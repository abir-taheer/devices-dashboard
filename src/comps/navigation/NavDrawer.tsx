import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useLocation, useSearchParams } from "react-router-dom";
import AddOutlined from "@mui/icons-material/AddOutlined";
import UnstyledLink from "../ui/UnstyledLink";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import * as qs from "querystring";

type Props = {
  open: boolean;
};

export default function NavDrawer({ open }: Props) {
  const location = useLocation();
  const [search] = useSearchParams();

  const hidden = search.get("hideDrawer") === "true";

  if (hidden) {
    return null;
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 250,
          padding: 2,
          borderRight: "1px solid rgba(0,0,0,0.2)",
        },
      }}
    >
      <Typography variant="h2" align="center">
        RRM Devices Dashboard
      </Typography>

      <Typography variant="h4" align="center">
        Menu:
      </Typography>
      <List>
        <UnstyledLink to={"/assignment/create"}>
          <ListItemButton selected={location.pathname.startsWith("/assignment/create")}>
            <ListItemIcon>
              <AddOutlined />
            </ListItemIcon>
            <ListItemText primary={"Create New Assignment"} />
          </ListItemButton>
        </UnstyledLink>
        <UnstyledLink to={"/work-unit"}>
          <ListItemButton selected={location.pathname.startsWith("/work-unit")}>
            <ListItemIcon>
              <BusinessOutlined />
            </ListItemIcon>
            <ListItemText primary={"Work Units"} />
          </ListItemButton>
        </UnstyledLink>
        <UnstyledLink to={"/roster"}>
          <ListItemButton selected={location.pathname.startsWith("/roster")}>
            <ListItemIcon>
              <PeopleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Roster"} />
          </ListItemButton>
        </UnstyledLink>
      </List>
    </Drawer>
  );
}
