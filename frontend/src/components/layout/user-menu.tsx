import { FC } from "react";
import { useTranslations } from "next-intl";
import { Dropdown, Space, Avatar, Typography } from "antd";
import type { MenuProps } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

import { UserStore } from "@/store";
import { useRouter } from "@/navigation";

export const UserMenu: FC = () => {
  const router = useRouter();
  const t = useTranslations("userMenu");
  const { user, username, shortname } = UserStore();
  const clearUser = UserStore((state) => state.clearUser);

  const handleLogOut = () => {
    clearUser();
    router.push("/login");
  };

  const items: MenuProps["items"] = [
    {
      label: <a href="http://10.122.82.10/profile">{t("profile")}</a>,
      key: 0,
    },
    {
      type: "divider",
    },
    {
      label: <a onClick={handleLogOut}>{t("logOut")}</a>,
      key: 3,
    },
  ];

  return (
    <div className="user-menu-dropdown" style={{ padding: "0.5rem", borderRadius: "0.5rem" }}>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space
            style={{
              display: "flex",
              gap: "0.8rem",
              cursor: "pointer",
            }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Avatar
                style={{ backgroundColor: "#5454ff", color: "#fafafa", borderWidth: "1px", borderColor: "#2f54eb" }}
                alt={shortname()}
                size="large"
                gap={2}>
                <b>{shortname()}</b>
              </Avatar>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                }}>
                <Typography
                  style={{
                    lineHeight: "1",
                    color: "#8F98A3",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}>
                  {username()}
                </Typography>
                <Typography
                  style={{
                    lineHeight: "1",
                    color: "#C0CCDA",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}>
                  {user?.position_id}
                </Typography>
              </div>
            </div>
            <CaretDownOutlined style={{ cursor: "pointer" }} color="#C0CCDA" />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default UserMenu;
