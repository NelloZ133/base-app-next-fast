"use client";
import { Button, ConfigProvider, Form, Input, Layout, Modal, Space, Typography, message, theme } from "antd";
import type { ThemeConfig } from "antd";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { NextPage } from "next";

const { Content } = Layout;
const { Text } = Typography;

import { LayoutStore, ModeStore } from "@/store";
import { useRouter } from "@/navigation";
import { login, forgotPassword } from "@/actions";
import { IForgotPasswordForm } from "@/types/user.type";
import ForgotPasswordModal from "@/components/views/forgot-password-view";

import { Noto_Sans_Thai } from "next/font/google";
const notoTH = Noto_Sans_Thai({ subsets: ["thai", "latin", "latin-ext"] });

interface ILoginForm {
  username: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const { backTarget } = LayoutStore();
  const { setIsLoading, setHeaderTitle, setBackable } = LayoutStore.getState();
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
  const b = useTranslations("button");
  const l = useTranslations("layout");
  const m = useTranslations("message");
  const p = useTranslations("page");

  const router = useRouter();
  const [selectForgotPasswordModal, setSelectForgotPasswordModal] = useState<boolean>(false);
  const [selectContactAdmin, setSelectContactAdmin] = useState<boolean>(false);

  const onFinish = async (form: ILoginForm) => {
    setIsLoading(true);
    const res = await login(form["username"], form["password"]);
    setIsLoading(false);
    if (!res) return;
    router.replace(backTarget && backTarget !== "/login" ? backTarget : "/");
  };

  const onForgotPasswordFinish = async (form: IForgotPasswordForm) => {
    forgotPassword(form)
      .then((res) => message.success(res))
      .catch((err) => message.error(err));
    setSelectForgotPasswordModal(false);
  };

  const handleCancelSelectForgotPassword = () => {
    setSelectForgotPasswordModal(false);
  };

  useEffect(() => {
    setHeaderTitle(l("header.login"));
    setBackable(true);
  }, []);

  return (
    <ConfigProvider theme={config}>
      <div
        style={{
          background: toggleMode === "light" ? colorBgContainer : "#141a28",
        }}>
        <Content className="container">
          <Form
            name="login"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off">
            <Form.Item
              label={p("login.title.username")}
              name="username"
              rules={[{ required: true, message: m("usernameRequired") }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label={p("login.title.password")}
              name="password"
              rules={[{ required: true, message: m("passwordRequired") }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10 }} className="login">
              <Space>
                <Button style={{ width: "9rem" }} type="primary" htmlType="submit">
                  {b("login")}
                </Button>
                <Button type="dashed" style={{ width: "9rem" }} onClick={() => setSelectForgotPasswordModal(true)}>
                  {p("login.title.forgotPassword")}
                </Button>
              </Space>
              <Button
                type="default"
                style={{ width: "18rem", marginTop: "0.5rem" }}
                onClick={() => setSelectContactAdmin(true)}>
                {p("login.title.contactAdmin")}
              </Button>
            </Form.Item>
          </Form>

          <Modal
            title={p("login.title.contactAdmin")}
            open={selectContactAdmin}
            footer={null}
            onCancel={() => setSelectContactAdmin(false)}
            centered
            maskClosable={false}
            keyboard={true}>
            <Text>{p("login.content.contactAdmin")}</Text>
            <br />
            <a href="mailto:arief.kaday.a5c@ap.denso.com?subject=[Lot Quality Check]">
              &nbsp;&#x2022; arief.kaday.a5c@ap.denso.com
            </a>
            <br />
            <a href="mailto:khessarin.kaeoli.a8y@ap.denso.com?subject=[Lot Quality Check]">
              &nbsp;&#x2022; khessarin.kaeoli.a8y@ap.denso.com
            </a>
          </Modal>
        </Content>
        <ForgotPasswordModal
          title={p("login.title.forgotPassword")}
          visible={selectForgotPasswordModal}
          onFinish={onForgotPasswordFinish}
          onCancel={handleCancelSelectForgotPassword}
        />
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;
