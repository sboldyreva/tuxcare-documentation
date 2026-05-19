# Astro

Endless Lifecycle Support (ELS) for Astro from TuxCare provides security fixes for Astro versions that have reached their end of life. This allows you to continue running Astro applications without vulnerability concerns, even after official support has ended.

## Supported Astro Versions

* Astro 0.26.1, 1.9.2, 2.10.15, 3.6.5

## Installation

<ELSPrerequisites>

* **npm** package manager installed
* TuxCare registry token — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els_js) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

<ELSSteps>

1. **Create or update the .npmrc file**

   Navigate to the root directory of your Astro project and create a `.npmrc` file or update it if it already exists.

   **Example:**

   ```text
   my-astro-project/
   ├── node_modules/
   ├── package.json
   ├── .npmrc         ⚠️ ← Create it here
   └── package-lock.json
   ```

2. **Configure the npm registry**

   Use an editor of your choice (e.g., VS Code) to add the following registry address lines to the `.npmrc` file:

   ```text
   registry=https://registry.npmjs.org/
   @els-js:registry=https://nexus.repo.tuxcare.com/repository/els_js/
   //nexus.repo.tuxcare.com/repository/els_js/:_auth=${TOKEN}
   ```

   :::warning
   Replace `${TOKEN}` with the token you received from [sales@tuxcare.com](mailto:sales@tuxcare.com).
   :::

3. **Update dependencies**

   Update your `package.json` file to replace Astro dependencies with TuxCare-maintained packages. You can do this in two ways:

   * **Option 1: Manual update**

     Manually update your `package.json` file by replacing your Astro dependencies with the TuxCare packages. This method gives you full control over which packages to update.

     <TableTabs label="Choose Astro version: " >

      <template #astro_0.26.1>

      ```text
      "dependencies": {
        "astro": "npm:@els-js/astro@>=0.26.1-tuxcare.1"
      },
      "overrides": {
        "astro@0.26.1": "npm:@els-js/astro@>=0.26.1-tuxcare.1"
      }
      ```

      </template>

      <template #astro_1.9.2>

      ```text
      "dependencies": {
        "astro": "npm:@els-js/astro@>=1.9.2-tuxcare.1"
      },
      "overrides": {
        "astro@1.9.2": "npm:@els-js/astro@>=1.9.2-tuxcare.1"
      }
      ```

      </template>

      <template #astro_2.10.15>

      ```text
      "dependencies": {
        "astro": "npm:@els-js/astro@>=2.10.15-tuxcare.1"
      },
      "overrides": {
        "astro@2.10.15": "npm:@els-js/astro@>=2.10.15-tuxcare.1"
      }
      ```

      </template>

      <template #astro_3.6.5>

      ```text
      "dependencies": {
        "astro": "npm:@els-js/astro@>=3.6.5-tuxcare.1"
      },
      "overrides": {
        "astro@3.6.5": "npm:@els-js/astro@>=3.6.5-tuxcare.1"
      }
      ```

      </template>

     </TableTabs>

   * **Option 2: TuxCare Patcher (Automated)**

     Install the Patcher globally and run it. The TuxCare Patcher automatically detects the Astro version in your `package.json` and updates your `dependencies` and `overrides` to use the corresponding TuxCare `@els-js/*` packages.

     ```text
     npm install -g @els-js/tuxcare-patcher --userconfig ./.npmrc
     tuxcare-patch-js
     ```

     The patcher will update your `package.json`, for example, from:

     ```text
     "dependencies": {
       "astro": "^2.10.15"
     }
     ```

     to:

     ```text
     "dependencies": {
       "astro": "npm:@els-js/astro@>=2.10.15-tuxcare.1"
     },
     "overrides": {
       "astro@2.10.15": "npm:@els-js/astro@>=2.10.15-tuxcare.1"
     }
     ```

4. **Refresh the project dependencies**

   Remove `node_modules`, `package-lock.json`, and clear the npm cache:

   ```text
   rm -rf node_modules package-lock.json && npm cache clean --force
   ```

   Install dependencies:

   ```text
   npm install
   ```

   The token for the TuxCare repository is automatically picked up from your `.npmrc` file.

5. **Verify the setup**

   Use npm to list the project's dependencies and confirm TuxCare packages are resolved correctly:

   ```text
   npm list
   ```

   After reviewing the dependencies, run your application to ensure everything works correctly. The `npm` tool should be able to identify and resolve dependencies from the TuxCare ELS for Astro repository.

</ELSSteps>

## Resolved CVEs

Fixes for the following vulnerabilities are available in ELS for Astro from TuxCare versions:

<TableTabs label="Choose Astro version: " >

<template #astro_0.26.1>

|     CVE ID     | CVE Type | Severity | Affected Libraries |      Vulnerable Versions       |
|:--------------:| :------: |:--------:|:------------------:|:------------------------------:|
| CVE-2024-56140 | Direct   | Medium   |       astro        |          < 4.16.17             |
| CVE-2024-56159 | Direct   | Medium   |       astro        | <= 4.16.17, >= 5.0.0 <= 5.0.8  |
| CVE-2025-55303 | Direct   | Medium   |       astro        | < 4.16.18, >= 5.0.0 < 5.13.2   |
| CVE-2025-61925 | Direct   | Medium   |       astro        |          < 5.14.2              |
| CVE-2025-64757 | Direct   | Low      |       astro        |          < 5.14.3              |
| CVE-2025-64764 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-64765 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-65019 | Direct   | Medium   |       astro        |          < 5.15.9              |
| CVE-2025-66202 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2026-41067 | Direct   | Medium   |       astro        |          < 6.1.6               |

</template>

<template #astro_1.9.2>

|     CVE ID     | CVE Type | Severity | Affected Libraries |      Vulnerable Versions       |
|:--------------:| :------: |:--------:|:------------------:|:------------------------------:|
| CVE-2024-56140 | Direct   | Medium   |       astro        |          < 4.16.17             |
| CVE-2024-56159 | Direct   | Medium   |       astro        | <= 4.16.17, >= 5.0.0 <= 5.0.8  |
| CVE-2025-55303 | Direct   | Medium   |       astro        | < 4.16.18, >= 5.0.0 < 5.13.2   |
| CVE-2025-61925 | Direct   | Medium   |       astro        |          < 5.14.2              |
| CVE-2025-64757 | Direct   | Low      |       astro        |          < 5.14.3              |
| CVE-2025-64764 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-64765 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-65019 | Direct   | Medium   |       astro        |          < 5.15.9              |
| CVE-2025-66202 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2026-41067 | Direct   | Medium   |       astro        |          < 6.1.6               |

</template>

<template #astro_2.10.15>

|     CVE ID     | CVE Type | Severity | Affected Libraries |      Vulnerable Versions       |
|:--------------:| :------: |:--------:|:------------------:|:------------------------------:|
| CVE-2024-56140 | Direct   | Medium   |       astro        |          < 4.16.17             |
| CVE-2024-56159 | Direct   | Medium   |       astro        | <= 4.16.17, >= 5.0.0 <= 5.0.8  |
| CVE-2025-55303 | Direct   | Medium   |       astro        | < 4.16.18, >= 5.0.0 < 5.13.2   |
| CVE-2025-61925 | Direct   | Medium   |       astro        |          < 5.14.2              |
| CVE-2025-64757 | Direct   | Low      |       astro        |          < 5.14.3              |
| CVE-2025-64764 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-64765 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-65019 | Direct   | Medium   |       astro        |          < 5.15.9              |
| CVE-2025-66202 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2026-33769 | Direct   | Medium   |       astro        |     >= 2.10.10 < 5.18.1        |
| CVE-2026-41067 | Direct   | Medium   |       astro        |          < 6.1.6               |

</template>

<template #astro_3.6.5>

|     CVE ID     | CVE Type | Severity | Affected Libraries |      Vulnerable Versions       |
|:--------------:| :------: |:--------:|:------------------:|:------------------------------:|
| CVE-2024-47885 | Direct   | Medium   |       astro        |      >= 3.0.0 < 4.16.1         |
| CVE-2024-56140 | Direct   | Medium   |       astro        |          < 4.16.17             |
| CVE-2024-56159 | Direct   | Medium   |       astro        | <= 4.16.17, >= 5.0.0 <= 5.0.8  |
| CVE-2025-55303 | Direct   | Medium   |       astro        | < 4.16.18, >= 5.0.0 < 5.13.2   |
| CVE-2025-61925 | Direct   | Medium   |       astro        |          < 5.14.2              |
| CVE-2025-64525 | Direct   | Medium   |       astro        |     >= 2.16.0 < 5.15.5         |
| CVE-2025-64757 | Direct   | Low      |       astro        |          < 5.14.3              |
| CVE-2025-64764 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-64765 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2025-65019 | Direct   | Medium   |       astro        |          < 5.15.9              |
| CVE-2025-66202 | Direct   | Medium   |       astro        |          < 5.15.8              |
| CVE-2026-33769 | Direct   | Medium   |       astro        |     >= 2.10.10 < 5.18.1        |
| CVE-2026-41067 | Direct   | Medium   |       astro        |          < 6.1.6               |

</template>

</TableTabs>

If you are interested in the TuxCare Endless Lifecycle Support, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).

## What's Next?

<WhatsNext hide-title>

* ![](/images/eye.webp) [CVE tracker](https://tuxcare.com/cve-tracker/?q=astro) — Track vulnerability fixes and updates
* ![](/images/shield.webp) [Available fixes](https://tuxcare.com/cve-tracker/fixes?q=astro) — Patched versions and changelogs
* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_javascript/astro/) — Vulnerability Exploitability eXchange feed
* ![](/images/unlock-alt.webp) [SBOM](https://nexus.repo.tuxcare.com/#browse/browse:els-js-sbom:astro) — Software Bill of Materials (Nexus, credentials required)
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Update to newer versions

</WhatsNext>
