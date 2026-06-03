# JavaScript

SecureChain delivers verified, signed, continuously patched JavaScript packages from a TuxCare-managed npm registry. Packages install with standard `npm` tooling and continue to receive CVE patches after upstream end of life.

## Installation

<ELSPrerequisites>

* TuxCare SecureChain registry token — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* An npm project with `package.json`. If you're starting from scratch, run `npm init -y` in your project directory to create one.
* To browse available packages, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:securechain-js) and sign in. You may need to refresh the page after logging in.

</ELSPrerequisites>

<ELSSteps>

1. Connect to the SecureChain registry

   In the root directory of your project, create or edit `.npmrc` to point npm at the SecureChain registry and provide your token:

   ```text
   registry=https://nexus.repo.tuxcare.com/repository/securechain-js/@securechain-js/
   //nexus.repo.tuxcare.com/repository/securechain-js/:_auth=<TOKEN>
   always-auth=true
   ```

   :::warning
   Replace `<TOKEN>` with the token you received from [sales@tuxcare.com](mailto:sales@tuxcare.com).
   :::

2. Install your dependencies

   Run this command from the project root directory, where the package.json file containing your dependencies is located:

   ```text
   npm install
   ```

   You can keep the package names and versions in `package.json` as they are. 
   
   `npm` is now pointed at SecureChain from the previous step, so the packages are pulled automatically from the TuxCare Nexus.

   For the list of available packages and versions, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:securechain-js).

</ELSSteps>

## Troubleshooting

If `npm install` resolves to the public registry instead of SecureChain, use the commands below to verify that npm is reading your `.npmrc` and that the token is accepted.

* **Confirm the active registry**

   ```text
   npm config get registry
   ```

   The output must be `https://nexus.repo.tuxcare.com/repository/securechain-js/@securechain-js/`. If it returns `https://registry.npmjs.org/`, npm is not reading your project `.npmrc` - check that you are running npm from the project root and that no user-level `~/.npmrc` is overriding it.

* **Confirm authentication and connectivity**

   ```text
   npm whoami
   npm ping
   ```

   `npm whoami` confirms the token resolves to a Nexus user. `npm ping` confirms the registry is reachable with that token. Failures here usually mean a missing, malformed, or revoked `_auth` value in `.npmrc`.

## What's Next?

<WhatsNext hide-title>

* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/) — Vulnerability Exploitability eXchange feed
* ![](/images/eye.webp) [CVE Tracker](https://tuxcare.com/cve-tracker/) — Track vulnerability fixes and updates
* ![](/images/wrench.webp) [Managing the SecureChain repository](/securechain/managing-securechain-repository/) — Upgrade to a newer version

</WhatsNext>
