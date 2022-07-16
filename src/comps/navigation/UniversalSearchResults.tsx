import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import LaptopOutlined from "@mui/icons-material/LaptopOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PhoneAndroidOutlined from "@mui/icons-material/PhoneAndroidOutlined";
import PhoneIphoneOutlined from "@mui/icons-material/PhoneIphoneOutlined";
import TabletAndroidOutlined from "@mui/icons-material/TabletAndroidOutlined";
import TabletMacOutlined from "@mui/icons-material/TabletMacOutlined";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import { Fragment, ReactNode, useMemo } from "react";
import { getAssignmentsByDeviceId } from "../../lists/getAssignmentsByDeviceId";
import { getCachedListItemById } from "../../lists/getCachedListItemById";
import searchLists from "../../lists/searchLists";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import CenteredCircularProgress from "../ui/CenteredCircularProgress";
import SearchItemResult from "./SearchItemResult";

export type UniversalSearchResultsProps = {
  search: string;
  typing: boolean;
};

// This helps us ensure that all lists being searched have icons
type ListsToSearch = "Users" | "WorkUnits" | "Devices";
const listsToSearch: ListsToSearch[] = ["Users", "WorkUnits", "Devices"];

const IconMap: { [key in ListsToSearch]: ReactNode } = {
  Users: <PersonOutlined />,
  WorkUnits: <BusinessOutlined />,
  Devices: <PhoneAndroidOutlined />,
};

export default function UniversalSearchResults({ search, typing }: UniversalSearchResultsProps) {
  const results = useMemo(
    () => (typing ? [] : searchLists(search, listsToSearch)),
    [search, typing]
  );

  return (
    <Container maxWidth="xl">
      <Typography variant="body1" align="center">
        {typing ? (
          <>Waiting for typing to finish...</>
        ) : (
          <>
            Showing Results for: <b>{search}</b>
          </>
        )}
      </Typography>

      {typing && <CenteredCircularProgress />}

      <List>
        {!!results.length && (
          <>
            <ListSubheader>People</ListSubheader>
            {results.map((result, index) => {
              let primary: ReactNode = "No Label";
              let secondary: ReactNode = "No Label";
              let href: null | string = null;
              let icon = <DevicesOutlined />;

              if (result.list === "Users") {
                const user = result.item as UserData;

                const workUnit = getCachedListItemById("WorkUnits", user.WorkUnitId);

                primary = [user.FirstName, user.LastName].join(" ");

                secondary = `${user.Title} ${user.Level ? `(Level ${user.Level})` : ""} - ${
                  workUnit?.Title || "No Work Unit"
                }`;

                href = "/users/" + user.Id;
                icon = <PersonOutlined />;
              }

              if (result.list === "Devices") {
                const device = result.item as DeviceData;

                href = "/devices/" + device.Id;

                const assignments = getAssignmentsByDeviceId(device.Id);

                const activeAssignment = assignments.find((a) => a.Status === "Active");

                const assignedTo: UserData | null = activeAssignment
                  ? getCachedListItemById("Users", activeAssignment.UserId)
                  : null;

                primary = [
                  formatPhoneNumber(device.Phone),
                  device.Tag ? `Tag: ${device.Tag}` : "",
                  "-",
                  device.Manufacturer,
                  " - " + device.Model,
                ]
                  .filter(Boolean)
                  .join(" ");

                secondary = `${device.DeviceType} - ${device.ServiceType?.join?.(", ")}`;

                if (assignedTo) {
                  const workUnit = getCachedListItemById("WorkUnits", assignedTo.WorkUnitId);
                  secondary +=
                    " | (Currently Assigned To " +
                    assignedTo.FirstName +
                    " " +
                    assignedTo.LastName +
                    " @ " +
                    (workUnit?.Title || "Unknown Work Unit") +
                    ")";
                }

                if (device.DeviceType === "Phone") {
                  icon =
                    device.Manufacturer === "Apple" ? (
                      <PhoneIphoneOutlined />
                    ) : (
                      <PhoneAndroidOutlined />
                    );
                }

                if (device.DeviceType === "Tablet") {
                  icon =
                    device.Manufacturer === "Apple" ? (
                      <TabletMacOutlined />
                    ) : (
                      <TabletAndroidOutlined />
                    );
                }

                if (device.DeviceType === "Laptop") {
                  icon = <LaptopOutlined />;
                }
              }

              return (
                <Fragment key={result.list + "-" + result.item.Id}>
                  <SearchItemResult
                    primary={primary}
                    secondary={secondary}
                    icon={icon}
                    href={href}
                  />

                  {index + 1 < results.length && <Divider variant="inset" component="li" />}
                </Fragment>
              );
            })}
          </>
        )}
      </List>

      {!results.length && !typing && (
        <Typography align="center" color="error">
          No results found
        </Typography>
      )}
    </Container>
  );
}
