"use client";
import { Button, Col, Form, Input, Modal, Popconfirm, Radio, Row, Select, Space, Typography, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { EditTwoTone } from "@ant-design/icons";
import { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FC, Fragment, useEffect, useMemo, useState } from "react";

import { AdminKey, LanguageOptions, ShiftList } from "@/constants";
import { LayoutStore, ModeStore, SettingStore } from "@/store";
import { IUserRegisterForm, OptionValue } from "@/types";
import { validateEmail } from "@/validators";

interface IProps {
  onFinish: (form: IUserRegisterForm) => void;
}

//TODO: Use component instead
const RegisterView: NextPage = () => {
  return <></>;
  const b = useTranslations("button");
  const c = useTranslations("component");
  const m = useTranslations("message");

  const { setIsLoading } = LayoutStore.getState();
  const toggleMode = ModeStore((state) => state.toggleMode);
  const lines = SettingStore((state) => state.lines);
  const positions = SettingStore((state) => state.positions);
  const sections = SettingStore((state) => state.sections);

  const [form] = useForm<IUserRegisterForm>();

  const [adminKey, setAdminKey] = useState<string>("");
  const [adminAuthorization, setAdminAuthorization] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState<string>();
  const [supervisorEmail, setSupervisorEmail] = useState<string>();
  const [managerEmail, setManagerEmail] = useState<string>();

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
    setErrorMessage("");
    setAdminKey("");
    setAdminAuthorization(false);
  };

  const checkRight = () => {
    if (adminKey === AdminKey) {
      setAdminAuthorization(true);
      setAdminKey("");
    } else {
      setErrorMessage(m("wrongAdminKey"));
      message.error(m("wrongAdminKey"));
      setAdminKey("");
    }
  };

  return (
    <Fragment>
      <Form
        form={form}
        className={`form-profile ${toggleMode}`}
        layout="vertical"
        scrollToFirstError
        onChange={() => {
          setErrorMessage("");
        }}
        onFinish={(v: IUserRegisterForm) => {
          // onFormFinish() &&
          // onFinish({
          //   ...v,
          // });
        }}>
        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item
              label={c("editUser.label.username")}
              name="username"
              rules={[{ required: true, message: m("fieldRequired") }]}
              required>
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label={c("editUser.label.employeeNo")} name="employee_no">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.position")} name="position_id">
              <Select showSearch optionFilterProp="label" options={positionOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={10}>
            <Form.Item label={c("editUser.label.language")} name="language" tooltip={c("editUser.tooltip.language")}>
              <Select allowClear mode="multiple" showSearch optionFilterProp="label" options={LanguageOptions} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={c("editUser.label.workingShift")} name="shift_name">
              <Radio.Group buttonStyle="solid">
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
              rules={[{ required: true, message: m("fieldRequired") }]}
              required={false}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.middlePrimary")} name="middle_primary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label={c("editUser.label.lastPrimary")}
              name="last_primary"
              rules={[{ required: true, message: m("fieldRequired") }]}
              required={false}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item label={c("editUser.label.firstSecondary")} name="first_secondary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.middleSecondary")} name="middle_secondary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label={c("editUser.label.lastSecondary")} name="last_secondary">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={7}>
            <Form.Item label={c("editUser.label.firstTertiary")} name="first_tertiary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={c("editUser.label.middleTertiary")} name="middle_tertiary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label={c("editUser.label.lastTertiary")} name="last_tertiary">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.email")} name="email">
              <Input onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.emailSupervisor")} name="email_supervisor">
              <Input onChange={(e) => setSupervisorEmail(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.emailManager")} name="email_manager">
              <Input onChange={(e) => setManagerEmail(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={10}>
            <Form.Item
              label={c("editUser.label.section")}
              name="section_id"
              rules={[{ required: true, message: m("fieldRequired") }]}
              required={false}>
              <Select showSearch optionFilterProp="label" options={sectionOptions} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={c("editUser.label.mainLine")} name="line_id">
              <Select allowClear showSearch optionFilterProp="label" options={lineOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={20}>
            <Form.Item label={c("editUser.label.concernLine")} name="line_id_group">
              <Select
                style={{ maxHeight: "15rem", overflowY: "auto" }}
                allowClear
                mode="multiple"
                maxTagTextLength={18}
                showSearch
                optionFilterProp="label"
                options={lineOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={16}>
          <Col span={10}>
            <Form.Item label={c("editUser.label.telNoPrimary")} name="tel_no_primary">
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label={c("editUser.label.telNoSecondary")} name="tel_no_secondary">
              <Input />
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
                <Button danger style={{ width: "12rem", height: "3rem", fontSize: "1.5rem" }} type="primary">
                  {b("reset")}
                </Button>
              </Popconfirm>
              <Button htmlType="submit" style={{ width: "24rem", height: "3rem", fontSize: "1.5rem" }} type="primary">
                {b("submit")}
              </Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
      <Modal
        title={c("adminAuthorization.title")}
        open={false}
        onOk={() => checkRight()}
        onCancel={() => console.log("first")}
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

export default RegisterView;
