import { ListItem, ListItemText } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FormikErrors, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { makeStyles } from "tss-react/mui";
import useSubscribeToCacheChanges from "../../../../hooks/useSubscribeToCacheChanges";
import { getCachedListItemById } from "../../../../lists/getCachedListItemById";
import searchLists from "../../../../lists/searchLists";
import { AssignmentFormValue } from "./../AssignmentForm";

type Props = {
  fullWidth?: boolean;
};

export const validateUser = (values: AssignmentFormValue) => {
  const errors: FormikErrors<AssignmentFormValue> = {};
  if (values.UserId === null || typeof values.UserId === "undefined") {
    errors.UserId = "Please select a user";
  } else {
    // Check to  make sure that the user actually exists

    const user = getCachedListItemById("Users", values.UserId);
    if (!user) {
      errors.UserId = "User does not exist";
    }
  }

  return errors;
};

const useStyles = makeStyles()((theme) => ({}));

export default function UserSelection({ fullWidth }: Props) {
  const { values, setFieldValue } = useFormikContext<AssignmentFormValue>();
  const cacheVersion = useSubscribeToCacheChanges("Users");

  const [inputValue, setInputValue] = useState("");
  const value = useMemo(
    () => (values.UserId ? getCachedListItemById("Users", values.UserId) : null),
    [values.UserId]
  );
  const options = useMemo(
    () => searchLists(inputValue, ["Users"]).map((a) => a.item),
    [cacheVersion, inputValue]
  );

  return (
    <Autocomplete
      disablePortal
      inputValue={inputValue}
      onInputChange={(ev, value) => setInputValue(value)}
      options={options}
      value={value}
      fullWidth={fullWidth}
      renderOption={(props, option) => {
        const WorkUnit = getCachedListItemById("WorkUnits", option.WorkUnitId);

        return (
          <ListItem {...props}>
            <ListItemText
              primary={[option.FirstName, option.LastName].join(" ")}
              secondary={
                <>
                  {option.Title} {option.Level ? `(Level ${option.Level})` : ""} <br />
                  {!!WorkUnit && (
                    <>
                      {WorkUnit.Title} - {WorkUnit.Number} <br />
                      {WorkUnit.Address}
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        );
      }}
      onChange={(ev, val?: UserData) => {
        setFieldValue("UserId", val?.Id || null);
      }}
      renderInput={(params) => <TextField {...params} label="User" />}
      getOptionLabel={(opt: UserData) => {
        const workUnit = opt.WorkUnitId
          ? getCachedListItemById("WorkUnits", opt?.WorkUnitId)
          : null;

        return [opt?.FirstName, opt?.LastName, " - " + opt?.Title, "(" + workUnit?.Title + ")"]
          .filter(Boolean)
          .join(" ");
      }}
    />
  );
}
