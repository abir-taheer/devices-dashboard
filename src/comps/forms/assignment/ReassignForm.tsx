import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { FormikConfig, FormikErrors, useFormik } from "formik";
import { useEffect, useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import { ListChangeEmitter } from "../../../hooks/useSubscribeToCacheChanges";
import { getAssignmentsByDeviceId } from "../../../lists/getAssignmentsByDeviceId";
import ListItemIndexedCache from "../../../lists/ListItemIndexedCache";
import { sp } from "../../context/SPContext";
import DeviceAutocomplete from "./fields/DeviceAutocomplete";
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

const onSubmit: FormConfig["onSubmit"] = async (values, { setSubmitting, setErrors }) => {
  try {
    await sp.web.lists.getByTitle("Assignments").items.add({
      UserId: values.UserId,
      DeviceId: values.DeviceId,
      Status: "Active",
    });
    ListChangeEmitter.emit("change", "Assignments");
  } catch (er) {
    setErrors({ DeviceId: "There was an error assigning the device", UserId: er.message });
  }
  setSubmitting(false);
};

const useStyles = makeStyles()((theme) => ({}));

export default function ReassignForm({ disabled }: { disabled?: boolean }) {
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

  const deviceAssignments = useMemo(
    () => (values.DeviceId !== null ? getAssignmentsByDeviceId(values.DeviceId) : null),
    [values.DeviceId]
  );

  useEffect(() => {
    const a = ListItemIndexedCache.getIndex("Devices", "Id", "many");
    console.log(a.items);
  }, [values.DeviceId]);

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
      <DeviceAutocomplete
        fullWidth
        name="DeviceId"
        value={values.DeviceId}
        handleChange={(ev, value) => {
          setFieldValue("DeviceId", value);
        }}
        error={errors.DeviceId}
        touched={touched.DeviceId}
        disabled={disabled || isSubmitting}
        handleBlur={handleBlur}
      />

      <pre>{JSON.stringify(deviceAssignments, null, 2)}</pre>

      <Stack direction={"row"} spacing={4} marginTop={2}>
        <Button
          variant="contained"
          disabled={disabled || isSubmitting}
          onClick={() => {
            submitForm().then(() => {
              console.log("Submitted");
            });
          }}
        >
          Create Assignment
        </Button>
        <Button
          variant="outlined"
          disabled={disabled || isSubmitting}
          onClick={() => {
            submitForm().then(() => {
              const hasErrors = Object.keys(errors).length;
              if (!hasErrors) {
                resetForm();
              }
            });
          }}
        >
          Create and insert next
        </Button>
      </Stack>
    </>
  );
}
