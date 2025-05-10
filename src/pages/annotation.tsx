import React from 'react';
import { AnnotationDataContext } from '../context';
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { Annotation, AnnotationContextMenu } from "./../action";
import { ArrowLeft } from "lucide-react";
import Tabs from "./../tabs";
import { ReactFlowProvider } from '@xyflow/react';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjcwNDYwMSwianRpIjoiOWY2NzRjZWQtZDgyNi00ZTFmLTgwNTYtNjEyMDg3NWE0MTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc0NjcwNDYwMSwiY3NyZiI6IjMwMThhYTdjLTBlNDItNDg1MC1hNTMzLTllOGQ5MzQxNGFjYSIsImV4cCI6MTc1NTcwNDYwMSwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.asewhiLTXz32HgRurF-q9MNMaPN3nQjp3y0gp6loAlg"

export function AnnotationC() {

  const AnnotationDataProvider = AnnotationDataContext.Provider;
  const annotation: Annotation = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
    <ReactFlowProvider>
      <AnnotationDataProvider value={annotation}>
            <div className="h-full w-full">
        <div className="flex h-screen flex-col">
          <header className="flex items-center justify-between px-12 pt-4">
            <h1 className="red text-xl font-bold">
              {/* <a
                className="me-2 hover:cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="me-2 inline" />
              </a> */}
              {annotation.title || annotation.annotation_id}
            </h1>
            <AnnotationContextMenu annotation={annotation} />
          </header>
          <Tabs
            tabs={[
              {
                label: "Query",
                href: `/annotation/${annotation.annotation_id}/params`,
              },
              {
                label: "Result",
                href: `/annotation/${annotation.annotation_id}/results`,
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