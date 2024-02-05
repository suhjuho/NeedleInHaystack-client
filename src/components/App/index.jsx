import { Route, Routes } from "react-router-dom";
import MainPage from "../MainPage";
import ErrorPage from "../ErrorPage";
import ResultPage from "../ResultPage";
import DetailPage from "../DetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<MainPage />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/watch" element={<DetailPage />} />
      <Route path="*" element={<ErrorPage errorMessage="404 Not Found!" />} />
    </Routes>
  );
}

export default App;
