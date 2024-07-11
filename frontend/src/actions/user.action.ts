import axiosInstance from "@/lib/axios";
import {
  ILoginResponse,
  IForgotPasswordForm,
  IUserUpdateForm,
  UserUpdate,
  ChangePassword,
  IUserRegisterForm,
  UserRegister,
  ILoginForm,
  IChangePasswordForm,
} from "@/types";

export async function login(form: ILoginForm): Promise<ILoginResponse> {
  const body = {
    username: form.username,
    password: form.password,
  };
  const { data } = await axiosInstance.post<ILoginResponse>(`users/login`, body);
  return data;
}

export async function registerUesr(form: IUserRegisterForm): Promise<any> {
  const body: UserRegister = {
    username: form.username,
    password: form.password,
    language: form.language,
    first_primary: form.first_primary,
    middle_primary: form.middle_primary,
    last_primary: form.last_primary,
    first_secondary: form.first_secondary,
    middle_secondary: form.middle_secondary,
    last_secondary: form.last_secondary,
    first_tertiary: form.first_tertiary,
    middle_tertiary: form.middle_tertiary,
    last_tertiary: form.last_tertiary,
    employee_no: form.employee_no,
    shift_name: form.shift_name,
    line_id: form.line_id,
    line_id_group: form.line_id_group,
    tel_no_primary: form.tel_no_primary,
    tel_no_secondary: form.tel_no_secondary,
    email: form.email,
    email_supervisor: form.email_supervisor,
    email_manager: form.email_manager,
    is_admin: form.is_admin || false,
    position_id: 0,
    section_id: 0,
  };
  const { data } = await axiosInstance.post<any>(`users/register`, body);
  return data;
}

export async function updateUser(form: IUserUpdateForm): Promise<any> {
  if (!form.user_uuid || !form.position_id || !form.section_id) {
    return `Invalid, lack some user data ${form.user_uuid} ${form.position_id} ${form.section_id}`;
  }
  const body: UserUpdate = {
    username: form.username,
    language: form.language,
    first_primary: form.first_primary,
    middle_primary: form.middle_primary,
    last_primary: form.last_primary,
    first_secondary: form.first_secondary,
    middle_secondary: form.middle_secondary,
    last_secondary: form.last_secondary,
    first_tertiary: form.first_tertiary,
    middle_tertiary: form.middle_tertiary,
    last_tertiary: form.last_tertiary,
    employee_no: form.employee_no,
    shift_name: form.shift_name,
    line_id: form.line_id,
    line_id_group: form.line_id_group,
    tel_no_primary: form.tel_no_primary,
    tel_no_secondary: form.tel_no_secondary,
    email: form.email,
    email_supervisor: form.email_supervisor,
    email_manager: form.email_manager,
    user_uuid: form.user_uuid,
    position_id: form.position_id,
    section_id: form.section_id,
  };
  const { data } = await axiosInstance.post<any>(`users/update_user`, body);
  return data;
}
export async function changePassword(form: IChangePasswordForm): Promise<any> {
  if (!form.user_uuid) {
    return `Invalid, lack some user data ${form.user_uuid}`;
  }
  const body: ChangePassword = {
    user_uuid: form.user_uuid,
    cur_pass: form.cur_pass,
    new_pass: form.new_pass,
  };
  const { data } = await axiosInstance.post<any>(`users/change_password`, body);
  return data;
}

export async function forgotPassword(form: IForgotPasswordForm): Promise<any> {
  const { data } = await axiosInstance.post<any>(`users/reset_password`, {
    credential: form.credential,
  });
  return data;
}

export async function resetPassword(form: IForgotPasswordForm): Promise<any> {
  const { data } = await axiosInstance.post<any>(`users/reset_password_to_default`, {
    credential: form.credential,
  });
  return data;
}
