import { Typography } from "@mui/material";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useMemo } from "react";
import { makeStyles } from "tss-react/mui";
import useSubscribeToCacheChanges from "../../../../hooks/useSubscribeToCacheChanges";
import formatPhoneNumber from "../../../../utils/formatPhoneNumber";
import ListItemCache, { getCachedListItemById } from "../../../../utils/ListItemCache";
import searchLists from "../../../../utils/searchLists";
import TextHighlight from "../../../ui/TextHightlight";

const useStyles = makeStyles()((theme) => ({
  secondaryLabel: {
    fontSize: 14,
    marginLeft: theme.spacing(4),
  },
}));

type Value = DeviceData["Id"];

export type DeviceAutocompleteComponentProps = AutocompleteProps<Value, false, false, false>;

type Props = {
  name?: string;
  label?: string;
  value: Value;
  handleChange: DeviceAutocompleteComponentProps["onChange"];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  touched?: boolean;
  handleBlur?: DeviceAutocompleteComponentProps["onBlur"];
};

export default function DeviceAutocomplete({
  name,
  label = "Select a Device",
  handleChange,
  fullWidth,
  disabled,
  value,
  handleBlur,
  error,
  touched,
  helperText,
}: Props) {
  const DeviceCacheVersion = useSubscribeToCacheChanges("Devices");

  const { classes } = useStyles();

  const options = useMemo(
    () => ListItemCache.get("Devices").items.map((a) => a.Id),
    [DeviceCacheVersion]
  );

  return (
    <FormControl component="fieldset" fullWidth={fullWidth} error={!!error && touched}>
      <FormLabel component="legend">{label}</FormLabel>
      <Autocomplete
        // This field is the unique react memoization key when rendering the options list
        getOptionLabel={(option) => {
          // We don't have to worry about lookup time since it's already indexed by id. Lookups happen in constant time
          const device = getCachedListItemById("Devices", option);

          return [
            `(ID: ${option})`,
            formatPhoneNumber(device.Phone),
            device.Manufacturer,
            device.Model,
          ]
            .filter(Boolean)
            .join(" ");
        }}
        renderOption={(props, option, { inputValue }) => {
          const device = getCachedListItemById("Devices", option);

          return (
            <ListItem {...props}>
              <ListItemText
                primary={
                  <Typography variant="inherit" fontWeight={600}>
                    <TextHighlight
                      search={inputValue}
                      text={[device.Manufacturer, device.Model].join(" - ")}
                    />
                  </Typography>
                }
                secondary={
                  <Typography variant="inherit" className={classes.secondaryLabel}>
                    <>
                      {formatPhoneNumber(device.Phone)}
                      <br />
                      <span>{device.ServiceType.join(", ")}</span>
                    </>
                  </Typography>
                }
              />
            </ListItem>
          );
        }}
        onBlur={handleBlur}
        onChange={handleChange}
        options={options}
        filterOptions={(options, { inputValue }) =>
          searchLists(inputValue, ["Devices"], 15).map((a) => a.item.Id)
        }
        disabled={disabled}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            disabled={disabled}
            error={!!error && touched}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
            }}
          />
        )}
      />
      <FormHelperText>{touched && error ? error : helperText}</FormHelperText>
    </FormControl>
  );
}
