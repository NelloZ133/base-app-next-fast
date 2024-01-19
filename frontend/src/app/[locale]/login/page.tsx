"use client";
import { Button, Form, Input, message, Modal, theme, ConfigProvider, Layout, Space } from "antd";
import type { ThemeConfig } from "antd";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { NextPage } from "next";
const { Content } = Layout;

import { login, forgotPassword } from "@/actions";
import { IForgotPasswordForm } from "@/types/user.type";
import SelectForgotPasswordModal from "@/components/views/select-forgot-password";
import { ModeStore, LayoutStore } from "@/store";
import { useRouter } from "@/navigation";

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
      fontFamily: "Noto Sans Thai",
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const t = useTranslations("login");
  const b = useTranslations("button");
  const h = useTranslations("header");

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
    setHeaderTitle(h("login"));
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
            autoComplete="off"
            // style={{ width: "45%", justifyContent: "center" }}
          >
            <Form.Item
              label={`${t("username.title")}`}
              name="username"
              rules={[{ required: true, message: t("username.errorMessage") }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label={`${t("password.title")}`}
              name="password"
              rules={[{ required: true, message: t("password.errorMessage") }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10 }} className="login-button">
              <Space>
                <Button type="primary" htmlType="submit" className="button-login">
                  {`${b("login")}`}
                </Button>
                <Button
                  type="dashed"
                  className="button-forgot-password"
                  onClick={() => setSelectForgotPasswordModal(true)}>
                  {`${t("forgotPassword.title")}`}
                </Button>
              </Space>
              <Button type="default" className="button-contact-admin" onClick={() => setSelectContactAdmin(true)}>
                {`${t("contactAdmin.title")}`}
              </Button>
            </Form.Item>
          </Form>

          <Modal
            title={`${t("contactAdmin.title")}`}
            open={selectContactAdmin}
            footer={null}
            onCancel={() => setSelectContactAdmin(false)}
            centered
            maskClosable={false}
            keyboard={true}>
            <span>{`${t("contactAdmin.content")}`}</span>
            <br />
            <a href="mailto:arief.kaday.a5c@ap.denso.com?subject=[Lot Quality Check]">
              &nbsp;&#x2022; arief.kaday.a5c@ap.denso.com
            </a>
            <br />
            <a href="mailto:khunakon.lerdsrisampan.a3z@ap.denso.com?subject=[Lot Quality Check]">
              &nbsp;&#x2022; khunakon.lerdsrisampan.a3z@ap.denso.com
            </a>
          </Modal>
        </Content>
        <SelectForgotPasswordModal
          title={`${t("forgotPassword.title")}`}
          visible={selectForgotPasswordModal}
          onFinish={onForgotPasswordFinish}
          onCancel={handleCancelSelectForgotPassword}
        />
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;
