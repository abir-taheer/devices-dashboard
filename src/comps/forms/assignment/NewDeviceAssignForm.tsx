import { FormikConfig, FormikErrors, useFormik } from "formik";
import UserAutocomplete from "./fields/UserAutocomplete";

type Props = {
  disabled?: boolean;
};

type Value = {
  UserId: UserData["Id"] | null;
};
type FormConfig = FormikConfig<Value>;

const initialValues: Value = {
  UserId: null,
};

const validate: FormConfig["validate"] = (values) => {
  const errors: FormikErrors<Value> = {};

  if (values.UserId === null) {
    errors.UserId = "Please select a user";
  }

  return errors;
};

const onSubmit: FormConfig["onSubmit"] = (values, { setSubmitting }) => {};

export default function NewDeviceAssignForm({ disabled }: Props) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    submitForm,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    initialValues,
    validate,
    onSubmit,
  });

  return (
    <>
      <UserAutocomplete
        fullWidth
        value={values.UserId}
        handleChange={(ev, value) => {
          setFieldValue("UserId", value);
        }}
        name="UserId"
        error={errors.UserId}
        touched={touched.UserId}
        disabled={disabled || isSubmitting}
        handleBlur={handleBlur}
      />
    </>
  );
}
