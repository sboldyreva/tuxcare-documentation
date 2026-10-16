// Content of the docs home page (theme/home/HomeSections.vue). Products are
// listed from documents.ts, grouped by documentGroups.

// "Get started": the most common first tasks, each linking straight to the steps.
export const quickStarts = [
    {
        product: "KernelCare",
        title: "Install KernelCare",
        description: "Patch the Linux kernel live, without rebooting your servers.",
        link: "/live-patching-services/#installation",
    },
    {
        product: "ELS for Operating Systems",
        title: "Keep an end-of-life OS secure",
        description: "Pick your distribution and connect it to the ELS repository.",
        link: "/els-for-os/",
    },
    {
        product: "ELS for Language Ecosystems",
        title: "Install patched libraries",
        description: "Get security fixes for end-of-life open-source packages.",
        link: "/els-for-libraries/#installation-for-language-ecosystems",
    },
    {
        product: "SecureChain for Open Source",
        title: "Set up SecureChain",
        description: "Send your projects' dependencies to the portal with the SecureChain CLI.",
        link: "/securechain/cli/",
    },
]

// "Resources": references and help that are not tied to one product.
// External links open in a new tab.
export const resources = [
    {
        title: "CVE tracker",
        description: "Status of every CVE across TuxCare products.",
        link: "https://cve.tuxcare.com/",
    },
    {
        title: "Security data feeds",
        description: "Errata, OVAL and CSAF data for scanners.",
        link: "/els-for-os/machine-readable-security-data/",
    },
    {
        title: "Submit a support request",
        description: "Get help from the TuxCare support team.",
        link: "https://www.tuxcare.com/support-portal/",
    },
]
