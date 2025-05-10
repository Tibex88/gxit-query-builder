import cytoscape from "cytoscape";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CytoscapeBaseGraph from "./base";

const STYLE: cytoscape.Stylesheet[] = [
  {
    selector: "edge",
    style: {
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      "line-color": "#000",
      "target-arrow-color": "#000",
      "arrow-scale": 2,
      width: 2,
    },
  },
  {
    selector: "node",
    style: {
      shape: "round-rectangle",
      label: "data(label)",
      color: "#001929",
      width: (n: any) => n.data("label").length * 12,
      "text-valign": "center",
      "text-halign": "center",
      "padding-right": "30px",
      "padding-left": "30px",
      "background-color": "#bce3ff",
      "font-size": 20,
      "border-width": 1,
      "border-color": "#5CC0FF",
      "border-style": "solid",
      "font-family": "monospace",
    },
  },
  {
    selector: 'node[label*=":-"]',
    style: {
      "background-color": "#e4ccff",
      "border-color": "#BC85FF",
      color: "#1C003D",
    },
  },
  {
    selector: 'node[label="and"]',
    style: {
      shape: "diamond",
      "background-color": "#ffcd2a",
      "border-color": "#ffcd2a",
      color: "#291F00",
    },
  },
  {
    selector: 'node[label="true"]',
    style: {
      shape: "ellipse",
      "background-color": "#9ce2b0",
      "border-color": "#3FCA6B",
      color: "#092010",
      height: "50px",
      width: "50px",
    },
  },
  {
    selector: 'node[label="false"]',
    style: {
      shape: "ellipse",
      "background-color": "#ffb8b3",
      "border-color": "#ff9790",
      color: "#3D0300",
      height: "50px",
      width: "50px",
    },
  },
  {
    selector: ":selected",
    style: {
      "border-color": "#0f172a",
    },
  },
];

export default ({ elements, onExplainNode }: any) => {
  const ContextMenu = ({
    ref,
    selectedNode,
  }: {
    ref: React.RefObject<HTMLDivElement>;
    selectedNode: any;
  }) => (
    <div
      ref={ref}
      className="absolute rounded-md bg-primary text-xs text-slate-400"
    >
      <p className="p-2 font-mono">{selectedNode?.data().label}</p>
      <Button onClick={() => onExplainNode(selectedNode?.data().label)}>
        <Sparkles className="me-2 inline h-4 w-4" /> Explain this node
      </Button>
      <Separator className="inline" orientation="vertical" />
      <Button>
        <ChevronsUpDown className="me-2 inline h-4 w-4" /> Expand
      </Button>
    </div>
  );

  return (
    <CytoscapeBaseGraph
      graphProps={{
        elements,
        style: STYLE,
        layout: {
          name: "dagre",
        },
      }}
      NodeContextMenu={ContextMenu}
    />
  );
};
