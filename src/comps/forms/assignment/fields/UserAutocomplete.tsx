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
import { getCachedListItemById } from "../../../../lists/getCachedListItemById";
import ListItemCache from "../../../../lists/ListItemCache";
import searchLists from "../../../../lists/searchLists";
import TextHighlight from "../../../ui/TextHightlight";

const useStyles = makeStyles()((theme) => ({
  secondaryLabel: {
    fontSize: 14,
    marginLeft: theme.spacing(4),
  },
}));

type Value = UserData["Id"];

export type UserAutocompleteComponentProps = AutocompleteProps<Value, false, false, false>;

type Props = {
  name?: string;
  label?: string;
  value: Value;
  handleChange: UserAutocompleteComponentProps["onChange"];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  touched?: boolean;
  handleBlur?: UserAutocompleteComponentProps["onBlur"];
};

export default function UserAutocomplete({
  name,
  label = "Select a User",
  handleChange,
  fullWidth,
  disabled,
  value,
  handleBlur,
  error,
  touched,
  helperText,
}: Props) {
  const UserCacheVersion = useSubscribeToCacheChanges("Users");

  const { classes } = useStyles();

  const options = useMemo(
    () => ListItemCache.get("Users").items.map((a) => a.Id),
    [UserCacheVersion]
  );

  return (
    <FormControl component="fieldset" fullWidth={fullWidth} error={!!error && touched}>
      <FormLabel component="legend">{label}</FormLabel>
      <Autocomplete
        // This field is the unique react memoization key when rendering the options list
        getOptionLabel={(option) => {
          // We don't have to worry about lookup time since it's already indexed by id. Lookups happen in constant time
          const user = getCachedListItemById("Users", option);
          const workUnit = getCachedListItemById("WorkUnits", user.WorkUnitId);

          return [
            `(ID: ${user.Id}) `,
            user?.FirstName,
            user?.LastName,
            "- " + user?.Title,
            "@ " + workUnit?.Title,
          ]
            .filter(Boolean)
            .join(" ");
        }}
        renderOption={(props, option, { inputValue }) => {
          const user = getCachedListItemById("Users", option);
          const workUnit = getCachedListItemById("WorkUnits", user.WorkUnitId);

          let address: string | undefined;
          if (workUnit?.Address) {
            try {
              const { DisplayName } = JSON.parse(workUnit.Address);
              address = DisplayName;
            } catch (er) {}
          }
          return (
            <ListItem {...props}>
              <ListItemText
                primary={
                  <Typography variant="inherit" fontWeight={600}>
                    <TextHighlight
                      search={inputValue}
                      text={[user.FirstName, user.LastName].join(" ")}
                    />
                  </Typography>
                }
                secondary={
                  <Typography variant="inherit" className={classes.secondaryLabel}>
                    {!!workUnit && (
                      <>
                        <TextHighlight
                          search={inputValue}
                          text={`${user.Title} ${user.Level ? `(Level ${user.Level})` : ""}`}
                        />
                        <br />
                        <span>
                          {workUnit.Title} - {workUnit.Number}
                        </span>
                        <br />
                        <span>{address}</span>
                      </>
                    )}
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
          searchLists(inputValue, ["Users"]).map((a) => a.item.Id)
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
