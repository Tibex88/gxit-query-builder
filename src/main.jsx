import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, redirect, RouterProvider, Navigate } from 'react-router-dom'
import {QB} from './pages/query-builder.js'
import { Result } from './pages/result.js'
import { Param } from './pages/param.js'
import { AnnotationC } from './pages/annotation.js'
import { annotationAPI } from './api.js'
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallBack } from "./pages/error-boundary.js"
import "./global.scss";

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/interactivetool/ep/404kvqqida1i/ixw8gx33yn32" replace />,
  },
  {
    path: "/interactivetool/ep/:id1/:id2",
    element: <QB />,
    errorElement: <ErrorFallBack />,
    children: [
      {
        path: "annotation/:id",
        element: <AnnotationC />,
        // errorElement: <ErrorFallBack />,
        loader: async ({ request, params }) => {
          const url = new URL(request.url);

          if (url.pathname.includes(`/annotation/${params.id}`)) {
          }

          const headers = { Authorization: `Bearer ${token}` };
          const annotation = await annotationAPI
          .get(`annotation/${params.id}`, { headers })
          .json();
          return annotation;
        },
        children: [
          {
            path: "results",
            element: <Result />,
          },
          {
            path: "params",
            element: <Param />,
          },
        ],
      },
    ],

  },
]);

createRoot(document.getElementById('root')).render(
<StrictMode>
  
    <ErrorBoundary  
      FallbackComponent={ErrorFallBack}
      onReset={() => window.location.replace("/")}>
      
        <RouterProvider router={router} />
    
    </ErrorBoundary>
  
  </StrictMode>
)
