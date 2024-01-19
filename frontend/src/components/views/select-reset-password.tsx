import { IForgotPasswordForm } from "@/types";
import { Form, Modal, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC, useEffect } from "react";

interface IProps {
  title: string;
  visible: boolean;
  onFinish: (form: IForgotPasswordForm) => void;
  onCancel?: () => void;
}

export const SelectResetPasswordModal: FC<IProps> = ({ title, visible, onFinish, onCancel }: IProps) => {
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
            label="Username"
            name="user_id"
            rules={[{ required: true, message: "Please input your username" }]}>
            <Input placeholder="Enter the username you want to reset password" />
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
                Reset
              </Button>
              <Button className="mx-1 register-user" type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SelectResetPasswordModal;
