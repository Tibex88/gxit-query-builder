import {  useState } from "react";
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
    status: "PENDING" | "FAILED" | "COMPLETE";
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

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDA4MzE2MiwianRpIjoiZGM5YzlkZDctZGM2NC00MzBiLTgxMmYtYTYwOWEzZmVjNTZmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTc1MDA4MzE2MiwiY3NyZiI6ImRiYTE4OGEzLTkzNGQtNGRmMC05ZWQzLTE2NDJkYzAyY2ZmZCIsImV4cCI6MTc1OTA4MzE2MiwidXNlcl9pZCI6MTEsImVtYWlsIjoidGliZXNvbG9tb243QGdtYWlsLmNvbSJ9.Sm50m91oV7HEkbEWMTJ2sxpYKL3ljBz2o3HAINCw8IQ"

  
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
    </div>
  );
};