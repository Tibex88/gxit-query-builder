import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./context";
import { annotationAPI } from "./api";

export function useRunQuery(id?: string) {
  const navigate = useNavigate();
  const user = useContext(UserDataContext);
  const [busy, setBusy] = useState(false);

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjcwNDYwMSwianRpIjoiOWY2NzRjZWQtZDgyNi00ZTFmLTgwNTYtNjEyMDg3NWE0MTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc0NjcwNDYwMSwiY3NyZiI6IjMwMThhYTdjLTBlNDItNDg1MC1hNTMzLTllOGQ5MzQxNGFjYSIsImV4cCI6MTc1NTcwNDYwMSwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.asewhiLTXz32HgRurF-q9MNMaPN3nQjp3y0gp6loAlg"
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

const runQuery = async (graph: any) => {
  setBusy(true);
  const requestJSON = {
    requests: {
      nodes: graph.nodes.map((n: any) => (
        console.log(n),
        {
        node_id: "a" + n.id.replaceAll("-", ""),
        id: n.data.id || "",
        type: n.data.type,
        properties: Object.keys(n.data)
          .filter((k) => !["id", "type", "animate"].includes(k) && n.data[k])
          .reduce((acc, k) => ({ ...acc, [k]: n.data[k] }), {}),
      })),
      predicates: graph.edges.map((e: any) => ({
        id: e.id,
        type: e.data.edgeType,
        source: "a" + e.source.replaceAll("-", ""),
        target: "a" + e.target.replaceAll("-", ""),
      })),
    },
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const { annotation_id , title } = await annotationAPI
      .post("query", {
        headers,
        body: JSON.stringify(requestJSON),
      })
      .json();
      console.log(title,{title, annotation_id})
    const segments = location.pathname.split('/'); // ['', 'interactivetool', 'ep', 'uid', 'token', ...]
    const basePath = `/${segments.slice(1, 5).join('/')}`; // /interactivetool/ep/:uid/:token
    var history_id = segments[3]; // history ID 
    // outputToGalaxy(title || "Rejuve Query Output")
    navigate(`${basePath}/annotation/${annotation_id}/results`);
  } catch (e: any) {
    console.error(e);
    alert(`${e.response?.statusText}: ${e.response?.data}`);
  } finally {
    setBusy(false);
  }
};

  return { runQuery, busy };
}
