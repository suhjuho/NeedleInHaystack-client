import { Route, Routes } from "react-router-dom";
import MainPage from "../MainPage";
import ErrorPage from "../ErrorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
