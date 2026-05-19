# OpenJDK

Endless Lifecycle Support (ELS) from TuxCare provides security fixes for OpenJDK versions that have reached end-of-life. This allows you to continue running your OpenJDK-based applications without vulnerability concerns, even after official support has ended.

## Supported OS and OpenJDK versions

| OS                                                      | Package Type | OS Version    | OpenJDK version |
| :-----------------------------------------------------: | :----------: | :-----------: | :-------------: |
| EL 6 (CentOS, CloudLinux, Oracle Linux, etc.)            | RPM          | 6.x           | 8               |
| EL 7 (CentOS, CloudLinux, Oracle Linux, etc.)            | RPM          | 7.x           | 8               |
| EL 8 (CloudLinux, CentOS, AlmaLinux, Oracle Linux, etc.) | RPM          | 8.x           | 8, 11           |
| AlmaLinux                                               | RPM          | 9.x           | 8               |

**Supported architecture:** x86_64 (64-bit)

<ContactSales text="Other versions and architectures available upon request. Contact sales@tuxcare.com for more information." />

## Installation

<ELSBadge heading>Docker compatible</ELSBadge>

<ELSPrerequisites>

* A valid TuxCare ELS license key — contact [sales@tuxcare.com](mailto:sales@tuxcare.com) to obtain one
* Root or `sudo` access to the server

</ELSPrerequisites>

<ELSSteps>

1. Download the installer script

   ```text
   wget https://repo.tuxcare.com/openjdk-els/install-openjdk-els-repo.sh
   ```

2. Run the installer script with your license key

   ```text
   sh install-openjdk-els-repo.sh --license-key XXXXXXXXXXX
   ```

3. Verify the repository is enabled

   ```text
   yum repolist | grep openjdk-els
   ```

4. Install OpenJDK

   <TableTabs label="OpenJDK version: " >

   <template #8>

   ```text
   yum install java-1.8.0-openjdk
   ```

   </template>

   <template #11>

   ```text
   yum install java-11-openjdk
   ```

   </template>

   </TableTabs>

5. Verify the installation

   ```text
   java -version
   ```

</ELSSteps>