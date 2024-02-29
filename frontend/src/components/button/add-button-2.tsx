import { FC, Fragment } from "react";
import { Button, Tooltip } from "antd";
import { FiPlusSquare } from "react-icons/fi";

interface IProp {
  children?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  tooltip?: string;
  onClick?: (value: any) => void;
}

export const AddButton2: FC<IProp> = ({ children, disabled, style, tooltip, onClick }) => {
  return (
    <Fragment>
      <Tooltip title={tooltip} mouseEnterDelay={1}>
        <Button disabled={disabled} type="link" onClick={onClick}>
          <FiPlusSquare className="default-icon-size" style={style} />
          {children}
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default AddButton2;
