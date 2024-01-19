import { IChangePasswordForm } from "@/types";
import { validatePassword } from "@/validators";
import { Form, Modal, Input, Button, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC, useState, useEffect } from "react";

interface IProps {
  title: string;
  visible: boolean;
  onFinish: (form: IChangePasswordForm) => void;
  onCancel?: () => void;
}

export const SelectChangePasswordModal: FC<IProps> = ({ title, visible, onFinish, onCancel }: IProps) => {
  const [form] = useForm<IChangePasswordForm>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const sendErrorMessage = () => {
    messageApi.open({
      type: "error",
      content: "password setting error",
      duration: 500,
    });
    setTimeout(messageApi.destroy, 1330);
  };

  const handleSubmit = () => {
    const validation = validatePassword(password, confirmPassword);
    if (validation.isValid) {
      return true;
    } else {
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
    <>
      {contextHolder}
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
          className="form-change-password"
          layout="vertical"
          autoComplete="off"
          onChange={() => setErrorMessage("")}
          onFinish={(v) => {
            handleSubmit()
              ? onFinish({
                  ...v,
                })
              : sendErrorMessage();
          }}>
          <Form.Item
            label="Current Password"
            name="current_pass"
            rules={[{ required: true, message: "Please input your current password" }]}>
            <Input.Password placeholder="Enter your current password" />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new_pass"
            rules={[{ required: true, message: "Please input your new password" }]}>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirm_new_pass"
            rules={[{ required: true, message: "Please input the same as new password" }]}>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your new password again"
            />
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
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </Modal>
    </>
  );
};

export default SelectChangePasswordModal;
