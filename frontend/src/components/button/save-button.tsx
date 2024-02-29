import { FC, Fragment } from "react";
import { Button, Tooltip } from "antd";
import { FiSave } from "react-icons/fi";

interface IProp {
  children?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  tooltip?: string;
  onClick?: (value: any) => void;
}

export const SaveButton: FC<IProp> = ({ children, disabled, style, tooltip, onClick }) => {
  return (
    <Fragment>
      <Tooltip title={tooltip} mouseEnterDelay={1}>
        <Button disabled={disabled} type="link" onClick={onClick}>
          <FiSave className="default-icon-size" style={style} />
          {children}
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default SaveButton;
