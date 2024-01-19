import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "@/navigation";

export default createMiddleware({
  defaultLocale: "en",
  locales: locales,
  localePrefix: localePrefix,
});

export const config = {
  matcher: ["/", "/(en|th)/:path*"],

  //* For pathname without locale prefix
  // matcher: ["/", "/(en|th)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
