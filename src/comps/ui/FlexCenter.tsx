import { styled } from "@mui/system";
import { FC, ReactNode } from "react";

export interface FlexCenterProps {
  fullScreen?: boolean;
  children: ReactNode;
  className?: string;
}

const FlexCenterWithoutStyles: FC<FlexCenterProps> = ({ children, className }) => (
  <div className={className}>
    <div>{children}</div>
  </div>
);

const FlexCenter = styled(FlexCenterWithoutStyles)(({ fullScreen }) => ({
  display: "flex",
  justifyContent: "center",
  height: fullScreen ? "100%" : undefined,
  minHeight: fullScreen ? "80vh" : undefined,
  width: fullScreen ? "100%" : undefined,
  verticalAlign: "middle",
  justifyItems: "center",
  alignItems: "center",
  flexDirection: "column",
}));

export default FlexCenter;
