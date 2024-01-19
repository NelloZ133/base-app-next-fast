import { Select, Spin, Tag, Tooltip } from "antd";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import { Fragment, useEffect, useState } from "react";
import { TbMoodConfuzed } from "react-icons/tb";
interface IDebounceSelectProps<T = any> extends Omit<SelectProps<T | T[] | string[]>, "options" | "children"> {
  fetchOption: (search: string, pathSearch?: string, enableNewItem?: boolean) => Promise<T[]>;
  fetchKey?: "label" | "value";
  defaultLoadOption?: boolean;
  defaultLoadValue?: string;
  tagWidth?: number | string;
  wrap?: boolean;
  debounceTimeout?: number;
  pathSearch?: string;
  enableNewItem?: boolean;
  initialValue?: string[] | string;
}

const DebounceSelect = <
  T extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean;
  }
>({
  fetchOption,
  fetchKey = "value",
  defaultLoadOption = false,
  defaultLoadValue = "",
  tagWidth = "auto",
  wrap = false,
  debounceTimeout = 800,
  value: selectValue,
  placeholder,
  allowClear,
  onChange,
  pathSearch = "",
  enableNewItem = false,
  initialValue = [],
  ...props
}: IDebounceSelectProps<T>) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<T[]>([]);

  const tagRender = (props: any) => {
    const { label } = props;
    const isFix = tagWidth !== "auto" && !wrap;
    const tag = (
      <Tag
        style={{
          fontSize: 14,
          width: tagWidth,
        }}
        className={isFix ? "tag-fix-width" : "tag-wrap"}
        {...props}>
        <p>{label}</p>
      </Tag>
    );

    return (
      <Fragment>
        {isFix ? (
          <Tooltip
            title={label}
            placement="topLeft"
            overlayInnerStyle={{ color: "white", fontStyle: "italic" }}
            mouseEnterDelay={1}>
            {tag}
          </Tooltip>
        ) : (
          tag
        )}
      </Fragment>
    );
  };

  const loadOptions = (value: string) => {
    setOptions([]);
    setFetching(true);

    fetchOption(value, pathSearch, enableNewItem)
      .then((searchOptions) => {
        let optionList = [...searchOptions];
        let filteredDuplicateOptions: T[] = [];

        if (Array.isArray(selectValue)) {
          selectValue.forEach((v) => {
            if (typeof v === "string") {
              filteredDuplicateOptions.push({ label: v, value: v } as T);
            } else {
              filteredDuplicateOptions.push(v);
            }
          });
        }
        filteredDuplicateOptions = [
          ...new Set([
            ...filteredDuplicateOptions,
            ...(Array.isArray(initialValue)
              ? initialValue.map((value) => ({ label: value, value: value } as T))
              : [{ label: initialValue, value: initialValue } as T]),
            ...optionList,
          ]),
        ];
        //* filter duplicated value
        filteredDuplicateOptions = filteredDuplicateOptions.filter((opt) => {
          const val = opt.value;
          return (
            filteredDuplicateOptions.findIndex((option) => option.value === val) ===
            filteredDuplicateOptions.indexOf(opt)
          );
        });
        //* filter value of fetchKey is same as selected value
        filteredDuplicateOptions = filteredDuplicateOptions.filter((opt) => {
          const val = opt[fetchKey as keyof T];
          if (typeof val === "string") {
            return val.toLowerCase().includes(value.toLowerCase());
          }
          return false;
        });
        if (filteredDuplicateOptions.length === 0 && enableNewItem) {
          filteredDuplicateOptions = [{ label: value, value: value } as T];
        }
        setOptions(filteredDuplicateOptions);
      })
      .finally(() => setFetching(false));
  };

  const onSelect = () => {
    if (defaultLoadOption) {
      loadOptions("");
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (!defaultLoadOption && defaultLoadValue === "") return;

    loadOptions(defaultLoadValue);
  }, []);

  useEffect(() => {
    if (!defaultLoadOption && defaultLoadValue === "") {
      setOptions([]);
    } else {
      loadOptions(defaultLoadValue);
    }
  }, [selectValue]);

  return (
    <Select
      filterOption={false}
      onSearch={debounce(loadOptions, debounceTimeout)}
      notFoundContent={
        fetching ? (
          <Spin size="small" />
        ) : (
          <div className="select-notfound">
            <TbMoodConfuzed className="default-icon-size" />
            <span style={{ marginLeft: 5 }}>Not found ...</span>
          </div>
        )
      }
      tagRender={tagRender}
      options={options}
      value={selectValue}
      placeholder={placeholder}
      onChange={onChange}
      // onSelect={onSelect}
      allowClear={allowClear}
      {...props}
    />
  );
};

export default DebounceSelect;
