import { useContext, useEffect, useState } from "react";
import "./App.css";
import { SPContext } from "./sharepoint/SPContext";
import { SnackbarProvider } from "notistack";
import MuiThemeProvider from "./comps/context/MuiThemeContext";
import { HashRouter } from "react-router-dom";
import ContentAlignmentContainer from "./comps/navigation/ContentAlignmentContainer";
import TopAppBar from "./comps/navigation/TopAppBar";
import RootNavigation from "./pages/_navigation";
import NavDrawer from "./comps/navigation/NavDrawer";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <MuiThemeProvider>
      <SnackbarProvider maxSnack={3}>
        <HashRouter>
          <NavDrawer open={drawerOpen} />
          <ContentAlignmentContainer drawerOpen={drawerOpen}>
            <TopAppBar setDrawerOpen={setDrawerOpen} />
            <RootNavigation />
          </ContentAlignmentContainer>
        </HashRouter>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
