export interface ILoginResponse extends User {}

export type User = {
  username: string;
  language: string[] | null;
  first_primary: string | null;
  middle_primary: string | null;
  last_primary: string | null;
  first_secondary: string | null;
  middle_secondary: string | null;
  last_secondary: string | null;
  first_tertiary: string | null;
  middle_tertiary: string | null;
  last_tertiary: string | null;
  employee_no: string | null;
  shift_name: string | null;
  line_id: number | null;
  line_id_group: number[] | null;
  tel_no_primary: string | null;
  tel_no_secondary: string | null;
  email: string | null;
  email_supervisor: string | null;
  email_manager: string | null;
  user_uuid: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
  access_token: string | null;
  refresh_token: string | null;
  token_type: string | null;
};

export interface IForgotPasswordForm {
  credential: string;
}

export interface IChangePasswordForm {
  cur_pass: string;
  new_pass: string;
}

export interface IUesrRegisterForm {
  username: string;
  password: string;
  language: string[] | null;
  first_primary: string | null;
  middle_primary: string | null;
  last_primary: string | null;
  first_secondary: string | null;
  middle_secondary: string | null;
  last_secondary: string | null;
  first_tertiary: string | null;
  middle_tertiary: string | null;
  last_tertiary: string | null;
  employee_no: string | null;
  shift_name: string | null;
  line_id: number | null;
  line_id_group: number[] | null;
  tel_no_primary: string | null;
  tel_no_secondary: string | null;
  email: string | null;
  email_supervisor: string | null;
  email_manager: string | null;
  is_admin: boolean;
}

export type UserRegister = {
  username: string;
  password: string;
  language: string[] | null;
  first_primary: string | null;
  middle_primary: string | null;
  last_primary: string | null;
  first_secondary: string | null;
  middle_secondary: string | null;
  last_secondary: string | null;
  first_tertiary: string | null;
  middle_tertiary: string | null;
  last_tertiary: string | null;
  employee_no: string | null;
  shift_name: string | null;
  line_id: number | null;
  line_id_group: number[] | null;
  tel_no_primary: string | null;
  tel_no_secondary: string | null;
  email: string | null;
  email_supervisor: string | null;
  email_manager: string | null;
  is_admin: boolean;
};

export interface IUserUpdateForm {
  username: string;
  language: string[] | null;
  first_primary: string | null;
  middle_primary: string | null;
  last_primary: string | null;
  first_secondary: string | null;
  middle_secondary: string | null;
  last_secondary: string | null;
  first_tertiary: string | null;
  middle_tertiary: string | null;
  last_tertiary: string | null;
  employee_no: string | null;
  shift_name: string | null;
  line_id: number | null;
  line_id_group: number[] | null;
  tel_no_primary: string | null;
  tel_no_secondary: string | null;
  email: string | null;
  email_supervisor: string | null;
  email_manager: string | null;
}

export type UserUpdate = {
  username: string;
  language: string[] | null;
  first_primary: string | null;
  middle_primary: string | null;
  last_primary: string | null;
  first_secondary: string | null;
  middle_secondary: string | null;
  last_secondary: string | null;
  first_tertiary: string | null;
  middle_tertiary: string | null;
  last_tertiary: string | null;
  employee_no: string | null;
  shift_name: string | null;
  line_id: number | null;
  line_id_group: number[] | null;
  tel_no_primary: string | null;
  tel_no_secondary: string | null;
  email: string | null;
  email_supervisor: string | null;
  email_manager: string | null;
  user_uuid: string;
};

export type ChangePassword = {
  user_uuid: string;
  cur_pass: string;
  new_pass: string;
};
