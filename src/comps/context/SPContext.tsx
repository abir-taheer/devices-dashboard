import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { SPBrowser, spfi, SPFI } from "@pnp/sp";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/site-users/web";
import "@pnp/sp/webs";

import { ISiteUserInfo } from "@pnp/sp/site-users";
import { SHAREPOINT_URL } from "../../constants";
import openTrackedWindow from "../../utils/openTrackedWindow";
import CenteredCircularProgress from "../ui/CenteredCircularProgress";

const sp = spfi().using(SPBrowser({ baseUrl: SHAREPOINT_URL }));

type Props = {
  children: ReactNode;
};

type SPContextValue = {
  user: ISiteUserInfo | null;
  sp: SPFI;
};

const defaultValue: SPContextValue = {
  user: null,
  sp,
};

const SPContext = createContext<SPContextValue>(defaultValue);

export function SPContextProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [user, setUser] = useState<null | ISiteUserInfo>(null);

  const value = useMemo<SPContextValue>(
    () => ({
      user,
      sp,
    }),
    [user]
  );

  const setup = useCallback(async () => {
    await sp.web();
    const currentUser = await sp.web.currentUser();

    setUser(currentUser);
  }, []);

  useEffect(() => {
    // Setup the context
    setup()
      .then(() => setReady(true))
      // If there's an auth error, lead to login page, otherwise display error boundary
      .catch((er) => {
        if (er.response?.status === 403) {
          const confirmation = window.confirm(
            "You are not authorized to access the list. This likely means that you're not signed in. Click OK to open a new tab with the sign in page"
          );

          if (confirmation) {
            const start = new Date();

            openTrackedWindow({
              url: SHAREPOINT_URL + "/SitePages/Login-Status.aspx",
              shouldCloseWindow: (w) => {
                const now = new Date();
                const durationOpen = now.getTime() - start.getTime();

                // Give 5 seconds for the redirect to the login screen to happen
                if (durationOpen < 5000) {
                  return false;
                }

                // If after 5 seconds they're on the correct page, probably successful login. Close the popup
                try {
                  return w.location.href === SHAREPOINT_URL + "/SitePages/Login-Status.aspx";
                } catch (er) {
                  return false;
                }
              },
              onWindowClose: () => window.location.reload(),
            });
          }
        }

        setError(er);
      });
  }, [setup]);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  if (!ready) {
    return <CenteredCircularProgress fullScreen />;
  }

  return <SPContext.Provider value={value}>{children}</SPContext.Provider>;
}

export default SPContext;
