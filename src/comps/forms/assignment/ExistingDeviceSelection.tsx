import Autocomplete from "@mui/material/Autocomplete";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import useSubscribeToCacheChanges from "../../../hooks/useSubscribeToCacheChanges";
import formatPhoneNumber from "../../../utils/formatPhoneNumber";
import ListItemCache from "../../../utils/ListItemCache";
import searchLists from "./../../../utils/searchLists";
import { AssignmentFormValue } from "./AssignmentForm";

const styles = {
  width: 400,
};

export default function ExistingDeviceSelection() {
  const { values, setFieldValue, errors } = useFormikContext<AssignmentFormValue>();
  const { items: devices, populated } = ListItemCache.get("Devices");
  const cacheVersion = useSubscribeToCacheChanges("Devices");

  const [inputValue, setInputValue] = useState("");

  const options = useMemo(
    () => searchLists(inputValue, ["Devices"]).map((a) => a.item),
    [inputValue, cacheVersion]
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
        options={options}
        // Don't actually filter, mui doesn't filter how we want so we'll do it ourselves
        filterOptions={(options, state) => options}
        inputValue={inputValue}
        sx={styles}
        getOptionLabel={getOptionLabel}
        onInputChange={(ev, value) => setInputValue(value)}
        onChange={(a, val?: DeviceData) => {
          setFieldValue("DeviceId", val?.Id || null);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Device" error={error} helperText={helperText} />
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
    </div>
  );
}
