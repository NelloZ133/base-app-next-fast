import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales } from "./navigation";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await (locale === "en" ? import(`@/i18n/en.json`) : import(`@/i18n/${locale}.json`))).default,
  };
});
