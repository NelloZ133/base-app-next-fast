import { Form, Modal, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC, useEffect } from "react";
import { useTranslations } from "next-intl";

import { IForgotPasswordForm } from "@/types";

interface IProps {
  title: string;
  visible: boolean;
  onFinish: (form: IForgotPasswordForm) => void;
  onCancel?: () => void;
}

export const SelectForgotPasswordModal: FC<IProps> = ({ title, visible, onFinish, onCancel }: IProps) => {
  const t = useTranslations("login");
  const b = useTranslations("button");

  const [form] = useForm<IForgotPasswordForm>();

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
    <>
      <Modal
        title={title}
        open={visible}
        footer={null}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        keyboard={true}>
        <Form
          form={form}
          className="form-forgot-password"
          layout="vertical"
          autoComplete="off"
          onFinish={(v) => {
            onFinish({
              ...v,
            });
          }}>
          <Form.Item
            label={`${t("username.title")}`}
            name="user_id"
            rules={[{ required: true, message: t("username.errorMessage") }]}>
            <Input placeholder={`${t("forgotPassword.placeholder")}`} />
          </Form.Item>
          <Form.Item>
            <div className="flex w-full justify-end mb-4">
              <Button
                className="mx-1"
                type="primary"
                htmlType="reset"
                onClick={() => {
                  form.resetFields();
                }}
                danger>
                {`${b("reset")}`}
              </Button>
              <Button className="mx-1 register-user" type="primary" htmlType="submit">
                {`${b("submit")}`}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SelectForgotPasswordModal;
