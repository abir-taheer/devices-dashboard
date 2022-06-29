import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useFormikContext } from "formik";
import { AssignmentFormValue } from "./AssignmentForm";

export default function DeviceSelectionSwitch() {
  const { values, setFieldValue } = useFormikContext<AssignmentFormValue>();

  return (
    <div>
      <FormControl>
        <FormLabel>Device Option</FormLabel>
        <RadioGroup
          value={values.deviceSelection}
          onChange={(ev) => setFieldValue("deviceSelection", ev.target.value)}
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
