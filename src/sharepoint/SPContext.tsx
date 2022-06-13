import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { spfi, SPBrowser, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-users";
import "@pnp/sp/items";

import { ISiteUserInfo } from "@pnp/sp/site-users";
import { SHAREPOINT_URL } from "../constants";

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

export const SPContext = createContext<SPContextValue>(defaultValue);

export default function SPContextProvider({ children }: Props) {
  return <SPContext.Provider value={defaultValue}>{children}</SPContext.Provider>;

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

    const items = await sp.web.lists.getByTitle("Users").items();

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
            const loginWindow = window.open(
              SHAREPOINT_URL + "/SitePages/Login-Status.aspx",
              "_blank",
              "location=no,toolbar=no,menubar=no,width=1000,height=750"
            );

            const closeCheck = setInterval(() => {
              if (loginWindow.closed) {
                clearInterval(closeCheck);
                window.location.reload();
              }
            }, 500);
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
    return <p>Loading...</p>;
  }

  return <SPContext.Provider value={value}>{children}</SPContext.Provider>;
}
