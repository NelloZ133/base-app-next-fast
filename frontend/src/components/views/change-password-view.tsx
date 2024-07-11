import { Form, Modal, Input, Button, message, Space, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslations } from "next-intl";
import { FC, Fragment, useEffect, useState } from "react";

import { IChangePasswordForm } from "@/types";
import { validatePassword } from "@/validators";

interface IProps {
  visible: boolean;
  onFinish: (form: IChangePasswordForm) => void;
  onCancel: () => void;
}

export const ChangePasswordView: FC<IProps> = ({ visible, onFinish, onCancel }) => {
  const b = useTranslations("button");
  const c = useTranslations("component");
  const m = useTranslations("message");
  const p = useTranslations("page");

  const [form] = useForm<IChangePasswordForm>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = () => {
    const validation = validatePassword(password, confirmPassword);
    if (validation.isValid) {
      return true;
    } else {
      message.error(validation.errorMessage as string);
      setErrorMessage(validation.errorMessage as string);
      return false;
    }
  };

  const handleCancel = () => {
    onCancel?.();
    form.resetFields();
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Fragment>
      <Modal
        title={p("profile.title.changePassword")}
        open={visible}
        footer={null}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        keyboard={true}>
        <Form
          form={form}
          className="form-change-password"
          layout="vertical"
          autoComplete="off"
          onChange={() => setErrorMessage("")}
          onFinish={(v: IChangePasswordForm) => {
            handleSubmit() &&
              onFinish({
                ...v,
              });
          }}>
          <Form.Item
            label={c("changePassword.label.currentPassword")}
            name="cur_pass"
            rules={[{ required: true, message: m("fieldRequired") }]}>
            <Input.Password placeholder={c("changePassword.placeholder.currentPassword")} />
          </Form.Item>
          <Form.Item
            label={c("changePassword.label.newPassword")}
            name="new_pass"
            rules={[{ required: true, message: m("fieldRequired") }]}>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={c("changePassword.placeholder.newPassword")}
            />
          </Form.Item>
          <Form.Item
            label={c("changePassword.label.confirmNewPassword")}
            name="confirm_new_pass"
            rules={[{ required: true, message: m("fieldRequired") }]}>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={c("changePassword.placeholder.confirmNewPassword")}
            />
          </Form.Item>
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          <Form.Item>
            <Row justify={"end"}>
              <Space size="middle">
                <Button
                  danger
                  type="primary"
                  htmlType="reset"
                  onClick={() => {
                    form.resetFields();
                    setErrorMessage("");
                  }}>
                  {b("reset")}
                </Button>
                <Button type="primary" htmlType="submit">
                  {b("submit")}
                </Button>
              </Space>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ChangePasswordView;
