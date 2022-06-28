import { EditOutlined, ExpandMore } from "@mui/icons-material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import Sync from "@mui/icons-material/Sync";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton/IconButton";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import TextHighlight from "../../comps/ui/TextHightlight";
import useListItems from "../../hooks/useListItems";
import { ListChangeEmitter } from "../../hooks/useSubscribeToCacheChanges";
import displaySharepointEditWindow from "../../utils/displaySharepointEditWindow";
import displaySharepointNewItemWindow from "../../utils/displaySharepointNewItemWindow";

export default function WorkUnitHome() {
  const { items: workUnits } = useListItems("WorkUnits");
  const [search, setSearch] = useState("");
  // Whatever type the Id field is, that's what the expanded variable will be an array of
  // By default it will be an array of integers
  const [expanded, setExpanded] = useState<Set<WorkUnitData["ID"]>>(new Set());

  const toggleAccordion = (id: WorkUnitData["ID"]) => {
    setExpanded((e) => {
      if (e.has(id)) {
        e.delete(id);
      } else {
        e.add(id);
      }
      return new Set(Array.from(e));
    });
  };

  return (
    <Container maxWidth="xl">
      <Typography align="center" variant="h1">
        Work Units
      </Typography>

      <Stack direction={"row"} justifyContent="center" spacing={3} marginBottom={4}>
        <Button
          startIcon={<AddOutlined />}
          variant="contained"
          onClick={() => {
            displaySharepointNewItemWindow("WorkUnits");
          }}
        >
          Create New Work Unit
        </Button>

        <Button
          color="secondary"
          startIcon={<Sync />}
          onClick={() => ListChangeEmitter.emit("change", "WorkUnits")}
          variant="outlined"
        >
          Refresh
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {workUnits.map((wu) => {
          const completeHeight = 300;
          const maxHeight = 600;
          const minHeight = 300;

          const height = Math.min(maxHeight, Math.max(minHeight, completeHeight));

          return (
            <Grid
              item
              xs={expanded.has(wu.ID) ? 12 : 6}
              sx={(theme) => ({
                transition: theme.transitions.create("all", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              })}
              key={wu.Id}
            >
              <Accordion
                expanded={expanded.has(wu.ID)}
                onChange={() => toggleAccordion(wu.Id)}
                sx={{ border: "1px solid grey" }}
              >
                <AccordionSummary
                  expandIcon={
                    <IconButton>
                      <ExpandMore style={{ color: expanded.has(wu.ID) ? "red" : undefined }} />
                    </IconButton>
                  }
                >
                  <Typography fontSize={18}>
                    <Typography component="span" color="primary" fontSize={18}>
                      ({wu.Number})
                    </Typography>
                    : <TextHighlight text={wu.Title} search={search} />
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Button
                    onClick={() => displaySharepointEditWindow("WorkUnits", wu.Id)}
                    variant="outlined"
                    startIcon={<EditOutlined />}
                  >
                    Edit Work Unit
                  </Button>

                  <pre>{JSON.stringify(wu, null, 2)}</pre>
                </AccordionDetails>
              </Accordion>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
