"use client";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ConfigProvider, Layout, Typography, theme } from "antd";
import type { ThemeConfig } from "antd";
const { Content } = Layout;

import { LayoutStore, ModeStore } from "@/store";
import { Link } from "@/navigation";

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
            <Typography className="main-menu-item">{l("menu.main.topic1")}</Typography>
          </Link>

          <Link href={"/"}>
            <Typography className="main-menu-item">{l("menu.main.topic2")}</Typography>
          </Link>
        </Content>
      </div>
    </ConfigProvider>
  );
};

export default Home;
