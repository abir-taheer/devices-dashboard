import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { FormikErrors, useFormikContext } from "formik";
import { AssignmentFormValue } from "../AssignmentForm";

export const validateAssigmentTypeSelection = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};

  if (!values.assignmentType) {
    errors.assignmentType = "Required";
  }

  return errors;
};

export default function AssignmentTypeSelection() {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext<AssignmentFormValue>();

  return (
    <div>
      <FormControl>
        <FormLabel>Device Option</FormLabel>
        <RadioGroup
          value={values.assignmentType}
          onChange={(ev) => setFieldValue("assignmentType", ev.target.value)}
          onBlur={handleBlur}
          name="assignmentType"
        >
          <FormControlLabel value="new" control={<Radio />} label={"Create A New Device"} />
          <FormControlLabel
            value="existing"
            control={<Radio />}
            label={"Reassign An Existing device"}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
