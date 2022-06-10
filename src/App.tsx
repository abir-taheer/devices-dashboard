import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import getFormDigest from "./sharepoint/getFormDigest";

import { spfi, SPBrowser } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

const sp = spfi().using(SPBrowser({ baseUrl: "https://nycdot.sharepoint.com/sites/RRM_dev" }));

function App() {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sp.web().then(async () => {
      setReady(true);
      console.log(sp);

      // get the default document library 'Documents'
      const list = sp.web.lists.getByTitle("WorkUnits");
      // we can use this 'list' variable to run more queries on the list:
      const r = await list.select("")();

      // log the list Id to console
      console.log(r.Id);
    });
  });

  useEffect(() => {
    getFormDigest().then(console.log);
  }, []);

  if (!ready) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
