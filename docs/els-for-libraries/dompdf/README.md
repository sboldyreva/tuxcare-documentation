# Dompdf

Endless Lifecycle Support (ELS) for Dompdf from TuxCare provides security fixes for Dompdf versions that have reached their end-of-life. This allows you to continue running your Dompdf applications without vulnerability concerns, even after official support has ended.

## Supported Versions

* **Dompdf** 0.8.6, 1.2.2, 3.1.0

Other versions upon request.

## Installation

<ELSPrerequisites>

* Nexus repository access credentials (username and password) — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els_php) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

1. Locate the `auth.json` file

   Composer reads credentials from a per-user `auth.json`. Create or edit the file at:

   * **Linux/macOS**: 
     
     ```
     ~/.composer/auth.json
     ```

   * **Windows**:
   
     ```
     %APPDATA%\Composer\auth.json
     ```

2. Add your TuxCare credentials

   Use either the Composer CLI or edit `auth.json` directly to add credentials for `nexus.repo.tuxcare.com`:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: `composer config --global --auth http-basic.nexus.repo.tuxcare.com USERNAME PASSWORD` },
     { title: 'auth.json', content: authjson }
   ]" />

   Replace `USERNAME` and `PASSWORD` with the credentials provided by TuxCare.

3. Register the TuxCare repository

   Add the `els_php` Composer repository either via CLI or by editing `composer.json`:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: cli },
     { title: 'composer.json', content: composerjson }
   ]" />

4. Install Dompdf

   Install the TuxCare-maintained Dompdf release that matches your project:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: `composer require dompdf/dompdf:1.2.2-p1+tuxcare` },
     { title: 'composer.json', content: dompdfjson }
   ]" />

   **Check the exact version listed in your TuxCare Nexus account to ensure you receive the most recent patched release.**

   :::tip

   If you edited `composer.json` manually, run `composer update` to install the package:
   
   ```
   composer update
   ```
   
   Composer will resolve dependencies against the TuxCare repository and install the patched releases.

   :::

### Composer Repository Configuration

If you encounter dependency resolution errors like:

`packages from higher priority repository do not match your constraint`

it usually means your project requires a package version that is not yet available in the TuxCare repository.

**Solution**: Update your `composer.json` to set the TuxCare repository as non-canonical:

```
{
    "repositories": [
        {
            "type": "composer",
            "url": "https://nexus.repo.tuxcare.com/repository/els_php/",
            "canonical": false
        }
    ]
}
```

This allows Composer to fall back to Packagist for packages not available in the TuxCare repository, while still preferring TuxCare patches when available.

## Resolved CVEs in Dompdf

Fixes for the following vulnerabilities are available in ELS for Dompdf from TuxCare:

<TableTabs label="Choose Dompdf version: ">

<template #Dompdf_0.8.6>

| CVE ID         | Severity | Vulnerable versions | Fixed in version    |
|----------------|----------|---------------------|---------------------|
| CVE-2023-50262 | High     | < 2.0.3             | 0.8.6-p1+tuxcare    |
| CVE-2023-23924 | Critical | < 2.0.2             | 0.8.6-p1+tuxcare    |
| CVE-2022-41343 | High     | < 2.0.1             | 0.8.6-p1+tuxcare    |
| CVE-2022-28368 | Critical | < 1.2.1             | 0.8.6-p1+tuxcare    |
| CVE-2022-0085  | Low      | < 2.0.0             | 0.8.6-p1+tuxcare    |
| CVE-2021-3902  | Critical | < 2.0.0             | 0.8.6-p1+tuxcare    |
| CVE-2021-3838  | Critical | < 2.0.0             | 0.8.6-p1+tuxcare    |
| CVE-2022-2400  | Medium   | < 2.0.0             | 0.8.6-p1+tuxcare    |

</template>

<template #Dompdf_1.2.2>

| CVE ID         | Severity | Vulnerable versions | Fixed in version    |
|----------------|----------|---------------------|---------------------|
| CVE-2023-50262 | High     | < 2.0.3             | 1.2.2-p1+tuxcare    |
| CVE-2023-23924 | Critical | < 2.0.2             | 1.2.2-p1+tuxcare    |
| CVE-2022-41343 | High     | < 2.0.1             | 1.2.2-p1+tuxcare    |
| CVE-2022-0085  | Low      | < 2.0.0             | 1.2.2-p1+tuxcare    |
| CVE-2021-3902  | Critical | < 2.0.0             | 1.2.2-p1+tuxcare    |
| CVE-2021-3838  | Critical | < 2.0.0             | 1.2.2-p1+tuxcare    |
| CVE-2022-2400  | Medium   | < 2.0.0             | 1.2.2-p1+tuxcare    |

</template>

</TableTabs>

## What's Next?

<WhatsNext hide-title>

* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_php/dompdf/dompdf/) — Vulnerability Exploitability eXchange feed
* ![](/images/eye.webp) [CVE Tracker](https://tuxcare.com/cve-tracker/) — Track vulnerability fixes and updates
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Upgrade to a newer version

</WhatsNext>

<script setup>

const authjson =
`{
  "http-basic": {
    "nexus.repo.tuxcare.com": {
      "username": "USERNAME",
      "password": "PASSWORD"
    }
  }
}`

const composerjson =
`{
    "repositories": [
        {
        "type": "composer",
        "url": "https://nexus.repo.tuxcare.com/repository/els_php/",
        "options": {
            "http": {
            "verify": true
            }
        }
        }
    ]
}`

const cli =
`composer config repositories.tuxcare '{"type":"composer","url":"https://nexus.repo.tuxcare.com/repository/els_php/","options":{"http":{"verify":true}}}' --json`

const dompdfjson =
`{
    "require": {
        "dompdf/dompdf": "1.2.2-p1+tuxcare"
    }
}`

</script>
