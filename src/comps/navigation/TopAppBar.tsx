import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import UniversalSearchResults from "./UniversalSearchResults";
import IconButton from "@mui/material/IconButton";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Menu from "@mui/icons-material/Menu";
import { useLocation, useSearchParams } from "react-router-dom";

type Props = {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TopAppBar({ setDrawerOpen }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [canBlur, setCanBlur] = useState(true);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");
  const appBarRef = useRef();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const hidden = searchParams.get("hideAppBar") === "true";

  // If the user clicks on a search result then close the search
  useEffect(() => {
    setFocused(false);
    setCanBlur(true);

    // Blur the input so that the onFocus handler gets called next time it is clicked and the focused state variable is set to true again
    requestAnimationFrame(() => {
      const element = document.activeElement as HTMLInputElement;

      element?.blur();
    });
  }, [location]);

  // If the typing variable is true, create a timer to set it to false in 200ms. Reset the timer every time the value changes
  useEffect(() => {
    if (typing) {
      const timeout = setTimeout(() => setTyping(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [typing, value]);

  // If the value variable changes, set the typing variable to true
  useEffect(() => {
    setTyping(true);
  }, [value]);

  // Once the typing stops, check to see if the value changed from last time and only then ask the server for new results
  useEffect(() => {
    if (!typing && search !== value) {
      setSearch(value);
    }
  }, [typing, search, value]);

  const toggleDrawer = () => setDrawerOpen((current) => !current);

  if (hidden) {
    return null;
  }

  return (
    <AppBar
      position="relative"
      color="transparent"
      elevation={1}
      // @ts-ignore
      ref={appBarRef}
    >
      <Toolbar>
        <IconButton size="large" edge="start" onClick={toggleDrawer}>
          <Menu />
        </IconButton>
        <TextField
          InputProps={{
            startAdornment: <SearchOutlined />,
            endAdornment: value ? (
              <IconButton onClick={() => setValue("")}>
                <CloseOutlined />
              </IconButton>
            ) : undefined,
          }}
          onFocus={() => setFocused(true)}
          onBlur={(ev) => {
            if (canBlur) {
              setFocused(false);
            } else {
              ev.target.focus();
            }
          }}
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          fullWidth
          placeholder="Search (phone numbers, name, emails, comments, etc.)"
        />
      </Toolbar>

      {!!value && focused && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            width: "100%",
            background: "white",
            borderBottom: value ? "1px solid grey" : undefined,
            maxHeight: 400,
            overflow: "auto",
            zIndex: 2,
          }}
          onMouseOver={() => setCanBlur(false)}
          onMouseOut={() => setCanBlur(true)}
        >
          <UniversalSearchResults search={search} typing={typing} />
        </div>
      )}
    </AppBar>
  );
}
