import axiosInstance from "@/lib/axios";
import { UserStore } from "@/store";
import {
  ILoginResponse,
  IForgotPasswordForm,
  IUserUpdateForm,
  UserUpdate,
  ChangePassword,
  IUesrRegisterForm,
  UserRegister,
} from "@/types";

export async function login(username: string, password: string): Promise<ILoginResponse> {
  const { setUser } = UserStore.getState();
  const body = {
    username: username,
    password: password,
  };
  const { data } = await axiosInstance.post<ILoginResponse>(`users/login`, body);
  setUser(data);

  return data;
}

export async function registerUesr(form: IUesrRegisterForm) {
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
  };

  const { data } = await axiosInstance.post<any>(`users/register`, body);

  return data;
}

export async function updateUser(form: IUserUpdateForm): Promise<any> {
  const { user, setUser } = UserStore.getState();
  if (!user) {
    return;
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
    user_uuid: user.user_uuid,
  };

  const { data } = await axiosInstance.post<any>(`users/update_user`, body);
  setUser(data);

  return data;
}

export async function changePassword(cur_pass: string, new_pass: string): Promise<any> {
  const { user } = UserStore.getState();
  if (!user) {
    return;
  }
  const body: ChangePassword = {
    user_uuid: user.user_uuid,
    cur_pass: cur_pass,
    new_pass: new_pass,
  };
  const { data } = await axiosInstance.post<any>(`users/change_password`, body);

  return data;
}

export async function forgotPassword(form: IForgotPasswordForm): Promise<any> {
  const { data } = await axiosInstance.post<any>(`users/reset_password`, null, {
    params: {
      credential: form.credential,
    },
  });

  return data;
}

export async function resetPassword(form: IForgotPasswordForm): Promise<any> {
  const { data } = await axiosInstance.post<any>(`users/reset_password_to_default`, null, {
    params: {
      username: form.credential,
    },
  });

  return data;
}
