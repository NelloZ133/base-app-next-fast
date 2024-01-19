import { IMapObjectByKey } from "@/types";

export const stringIsArray = (str: string): boolean => {
  try {
    return new Function(`return Array.isArray(${str})`)();
  } catch {
    return false;
  }
};

export const stringIsBoolean = (str: string): boolean => {
  const lc = str.toLowerCase();
  return lc === "true" || lc === "false";
};

export const stringToBoolean = (str: string): boolean => {
  return str.toLowerCase() === "true";
};

export const mapObjectByKey = <T>(
  objArray: T[],
  keyName: string,
  distKeys: string[] | number[],
  detailKeysName: string[] = []
): IMapObjectByKey<T> => {
  let newObject: IMapObjectByKey<T> = {};
  distKeys.forEach((key) => {
    newObject[key] = { value: [], _details: {} };
  });

  objArray.forEach((obj, idx) => {
    const ObjKey = (obj as any)[keyName];
    newObject[ObjKey]["_details"] = detailKeysName.reduce((a, key) => ({ ...a, [key]: (obj as any)[key] }), {});
    newObject[ObjKey]["value"] = [...newObject[ObjKey]["value"], obj];
  });
  return newObject;
};
