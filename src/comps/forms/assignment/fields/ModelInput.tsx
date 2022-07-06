import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FormikErrors, useFormikContext } from "formik";
import { useMemo } from "react";
import useSubscribeToCacheChanges from "../../../../hooks/useSubscribeToCacheChanges";
import ListItemCache from "../../../../utils/ListItemCache";
import { AssignmentFormValue } from "../AssignmentForm";

type Props = {
  fullWidth?: boolean;
};

export const validateModel = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};

  if (values.assignmentType === "new" && !values.Model) {
    errors.Model = "Required";
  }

  return errors;
};

export default function ModelInput({ fullWidth }: Props) {
  const { values, setFieldValue, errors, touched, handleBlur, handleChange } =
    useFormikContext<AssignmentFormValue>();

  const { items: devices } = ListItemCache.get("Devices");
  const cacheVersion = useSubscribeToCacheChanges("Devices");

  const modelManufacturerMap = useMemo(
    () =>
      devices.reduce((obj, item) => {
        obj[item.Model] = item.Manufacturer;
        return obj;
      }, {}),
    [cacheVersion]
  );

  const options = useMemo(() => {
    let possibilities = devices;

    if (values.Manufacturer) {
      possibilities = possibilities.filter((item) => item.Manufacturer === values.Manufacturer);
    }

    return Array.from(new Set(possibilities.map((item) => item.Model)));
  }, [cacheVersion]);

  return (
    <Autocomplete
      freeSolo
      fullWidth={fullWidth}
      value={values.Model}
      options={options}
      onChange={(ev, val: string) => {
        setFieldValue("Model", val);

        if (modelManufacturerMap[val]) {
          setFieldValue("Manufacturer", modelManufacturerMap[val]);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Model"
          onBlur={handleBlur}
          name="Model"
          value={values.Model }
          onChange={handleChange}
          error={touched.Model && !!errors.Model}
          helperText={touched.Model && errors.Model}
        />
      )}
    />
  );
}
