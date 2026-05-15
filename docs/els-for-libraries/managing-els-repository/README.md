# Managing the ELS repository

This page provides instructions for upgrading to newer TuxCare package versions, accessing source code for ELS-patched libraries, and managing the TuxCare NuGet source for .NET projects.

## How to Upgrade to a Newer Version

<TableTabs label="Choose the Ecosystem: " :labels="{ java: 'Java', dotnet: '.NET' }">

<template #java>

If you have already installed a package with a `tuxcare.1` suffix and want to upgrade to a newer release (for example, `tuxcare.3`), update the version string in your Maven or Gradle build file with the version listed in your TuxCare Nexus account.

</template>

<template #PHP>

If you have already installed a TuxCare-patched package and want to upgrade to a newer release, update the version string in your `composer.json` file or run the `composer require` command with the new version.

1. Update the required version

   Replace `VENDOR/PACKAGE` with the package name and `VERSION-pN+tuxcare` with the version listed in your TuxCare Nexus account:

   ```text
   composer require VENDOR/PACKAGE:VERSION-pN+tuxcare
   ```

2. Apply the changes

   Run `composer update` to resolve dependencies and install the new release:

   ```text
   composer update
   ```

**Check the exact version listed in your TuxCare Nexus account to ensure you receive the most recent patched release.**

</template>

<template #Python>

To upgrade to a newer TuxCare release (for example, from `version.post1+tuxcare` to `version.post2+tuxcare`), use the same installation method you used during setup and specify the newer package version listed in your TuxCare Nexus account.

</template>

<template #JavaScript>

To upgrade to a newer TuxCare release (for example, from `tuxcare.1` to `tuxcare.3`), remove `node_modules`, clear the npm cache to avoid conflicts, and then run the installation command:

```text
rm -rf node_modules package-lock.json && npm cache clean --force
npm install
```

</template>

<template #dotnet>

**Check the exact version listed in your TuxCare Nexus account to ensure you receive the most recent patched release.**

To upgrade to a newer TuxCare release, update the package in your project:

```text
dotnet add package <PACKAGE_NAME> --version <NEW_VERSION>
```

Then rebuild the project to verify the upgrade:

```text
dotnet build
```

</template>

</TableTabs>

## Source code

<TableTabs label="Choose the Ecosystem: " :labels="{ javaSources: 'Java', dotnetSources: '.NET' }">

<template #javaSources>

Source code is available for TuxCare-patched **Java** libraries. Source JARs follow the standard Maven naming convention with a `-sources` classifier and are published to the [Nexus repository](https://nexus.repo.tuxcare.com/#browse/browse:els_java).

For example: [https://nexus.repo.tuxcare.com/repository/els_java/commons-lang/commons-lang/2.6-tuxcare.1/commons-lang-2.6-tuxcare.1-sources.jar](https://nexus.repo.tuxcare.com/repository/els_java/commons-lang/commons-lang/2.6-tuxcare.1/commons-lang-2.6-tuxcare.1-sources.jar).

:::tip
If a source JAR is not available for a specific package, please contact [sales@tuxcare.com](mailto:sales@tuxcare.com).
:::

</template>

<template #dotnetSources>

The TuxCare NuGet source is configured per-project in `nuget.config`. Use the `dotnet` CLI or edit `nuget.config` directly to manage it. Replace `<els_dotnet_customerN>` with your customer repository name.

* **Add the TuxCare source**

  ```text
  dotnet nuget add source "https://nexus.repo.tuxcare.com/repository/<els_dotnet_customerN>/index.json" \
    --name TuxCare \
    --username USERNAME \
    --password PASSWORD
  ```

* **List configured sources**

  ```text
  dotnet nuget list source
  ```

  Example output:

  ```text
  Registered Sources:
    1.  TuxCare [Enabled]
        https://nexus.repo.tuxcare.com/repository/<els_dotnet_customerN>/index.json
    2.  nuget [Enabled]
        https://api.nuget.org/v3/index.json
  ```

* **Update source credentials**

  ```text
  dotnet nuget remove source TuxCare
  dotnet nuget add source "https://nexus.repo.tuxcare.com/repository/<els_dotnet_customerN>/index.json" `
    --name TuxCare `
    --username <NEW_USERNAME> `
    --password <NEW_PASSWORD>
  ```

* **Remove the source**

  ```text
  dotnet nuget remove source TuxCare
  ```

* **Route specific packages to TuxCare (Package Source Mapping)**

  If you use a `nuget.config` file, you can add package source mapping to route specific packages to the TuxCare feed. This ensures certain packages are always fetched from TuxCare while others come from NuGet.org.

  Add a `<packageSourceMapping>` section inside `<configuration>` in your `nuget.config`. For example, to route Newtonsoft.Json to TuxCare:

  <CodeTabs :tabs="[
    { title: 'Snippet to Add', content: mappingSnippet },
    { title: 'Full nuget.config', content: mappingFullConfig }
  ]" />

</template>

</TableTabs>

<script setup>

const mappingSnippet =
`<packageSourceMapping>
  <!-- Allow nuget.org to serve any package -->
  <packageSource key="nuget">
    <package pattern="*" />
  </packageSource>

  <!-- Route specific packages to TuxCare feed -->
  <packageSource key="TuxCare">
    <package pattern="Newtonsoft.*" />
  </packageSource>
</packageSourceMapping>`

const mappingFullConfig =
`<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <!-- To inherit the global NuGet package sources remove the <clear/> line below -->
    <clear />
    <add key="TuxCare" value="https://nexus.repo.tuxcare.com/repository/<els_dotnet_customerN>/index.json" />
    <add key="nuget" value="https://api.nuget.org/v3/index.json" />
  </packageSources>

  <packageSourceCredentials>
      <TuxCare>
          <add key="Username" value="username" />
          <add key="Password" value="passwordHash" />
      </TuxCare>
  </packageSourceCredentials>

  <packageSourceMapping>
    <!-- Allow nuget.org to serve any package -->
    <packageSource key="nuget">
      <package pattern="*" />
    </packageSource>

    <!-- Route specific packages to TuxCare feed -->
    <packageSource key="TuxCare">
      <package pattern="Newtonsoft.*" />
    </packageSource>
  </packageSourceMapping>
</configuration>`
</script>