#!/usr/bin/env python3
"""Writes REPORT.md for the emulator-results artifact from the test's results.json (see AcceptanceTest.kt).

    python3 android/scripts/emulator_report.py <results folder> <fixtures.json>

Test-only: run by android/scripts/emulator_tests.sh in the emulator-tests job.
"""
import json
import os
import re
import sys

out_dir, fixtures_path = sys.argv[1], sys.argv[2]
L = []
w = L.append


def load(path, default=None):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default


def read(path):
    try:
        with open(path, encoding='utf-8', errors='replace') as f:
            return f.read()
    except Exception:
        return ''


results = load(os.path.join(out_dir, 'results.json'))
fixtures = load(fixtures_path, {}) or {}
tests = (results or {}).get('tests', {})
run_url = ''
if os.environ.get('GITHUB_RUN_ID'):
    run_url = '%s/%s/actions/runs/%s' % (os.environ.get('GITHUB_SERVER_URL', 'https://github.com'),
                                         os.environ.get('GITHUB_REPOSITORY', ''), os.environ['GITHUB_RUN_ID'])
ICON = {'pass': 'PASS', 'fail': 'FAIL', 'needs-human': 'NEEDS-HUMAN', 'not-run': 'NOT RUN', 'running': 'DID NOT FINISH'}
TITLES = {
    't2': 'Test 2: Halcyon Illustrated widgets show real calendar, weather and battery data',
    't3': 'Test 3: Charger: the game widget refreshes and the specimen advances',
    't4': 'Test 4: Airplane mode: widgets keep rendering with cached art, nothing crashes',
    't5': 'Test 5: Allocation setup: choose an event, Shift counts down to it',
    't6': 'Test 6: Original edition: each widget offers only its intended size',
}


def status(key):
    t = tests.get(key)
    return ICON.get(t.get('status'), t.get('status')) if t else 'NOT RUN'


def checks_table(t):
    rows = t.get('checks', [])
    if not rows:
        return
    w('| | check | seen |')
    w('|---|---|---|')
    for c in rows:
        ok = c.get('ok')
        mark = 'ok' if ok is True else ('**FAIL**' if ok is False else 'look')
        detail = str(c.get('detail', '')).replace('|', '\\|').replace('\n', ' ')
        w('| %s | %s | %s |' % (mark, c.get('name', '').replace('|', '\\|'), detail[:400]))
    w('')


def notes(t):
    for n in t.get('notes', []):
        w('- ' + n)
    if t.get('notes'):
        w('')


def images(t, only=None):
    imgs = [i for i in t.get('images', []) if not only or re.match(only, i['file'])]
    for i in imgs:
        w('- `%s`: %s' % (i['file'], i.get('caption', '')))
    if imgs:
        w('')


def error(t):
    if t.get('error'):
        w('<details><summary>Error</summary>\n\n```\n%s\n```\n</details>\n' % t['error'])


# ------------------------------------------------------------------ header
w('# Foundry for Android: emulator acceptance tests 2-6')
w('')
if run_url:
    w('Run: %s' % run_url)
w('Branch: `%s`, commit `%s`' % (os.environ.get('GITHUB_REF_NAME', '?'), os.environ.get('GITHUB_SHA', '?')))
w('')
w('| test | result |')
w('|---|---|')
for k in ['t2', 't3', 't4', 't5', 't6']:
    w('| %s | **%s** |' % (TITLES[k], status(k)))
w('')
w('Scope: a stock Android emulator (Google APIs image). Samsung-specific behavior (the One UI launcher, its widget '
  'resizing, and Samsung battery saver / app sleeping) is out of scope here and still needs the Galaxy A53.')
w('')

w('## What was tested')
w('')
w('- **App**: the exact `Foundry-debug.apk` uploaded by this run\'s build job, sha256 `%s`.'
  % (read(os.path.join(out_dir, 'apk.sha256')).split(' ')[0].strip() or '?'))
w('- **Widget scripts**: exported from `index.html` on `main` at commit `%s`, the way the site\'s Export step does it '
  '(`buildScript()` run in node\'s vm, as in `tests/white-rabbit-afterimage.test.cjs`):' % fixtures.get('mainCommit', '?'))
for name, f in (fixtures.get('files') or {}).items():
    w('  - `%s` (%s edition, %s bytes): sha256 `%s`' % (name, f.get('edition'), f.get('bytes'), f.get('sha256')))
dev = (results or {}).get('device', {})
if dev:
    w('- **Device**: Android %s (API %s), %s, %s px at %sx, WebView %s, time zone %s. App %s.'
      % (dev.get('release'), dev.get('sdk'), dev.get('model'), dev.get('screen'), dev.get('density'), dev.get('webview'),
         dev.get('timezone'), dev.get('app')))
w('- **Widget placement**: a home-screen drag on an emulator is flaky, so an instrumented test (running in Foundry\'s '
  'process) hosts the widgets: its `AppWidgetHost` binds Foundry\'s real `FoundryWidgetProvider` '
  '(allowed by `adb shell appwidget grantbind`), so the real provider, `WidgetUpdater`, `Renderer` (the hidden WebView) '
  'and `RemoteViews` draw every widget. Each "screenshot" is that host\'s `AppWidgetHostView` drawn to a PNG at the '
  'size a launcher reports (small 170x170 dp, medium 364x170 dp, large 364x382 dp), on a grey backdrop.')
w('- **Reading what a widget drew**: the test patches the renderer page\'s canvas `fillText` (through reflection, test-only) '
  'to collect each render\'s text, so calendar, weather and battery are checked as text as well as by screenshot.')
setup = tests.get('setup', {})
imp = [tests.get(k, {}).get('import') for k in ('t2', 't6') if tests.get(k, {}).get('import')]
for i in imp:
    w('- **Import of `%s`**: %s.' % (i.get('file'), i.get('route')))
loc = setup.get('location')
if loc:
    w('- **Location**: %s; app cache `%s`.' % (loc.get('route'), loc.get('cached')))
cal = setup.get('calendar')
if cal:
    w('- **Calendar**: local calendar id `%s`; events %s.' % (cal.get('calendarId'), '; '.join(
        '"%s" %s (id %s)' % (e['title'], e.get('local', ''), e.get('id')) for e in cal.get('events', []))))
w('- **Battery**: `dumpsys battery set level 68` and `dumpsys battery unplug` before the run; permissions with `pm grant`.')
w('')
if setup:
    w('### Setup checks: %s' % status('setup'))
    w('')
    checks_table(setup)
    notes(setup)
    error(setup)

if results is None:
    w('## The test run did not return results')
    w('')
    w('```')
    w(read(os.path.join(out_dir, 'instrument.txt'))[-6000:])
    w('```')

# ------------------------------------------------------------------ per test


def widget_table(t):
    ws = t.get('widgets', [])
    if not ws:
        return
    w('| widget | fresh | ms | what it drew (text, first strings) |')
    w('|---|---|---|---|')
    for x in ws:
        texts = x.get('texts')
        shown = ' / '.join(texts[:28]) if texts else '(probe unavailable)'
        w('| `%s` %s %s | %s | %s | %s |' % (x['image'], x['mode'], x['size'], 'yes' if x.get('fresh') and x.get('picture') else '**no**',
                                          x.get('ms'), shown.replace('|', '\\|')[:700]))
    w('')


for k in ['t2', 't3', 't4', 't5', 't6']:
    t = tests.get(k)
    w('## %s: %s' % (TITLES[k], status(k)))
    w('')
    if not t:
        w('Not run.')
        w('')
        continue
    if k == 't2':
        w('Screenshots `t2_<mode>_<size>.png`. Each widget got exactly one refresh after it was configured. Status needs '
          'weather, battery (68%) and, at medium and large, the next event ("Allocation review"); Solar needs weather; '
          'Shift must read the calendar (it asks for an allocation until test 5 picks one); Game, Tracker and Dossier '
          'draw no live device readings and are checked for a fresh picture.')
        w('')
    if k == 't3':
        a, b = t.get('liveReceiver', {}), t.get('forcedJob', {})
        w('Per SPEC: at once with Foundry open, otherwise by the next refresh. Both were exercised: (A) the plug-in with '
          'Foundry\'s process running, and (B) the WorkManager job, forced with `adb shell cmd jobscheduler run -f` instead of '
          'waiting up to 15 minutes. Halcyon\'s game takes at most one turn per 15 minutes, so before each step the save\'s '
          'last-turn time was moved back 16 minutes so the next turn was due.')
        w('')
        for label, d in (('A, Foundry open', a), ('B, forced job #%s' % b.get('job'), b)):
            if d:
                bf, af = d.get('before', {}), d.get('after', {})
                w('- %s: turn %s -> %s, growth %s -> %s, nutrients %s -> %s%s' % (
                    label, bf.get('turn'), af.get('turn'), bf.get('growth'), af.get('growth'), bf.get('nut'), af.get('nut'),
                    ', %.1f s after plug-in' % d['secondsToTurn'] if 'secondsToTurn' in d else ''))
                log = af.get('log') or []
                if log:
                    w('  - latest log: "%s"' % '"; "'.join(x.get('m', '') for x in log[-3:]))
        w('')
    if k == 't3' and t.get('jobDump'):
        w('<details><summary>dumpsys jobscheduler (no WorkManager job matched)</summary>\n\n```\n%s\n```\n</details>\n' % t['jobDump'][:6000])
    if k == 't4':
        lc = t.get('logcat', {})
        w('Logcat while offline: **%s** FATAL EXCEPTION, **%s** ANR (crash buffer: %s FATAL).'
          % (lc.get('fatal', '?'), lc.get('anr', '?'), lc.get('crashBufferFatal', '?')))
        w('')
    if k == 't5':
        sf = t.get('settingsFile', {})
        if sf:
            w('Settings file `%s` (via `adb shell run-as io.github.lucidfuzz.foundry.debug cat`):' % sf.get('path'))
            w('')
            w('```json')
            try:
                w(json.dumps(json.loads(sf.get('content', '')), indent=2, ensure_ascii=False))
            except Exception:
                w(sf.get('content', ''))
            w('```')
            w('')
            w('Expected shape (SPEC): `{allocation:{match:\'title\', identifier, title, calendar}}` merged so `radio` is kept.')
            w('')
    if k == 't6':
        hdr = t.get('header')
        if hdr:
            w('Script header:')
            w('')
            w('```')
            w(hdr)
            w('```')
            w('')
        rows = t.get('modes', [])
        if rows:
            w('| widget | header says | app offers | picker shows | rendered at | how placed |')
            w('|---|---|---|---|---|---|')
            for r in rows:
                w('| %s | %s (%s) | %s | %s | `%s` | %s |' % (r['mode'], r.get('headerNote'), '/'.join(r.get('headerSizes', [])),
                                                         '/'.join(r.get('appOffers', [])), '/'.join(r.get('pickerShows', [])) or '?',
                                                         r.get('image'), r.get('route')))
            w('')
    checks_table(t)
    notes(t)
    widget_table(t)
    w('Screenshots:')
    w('')
    images(t)
    error(t)

# ------------------------------------------------------------------ whole run
# The test's own log lines (tag FoundryEmulatorTest) name these words in its check titles; leave them out.
logcat = '\n'.join(l for l in read(os.path.join(out_dir, 'logcat.txt')).splitlines() if 'FoundryEmulatorTest' not in l)
events = read(os.path.join(out_dir, 'logcat-events.txt'))
anrs = [l for l in events.splitlines() if 'am_anr' in l]
w('## Whole run')
w('')
w('- Logcat for the whole run: %d FATAL EXCEPTION, %d "ANR in", %d am_anr events.'
  % (logcat.count('FATAL EXCEPTION'), logcat.count('ANR in'), len(anrs)))
for l in anrs[:5]:
    w('  - `%s`' % l.strip()[:300])
for l in [l for l in logcat.splitlines() if 'ANR in' in l][:5]:
    w('  - `%s`' % l.strip()[:300])
fatal = [m.start() for m in re.finditer('FATAL EXCEPTION', logcat)]
for p in fatal[:3]:
    w('')
    w('```')
    w(logcat[p:p + 2500])
    w('```')
instr = read(os.path.join(out_dir, 'instrument.txt'))
w('- Instrumentation: `%s`' % (instr.strip().splitlines()[-1] if instr.strip() else 'no output'))
w('')
w('Files: `logcat.txt`, `logcat-crash.txt`, `logcat-events.txt`, `instrument.txt`, `jobscheduler.txt`, `harness.log`, '
  '`results.json` (everything above in machine-readable form).')

with open(os.path.join(out_dir, 'REPORT.md'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(L) + '\n')
print('REPORT.md written: ' + ', '.join('%s %s' % (k, status(k)) for k in ['t2', 't3', 't4', 't5', 't6']))
