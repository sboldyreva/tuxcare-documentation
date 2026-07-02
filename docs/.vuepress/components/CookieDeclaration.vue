<template>
  <div ref="container" class="cookie-declaration"></div>
</template>

<script>
export default {
  name: "CookieDeclaration",
  mounted() {
    // Cookiebot renders the cookie declaration table inline at the position of
    // this script tag. cd.js is a versionless vendor loader, so (like the banner)
    // no SRI is applied — accepted risk, tracked in ELSDOC-313.
    const container = this.$refs.container;
    if (!container || container.querySelector("#CookieDeclaration")) return;
    const script = document.createElement("script");
    script.id = "CookieDeclaration";
    script.src =
      "https://consent.cookiebot.com/683e5da5-be31-4695-80e1-2c71cc909411/cd.js";
    script.type = "text/javascript";
    script.async = true;
    container.appendChild(script);
  },
};
</script>
