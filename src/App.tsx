import { Admin } from "admin";
import { Gms } from "gms";
import { HashRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/gms/*" element={<Gms />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
