import { Admin } from "admin";
import { Gms } from "gms";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/gms/word-balloon" />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/gms/*" element={<Gms />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
