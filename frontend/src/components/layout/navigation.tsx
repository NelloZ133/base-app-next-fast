"use client";
import Image from "next/image";
import React, { FC } from "react";
import { theme, ConfigProvider, Typography } from "antd";
import type { ThemeConfig } from "antd";
import { BiSun } from "react-icons/bi";
import { BsMoonStars } from "react-icons/bs";

import denso from "@/assets/denso.svg";
import styles from "@/styles/nav.module.scss";
import { ModeStore, LayoutStore } from "@/store/";
import UserMenu from "./user-menu";
import LocaleSwitcher from "./locale-switcher";

const Navigation: FC = () => {
  const { headerTitle } = LayoutStore();
  const toggleMode = ModeStore((state) => state.toggleMode);
  const setToggleMode = ModeStore((state) => state.setToggleMode);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const changeTheme = () => {
    setToggleMode(toggleMode === "light" ? "dark" : "light");
  };

  const config: ThemeConfig = {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: "Noto Sans Thai",
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };

  return (
    <ConfigProvider theme={config}>
      <div
        style={{
          display: "flex",
          height: "5rem",
          justifyContent: "space-between",
          padding: "1rem 2rem 0.5rem 2rem",
          background: toggleMode === "light" ? colorBgContainer : "#0d1117",
        }}>
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Image src={denso} alt="denso" priority width={100} />
          <Typography className="header-title">{`${headerTitle}`}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <div onClick={changeTheme} className={styles.mode}>
            {toggleMode === "light" ? <BiSun color="#8c8c8c" size={25} /> : <BsMoonStars color="white" size={20} />}
          </div>
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Navigation;
