import styled from "@emotion/styled";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Menu from "@mui/icons-material/Menu";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import UniversalSearchResults from "./UniversalSearchResults";

// This is the element that is presented below the search bar once the search is in focus and has a non-empty value
const ResultsContainer = styled.div(({ hasValue }: { hasValue: boolean }) => ({
  position: "absolute",
  top: "100%",
  width: "100%",
  background: "white",
  borderBottom: hasValue ? "1px solid grey" : undefined,
  maxHeight: 400,
  overflow: "auto",
  zIndex: 2,
}));

type Props = {
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TopAppBar({ setDrawerOpen }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  const hidden = searchParams.get("hideAppBar") === "true";
  const location = useLocation();

  useEffect(() => {
    setFocused(false);
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
    // As soon as the user clicks away from the results or the search bar, hide the results container
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <AppBar position="relative" color="transparent" elevation={1}>
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
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            fullWidth
            placeholder="Search (phone numbers, name, emails, comments, etc.)"
          />
        </Toolbar>

        {!!value && focused && (
          <ResultsContainer hasValue={!!value}>
            <UniversalSearchResults search={search} typing={typing} />
          </ResultsContainer>
        )}
      </AppBar>
    </ClickAwayListener>
  );
}
