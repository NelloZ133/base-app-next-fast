"use client";
import { ConfigProvider, Layout, Space, Tooltip, message, theme } from "antd";
import { FormOutlined, LockOutlined } from "@ant-design/icons";
import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { LayoutStore, ModeStore, SettingStore, UserStore } from "@/store";
import { IChangePasswordForm, IUserUpdateForm } from "@/types";

import { Noto_Sans_Thai } from "next/font/google";
import ProfileView from "@/components/views/profile-view";
import { changePassword, updateUser } from "@/actions";
import ChangePasswordView from "@/components/views/change-password-view";
const notoTH = Noto_Sans_Thai({ subsets: ["thai", "latin", "latin-ext"] });
const { Content } = Layout;

const ProfilePage: NextPage = () => {
  const l = useTranslations("layout");
  const m = useTranslations("message");
  const p = useTranslations("page");

  const router = useRouter();
  const { setIsLoading, setHeaderTitle, setBackable } = LayoutStore.getState();
  const toggleMode = ModeStore((state) => state.toggleMode);
  const { fetchSettings } = SettingStore.getState();
  const user = UserStore((state) => state.user);
  const isLoggedIn = UserStore((state) => state.isLoggedIn);
  const { setUser, loadUser } = UserStore.getState();

  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState<boolean>(false);
  const [disableChangePassword, setDisableChangePassword] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const config = {
    token: {
      colorPrimary: "#1890ff",
      fontFamily: notoTH.style.fontFamily,
    },
    algorithm: toggleMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const checkAuth = () => {
    setIsLoading(true);
    loadUser();
    setIsLoading(false);

    if (!isLoggedIn()) {
      router.push("/login");
      return false;
    }

    return true;
  };

  useEffect(() => {
    checkAuth();
    setHeaderTitle(l("header.profile"));
    setBackable(true);
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!user.email && !user.email_supervisor && !user.email_manager) {
      setDisableChangePassword(true);
    } else {
      setDisableChangePassword(false);
    }
  }, [user]);

  const onUserFinish = async (form: IUserUpdateForm) => {
    try {
      setIsLoading(true);
      const res = await updateUser({ ...form, user_uuid: user?.user_uuid });
      setUser(res);
      setIsEditing(false);
      setIsLoading(false);
      message.success(m("updateUserSuccess"));
    } catch (err) {
      message.error(`${m("updateUserFailed")} : ${err}`);
    }
  };

  const onChangePasswordFinish = (form: IChangePasswordForm) => {
    changePassword({ ...form, user_uuid: user?.user_uuid }).then((res) => {
      message.success(res);
      setChangePasswordModalOpen(false);
    });
  };

  return (
    <ConfigProvider theme={config}>
      <div style={{ background: toggleMode === "light" ? colorBgContainer : "#141a28" }}>
        <Content className="container">
          <div className="user-profile-top">
            <Space>
              {disableChangePassword ? (
                <Tooltip title={p("profile.tooltip.changePasswordDisable")}>
                  <LockOutlined style={{ color: "gray", fontSize: "2rem" }} />
                </Tooltip>
              ) : (
                <Tooltip title={p("profile.tooltip.changePassword")}>
                  <LockOutlined style={{ fontSize: "2rem" }} onClick={() => setChangePasswordModalOpen(true)} />
                </Tooltip>
              )}
              <Tooltip title={p("profile.tooltip.editUserInfo")}>
                <FormOutlined
                  style={{ fontSize: "2rem" }}
                  onClick={() => {
                    isEditing ? setIsEditing(false) : setIsEditing(true);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
          {user && <ProfileView isEditing={isEditing} user={user} onFinish={onUserFinish} />}
          <ChangePasswordView
            visible={changePasswordModalOpen}
            onFinish={onChangePasswordFinish}
            onCancel={() => setChangePasswordModalOpen(false)}
          />
        </Content>
      </div>
    </ConfigProvider>
  );
};

export default ProfilePage;
