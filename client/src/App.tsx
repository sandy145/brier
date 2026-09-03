import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { NewPermit } from "./pages/NewPermit";
import { PermitDetailPage } from "./pages/PermitDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/permits/new" element={<NewPermit />} />
      <Route path="/permits/:id" element={<PermitDetailPage />} />
    </Routes>
  );
}
