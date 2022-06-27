import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import "./App.css";
import { ListUpdatingContextProvider } from "./comps/context/ListUpdatingContext";
import MuiThemeProvider from "./comps/context/MuiThemeContext";
import ContentAlignmentContainer from "./comps/navigation/ContentAlignmentContainer";
import NavDrawer from "./comps/navigation/NavDrawer";
import TopAppBar from "./comps/navigation/TopAppBar";
import RootNavigation from "./pages/_navigation";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [width, setWidth] = useState(
    parseInt(window.localStorage.getItem("drawer-width") || "250")
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("drawer-width", width.toString());
    }, 500);

    return () => clearTimeout(timeout);
  }, [width]);

  return (
    <MuiThemeProvider>
      <SnackbarProvider maxSnack={3}>
        <HashRouter>
          <ListUpdatingContextProvider>
            <NavDrawer open={drawerOpen} width={width} setWidth={setWidth} />
            <ContentAlignmentContainer drawerOpen={drawerOpen} width={width}>
              <TopAppBar setDrawerOpen={setDrawerOpen} />
              <RootNavigation />
            </ContentAlignmentContainer>
          </ListUpdatingContextProvider>
        </HashRouter>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
