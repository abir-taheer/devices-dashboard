import TextField, { TextFieldProps } from "@mui/material/TextField";
import { FormikErrors, useFormikContext } from "formik";
import formatPhoneNumber from "../../../../utils/formatPhoneNumber";
import ListItemCache from "../../../../utils/ListItemCache";
import { AssignmentFormValue } from "../AssignmentForm";

const normalize = (val) => val.replace(/[^0-9]/g, "").substring(0, 10);

type Props = {
  fullWidth?: boolean;
};

const isPhoneNumber = (val) => /^\d{10}$/.test(val);

export const validatePhone = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};

  if (values.assignmentType === "existing") {
    return {};
  }

  if (!values.Phone) {
    errors.Phone = "Required";
  } else if (!isPhoneNumber(values.Phone)) {
    errors.Phone = "Invalid phone number";
  } else {
    // Now check to see if any other devices have the same phone number

    const { items: devices } = ListItemCache.get("Devices");

    const existing = devices.find((i) => i.Phone === values.Phone);

    if (existing) {
      errors.Phone = "Phone number already in use";
    }
  }

  return errors;
};

export default function PhoneInput({ fullWidth }: Props) {
  const { values, setFieldValue, errors, touched, setFieldTouched, handleBlur } =
    useFormikContext<AssignmentFormValue>();

  const onChange: TextFieldProps["onChange"] = (ev) => {
    setFieldValue("Phone", normalize(ev.target.value));
  };

  return (
    <TextField
      fullWidth={fullWidth}
      value={formatPhoneNumber(values.Phone)}
      label="Phone Number"
      error={touched.Phone && !!errors.Phone}
      helperText={touched.Phone && errors.Phone}
      onChange={onChange}
      name="Phone"
      onBlur={handleBlur}
    />
  );
}
