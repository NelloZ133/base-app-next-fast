import axiosInstance from "@/lib/axios";
import { SettingStore } from "@/store";
import { ILineResponse, IPositionResponse, ISectionResponse } from "@/types";

export async function fetchLine(): Promise<ILineResponse> {
  const { setLines } = SettingStore.getState();
  const { data } = await axiosInstance.get<ILineResponse>(`settings/lines`);
  setLines(data.lines);
  return data;
}
export async function fetchPosition(): Promise<IPositionResponse> {
  const { setPositions } = SettingStore.getState();
  const { data } = await axiosInstance.get<IPositionResponse>(`settings/positions`);
  setPositions(data.positions);
  return data;
}
export async function fetchSection(): Promise<ISectionResponse> {
  const { setSections } = SettingStore.getState();
  const { data } = await axiosInstance.get<ISectionResponse>(`settings/sections`);
  setSections(data.sections);
  return data;
}
