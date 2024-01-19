import { queryParamsSetting } from "@/constants";
import { QueryParams } from "@/types";

export function getQueryParams(queryParams: any) {
  let queryParamsUrl: string | null = null;
  let queryParamsValue: QueryParams = {};

  queryParamsSetting.forEach((param) => {
    const q = queryParams.get(`${param}`);
    if (q && q !== "null") {
      if (!queryParamsUrl) {
        queryParamsUrl = `?${param}=${q}`;
      } else {
        queryParamsUrl = `${queryParamsUrl}&${param}=${q}`;
      }
      queryParamsValue = { ...queryParamsValue, [param]: q };
    }
  });

  return {
    queryParamsUrl: queryParamsUrl,
    queryParamsValue: queryParamsValue,
  };
}
