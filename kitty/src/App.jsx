import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./routes/Dashboard";
import Add from "./routes/Add";
import History from "./routes/History";
import Members from "./routes/Members";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Add />} />
          <Route path="/history" element={<History />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
