"use client";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ConfigProvider, theme, Typography, Layout } from "antd";
import type { ThemeConfig } from "antd";
const { Content } = Layout;

import { ModeStore, LayoutStore } from "@/store";
import { Link } from "@/navigation";

const Home = () => {
  const { setHeaderTitle, setBackable, setBackTarget } = LayoutStore.getState();
  const toggleMode = ModeStore((state) => state.toggleMode);
  const config: ThemeConfig = {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: "Noto Sans Thai",
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const t = useTranslations("main");
  const h = useTranslations("header");

  useEffect(() => {
    setHeaderTitle(h("home"));
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
            <Typography className="main-menu-item">{t("topic1")}</Typography>
          </Link>

          <Link href={"/"}>
            <Typography className="main-menu-item">{t("topic2.subject")}</Typography>
          </Link>
        </Content>
      </div>
    </ConfigProvider>
  );
};

export default Home;
