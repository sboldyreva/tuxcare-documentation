# Vue

Endless Lifecycle Support (ELS) for Vue from TuxCare provides security fixes for Vue versions that have reached end of life. This allows you to continue running Vue applications without vulnerability concerns, even after official support has ended.

TuxCare PatchFlow for Vue targets the following Vue ecosystem packages:

* Vue 2.6.11, 2.6.14, 2.7.16
* vue-server-renderer 2.6.11, 2.6.14, 2.7.16
* vue-template-compiler 2.6.11, 2.6.14, 2.7.16

## Connection to ELS for Vue Repository

This guide outlines the steps needed to integrate the TuxCare ELS for Vue repository.

## Step 1: Get Token

You need a token in order to use the TuxCare ELS Vue repository. Anonymous access is disabled. To receive the token, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).

## Step 2: Set Up ELS for Vue

TuxCare provides ELS for Vue as npm packages, hosted on a secure internal registry. Follow the steps below to add it to your project and get started.

1. Navigate to the root directory of your Vue project.
2. Create a `.npmrc` file (or update it if it already exists).

   ```text
   my-vue-project/
   ├── node_modules/
   ├── package.json
   ├── .npmrc         ⚠️ ← Create it here
   └── package-lock.json
   ```

3. Add the ELS Vue registry configuration to `.npmrc`:

   ```text
   registry=https://registry.npmjs.org/
   @els-vue:registry=https://nexus.repo.tuxcare.com/repository/els-vue/
   //nexus.repo.tuxcare.com/repository/els-vue/:_auth=${TOKEN}
   ```

   :::warning
   Replace `${TOKEN}` with the token you received from [sales@tuxcare.com](mailto:sales@tuxcare.com).
   :::

4. Update your `package.json` dependencies to use TuxCare packages.

   :::tip
   For exact available patched versions, check your Nexus access first. The snippets below are examples.
   :::

   <TableTabs label="Choose package: " >

   <template #vue>

   ```text
   "dependencies": {
     "vue": "npm:@els-vue/vue@>=X.Y.Z-tuxcare.N"
   },
   "overrides": {
     "vue@X.Y.Z": "npm:@els-vue/vue@>=X.Y.Z-tuxcare.N"
   }
   ```

   </template>

   <template #vue_server_renderer>

   ```text
   "dependencies": {
     "vue-server-renderer": "npm:@els-vue/vue-server-renderer@>=X.Y.Z-tuxcare.N"
   },
   "overrides": {
     "vue-server-renderer@X.Y.Z": "npm:@els-vue/vue-server-renderer@>=X.Y.Z-tuxcare.N"
   }
   ```

   </template>

   <template #vue_template_compiler>

   ```text
   "dependencies": {
     "vue-template-compiler": "npm:@els-vue/vue-template-compiler@>=X.Y.Z-tuxcare.N"
   },
   "overrides": {
     "vue-template-compiler@X.Y.Z": "npm:@els-vue/vue-template-compiler@>=X.Y.Z-tuxcare.N"
   }
   ```

   </template>

   </TableTabs>

5. Remove old dependencies and clear npm cache:

   ```text
   rm -rf node_modules package-lock.json && npm cache clean --force
   ```

6. Run the following command to install the ELS version of the Vue library (token for the TuxCare repository will be automatically picked up from your `.npmrc` file):

   ```text
   npm install
   ```

## Step 3: Verify Installation

1. Confirm package resolution:

   ```text
   npm list <package-name>
   ```

2. Run your application and verify that dependency resolution works through the TuxCare repository.

## Vulnerability Exploitability eXchange (VEX)

VEX is a machine-readable format that tells you if a known vulnerability is actually exploitable in your product. It reduces false positives and helps prioritize real risks.

TuxCare provides VEX data for Vue packages:

* [vue](https://security.tuxcare.com/vex/cyclonedx/els_lang_javascript/vue/)
* [vue-template-compiler](https://security.tuxcare.com/vex/cyclonedx/els_lang_javascript/vue-template-compiler/)

## How to Upgrade to a Newer Version of TuxCare Packages

If you already use a `tuxcare.N` package release and need to upgrade, clear local dependencies and reinstall:

```text
rm -rf node_modules package-lock.json && npm cache clean --force
npm install
```

## Resolved CVEs

Fixes for the following vulnerabilities are available in ELS for Vue from TuxCare versions:

<TableTabs label="Choose package: " >

<template #vue>

| CVE ID        | CVE Type | Severity | Affected Library | Vulnerable Versions |
| :-----------: | :------: | :------: | :--------------: | :-----------------: |
| CVE-2024-6783 | Direct   | Medium   | vue              | >= 2.0.0 < 3.0.0    |
| CVE-2024-9506 | Direct   | Low      | vue              | >= 2.0.0 < 3.0.0    |

</template>

<template #vue_template_compiler>

| CVE ID        | CVE Type | Severity | Affected Library      | Vulnerable Versions |
| :-----------: | :------: | :------: | :-------------------: | :-----------------: |
| CVE-2024-6783 | Direct   | Medium   | vue-template-compiler | >= 2.0.0 < 3.0.0    |

</template>

</TableTabs>

If you are interested in TuxCare Endless Lifecycle Support, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).
