import { FC } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { FiHome, FiFile, FiSearch } from "react-icons/fi";

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
  const l = useTranslations("layout");

  const items: MenuItem[] = [
    getItem(l("menu.side.home"), 10, "/", <FiHome className="default-icon-size" />),
    getItem(l("menu.side.mainTopic"), 20, null, <FiFile className="default-icon-size" />, [
      getItem(l("menu.side.topic1"), 21, "/", <FiSearch className="default-icon-size" />),
      getItem(l("menu.side.topic2"), 22, "/", <FiSearch className="default-icon-size" />),
    ]),
  ];

  return (
    <div className="menu-wrapper">
      <Menu className="menu" mode="inline" selectable={false} items={items} />
    </div>
  );
};
