import { CancelOutlined } from "@mui/icons-material";
import {
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { FormikErrors, useFormikContext } from "formik";
import { AssignmentFormValue } from "../AssignmentForm";

const ServiceTypeValues: ServiceTypeValue[] = ["Cell", "Data", "PTT"];

export const validateServiceType = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};

  if (
    values.assignmentType === "new" &&
    values.DeviceType === "Phone" &&
    !values.ServiceType.length
  ) {
    errors.ServiceType = "Required";
  }

  return errors;
};

export default function ServiceTypeSelection() {
  const { values, setFieldValue, handleBlur, touched, errors } =
    useFormikContext<AssignmentFormValue>();

  const deleteItem = (val) =>
    setFieldValue(
      "ServiceType",
      values.ServiceType.filter((item) => item !== val)
    );

  return (
    <FormControl fullWidth>
      <InputLabel>Service Type</InputLabel>
      <Select
        value={values.ServiceType}
        label="Service Type"
        onChange={(ev) => {
          // Get rid of duplicate values if they were selected
          const values = Array.from(new Set(ev.target.value));
          setFieldValue("ServiceType", values);
        }}
        error={touched.ServiceType && !!errors.ServiceType}
        multiple
        renderValue={(selected) => (
          <Stack direction="row" spacing={2}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={value}
                clickable
                deleteIcon={
                  <CancelOutlined
                    onMouseDown={(event) => {
                      deleteItem(value);
                      event.stopPropagation();
                    }}
                  />
                }
                onDelete={(e) => deleteItem(value)}
              />
            ))}
          </Stack>
        )}
      >
        {ServiceTypeValues.map((serviceType) => (
          <MenuItem key={serviceType} value={serviceType}>
            <Checkbox checked={values.ServiceType.includes(serviceType)} />
            <ListItemText primary={serviceType} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={touched.ServiceType && !!errors.ServiceType}>
        {touched.ServiceType && errors.ServiceType}
      </FormHelperText>
    </FormControl>
  );
}
