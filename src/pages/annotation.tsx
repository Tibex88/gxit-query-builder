import React, { useEffect, useRef, useState } from 'react';
import { AnnotationDataContext } from '../context';
import { Outlet, useFetcher, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { Annotation, AnnotationContextMenu } from "./../action";
import { ArrowLeft } from "lucide-react";
import Tabs from "./../tabs";
import { ReactFlowProvider } from '@xyflow/react';
import { io, Socket } from "socket.io-client";
import { annotationAPI } from '../api';

function writeToOutput(content) {
  const pathParts = window.location.pathname.split('/');
  const BASE_PATH = ['','interactivetool','ep', pathParts[3], pathParts[4]].join('/');
  const { annotation_id } = content;
  fetch(`${BASE_PATH}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({content: (annotation_id).toString() }),
  })
    .then(res => res.json())
    .then(data => {
      // console.log({dm:data.message, de:data.error ? data.error : ''})
      console.count('Write to output called');
      alert(data.message);
    })
    .catch(err => {
      alert('Write failed');
      return console.error('Write failed', err)
    });
}

interface Update {
  status: "COMPLETE" | "PENDING" | "FAILED";
  update: any;
}

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

  // Get base path dynamically
  const segments = location.pathname.split('/'); // ['', 'interactivetool', 'ep', 'uid', 'token', ...]
  const basePath = `/${segments.slice(1, 5).join('/')}`; // /interactivetool/ep/:uid/:token

  useEffect(() => {
    console.log({data})
    setAnnotation(data)
  }, [data]);

    async function handleUpdates(update: Update) {
      console.log("handling updates ", update)
      if (update.update.graph) {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await annotationAPI
        .get(`annotation/${annotation.annotation_id}`, { headers })
        .json();
        console.log({annotation2:res})
        // writeToOutput(res)
        // await fetcher.load(`/annotation/${annotation.annotation_id}`);
        setAnnotation(res)
        navigate(`${basePath}/annotation/${annotation.annotation_id}/results`);
          // navigate(`/interactivetool/ep/${id1}/${id2}/annotation/${annotation.annotation_id}`, { replace: true });
      return res;
      
    }
    // return fetcher.load(`${basePath}/annotation/${annotation.annotation_id}/results`);
    if (update.status === "COMPLETE" || update.status === "FAILED") {
      console.log({updateStatus:update.status})
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