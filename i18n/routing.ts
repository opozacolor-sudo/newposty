import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ro", "de", "it", "fr", "es"],
  defaultLocale: "en",
  localeDetection: true,
});
