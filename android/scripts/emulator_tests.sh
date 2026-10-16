#!/usr/bin/env bash
# Runs Foundry's emulator acceptance tests (2-6) once the emulator is up. Called by the "emulator-tests" job in
# .github/workflows/android.yml (inside reactivecircus/android-emulator-runner), from the repository root.
#
# Inputs (environment):
#   APK          the exact Foundry-debug.apk from the build job
#   TEST_APK     the instrumentation test APK (assembleDebugAndroidTest)
#   FIXTURES     folder from make_emulator_fixtures.cjs (halcyon-*.txt + fixtures.json)
#   OUT          where the emulator-results artifact is gathered (screenshots, REPORT.md, logs)
#
# Exits non-zero only when the harness itself failed (no results came back). Acceptance failures are reported in
# REPORT.md, not by the exit code.
set -u
PKG=io.github.lucidfuzz.foundry.debug
RUNNER="$PKG.test/androidx.test.runner.AndroidJUnitRunner"
CLASS=io.github.lucidfuzz.foundry.emulator.AcceptanceTest
mkdir -p "$OUT"
LOG="$OUT/harness.log"
say() { echo "== $*" | tee -a "$LOG"; }
run() { echo "\$ $*" >>"$LOG"; "$@" >>"$LOG" 2>&1; local s=$?; [ $s -ne 0 ] && echo "   (exit $s)" >>"$LOG"; return $s; }

say "Waiting for the emulator"
adb wait-for-device
for i in $(seq 1 120); do [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" = "1" ] && break; sleep 2; done
adb shell getprop ro.build.fingerprint | tee -a "$LOG"

say "Installing the build job's APK and the test APK"
sha256sum "$APK" | tee "$OUT/apk.sha256" | tee -a "$LOG"
run adb install -r "$APK" || { say "APK install failed"; }
run adb install -r -t "$TEST_APK" || { say "test APK install failed"; }
adb shell pm list instrumentation | tee -a "$LOG"
adb shell dumpsys package "$PKG" | grep -m3 -E "versionName|versionCode|signatures" | tee -a "$LOG"

say "Device setup"
run adb shell pm grant "$PKG" android.permission.READ_CALENDAR
run adb shell pm grant "$PKG" android.permission.ACCESS_COARSE_LOCATION
# The test's AppWidgetHost runs in Foundry's process (instrumentation), so the binding package is Foundry itself;
# the test package is granted too.
run adb shell appwidget grantbind --package "$PKG" --user 0
run adb shell appwidget grantbind --package "$PKG.test" --user 0
run adb shell cmd alarm set-timezone America/New_York
run adb shell settings put global auto_time_zone 0
run adb shell cmd location set-location-enabled true
run adb emu geo fix -74.0060 40.7128
run adb shell dumpsys battery set level 68
run adb shell dumpsys battery unplug
run adb shell dumpsys battery
# Keep the emulator's GPS fix fresh for the whole run (geo fix only reaches apps while the GPS is on).
( while true; do adb emu geo fix -74.0060 40.7128 >/dev/null 2>&1; sleep 10; done ) &
GEO=$!

say "Placing the website exports where the test reads them (run-as into Foundry's cache)"
run adb shell run-as "$PKG" mkdir -p cache/emulator-fixtures
for f in "$FIXTURES"/halcyon-*.txt; do
  n=$(basename "$f")
  adb shell "run-as $PKG sh -c 'cat > cache/emulator-fixtures/$n'" <"$f"
  got=$(adb shell "run-as $PKG sha256sum cache/emulator-fixtures/$n" | cut -d' ' -f1 | tr -d '\r')
  want=$(sha256sum "$f" | cut -d' ' -f1)
  echo "$n on device $got (expected $want)" | tee -a "$LOG"
done

say "Running the acceptance tests"
adb logcat -c || true
adb logcat -v threadtime >"$OUT/logcat.txt" 2>&1 &
LOGCAT=$!
START=$(date +%s)
timeout 1800 adb shell am instrument -w -r -e class "$CLASS" "$RUNNER" >"$OUT/instrument.txt" 2>&1
echo "instrumentation exit $? after $(( $(date +%s) - START )) s" | tee -a "$LOG"
tail -n 30 "$OUT/instrument.txt" | tee -a "$LOG"

say "Collecting results"
kill $GEO 2>/dev/null || true
sleep 2
kill $LOGCAT 2>/dev/null || true
adb shell dumpsys battery reset >/dev/null 2>&1 || true
adb shell cmd connectivity airplane-mode disable >/dev/null 2>&1 || true
REMOTE=/sdcard/Android/data/$PKG/files/emulator-results
mkdir -p "$OUT/evidence"
if ! adb pull "$REMOTE/." "$OUT/evidence/" >>"$LOG" 2>&1 || [ ! -f "$OUT/evidence/results.json" ]; then
  # Fallback: the internal copy (when external storage wasn't available to the app).
  adb exec-out run-as "$PKG" tar -C files -cf - emulator-results 2>>"$LOG" | tar -C "$OUT/evidence" --strip-components=1 -xf - 2>>"$LOG" || true
fi
mv "$OUT"/evidence/*.png "$OUT/" 2>/dev/null || true
mv "$OUT/evidence/results.json" "$OUT/results.json" 2>/dev/null || true
rmdir "$OUT/evidence" 2>/dev/null || true
adb shell dumpsys jobscheduler "$PKG" >"$OUT/jobscheduler.txt" 2>&1 || true
adb logcat -d -b crash >"$OUT/logcat-crash.txt" 2>&1 || true
adb logcat -d -b events >"$OUT/logcat-events.txt" 2>&1 || true

python3 android/scripts/emulator_report.py "$OUT" "$FIXTURES/fixtures.json" | tee -a "$LOG"
# The report in the job log too, so it can be read without downloading the artifact.
echo "::group::REPORT.md"; cat "$OUT/REPORT.md" 2>/dev/null; echo "::endgroup::"
[ -f "$OUT/results.json" ] || { say "No results.json came back from the device"; exit 1; }
exit 0
