import { Link } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FormikErrors, useFormikContext } from "formik";
import { useCallback, useMemo, useState } from "react";
import useSubscribeToCacheChanges from "../../../../hooks/useSubscribeToCacheChanges";
import getLevenshteinDistance from "../../../../utils/getLevenshteinDistance";
import ListItemCache from "../../../../utils/ListItemCache";
import { AssignmentFormValue } from "./../AssignmentForm";

export const validateManufacturer = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};

  if (values.assignmentType === "new" && !values.Manufacturer) {
    errors.Manufacturer = "Required";
  }

  return errors;
};

export default function ManufacturerInput() {
  const { values, handleBlur, errors, touched, handleChange, setFieldValue, setFieldError } =
    useFormikContext<AssignmentFormValue>();

  const [typos, setTypos] = useState<string[]>([]);
  const cacheVersion = useSubscribeToCacheChanges("Devices");
  const { items: devices } = ListItemCache.get("Devices");

  const optionsSet = useMemo(
    () => new Set(devices.map((item) => item.Manufacturer)),
    [cacheVersion]
  );

  const options = useMemo(() => Array.from(optionsSet), [optionsSet]);

  const checkForTypos = useCallback(() => {
    if (!optionsSet.has(values.Manufacturer)) {
      const possibleTypos = options.filter((option) => {
        const distance = getLevenshteinDistance(option, values.Manufacturer);

        return distance <= 3;
      });
      setTypos(possibleTypos);
    } else {
      setTypos([]);
    }
  }, [optionsSet, values.Manufacturer]);

  const TypoWarning = typos.length ? (
    <>
      Did you mean to type any of the following?{" "}
      {typos.map((a) => (
        <Link
          style={{ cursor: "pointer" }}
          key={a}
          onClick={(ev) => {
            setFieldValue("Manufacturer", a);
          }}
        >
          {a}
        </Link>
      ))}
    </>
  ) : null;

  return (
    <Autocomplete
      freeSolo
      disablePortal
      options={options}
      value={values.Manufacturer}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Manufacturer"
          onBlur={(...args) => {
            handleBlur(...args);
            checkForTypos();
          }}
          name="Manufacturer"
          onChange={handleChange}
          error={touched.Manufacturer && !!errors.Manufacturer || !!TypoWarning}
          helperText={errors.Manufacturer || TypoWarning}
        />
      )}
    />
  );
}
