import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import { Fragment, useContext, useEffect, useState } from "react";
import CorporateFareOutlined from "@mui/icons-material/CorporateFareOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import EmojiTransportationOutlined from "@mui/icons-material/EmojiTransportationOutlined";
import SearchItemResult from "./SearchItemResult";
import CenteredCircularProgress from "../ui/CenteredCircularProgress";

export type UniversalSearchResultsProps = {
  search: string;
  typing: boolean;
};

export default function UniversalSearchResults({ search, typing }: UniversalSearchResultsProps) {
  const [loading, setLoading] = useState(false);

  const users = [];
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

      {loading && <CenteredCircularProgress />}

      <List>
        {!!users.length && (
          <>
            <ListSubheader>People</ListSubheader>
            {users.map((user, index) => (
              <Fragment key={user.Id}>
                <SearchItemResult
                  onClick={(ev) => {
                    ev.preventDefault();
                    return false;
                  }}
                  primary={user.First_Name + " " + user.Last_Name}
                  secondary={user.Title}
                  icon={<PersonOutlined />}
                />

                {index + 1 < users.length && <Divider variant="inset" component="li" />}
              </Fragment>
            ))}
          </>
        )}
      </List>

      {!loading && !users.length && !typing && (
        <Typography align="center" color="error">
          No results found
        </Typography>
      )}
    </Container>
  );
}
