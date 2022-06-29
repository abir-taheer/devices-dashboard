import { Route, Routes } from "react-router-dom";
import AssignmentCreatePage from "./assignment/create";
import WorkUnitHome from "./work-unit/home";

export default function RootNavigation() {
  return (
    <div style={{ paddingTop: 30 }}>
      <Routes>
        <Route path="assignment">
          <Route path="create" element={<AssignmentCreatePage />} />
        </Route>
        <Route path="work-unit">
          <Route path="" element={<WorkUnitHome />} />
        </Route>
      </Routes>
    </div>
  );
}
