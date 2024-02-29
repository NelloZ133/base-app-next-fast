"use client";
import { Spin } from "antd";

import { LayoutStore } from "@/store";

const Loading = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = LayoutStore();
  return (
    <Spin spinning={isLoading} style={{ top: "50%", transform: "translateY(-50%)" }}>
      {children}
    </Spin>
  );
};

export default Loading;
