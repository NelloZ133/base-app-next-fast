export interface IStringKey {
  [key: string]: any;
}

export interface OptionValue extends ValueType {
  disabled?: boolean;
}

export interface ValueType {
  key?: string;
  label: string | React.ReactNode;
  value: string | number;
}

export interface IDetailKey {
  [detailKey: string]: string | number;
}

export interface IMapObjectByKey<T> {
  [key: string]: { value: T[]; _details: IDetailKey };
}

export interface ICommonTableProps {
  key: number;
}
