import { FormikConfig, FormikErrors, useFormik } from "formik";
import { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import useSubscribeToCacheChanges from "../../../hooks/useSubscribeToCacheChanges";
import ListItemCache from "../../../utils/ListItemCache";
import UserAutocomplete from "./fields/UserAutocomplete";

type Value = {
  UserId: UserData["Id"] | null;
  DeviceId: DeviceData["Id"] | null;
};

type FormConfig = FormikConfig<Value>;

const initialValues: FormConfig["initialValues"] = {
  UserId: null,
  DeviceId: null,
};

/*
    Validation Requirements:
    1. The DeviceId field cannot be left unselected
    2. The UserId field cannot be left unselected
    3. The DeviceId field must be a valid device
    4. The UserId field must be a valid user
*/
const validate: FormConfig["validate"] = (values) => {
  const errors: FormikErrors<Value> = {};

  if (values.UserId === null) {
    errors.UserId = "Please select a user";
  }

  if (values.DeviceId === null) {
    errors.DeviceId = "Please select a device";
  }

  return errors;
};

const onSubmit: FormConfig["onSubmit"] = (values, { setSubmitting }) => {};

const useStyles = makeStyles()((theme) => ({}));

export default function ReassignForm({ disabled }: { disabled?: boolean }) {
  const { values, errors, touched, setFieldValue, handleBlur, handleChange, isSubmitting } =
    useFormik({
      initialValues,
      validate,
      onSubmit,
    });

  const UserCacheVersion = useSubscribeToCacheChanges("Users");

  const options = useMemo(
    () => ListItemCache.get("Users").items.map((a) => a.Id),
    [UserCacheVersion]
  );

  const { classes } = useStyles();

  return (
    <>
      <UserAutocomplete
        fullWidth
        value={values.UserId}
        handleChange={(props, value) => {
          setFieldValue("UserId", value);
        }}
        error={errors.UserId}
        touched={touched.UserId}
        disabled={disabled || isSubmitting}
        handleBlur={handleBlur}
      />
    </>
  );
}
