import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import NewDeviceAssignForm from "../../comps/forms/assignment/NewDeviceAssignForm";
import ReassignForm from "../../comps/forms/assignment/ReassignForm";

const useStyles = makeStyles()((theme) => ({
  card: {
    padding: theme.spacing(3),
  },
}));

export default function AssignmentCreatePage() {
  const { classes } = useStyles();
  const [type, setType] = useState<"create" | "assign">("create");

  return (
    <Container maxWidth="md">
      <Card className={classes.card}>
        <FormControl>
          <FormLabel>Device Type</FormLabel>
          <RadioGroup value={type} onChange={(e, v: "create" | "assign") => setType(v)}>
            <FormControlLabel
              value={"create"}
              control={<Radio />}
              label={"Add a new device to assign"}
            />
            <FormControlLabel
              value={"assign"}
              control={<Radio />}
              label={"Reassign an existing Device"}
            />
          </RadioGroup>
        </FormControl>
        {type === "create" && <NewDeviceAssignForm />}
        {type === "assign" && <ReassignForm />}
      </Card>
    </Container>
  );
}
