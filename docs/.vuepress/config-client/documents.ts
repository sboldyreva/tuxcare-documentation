// Product groups for the sidebar product switcher (theme/components/ProductSwitcher.vue),
// in display order. Each document refers to one by `group`; `summary` is its
// one-line description in the switcher.
export const documentGroups = [
    {id: "start", title: "Get started"},
    {id: "patching", title: "Live patching"},
    {id: "els", title: "Extended Lifecycle Support"},
    {id: "security", title: "Vulnerability management"},
    {id: "support", title: "Enterprise support"},
]

export default [
    {
        title: "TuxCare",
        description: "TuxCare services automate, simplify, and enhance Linux operations, giving organizations more flexibility in managing Linux distro choices and versions, significant maintenance cost reductions, and greatly enhanced security and compliance postures.",
        link: "/tuxcare/",
        group: "start",
        summary: "Overview of TuxCare services",
    },
    {
        title: "TuxCare Radar",
        description: "Rather than relying on the conventional scoring mechanisms of legacy scanning solutions, TuxCare Radar takes a holistic, comprehensive approach to reveal the actual real-world risk that vulnerabilities pose.",
        link: "/radar/",
        group: "security",
        summary: "Risk-based vulnerability scanning",
    },
    {
        title: "TuxCare Enterprise Support",
        description: "TuxCare Enterprise Support provides a TuxCare-vetted repository of AlmaLinux and Rocky Linux updates with 16 years of support coverage, delivers an extension of an additional 4.5 years of security fixes for Critical and High-risk vulnerabilities and FIPS-compliant security patches for select minor versions, minimizes vulnerability windows with rebootless security patches and helps to avoid costly upfront support package fees with pay-as-you-go hourly support bundles.",
        link: "/enterprise-support-for-almalinux/",
        group: "support",
        summary: "Vetted AlmaLinux and Rocky Linux updates",
    },
    {
        title: "KernelCare",
        description: "KernelCare is a live kernel patching service that provides security patches and bugfixes for a range of popular Linux kernels that can be installed without rebooting the system.",
        link: "/live-patching-services/",
        group: "patching",
        summary: "Rebootless kernel patching",
    },
    {
        title: "KernelCare for IOT",
        description: "KernelCare for IoT provides live security patching for ARM64-based embedded systems for enterprise IoT users and original equipment manufacturers.",
        link: "/kernelcare-for-iot/",
        group: "patching",
        summary: "Live patching for ARM64 embedded devices",
    },
    {
        title: "ePortal",
        description: "TuxCare ePortal is the web management console dedicated to KernelCare Enterprise live patch management.",
        link: "/eportal/",
        group: "patching",
        summary: "On-premise live patch management",
    },
    {
        title: "ePortal API",
        description: "The ePortal API is a complete API for everyday use.",
        link: "/eportal-api/",
        group: "patching",
        summary: "API for ePortal automation",
    },
    {
        title: "ELS for Operating Systems",
        description: "ELS for Operating Systems allows you to continue running your Linux server after the operating system’s end of life.",
        link: "/els-for-os/",
        group: "els",
        summary: "Security updates for end-of-life Linux",
    },
    {
        title: "ELS for Language Ecosystems",
        description: "ELS for Language Ecosystems provides security fixes for open-source packages across language ecosystems beyond their official end-of-life date.",
        link: "/els-for-libraries/",
        group: "els",
        summary: "Patched open-source packages past EOL",
    },
    {
        title: "ELS for Runtimes",
        description: "ELS for Runtimes provides security fixes for language runtimes beyond their official end-of-life date.",
        link: "/els-for-runtimes/",
        group: "els",
        summary: "Patched language runtimes past EOL",
    },
    {
        title: "ELS for Applications",
        description: "ELS for Applications provides security fixes for open-source applications after official support ends.",
        link: "/els-for-applications/",
        group: "els",
        summary: "Patched open-source applications past EOL",
    },
    {
        title: "SecureChain for Open Source",
        description: "SecureChain for Open Source delivers verified, signed, continuously patched open-source packages from a trusted, TuxCare-managed registry — drop-in replacements that extend protection beyond upstream end of life. Available for JavaScript at launch, with Python, Java, Go, and PHP on the roadmap.",
        link: "/securechain/",
        group: "security",
        summary: "Verified, signed open-source packages",
    },
    {
        title: "Subscription Management Portal",
        description: "The TuxCare subscription management portal is designed to easily manage your licenses of TuxCare products and services by means of a user-friendly interface.",
        link: "/tuxcare-cln/",
        group: "start",
        summary: "Manage licenses and subscriptions",
    },
    {
        title: "Service Descriptions",
        description: "Technical support service descriptions.",
        link: "/service-descriptions/",
        group: "start",
        summary: "Technical support service terms",
    }
]
