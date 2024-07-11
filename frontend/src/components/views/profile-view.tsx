import { Button, Col, Form, Input, Modal, Popconfirm, Radio, Row, Select, Space, Typography, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { EditTwoTone } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { FC, Fragment, useEffect, useMemo, useState } from "react";

import { AdminKey, LanguageOptions, ShiftList } from "@/constants";
import { LayoutStore, ModeStore, SettingStore } from "@/store";
import { IUserUpdateForm, OptionValue, User } from "@/types";
import { validateEmail } from "@/validators";

interface IProps {
  isEditing: boolean;
  user: User;
  onFinish: (form: IUserUpdateForm) => void;
}

export const ProfileView: FC<IProps> = ({ user, isEditing, onFinish }) => {
  const b = useTranslations("button");
  const c = useTranslations("component");
  const m = useTranslations("message");

  const { setIsLoading } = LayoutStore.getState();
  const toggleMode = ModeStore((state) => state.toggleMode);
  const lines = SettingStore((state) => state.lines);
  const positions = SettingStore((state) => state.positions);
  const sections = SettingStore((state) => state.sections);

  const inputSpanStyle = {
    // color: toggleMode === "light" ? "rgba(0,0,0,0.88)" : "rgba(255, 255, 255, 0.85)",
  };

  const [form] = useForm<IUserUpdateForm>();

  const [adminKey, setAdminKey] = useState<string>("");
  const [adminAuthorization, setAdminAuthorization] = useState<boolean>(user?.is_admin ? true : false);
  const [allowEditPositionModal, setAllowEditPositionModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [supervisorEmail, setSupervisorEmail] = useState<string>(user?.email_supervisor || "");
  const [managerEmail, setManagerEmail] = useState<string>(user?.email_manager || "");

  useEffect(() => {
    if (!user) {
      message.error(m("userNotFound"));
      return;
    }
    setUserToForm();
  }, [user]);

  const lineOptions = useMemo<OptionValue[]>(() => {
    return lines.map((line) => {
      return {
        label: `${line.line_fullname} [${line.work_center_code}]`,
        value: line.line_id,
      } as OptionValue;
    });
  }, [lines]);

  const positionOptions = useMemo<OptionValue[]>(() => {
    return positions.map((pos) => {
      return {
        label: `${pos.position_shortname} [T${pos.position_level}]`,
        value: pos.position_id,
      } as OptionValue;
    });
  }, [positions]);

  const sectionOptions = useMemo<OptionValue[]>(() => {
    return sections.map((sect) => {
      return {
        label: `${sect.section_code} ${sect.section_name}`,
        value: sect.section_id,
      } as OptionValue;
    });
  }, [sections]);

  const setUserToForm = async () => {
    if (!user) {
      message.error(m("userNotFound"));
      return;
    }
    try {
      setIsLoading(true);
      const userInfo: IUserUpdateForm = {
        username: user.username,
        language: user.language,
        first_primary: user.first_primary,
        middle_primary: user.middle_primary,
        last_primary: user.last_primary,
        first_secondary: user.first_secondary,
        middle_secondary: user.middle_secondary,
        last_secondary: user.last_secondary,
        first_tertiary: user.first_tertiary,
        middle_tertiary: user.middle_tertiary,
        last_tertiary: user.last_tertiary,
        employee_no: user.employee_no,
        shift_name: user.shift_name,
        line_id: user.line_id,
        line_id_group: user.line_id_group,
        tel_no_primary: user.tel_no_primary,
        tel_no_secondary: user.tel_no_secondary,
        email: user.email,
        email_supervisor: user.email_supervisor,
        email_manager: user.email_manager,
        position_id: user.position_id,
        section_id: user.section_id,
      };
      setEmail(user.email || "");
      setSupervisorEmail(user.email_supervisor || "");
      setManagerEmail(user.email_manager || "");
      Object.entries(userInfo).forEach((entry) => {
        const [key, value] = entry;
        form.setFieldValue(key, value);
      });
      setIsLoading(false);
    } catch (err) {
      message.error(`${err}`);
    }
  };

  const onFormFinish = () => {
    const validationEmail = email ? validateEmail(email) : { isValid: true };
    const validationSupervisorEmail = supervisorEmail ? validateEmail(supervisorEmail) : { isValid: true };
    const validationManagerEmail = managerEmail ? validateEmail(managerEmail) : { isValid: true };

    if (!email && !supervisorEmail) {
      setErrorMessage(m("emailRequired"));
      message.error(m("emailRequired"));
      return false;
    }

    if (validationEmail.isValid && validationSupervisorEmail.isValid && validationManagerEmail.isValid) {
      return true;
    } else if (!validationEmail.isValid) {
      setErrorMessage("Email: " + (validationEmail.errorMessage as string));
      message.error("Email: " + (validationEmail.errorMessage as string));
      return false;
    } else if (!validationSupervisorEmail.isValid) {
      setErrorMessage("Supervisor Email: " + (validationSupervisorEmail.errorMessage as string));
      message.error("Supervisor Email: " + (validationSupervisorEmail.errorMessage as string));
      return false;
    } else if (!validationManagerEmail.isValid) {
      setErrorMessage("Manager Email: " + (validationManagerEmail.errorMessage as string));
      message.error("Manager Email: " + (validationManagerEmail.errorMessage as string));
      return false;
    }
    return true;
  };

  const onFormReset = () => {
    form.resetFields();
    setUserToForm();
    setErrorMessage("");
    setAdminKey("");
    setAdminAuthorization(false);
  };

  const checkRight = () => {
    if (user?.is_admin || adminKey === AdminKey) {
      setAdminAuthorization(true);
      setAdminKey("");
    } else {
      setErrorMessage(m("wrongAdminKey"));
      message.error(m("wrongAdminKey"));
      setAdminKey("");
    }
    setAllowEditPositionModal(false);
  };

  useEffect(() => {
    if (!isEditing) {
      onFormReset();
    }
  }, [isEditing]);

  return (
    <Fragment>
      <Form
        form={form}
        className={`form-profile ${toggleMode}`}
        layout="vertical"
        disabled={!isEditing}
        scrollToFirstError
        onChange={() => {
          setErrorMessage("");
        }}
        onFinish={(v: IUserUpdateForm) => {
          onFormFinish() &&
            onFinish({
              ...v,
            });
        }}>
        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item
              label={
                <Space>
                  <Typography.Text>{c("editUser.label.username")}</Typography.Text>
                  <EditTwoTone
                    style={{ fontSize: "1rem", visibility: isEditing ? "visible" : "hidden" }}
                    onClick={() => setAllowEditPositionModal(true)}
                  />
                </Space>
              }
              name="username"
              rules={[{ required: isEditing, message: m("fieldRequired") }]}
              required={false}>
              <Input
                style={{ ...inputSpanStyle }}
                variant={isEditing ? "outlined" : "filled"}
                disabled={!adminAuthorization || !isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label={c("editUser.label.employeeNo")} name="employee_no">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={
                <Space>
                  <Typography.Text>{c("editUser.label.position")}</Typography.Text>
                  <EditTwoTone
                    style={{ fontSize: "1rem", visibility: isEditing ? "visible" : "hidden" }}
                    onClick={() => setAllowEditPositionModal(true)}
                  />
                </Space>
              }
              name="position_id">
              <Select
                style={{ ...inputSpanStyle }}
                showSearch
                optionFilterProp="label"
                options={positionOptions}
                suffixIcon={null}
                disabled={!adminAuthorization || !isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={10}>
            <Form.Item label={c("editUser.label.language")} name="language" tooltip={c("editUser.tooltip.language")}>
              <Select
                allowClear
                style={{ ...inputSpanStyle }}
                mode="multiple"
                showSearch
                optionFilterProp="label"
                options={LanguageOptions}
                suffixIcon={null}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={c("editUser.label.workingShift")} name="shift_name">
              <Radio.Group buttonStyle="solid" disabled={!isEditing}>
                {ShiftList.map((shift, idx) => (
                  <Radio.Button className="shift-radio" key={`shift-${idx}`} value={shift}>
                    Shift {shift}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item
              label={c("editUser.label.firstPrimary")}
              name="first_primary"
              rules={[{ required: isEditing, message: m("fieldRequired") }]}
              required={false}>
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.middlePrimary")} name="middle_primary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label={c("editUser.label.lastPrimary")}
              name="last_primary"
              rules={[{ required: isEditing, message: m("fieldRequired") }]}
              required={false}>
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item label={c("editUser.label.firstSecondary")} name="first_secondary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.middleSecondary")} name="middle_secondary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label={c("editUser.label.lastSecondary")} name="last_secondary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item label={c("editUser.label.firstTertiary")} name="first_tertiary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.middleTertiary")} name="middle_tertiary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label={c("editUser.label.lastTertiary")} name="last_tertiary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.email")} name="email">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...inputSpanStyle }}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.emailSupervisor")} name="email_supervisor">
              <Input
                onChange={(e) => setSupervisorEmail(e.target.value)}
                style={{ ...inputSpanStyle }}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.emailManager")} name="email_manager">
              <Input
                onChange={(e) => setManagerEmail(e.target.value)}
                style={{ ...inputSpanStyle }}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={10}>
            <Form.Item
              label={c("editUser.label.section")}
              name="section_id"
              rules={[{ required: isEditing, message: m("fieldRequired") }]}
              required={false}>
              <Select
                style={{ ...inputSpanStyle }}
                showSearch
                optionFilterProp="label"
                options={sectionOptions}
                suffixIcon={null}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={c("editUser.label.mainLine")} name="line_id">
              <Select
                style={{ ...inputSpanStyle }}
                allowClear
                showSearch
                optionFilterProp="label"
                options={lineOptions}
                suffixIcon={null}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.concernLine")} name="line_id_group">
              <Select
                style={{ maxHeight: "15rem", overflowY: "auto", ...inputSpanStyle }}
                allowClear
                mode="multiple"
                maxTagTextLength={18}
                showSearch
                optionFilterProp="label"
                options={lineOptions}
                suffixIcon={null}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={10}>
            <Form.Item label={c("editUser.label.telNoPrimary")} name="tel_no_primary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={c("editUser.label.telNoSecondary")} name="tel_no_secondary">
              <Input style={{ ...inputSpanStyle }} variant={isEditing ? "outlined" : "filled"} />
            </Form.Item>
          </Col>
        </Row>
        {errorMessage && (
          <Row>
            <Typography.Text style={{ fontSize: "1.5rem", color: "red", paddingLeft: "2rem", paddingBottom: "1rem" }}>
              {errorMessage}
            </Typography.Text>
          </Row>
        )}
        <Form.Item>
          <Row justify={"center"}>
            <Space size="large">
              <Popconfirm
                title={c("editUser.label.resetConfirm")}
                description={c("editUser.description.resetConfirm")}
                onConfirm={onFormReset}
                okText={b("ok")}
                cancelText={b("cancel")}>
                <Button
                  danger
                  disabled={!isEditing}
                  style={{ width: "12rem", height: "3rem", fontSize: "1.5rem" }}
                  type="primary">
                  {b("reset")}
                </Button>
              </Popconfirm>
              <Button
                disabled={!isEditing}
                htmlType="submit"
                style={{ width: "24rem", height: "3rem", fontSize: "1.5rem" }}
                type="primary">
                {b("submit")}
              </Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
      <Modal
        title={c("adminAuthorization.title")}
        open={allowEditPositionModal}
        onOk={() => checkRight()}
        onCancel={() => setAllowEditPositionModal(false)}
        keyboard>
        <Input.Password
          value={adminKey}
          onChange={(e) => {
            setAdminKey(e.target.value);
            setErrorMessage("");
          }}
          placeholder={c("adminAuthorization.placeholder")}
          autoComplete="false"
        />
      </Modal>
    </Fragment>
  );
};

export default ProfileView;
