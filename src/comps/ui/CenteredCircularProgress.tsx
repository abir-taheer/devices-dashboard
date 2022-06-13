import { CircularProgress } from "@mui/material";
import FlexCenter, { FlexCenterProps } from "./FlexCenter";

export default function CenteredCircularProgress(props: Omit<FlexCenterProps, "children">) {
  return (
    <FlexCenter {...props}>
      <CircularProgress />
    </FlexCenter>
  );
}
