import AddOutlined from "@mui/icons-material/AddOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import { Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { ListUpdatingContext } from "../context/ListUpdatingContext";
import SPContext from "../context/SPContext";
import UnstyledLink from "../ui/UnstyledLink";

type Props = {
  open: boolean;
  width: number;
  setWidth: (width: number) => void;
};

type StyleProps = {
  width: number;
};

const useStyles = makeStyles<StyleProps>()((theme, { width }) => ({
  drawer: {
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
      width,
      borderRight: "1px solid rgba(0,0,0,0.2)",
    },
  },
  contentContainer: {
    position: "relative",
    width: "100%",
  },
  draggableBar: {
    width: "4px",
    height: "100vh",
    position: "absolute",
    right: 0,
    border: 0,
    cursor: "ew-resize",
    background: "rgba(0,0,0,0)",
  },
  header: {
    padding: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  updatingListItemText: {
    fontSize: 12,
  },
  updatingListItem: {
    opacity: 0.8,
  },
}));

export default function NavDrawer({ open, width, setWidth }: Props) {
  const location = useLocation();
  const [search] = useSearchParams();
  const { user } = useContext(SPContext);
  const listsUpdating = useContext(ListUpdatingContext);
  const { classes } = useStyles({ width });

  const hidden = search.get("hideDrawer") === "true";

  if (hidden) {
    return null;
  }

  return (
    <Drawer variant="persistent" open={open} anchor="left" className={classes.drawer}>
      <div className={classes.contentContainer}>
        <div
          className={classes.draggableBar}
          draggable
          onDrag={(ev) => ev.screenX && setWidth(Math.min(600, Math.max(250, ev.screenX)))}
        />

        <div className={classes.header}>
          <Typography variant="h2" align="center">
            RRM Devices Dashboard
          </Typography>
          <Divider />

          <Typography>
            {user ? (
              <>
                Signed in as{" "}
                <Typography
                  variant="body1"
                  fontWeight={600}
                  component="span"
                  color="secondary.main"
                >
                  {user.Title}
                </Typography>
              </>
            ) : (
              "Not signed in"
            )}
          </Typography>

          <Divider />
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

          <Divider className={classes.divider} />

          {!!listsUpdating.length && (
            <>
              <Typography variant="h4" align="center" color="secondary.main">
                Updates:
              </Typography>

              <List>
                {listsUpdating.map((list, index) => (
                  <ListItem
                    alignItems="flex-start"
                    key={list + index}
                    color="secondary.main"
                    className={classes.updatingListItem}
                  >
                    <ListItemIcon>
                      <CircularProgress size={16} color="secondary" />
                    </ListItemIcon>
                    <ListItemText className={classes.updatingListItemText} primary={list} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
