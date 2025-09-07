import { useContext, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { UserDataContext } from "./context";
import { annotationAPI } from "./api";

export function useRunQuery(id?: string) {
  const navigate = useNavigate();
  const user = useContext(UserDataContext);
  const [busy, setBusy] = useState(false);

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

const runQuery = async (graph: any) => {
  setBusy(true);
  const requestJSON = {
    requests: {
      annotation_id: id,
      nodes: graph.nodes.map((n: any) => (
        {
        node_id: "a" + n.id.replaceAll("-", ""),
        id: n.data.id || "",
        type: n.data.qb_node_type,
        properties: Object.keys(n.data)
          .filter((k) => !["id", "qb_node_type", "animate"].includes(k) && n.data[k])
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
    // console.log({annotation_id})
      console.log("", title,{title, annotation_id})
    const segments = location.pathname.split('/'); // ['', 'interactivetool', 'ep', 'uid', 'token', ...]
    const basePath = `/${segments.slice(1, 5).join('/')}`; // /interactivetool/ep/:uid/:token
    var history_id = segments[3]; // history ID 
    // outputToGalaxy(title || "Rejuve Query Output")
    navigate(`${basePath}/annotation/${annotation_id}/results`, {
        // state: { reload: Date.now() },
        replace: true,
    });
  } catch (e: any) {
    console.error("", e);
    alert(`Could not connect to the server`);
  } finally {
    setBusy(false);
  }
};

  return { runQuery, busy };
}
