import Autocomplete from "@mui/material/Autocomplete";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { FormikErrors, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import useSubscribeToCacheChanges from "../../../../hooks/useSubscribeToCacheChanges";
import { getCachedListItemById } from "../../../../lists/getCachedListItemById";
import ListItemCache from "../../../../lists/ListItemCache";
import searchLists from "../../../../lists/searchLists";
import formatPhoneNumber from "../../../../utils/formatPhoneNumber";
import { AssignmentFormValue } from "./../AssignmentForm";

type Props = {
  fullWidth?: boolean;
};

export const validateExistingDevice = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};

  if (values.assignmentType === "existing" && values.DeviceId === null) {
    errors.DeviceId = "Please select a device";
  } else {
    // Check to  make sure that the device actually exists
    const device = getCachedListItemById("Devices", values.DeviceId);
    if (!device) {
      errors.DeviceId = "Device does not exist";
    }
  }

  return errors;
};

export default function ExistingDeviceSelection({ fullWidth }: Props) {
  const { setFieldValue, errors, handleBlur, touched, values } =
    useFormikContext<AssignmentFormValue>();
  const { populated } = ListItemCache.get("Devices");
  const { items: assignments } = ListItemCache.get("Assignments");
  const deviceCacheVersion = useSubscribeToCacheChanges("Devices");
  const assignmentCacheVersion = useSubscribeToCacheChanges("Assignments");

  const value = useMemo(
    () => (values.DeviceId ? getCachedListItemById("Devices", values.DeviceId) : null),
    [values.DeviceId]
  );

  const deviceAssignments = useMemo(() => {
    const all = assignments
      .filter((assignment) => assignment.DeviceId === values.DeviceId)
      .map((a) => ({
        ...a,
        user: getCachedListItemById("Users", a.UserId),
      }));

    const current = all.find((a) => a.Status === "Active");

    return {
      current,
      all,
    };
  }, [assignmentCacheVersion, values.DeviceId]);

  const [inputValue, setInputValue] = useState("");

  const options = useMemo(
    () => searchLists(inputValue, ["Devices"]).map((a) => a.item),
    [inputValue, deviceCacheVersion]
  );

  const getOptionLabel = (opt) => {
    return `${formatPhoneNumber(opt?.Phone)} (${opt?.Manufacturer} - ${opt?.Model})`;
  };

  const error = !!errors.DeviceId || !populated;

  let helperText = "";

  if (errors.DeviceId) {
    helperText = errors.DeviceId;
  }

  if (!populated) {
    helperText = "The list of devices hasn't been fully loaded yet. Wait a moment and try again.";
  }

  return (
    <div>
      <Autocomplete
        disablePortal
        fullWidth={fullWidth}
        options={options}
        // Don't actually filter, mui doesn't filter how we want so we'll do it ourselves
        filterOptions={() => options}
        inputValue={inputValue}
        getOptionLabel={getOptionLabel}
        onInputChange={(ev, value) => setInputValue(value)}
        onChange={(a, val?: DeviceData) => {
          setFieldValue("DeviceId", val?.Id || null);
        }}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            onBlur={handleBlur}
            name="DeviceId"
            label="Device"
            error={touched.DeviceId && !!error}
            helperText={helperText}
          />
        )}
        isOptionEqualToValue={(option, value) => option.Id === value?.Id}
        renderOption={(props, opt: DeviceData) => (
          <ListItem key={opt.ID} {...props}>
            <ListItemText
              primary={formatPhoneNumber(opt.Phone)}
              secondary={
                <>
                  {[opt.Manufacturer, opt.Model].filter(Boolean).join(" - ")} ({opt.DeviceType})
                  {opt.Tag && (
                    <>
                      <br />
                      Tag: {opt.Tag}
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        )}
      />
      {deviceAssignments.current && (
        <div>
          <ListItem>
            <ListItemText
              primary={`This device is currently assigned to ${deviceAssignments.current.user.FirstName} ${deviceAssignments.current.user.LastName}`}
              secondary={deviceAssignments.current.user.Email}
            />
          </ListItem>
        </div>
      )}
    </div>
  );
}
