import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import {QB} from './pages/query-builder.js'
import { Result } from './pages/result.js'
import { Param } from './pages/param.js'
import { AnnotationC } from './pages/annotation.js'
import { annotationAPI } from './api.js'
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallBack } from "./pages/error-boundary.js"
import "./global.scss";

// const token = "eyJhdXRoU2Vzc2lvbiI6eyJhY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbWNtVnphQ0k2Wm1Gc2MyVXNJbWxoZENJNk1UYzBOamN3TVRreU1pd2lhblJwSWpvaVltRmxPRE15WVRJdE9EVXhNeTAwT0RBMkxUZzBaVFV0TnpJeVlXSXlaR1JrTkRBNElpd2lkSGx3WlNJNkltRmpZMlZ6Y3lJc0luTjFZaUk2TVRFc0ltNWlaaUk2TVRjME5qY3dNVGt5TWl3aVkzTnlaaUk2SWprek16RTBNMlF5TFRneU5qSXROR1k1T0MwNE1qTmhMVFkzTjJNMU5HVXdZalJqTVNJc0ltVjRjQ0k2TVRjMU5UY3dNVGt5TWl3aWRYTmxjbDlwWkNJNk1URXNJbVZ0WVdsc0lqb2lkR2xpWlhOdmJHOXRiMjQzUUdkdFlXbHNMbU52YlNKOS5CNHF…VdE56SXlZV0l5WkdSa05EQTRJaXdpZEhsd1pTSTZJbUZqWTJWemN5SXNJbk4xWWlJNk1URXNJbTVpWmlJNk1UYzBOamN3TVRreU1pd2lZM055WmlJNklqa3pNekUwTTJReUxUZ3lOakl0TkdZNU9DMDRNak5oTFRZM04yTTFOR1V3WWpSak1TSXNJbVY0Y0NJNk1UYzFOVGN3TVRreU1pd2lkWE5sY2w5cFpDSTZNVEVzSW1WdFlXbHNJam9pZEdsaVpYTnZiRzl0YjI0M1FHZHRZV2xzTG1OdmJTSjkuQjRxdFZ0RTlwcnU4MlNWcDl4U2doR1loTURnZFdxQlpScFZPZVlZMWNwcyIsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9LCJzdHJhdGVneSI6InVzZXItcGFzcyIsIl9fZmxhc2hfZXJyb3JfXyI6bnVsbH0%3D.JqrIfmlbs4Ab0HtBWZQvfNcOcW66yjyZL13xjKcP50g"
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjcwNDYwMSwianRpIjoiOWY2NzRjZWQtZDgyNi00ZTFmLTgwNTYtNjEyMDg3NWE0MTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc0NjcwNDYwMSwiY3NyZiI6IjMwMThhYTdjLTBlNDItNDg1MC1hNTMzLTllOGQ5MzQxNGFjYSIsImV4cCI6MTc1NTcwNDYwMSwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.asewhiLTXz32HgRurF-q9MNMaPN3nQjp3y0gp6loAlg"
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

const router = createBrowserRouter([
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
          console.log({url})

          if (url.pathname.includes(`/annotation/${params.id}`)) {
            console.log("includes ," )
            // return redirect(`${url.pathname}/params`); // or /results
          }

          // if (url.pathname === `/annotation/${params.id}`) {
          //   console.log("is true "+ url.pathname)
          //   return redirect(`annotation`);
          // }
          const headers = { Authorization: `Bearer ${token}` };
          const annotation = await annotationAPI
          .get(`annotation/${params.id}`, { headers })
          .json();
          console.log({annotation2:annotation})
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
