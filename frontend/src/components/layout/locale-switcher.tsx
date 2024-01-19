import { Select } from "antd";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, locales } from "@/navigation";
import styles from "@/styles/switcher.module.scss";

import { ModeStore } from "@/store";

const { Option } = Select;

const LocaleSwitcher = () => {
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { queryParamsUrl } = ModeStore();

  function onSelectChange(value: string) {
    startTransition(() => {
      // router.replace(pathname, { locale: value }); //*original
      router.replace(`/${pathname}${queryParamsUrl}`, { locale: value });
    });
  }

  return (
    <div className={styles.switch}>
      <Select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        style={{ fontFamily: "Noto Sans Thai" }}>
        {locales.map((cur) => (
          <Option key={cur} value={cur}>
            {t("locale", { locale: cur })}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default LocaleSwitcher;
