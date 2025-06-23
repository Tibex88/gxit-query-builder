import React, { useEffect, useRef, useState } from 'react';
import { AnnotationDataContext } from '../context';
import { Outlet, useFetcher, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { Annotation, AnnotationContextMenu } from "./../action";
import { ArrowLeft } from "lucide-react";
import Tabs from "./../tabs";
import { ReactFlowProvider } from '@xyflow/react';
import { io, Socket } from "socket.io-client";
import { annotationAPI } from '../api';

async function outputToGalaxy(title: string) {
  const baseURL = `${location.protocol}//${location.hostname}:9094`;

  // Step 1: Create a history
  const createHistoryRes = await fetch(`${baseURL}/api/histories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "9c90d079b75a7fe31b65772445b1f29f",
    },
    body: JSON.stringify({
      name: title || "Galaxy History from Rejuve",
    }),
  });

  const history = await createHistoryRes.json();
  const historyId = history.id;
  console.log("✅ History created:", historyId);

  await fetch(`${baseURL}/api/tools`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "9c90d079b75a7fe31b65772445b1f29f",
  },
    body: JSON.stringify({
      history_id: historyId,
      tool_id: "upload1",
      inputs: {
        "files_0|type": "upload_contents",
        "files_0|NAME": "my_output.txt",
        "files_0|url_paste": "Hello from my interactive tool!",
        "files_0|file_type": "txt"
      }
    })
  });

  // // Step 2: Launch the interactive tool
  // const toolLaunchRes = await fetch(`${baseURL}/api/tools?tool_id=interactivetool_qb`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-api-key": "9c90d079b75a7fe31b65772445b1f29f",
  //   },
  //   body: JSON.stringify({
  //     history_id: historyId,
  //     tool_id: "interactivetool_qb",
  //     inputs: {}  // No input is required to launch, outputs will be created automatically
  //   }),
  // });

  // const result = await toolLaunchRes.json();
  // console.log("🚀 Tool launched:", result);

  // // Step 3: Get the output dataset ID
  // const datasetId = result.outputs?.[0]?.id;
  // if (!datasetId) {
  //   throw new Error("❌ No dataset ID returned from tool launch.");
  // }

  // console.log("📄 Writing to dataset ID:", datasetId);

  // // Step 4: Write content to the dataset
  // const contentBlob = new Blob(["Hello from my interactive tool!"], { type: "text/plain" });
  // const formData = new FormData();
  // formData.append("file", contentBlob, "output.txt");

  // const uploadRes = await fetch(`${baseURL}/api/histories/${historyId}/contents/${datasetId}/overwrite`, {
  //   method: "PUT",
  //   headers: {
  //     "x-api-key": "9c90d079b75a7fe31b65772445b1f29f",
  //   },
  //   body: formData,
  // });

  // const uploadResult = await uploadRes.json();
  // console.log("✅ Upload result:", uploadResult);
}

// async function outputToGalaxy(title: string) {
//     const outputFilePath = process.env.OUTPUT_FILE_PATH;
//     console.log("Output file path:", outputFilePath);
//     if (!outputFilePath) return console.error({ error: 'No output file path defined' });
//   fs.writeFile(outputFilePath, "req.body.content", (err) => {
//     if (err) return console.error({ error: 'Failed to write file' });
//     console.info({ status: 'ok' });
//   });

// }

interface Update {
  status: "COMPLETE" | "PENDING" | "FAILED";
  update: any;
}

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjcwNDYwMSwianRpIjoiOWY2NzRjZWQtZDgyNi00ZTFmLTgwNTYtNjEyMDg3NWE0MTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc0NjcwNDYwMSwiY3NyZiI6IjMwMThhYTdjLTBlNDItNDg1MC1hNTMzLTllOGQ5MzQxNGFjYSIsImV4cCI6MTc1NTcwNDYwMSwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.asewhiLTXz32HgRurF-q9MNMaPN3nQjp3y0gp6loAlg"
// let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

export function AnnotationC() {

  const AnnotationDataProvider = AnnotationDataContext.Provider;
  const data: Annotation = useLoaderData();
    // const data: Annotation = useLoaderData<typeof loader>();
  const [annotation, setAnnotation] = useState(data);

  
  const navigate = useNavigate();
  const location = useLocation();
  let fetcher = useFetcher();
  const ws = useRef<Socket | null>(null);
  // const ws = useRef<Socket>();

  // Get base path dynamically
  const segments = location.pathname.split('/'); // ['', 'interactivetool', 'ep', 'uid', 'token', ...]
  const basePath = `/${segments.slice(1, 5).join('/')}`; // /interactivetool/ep/:uid/:token

  useEffect(() => {
    console.log({data})
    setAnnotation(data);
  }, [data]);

    async function handleUpdates(update: Update) {
      console.log("handling updates ", update)
    if (update.update.graph) {
      // return await fetcher.load(`/annotation/${annotation.annotation_id}`);
      const headers = { Authorization: `Bearer ${token}` };
      const res = await annotationAPI
      .get(`annotation/${annotation.annotation_id}`, { headers })
      .json();
      console.log({annotation2:res})
      setAnnotation(res)
      return res;
      
    }
    // return fetcher.load(`${basePath}/annotation/${annotation.annotation_id}/results`);
    if (update.status === "COMPLETE" || update.status === "FAILED") {
      console.log({us:update.status})
      ws.current?.close();
    }
    setAnnotation((a) => ({ ...a, ...update.update, status: update.status }));
  }

  useEffect(() => {
    if (data.status !== "PENDING") return;
    ws.current = io("ws://100.67.47.42:5500/");
    ws.current.on("connect", () => {
      ws.current!.emit("join", { room: data.annotation_id });
    });
    ws.current.on("update", handleUpdates);
  }, [data]);


  return (
    <>
    <ReactFlowProvider>
      <AnnotationDataProvider value={annotation}>
        <div className="h-full w-full">
        <div className="flex h-screen flex-col">
          <header className="flex items-center justify-between px-12 pt-4">
            <h1 className="red text-xl font-bold">
              <a
                className="me-2 hover:cursor-pointer"
                onClick={() => navigate(basePath)}
              >
                <ArrowLeft className="me-2 inline" />
              </a>
              {annotation.title || annotation.annotation_id}
            </h1>
            <AnnotationContextMenu annotation={annotation} />
          </header>
          <Tabs
            tabs={[
              {
                label: "Query",
                href: `params`,
              },
              {
                label: "Result",
                href: `results`,
              },
            ]}
          />
          <div className="relative flex-grow">
            <Outlet />
          </div>
        </div>
      </div>

      </AnnotationDataProvider>
      </ReactFlowProvider>
    </>
  )
}