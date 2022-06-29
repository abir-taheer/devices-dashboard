import TextField from "@mui/material/TextField";
import { useFormikContext } from "formik";
import formatPhoneNumber from "../../../utils/formatPhoneNumber";
import { AssignmentFormValue } from "./AssignmentForm";

const normalize = (val) => val.replace(/[^0-9]/g, "").substring(0, 10);

const styles = {
  maxWidth: 400,
};

export default function AssignmentPhoneInput() {
  const { values, setFieldValue } = useFormikContext<AssignmentFormValue>();

  const onChange = (ev) => setFieldValue("Phone", normalize(ev.target.value));

  return (
    <TextField
      value={formatPhoneNumber(values.Phone)}
      label="Phone Number"
      onChange={onChange}
      sx={styles}
    />
  );
}
