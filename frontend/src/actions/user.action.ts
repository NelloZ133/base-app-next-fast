import axiosInstance from "@/lib/axios";
import { UserStore } from "@/store";
import { ILoginResponse, IForgotPasswordForm, IUserUpdateForm, UserUpdate, ChangePassword } from "@/types";

export async function login(username: string, password: string): Promise<ILoginResponse> {
  const { setUser } = UserStore.getState();
  const body = {
    user_id: username,
    user_pass: password,
  };
  const { data } = await axiosInstance.post<ILoginResponse>(`users/login`, body);
  setUser(data);

  return data;
}

export async function updateUser(form: IUserUpdateForm): Promise<any> {
  const { user, setUser } = UserStore.getState();
  if (!user) {
    return;
  }

  const concernLine = form.concern_line.map((line) => line.value as number);

  const body: UserUpdate = {
    user_uuid: user.user_uuid,
    user_id: user.user_id,
    user_pass: "",
    firstname: form.firstname,
    lastname: form.lastname,
    email: form.email || null,
    supervisor_email: form.supervisor_email || null,
    manager_email: form.manager_email || null,
    position_id: form.position_id.value as number,
    section_code: form.section_code.value as number,
    concern_line: concernLine,
    main_line: form.main_line?.value as number,
    shift: form.shift,
    app_line_id: "",
    is_active: true,
    is_admin: user.is_admin,
  };

  const { data } = await axiosInstance.post<any>(`users/update_user`, body);
  setUser(data);

  return data;
}

export async function changePassword(current_pass: string, new_pass: string): Promise<any> {
  const { user } = UserStore.getState();
  if (!user) {
    return;
  }
  const body: ChangePassword = {
    user_uuid: user.user_uuid,
    current_password: current_pass,
    new_password: new_pass,
  };
  const { data } = await axiosInstance.post<any>(`users/change_password`, body);

  return data;
}

export async function forgotPassword(form: IForgotPasswordForm): Promise<any> {
  const params: IForgotPasswordForm = {
    user_id: form.user_id,
  };
  const { data } = await axiosInstance.post<any>(`users/reset_password`, null, {
    params: {
      user_id: params.user_id,
    },
  });

  return data;
}

export async function resetPassword(form: IForgotPasswordForm): Promise<any> {
  const params: IForgotPasswordForm = {
    user_id: form.user_id,
  };
  const { data } = await axiosInstance.post<any>(`users/reset_default_password`, null, {
    params: {
      user_id: params.user_id,
    },
  });

  return data;
}
