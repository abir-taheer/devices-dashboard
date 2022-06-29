import Stack from "@mui/material/Stack";
import { Formik, FormikConfig, FormikErrors } from "formik";
import ListItemCache from "../../../utils/ListItemCache";
import AssignmentPhoneInput from "./AssignmentPhoneInput";
import DeviceSelectionSwitch from "./DeviceSelectionSwitch";
import ExistingDeviceSelection from "./ExistingDeviceSelection";

export type AssignmentFormValue = {
  deviceSelection: "new" | "existing";
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
  deviceSelection: "existing",
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
  const errors: FormikErrors<AssignmentFormValue> = {};
  const { items: users } = ListItemCache.get("Users");

  const { items: devices } = ListItemCache.get("Devices");

  if (values.UserId === null) {
    errors.UserId = "Please select a user";
  } else {
    const user = users.find((u) => u.Id === values.UserId);

    if (!user) {
      errors.UserId =
        "That user id does not belong to a user. If this is not true, try refreshing the page.";
    }
  }

  if (values.deviceSelection === "new") {
    if (!values.Manufacturer) {
      errors.Manufacturer = "Please enter a manufacturer";
    }

    if (!values.Model) {
      errors.Model = "Please enter a model";
    }

    if (!values.Phone) {
      errors.Phone = "Please enter a phone number";
    } else if (values.Phone.length !== 10) {
      errors.Phone = "Phone number is not 10 digits. Double check to make sure it's valid";
    } else {
      // Check to make sure nobody else has that phone number

      const existingDevice = devices.find((d) => d.Phone === values.Phone);

      if (existingDevice) {
        errors.Phone = "That phone number is already in use";
      }
    }
  } else if (values.deviceSelection === "existing") {
    if (!values.DeviceId) {
      errors.DeviceId = "Please select a device";
    } else {
      const device = devices.find((d) => d.Id === values.DeviceId);

      if (!device) {
        errors.DeviceId =
          "That device id does not belong to a device. If this is not true, try refreshing the page.";
      }
    }
  }

  return errors;
};

const onSubmit: AssignmentFormConfig["onSubmit"] = (values, { setSubmitting }) => {};

export default function AssignmentForm() {
  return (
    <Formik validate={validate} initialValues={initialValues} onSubmit={onSubmit}>
      {({ values }) => (
        <Stack direction="column" spacing={3}>
          <DeviceSelectionSwitch />
          {values.deviceSelection === "existing" && <ExistingDeviceSelection />}
          {values.deviceSelection === "new" && (
            <>
              <AssignmentPhoneInput />
            </>
          )}
        </Stack>
      )}
    </Formik>
  );
}
