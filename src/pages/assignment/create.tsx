import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import { makeStyles } from "tss-react/mui";
import ReassignForm from "../../comps/forms/assignment/ReassignForm";

const useStyles = makeStyles()((theme) => ({
  card: {
    padding: theme.spacing(3),
  },
}));

export default function AssignmentCreatePage() {
  const { classes } = useStyles();
  return (
    <Container maxWidth="sm">
      <Card className={classes.card}>
        <ReassignForm />
      </Card>
    </Container>
  );
}
