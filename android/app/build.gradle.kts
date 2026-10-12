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
        versionCode = 1
        versionName = "0.1.0"
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

dependencies {
    implementation("androidx.work:work-runtime:2.12.0")
    testImplementation("junit:junit:4.13.2")
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
