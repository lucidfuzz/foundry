import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
}

android {
    namespace = "io.github.lucidfuzz.foundry"
    compileSdk = 37

    defaultConfig {
        applicationId = "io.github.lucidfuzz.foundry"
        minSdk = 26
        targetSdk = 37
        // Each GitHub build gets its run number, so a tester can see which build is installed (Settings > Apps > Foundry).
        val run = providers.environmentVariable("GITHUB_RUN_NUMBER").orNull?.toIntOrNull() ?: 1
        versionCode = run
        versionName = "0.1.$run"
        // Instrumented tests (src/androidTest) are run on an emulator by the workflow's emulator-tests job only.
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        // One shared test key for every debug build, so a new build installs over the old one and keeps the tester's
        // themes and widgets. (Without it each GitHub run signs with a fresh random key and Android refuses the update.)
        // Debug keys are not secret; release builds will use their own key from repository secrets.
        getByName("debug") {
            val shared = file("debug.keystore")
            if (shared.exists()) {
                storeFile = shared
                storeType = "pkcs12"
                storePassword = "android"
                keyAlias = "androiddebugkey"
                keyPassword = "android"
            }
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-debug"
        }
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    testOptions {
        unitTests.isReturnDefaultValues = true
    }

    lint {
        // Report problems without failing the build; the APK is what testers need. CI prints the findings.
        abortOnError = false
        checkDependencies = false
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

// Some unit tests read the website's widget sources (the header and edition tables the app parses), so a change there
// re-runs them, and a skipped test shows up in the log.
tasks.withType<Test>().configureEach {
    inputs.files(
        rootProject.file("../src/tpl.js"), rootProject.file("../src/halcyon/paint.js"), rootProject.file("../src/deeprange/paint.js"),
    ).withPathSensitivity(PathSensitivity.RELATIVE)
    testLogging { events("skipped", "failed") }
}

dependencies {
    implementation("androidx.work:work-runtime:2.12.0")
    testImplementation("junit:junit:4.13.2")
    // Emulator acceptance tests (test APK only; nothing here goes into the app).
    androidTestImplementation("androidx.test:runner:1.7.0")
    androidTestImplementation("androidx.test.ext:junit:1.3.0")
    androidTestImplementation("androidx.test.uiautomator:uiautomator:2.3.0")
}

// The widget runtime is shared with the website and lives in android/runtime/. Copy it into the app's assets at build time
// (assets/runtime/foundry-runtime.js, next to index.html and the fonts) so there is only ever one copy in the repository.
abstract class CopyFoundryRuntime : DefaultTask() {
    @get:InputFile
    @get:PathSensitive(PathSensitivity.NONE)
    abstract val runtime: RegularFileProperty

    @get:OutputDirectory
    abstract val outputDir: DirectoryProperty

    @TaskAction
    fun copy() {
        val dir = outputDir.get().asFile.resolve("runtime")
        dir.mkdirs()
        runtime.get().asFile.copyTo(dir.resolve("foundry-runtime.js"), overwrite = true)
    }
}

androidComponents {
    onVariants { variant ->
        val name = variant.name.replaceFirstChar { it.uppercase() }
        val copy = tasks.register<CopyFoundryRuntime>("copy${name}FoundryRuntime") {
            runtime.set(rootProject.layout.projectDirectory.file("runtime/foundry-runtime.js"))
        }
        variant.sources.assets?.addGeneratedSourceDirectory(copy, CopyFoundryRuntime::outputDir)
    }
}
