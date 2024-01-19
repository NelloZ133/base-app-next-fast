"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Layout, ConfigProvider, Space, Tooltip, Typography, theme } from "antd";
import type { ThemeConfig } from "antd";
import { SiderTheme } from "antd/es/layout/Sider";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { ModeStore, UserStore } from "@/store";
import { SidebarMenu } from "./sidebar-menu";
import Navigation from "./navigation";

const { Sider, Content } = Layout;

export const LayoutCustom = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = UserStore();

  const toggleMode = ModeStore((state) => state.toggleMode);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const config: ThemeConfig = {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: "Noto Sans Thai",
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };
  const t = useTranslations("layout");
  const m = useTranslations("menu");

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
              <Tooltip title={t("foldButton")} placement="right" mouseEnterDelay={0.8}>
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
                  <Typography style={{ fontWeight: 600 }}>{`${m("menu")}`}</Typography>
                </Space>
              </Tooltip>
              <SidebarMenu />
            </Sider>
          )}

          <Content className="main-content">{children}</Content>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default LayoutCustom;
