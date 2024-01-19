import { Input } from "antd";
import type { TextAreaProps } from "antd/es/input";
import { debounce } from "lodash";
import { FC, Dispatch, SetStateAction, useMemo } from "react";

const { TextArea } = Input;

interface ITextareaNoWrap extends TextAreaProps {
  maxWidth?: number;
  placeholder?: string;
  setOverflowFlag: Dispatch<SetStateAction<boolean>>;
  keyIndex?: number;
  onChange?: (value: any) => void;
  value?: any;
}

const TextAreaNoWrap: FC<ITextareaNoWrap> = ({
  maxWidth = 300,
  placeholder = "",
  setOverflowFlag,
  onChange,
  value,
}) => {
  const scrollDebounced = useMemo(() => debounce(checkScroll, 300), []);
  const valueDebounced = useMemo(() => debounce(changeValue, 300), []);

  function checkScroll(flag: boolean) {
    if (flag) {
      setOverflowFlag(true);
    } else {
      setOverflowFlag(false);
    }
  }

  function changeValue(text: string) {
    onChange?.(text);
  }

  const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    valueDebounced(e.currentTarget.value);
    scrollDebounced(e.currentTarget.clientWidth < e.currentTarget.scrollWidth);
  };

  return (
    <TextArea
      className="textarea-nowrap custom-scroll"
      bordered={false}
      placeholder={placeholder}
      autoComplete="false"
      autoSize={{ minRows: 1 }}
      allowClear
      cols={30}
      wrap="off"
      // value={value}
      defaultValue={value}
      onChange={onChangeValue}
      style={{ maxWidth: maxWidth }}
    />
  );
};

export default TextAreaNoWrap;
