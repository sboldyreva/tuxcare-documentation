# Symfony

Endless Lifecycle Support (ELS) for Symfony components such as Symfony Process, Symfony HttpFoundation from TuxCare provides security fixes for Symfony component versions that have reached their end-of-life. This allows you to continue running your applications without vulnerability concerns, even after official support has ended.

## Supported Versions and Components

* **Symfony Process** 3.4.x, 4.4.x, 5.x, 6.x
* **Symfony HttpFoundation** 2.8.x, 3.4.x, 4.4.x

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

4. Install Symfony components

   Install the TuxCare-maintained Symfony components release that matches your project:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: `composer require symfony/process:6.4.13-p2+tuxcare` },
     { title: 'composer.json', content: symfonyjson }
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

## Resolved CVEs in Symfony

<TableTabs label="Choose Symfony component: " >

<template #Symfony_Process>

| CVE ID         | Severity | Vulnerable versions  | Fixed in version  |
|----------------|----------|----------------------|-------------------|
| CVE-2026-24739 | Medium   | < 6.4.14             | 6.4.13-p2+tuxcare |
| CVE-2026-24739 | Medium   | < 5.4.46             | 5.4.45-p2+tuxcare |
| CVE-2026-24739 | Medium   | < 4.4.45             | 4.4.44-p1+tuxcare |
| CVE-2026-24739 | Medium   | < 3.4.48             | 3.4.47-p1+tuxcare |
| CVE-2024-51736 | Critical | < 6.4.14             | 6.4.13-p1+tuxcare |
| CVE-2024-51736 | Critical | < 5.4.46             | 5.4.45-p1+tuxcare |
| CVE-2024-51736 | Critical | < 4.4.45             | 4.4.44-p1+tuxcare |
| CVE-2024-51736 | Critical | < 3.4.48             | 3.4.47-p1+tuxcare |

</template>

<template #Symfony_HttpFoundation>

| CVE ID         | Severity | Vulnerable versions  | Fixed in version  |
|----------------|----------|----------------------|-------------------|
| CVE-2025-64500 | Critical |< 5.4.50, >=6,<6.4.29, >=7,<7.3.7| 2.8.52-p1+tuxcare |
| CVE-2025-64500 | Critical |< 5.4.50, >=6,<6.4.29, >=7,<7.3.7| 3.4.47-p3+tuxcare |
| CVE-2025-64500 | Critical |< 5.4.50, >=6,<6.4.29, >=7,<7.3.7| 4.4.49-p1+tuxcare |
| CVE-2024-50345 | Critical |< 5.4.50, >=6,<6.4.29, >=7,<7.3.7| 4.4.49-p2+tuxcare |
| CVE-2024-50345 | Medium   |< 5.4.46, >=6,<6.4.14, >=7,<7.1.7| 3.4.47-p3+tuxcare |

</template>

</TableTabs>

## What's Next?

<WhatsNext hide-title>

* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_php/symfony/) — Vulnerability Exploitability eXchange feed
* ![](/images/eye.webp) [CVE Tracker](https://tuxcare.com/cve-tracker/?product=Symfony) — Track vulnerability fixes and updates
* ![](/images/bolt.webp) [Available fixes](https://tuxcare.com/cve-tracker/fixes?product=Symfony) — Released fixes for Symfony
* ![](/images/box.webp) [Supported components](https://tuxcare.com/cve-tracker/products?product=Symfony) — Symfony components covered by ELS
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

const symfonyjson =
`{
    "require": {
        "symfony/process": "6.4.13-p2+tuxcare"
    }
}`

</script>
