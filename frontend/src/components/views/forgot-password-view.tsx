import { Form, Modal, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC, Fragment, useEffect } from "react";
import { useTranslations } from "next-intl";

import { IForgotPasswordForm } from "@/types";

interface IProps {
  title: string;
  visible: boolean;
  onFinish: (form: IForgotPasswordForm) => void;
  onCancel?: () => void;
}

export const SelectForgotPasswordModal: FC<IProps> = ({ title, visible, onFinish, onCancel }: IProps) => {
  const b = useTranslations("button");
  const c = useTranslations("component");
  const m = useTranslations("message");

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
    <Fragment>
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
          layout="vertical"
          autoComplete="off"
          onFinish={(v) => {
            onFinish({
              ...v,
            });
          }}>
          <Form.Item
            label={c("forgotPassword.label.username")}
            name="user_id"
            rules={[{ required: true, message: m("usernameRequired") }]}>
            <Input placeholder={c("forgotPassword.placeholder.username")} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="reset"
              onClick={() => {
                form.resetFields();
              }}
              danger>
              {b("reset")}
            </Button>
            <Button type="primary" htmlType="submit">
              {b("submit")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default SelectForgotPasswordModal;
