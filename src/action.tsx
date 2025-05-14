import { annotationAPI } from "./api";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./context";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {Button} from '@/components/ui/button'

export interface Annotation {
    annotation_id: string;
    title: string;
    summary: string;
    node_count: number;
    edge_count: number;
    node_count_by_label: { label: string; count: number }[];
    edge_count_by_label: { label: string; count: number }[];
    nodes: { data: { id: string; type: string; name: string } }[];
    edges: {
      data: { id: string; label: string; source: string; target: string };
    }[];
    request: AnnotationRequest;
  }

  export interface AnnotationRequest {
    nodes: {
      node_id: string;
      id: string;
      type: string;
      properties: {
        [key: string]: string;
      };
    }[];
    predicates: {
      type: string;
      source: string;
      target: string;
    }[];
  }

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0NjcwNDYwMSwianRpIjoiOWY2NzRjZWQtZDgyNi00ZTFmLTgwNTYtNjEyMDg3NWE0MTExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc0NjcwNDYwMSwiY3NyZiI6IjMwMThhYTdjLTBlNDItNDg1MC1hNTMzLTllOGQ5MzQxNGFjYSIsImV4cCI6MTc1NTcwNDYwMSwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.asewhiLTXz32HgRurF-q9MNMaPN3nQjp3y0gp6loAlg"

export function useRunQuery (id?: string) {
    const navigate = useNavigate();
    const user = useContext(UserDataContext);
    const [busy, setBusy] = useState<boolean>(false);
    // const { toast } = useToast();
    for (const char of token) {
      if (char.charCodeAt(0) > 255) {
        console.log('Non-ISO-8859-1 character found:', char);
      }
    }
    const runQuery = async (graph: any) => {
      setBusy(true);
      const requestJSON = {
        requests: {
          nodes: graph.nodes.map((n: any) => {
            return {
              node_id: "a" + n.id.replaceAll("-", ""),
              id: n.data.id || "",
              type: n.data.type,
              properties: Object.keys(n.data)
                .filter(
                  (k) => !["id", "type", "animate"].includes(k) && n.data[k],
                )
                .reduce((acc, k) => ({ ...acc, [k]: n.data[k] }), {}),
            };
          }),
          predicates: graph.edges.map((e: any) => {
            return {
              id: e.id,
              type: e.data.edgeType,
              source: "a" + e.source.replaceAll("-", ""),
              target: "a" + e.target.replaceAll("-", ""),
            };
          }),
        },
      };
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      try {
        console.log({headers})
        const { annotation_id }: Annotation = await annotationAPI
          .post("query?limit=100", {
            headers,
            body: JSON.stringify(requestJSON),
          })
          .json();
          console.log({annotation_id})
          // annotation_id = `681f579bf8abe0ad25fa5baf`
          navigate(`annotation/${annotation_id}/results`);
      } catch (e: any) {
        console.error(e);
        alert(`${e.response?.statusText}: ${e.response?.data}`);
        // toast({
        //   title: e.response.statusText,
        //   variant: "destructive",
        // });
      } finally {
        setBusy(false);
      }
    };
  
    return { runQuery, busy };
  };
  
  export const AnnotationContextMenu = ({ annotation }: { annotation: any }) => {
  const [deleteDialogOpened, toggleDeleteDialog] = useState(false);
  const [renameDialogOpened, toggleRenameDialog] = useState(false);
  const [menuOpened, toggleMenuDialog] = useState(false);

  return (
    <div>
      <DropdownMenu open={menuOpened} onOpenChange={toggleMenuDialog}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="">
            <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom">
          <DropdownMenuItem
            onClick={() => {
              toggleMenuDialog(false);
              toggleRenameDialog(true);
            }}
          >
            <Pencil size={16} className="me-2 inline" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              toggleMenuDialog(false);
              toggleDeleteDialog(true);
            }}
          >
            <Trash size={16} className="me-2 inline" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <DeleteConfirmationDialog
        open={deleteDialogOpened}
        onOpenChange={toggleDeleteDialog}
        annotation={annotation}
      /> */}
      {/* <RenameDialog
        open={renameDialogOpened}
        onOpenChange={toggleRenameDialog}
        annotation={annotation}
      /> */}
    </div>
  );
};