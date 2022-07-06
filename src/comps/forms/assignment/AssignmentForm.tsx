import { Button, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Formik, FormikConfig } from "formik";
import { useNavigate } from "react-router-dom";
import DeviceSelectionTypeSwitch, {
  validateAssigmentTypeSelection,
} from "./fields/AssignmentTypeSelection";
import ExistingDeviceSelection, { validateExistingDevice } from "./fields/ExistingDeviceSelection";
import ManufacturerInput, { validateManufacturer } from "./fields/ManufacturerInput";
import ModelInput, { validateModel } from "./fields/ModelInput";
import PhoneInput, { validatePhone } from "./fields/PhoneInput";
import ServiceTypeSelection, { validateServiceType } from "./fields/ServiceTypeSelection";
import UserSelection, { validateUser } from "./fields/UserSelection";

export type AssignmentFormValue = {
  assignmentType: "new" | "existing";
  DeviceId: null | DeviceData["Id"];
  Manufacturer: string;
  Model: string;
  Phone: string;
  DeviceType: DeviceTypeValue;
  ServiceType: ServiceTypeValue[];
  Tag: DeviceData["Tag"];
  UserId: null | UserData["Id"];
};

export type AssignmentFormConfig = FormikConfig<AssignmentFormValue>;

const initialValues: AssignmentFormConfig["initialValues"] = {
  assignmentType: "existing",
  DeviceId: null,
  Manufacturer: "",
  DeviceType: "",
  Model: "",
  Phone: "",
  ServiceType: ["Cell", "PTT", "Data"],
  Tag: "",
  UserId: null,
};

const validate: AssignmentFormConfig["validate"] = (values) => {
  return {
    ...validateAssigmentTypeSelection(values),
    ...validateExistingDevice(values),
    ...validateManufacturer(values),
    ...validateModel(values),
    ...validatePhone(values),
    ...validateUser(values),
    ...validateServiceType(values),
  };
};

const onSubmit: AssignmentFormConfig["onSubmit"] = (values, { setSubmitting }) => {
  console.log(values);
  setSubmitting(false);
};

export default function AssignmentForm() {
  const navigate = useNavigate();

  return (
    <Formik
      validate={validate}
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur
    >
      {({ values, submitForm, resetForm, setFieldValue, errors }) => (
        <>
          <Grid container justifyContent={"center"} spacing={3} columns={6}>
            <Grid item width={"100%"}>
              <DeviceSelectionTypeSwitch />
            </Grid>
            {values.assignmentType === "existing" && (
              <Grid item xs={12}>
                <ExistingDeviceSelection fullWidth />
              </Grid>
            )}
            {values.assignmentType === "new" && (
              <>
                <Grid item xs={6}>
                  <PhoneInput fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <ManufacturerInput />
                </Grid>
                <Grid item xs={6}>
                  <ModelInput />
                </Grid>
                <Grid item xs={6}>
                  <ServiceTypeSelection />
                </Grid>
              </>
            )}
            <Grid item xs={6}>
              <UserSelection fullWidth />
            </Grid>
          </Grid>
          <Stack direction="row" spacing={3} marginTop={3}>
            <Button
              variant="contained"
              onClick={() => {
                submitForm().then(() => {
                  console.log("Submitted");
                  navigate("/device/" + values.DeviceId);
                });
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                submitForm().then(() => {
                  if (!Object.keys(errors).length) {
                    const type = values.assignmentType;
                    resetForm();
                    setFieldValue("assignmentType", type);
                  }
                });
              }}
            >
              Submit and Assign Another
            </Button>
          </Stack>
        </>
      )}
    </Formik>
  );
}
