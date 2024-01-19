import { FC } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { HiHome, HiDocumentCheck, HiMagnifyingGlassCircle, HiMiniPencilSquare } from "react-icons/hi2";

import { Link } from "@/navigation";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  link?: string | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label: link ? <Link href={link}>{label}</Link> : label,
    type,
  } as MenuItem;
}

export const SidebarMenu: FC = () => {
  const t = useTranslations("menu");

  const items: MenuItem[] = [
    getItem(t("home"), 10, "/", <HiHome className="default-icon-size" />),
    getItem(t("app_menu"), 20, null, <HiDocumentCheck className="default-icon-size" />, [
      getItem(t("sub_menu1"), 21, "/", <HiMagnifyingGlassCircle className="default-icon-size" />),
      getItem(t("sub_menu2"), 22, "/", <HiMiniPencilSquare className="default-icon-size" />),
    ]),
  ];

  return (
    <div className="menu-wrapper">
      <Menu className="menu" mode="inline" selectable={false} items={items} />
    </div>
  );
};
