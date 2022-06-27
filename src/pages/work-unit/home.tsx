import Sync from "@mui/icons-material/Sync";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FlexCenter from "../../comps/ui/FlexCenter";
import useListItems from "../../hooks/useListItems";
import { ListChangeEmitter } from "../../hooks/useSubscribeToCacheChanges";
import displaySharepointEditWindow from "../../utils/displaySharepointEditWindow";
import displaySharepointNewItemWindow from "../../utils/displaySharepointNewItemWindow";

export default function WorkUnitHome() {
  const wuItems = useListItems("WorkUnits");
  return (
    <div>
      <Typography align="center" variant="h1">
        Work Units
      </Typography>
      <FlexCenter>
        <Button
          color="secondary"
          startIcon={<Sync />}
          onClick={() => ListChangeEmitter.emit("change", "WorkUnits")}
        >
          Refresh
        </Button>
      </FlexCenter>
      <Button onClick={() => displaySharepointNewItemWindow("WorkUnits")}>
        Create a new Work Unit
      </Button>
      {wuItems.items.map((i) => (
        <div key={i.Id}>
          <pre>{JSON.stringify(i, null, 2)}</pre>
          <Button onClick={() => displaySharepointEditWindow("WorkUnits", i.ID)}>
            Edit {i.Title}
          </Button>
        </div>
      ))}
    </div>
  );
}

// export default function WorkUnitHome() {
//   const [filter, setFilter] = useState("");
//   const [sort, setSort] = useState<UseWorkUnitStatsSort>("a-z");
//   const { loading, data } = useWorkUnitStats({ sort });
//   const [expanded, setExpanded] = useState<Set<string | number>>(new Set());

//   function statsFilterFn(stat: WorkUnitStat) {
//     // Convert the search string into a lowercase array of unique words
//     const words = Array.from(new Set(filter.toLowerCase().split(/\s+/).filter(Boolean)));

//     return words.every(
//       (word) =>
//         stat.workUnit.Title.toLowerCase().includes(word) ||
//         stat.devicesSummary.some(
//           (device) =>
//             device.manufacturer.toLowerCase().includes(word) ||
//             device.model.toLowerCase().includes(word)
//         ) ||
//         stat.assignments.some(
//           (assignment) =>
//             assignment.device.Phone.includes(word) ||
//             assignment.person.First_Name.toLowerCase().includes(word) ||
//             assignment.person.Last_Name.toLowerCase().includes(word)
//         )
//     );
//   }

//   const stats = data?.length ? data.filter(statsFilterFn) : [];

//   const toggleAccordion = (id: string | number) => {
//     const newExpanded = new Set([...expanded]);

//     newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
//     setExpanded(newExpanded);
//   };

//   return (
//     <Container maxWidth="xl">
//       <Typography align="center" variant="h2">
//         Work Unit Stats
//       </Typography>

//       <div style={{ display: "flex", marginBottom: 20 }}>
//         <TextField
//           value={filter}
//           label="Filter"
//           onChange={(ev) => setFilter(ev.target.value)}
//           style={{ flexGrow: 1, marginRight: 10 }}
//           InputProps={{
//             endAdornment: !!filter && (
//               <IconButton onClick={() => setFilter("")}>
//                 <Close />
//               </IconButton>
//             ),
//           }}
//         />
//         <FormControl>
//           <InputLabel>Sort</InputLabel>
//           <Select
//             value={sort}
//             label="Age"
//             onChange={(ev) => setSort(ev.target.value as UseWorkUnitStatsSort)}
//           >
//             <MenuItem value={"a-z"}>A-Z</MenuItem>
//             <MenuItem value={"z-a"}>Z-A</MenuItem>
//             <MenuItem value={"num-assignments"}>Most To Least Assignments</MenuItem>
//             <MenuItem value={"num-assignments-reverse"}>Least To Most Assignments</MenuItem>
//           </Select>
//         </FormControl>
//       </div>

//       {!!filter && (
//         <Typography align="center" variant="body1">
//           Showing only results for {filter}
//         </Typography>
//       )}

//       {loading && <CenteredCircularProgress />}

//       <Grid container spacing={4}>
//         {!loading &&
//           stats.map((stat) => {
//             const completeHeight = stat.assignments.length * 70 + 160;
//             const maxHeight = 600;
//             const minHeight = 300;

//             const height = Math.min(maxHeight, Math.max(minHeight, completeHeight));

//             return (
//               <Grid
//                 item
//                 xs={expanded.has(stat.workUnit.Id) ? 12 : 6}
//                 sx={(theme) => ({
//                   transition: theme.transitions.create("all", {
//                     easing: theme.transitions.easing.sharp,
//                     duration: theme.transitions.duration.leavingScreen,
//                   }),
//                 })}
//                 key={stat.workUnit.Id}
//               >
//                 <Accordion
//                   expanded={expanded.has(stat.workUnit.Id)}
//                   onChange={() => toggleAccordion(stat.workUnit.Id)}
//                   sx={{ border: "1px solid grey" }}
//                 >
//                   <AccordionSummary
//                     expandIcon={
//                       <IconButton>
//                         <ExpandMore
//                           style={{ color: expanded.has(stat.workUnit.Id) ? "red" : undefined }}
//                         />
//                       </IconButton>
//                     }
//                   >
//                     <Typography fontSize={18}>
//                       <Typography component="span" color="primary" fontSize={18}>
//                         ({stat.workUnit.WU_Number})
//                       </Typography>
//                       : <TextHighlight text={stat.workUnit.Title} search={filter} />
//                     </Typography>
//                   </AccordionSummary>

//                   <AccordionDetails>
//                     {expanded.has(stat.workUnit.Id) && (
//                       <div style={{ height }}>
//                         <DataGrid
//                           checkboxSelection
//                           editMode="row"
//                           columns={[
//                             {
//                               field: "id",
//                               headerName: "ID",
//                               filterable: true,
//                               sortable: true,
//                               editable: true,
//                             },
//                             {
//                               field: "model",
//                               width: 250,
//                               headerName: "Model",
//                               filterable: true,
//                             },
//                             {
//                               field: "phone",
//                               headerName: "Phone Number",
//                               width: 200,
//                             },
//                             {
//                               field: "firstName",
//                               headerName: "First Name",
//                               width: 150,
//                             },
//                             {
//                               field: "lastName",
//                               headerName: "Last Name",
//                               width: 150,
//                             },
//                           ]}
//                           rows={stat.assignments.map((a) => ({
//                             id: a.Id,
//                             firstName: a.person.First_Name,
//                             lastName: a.person.Last_Name,
//                             model: a.device.Model,
//                             phone: a.device.Phone,
//                           }))}
//                           rowBuffer={4}
//                           components={{
//                             Toolbar: GridToolbar,
//                           }}
//                         />
//                       </div>
//                     )}

//                     <Button variant="contained" style={{ margin: "20px 0" }}>
//                       View More Details
//                     </Button>
//                   </AccordionDetails>
//                 </Accordion>
//               </Grid>
//             );
//           })}
//       </Grid>
//     </Container>
//   );
// }
