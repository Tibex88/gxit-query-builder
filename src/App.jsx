import { BrowserRouter, Routes, Route } from "react-router-dom";

import QB from "./pages/query-builder";
import { Result } from "./pages/result";
import { Param } from "./pages/param";
import { AnnotationC } from "./pages/annotation";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjcwNDYwMSwianRpIjoiOWY2NzRjZWQtZDgyNi00ZTFmLTgwNTYtNjEyMDg3NWE0MTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc0NjcwNDYwMSwiY3NyZiI6IjMwMThhYTdjLTBlNDItNDg1MC1hNTMzLTllOGQ5MzQxNGFjYSIsImV4cCI6MTc1NTcwNDYwMSwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.asewhiLTXz32HgRurF-q9MNMaPN3nQjp3y0gp6loAlg"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<QB />} />
          <Route
          path="annotation" element={<AnnotationC />} >
            <Route index path="results" element={<Result />} />
            <Route path="params" element={<Param />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}
