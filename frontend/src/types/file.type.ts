export interface IFileGetResponse {
  name: string;
  filename: string;
  url: string;
}

export interface IFileList extends IFileGetResponse {
  uid: string;
}

export interface IFileUploadResponse {
  path_map: Record<string, TAttachment>;
}

export type TAttachment = {
  local_path: string;
  url: string;
};
