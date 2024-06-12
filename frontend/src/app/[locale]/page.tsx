"use client";
import { ConfigProvider, Layout, Typography, theme } from "antd";
import type { ThemeConfig } from "antd";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
const { Content } = Layout;

import { Link } from "@/navigation";
import { LayoutStore, ModeStore } from "@/store";

import { Noto_Sans_Thai } from "next/font/google";
const notoTH = Noto_Sans_Thai({ subsets: ["thai", "latin", "latin-ext"] });

const Home = () => {
  const { setHeaderTitle, setBackable, setBackTarget } = LayoutStore.getState();
  const toggleMode = ModeStore((state) => state.toggleMode);
  const config: ThemeConfig = {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: notoTH.style.fontFamily,
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const l = useTranslations("layout");

  useEffect(() => {
    setHeaderTitle(l("header.home"));
    setBackable(false);
    setBackTarget(undefined);
  }, []);

  return (
    <ConfigProvider theme={config}>
      <div
        style={{
          background: toggleMode === "light" ? colorBgContainer : "#141a28",
        }}>
        <Content className="container">
          <Link href={"/"}>
            <Typography.Title className="main-menu-item" level={1}>
              {l("menu.main.topic1")}
            </Typography.Title>
          </Link>
          <Link href={"/"}>
            <Typography.Title className="main-menu-item" level={1}>
              {l("menu.main.topic2")}
            </Typography.Title>
          </Link>
        </Content>
      </div>
    </ConfigProvider>
  );
};

export default Home;
