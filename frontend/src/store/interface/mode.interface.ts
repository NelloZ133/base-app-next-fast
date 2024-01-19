import { QueryParams } from "@/types";

export interface IModeState {
  toggleMode: string;
  queryParamsUrl: string | null;
  queryParamsValue: QueryParams;

  setToggleMode: (toggleMode: string) => void;
  setQueryParamsUrl: (queryParamsUrl: string | null) => void;
  setQueryParamsValue: (queryParamsValue: QueryParams) => void;
}
