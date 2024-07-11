"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ConfigProvider, Layout, Space, Tooltip, Typography, theme } from "antd";
import type { ThemeConfig } from "antd";
import { SiderTheme } from "antd/es/layout/Sider";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { ModeStore, UserStore } from "@/store";
import { SidebarMenu } from "./sidebar-menu";
import Navigation from "./navigation";

const { Sider, Content } = Layout;

import { Noto_Sans_Thai } from "next/font/google";
const notoTH = Noto_Sans_Thai({ subsets: ["thai", "latin", "latin-ext"] });

export const LayoutCustom = ({ children }: { children: React.ReactNode }) => {
  const b = useTranslations("button");
  const l = useTranslations("layout");

  const isLoggedIn = UserStore((state) => state.isLoggedIn);

  const toggleMode = ModeStore((state) => state.toggleMode);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const config: ThemeConfig = {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: notoTH.style.fontFamily,
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <ConfigProvider theme={config}>
      <div
        style={{
          background: toggleMode === "light" ? colorBgContainer : "#141a28",
          height: "100dvh",
          flex: 1,
        }}>
        <Navigation />
        <Layout>
          {isLoggedIn() && (
            <Sider theme={toggleMode as SiderTheme} trigger={null} collapsible collapsed={collapsed}>
              <Tooltip title={b("fold")} placement="right" mouseEnterDelay={0.8}>
                <Space style={{ paddingLeft: "1rem", paddingTop: "1rem" }}>
                  {collapsed ? (
                    <MenuUnfoldOutlined
                      style={{ color: toggleMode === "light" ? "#8c8c8c" : "#ffffff" }}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  ) : (
                    <MenuFoldOutlined
                      style={{ color: toggleMode === "light" ? "#8c8c8c" : "#ffffff" }}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  )}
                  <Typography style={{ fontWeight: 600 }}>{l("menu.side.menu")}</Typography>
                </Space>
              </Tooltip>
              <SidebarMenu />
            </Sider>
          )}

          {children}
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default LayoutCustom;
