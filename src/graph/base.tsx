import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Download, Minus, Plus } from "lucide-react";
import { popperFactory, PopperInstance } from "./popper";
import nodeHtmlLabel from "cytoscape-node-html-label";
import cytoscapePopper from "cytoscape-popper";
import elk from "cytoscape-elk";
import html2canvas from "html2canvas";
import saver from "file-saver";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import cytoscape, {
  CytoscapeOptions,
  NodeSingular,
  Stylesheet,
} from "cytoscape";
cytoscape.use(cytoscapePopper(popperFactory));
cytoscape.use(nodeHtmlLabel);
cytoscape.use(elk);

interface BaseCytoscapeGraphProps extends CytoscapeOptions {
  filters?: string[];
  style?: Stylesheet[];
  children?: React.ReactNode;
  onRender?: (graph: cytoscape.Core) => void;
  NodePopup?: React.FC<{
    popupRef: React.RefObject<HTMLDivElement>;
    selectedNode: NodeSingular;
  }>;
}

export default function BaseCytoscapeGraph(props: BaseCytoscapeGraphProps) {
  const graph = useRef<cytoscape.Core>();
  const container = useRef<HTMLDivElement>(null);
  const popperRef = useRef<PopperInstance>();
  const popup = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeSingular>();

  useEffect(() => {
    if (props.style) graph.current?.style().append(props.style).update();
  }, [props.style]);

  useEffect(() => {
    graph.current = cytoscape({
      container: container.current,
      elements: props.elements,
      style: [...DEFAULT_STYLE, ...(props.style || [])],
    });
    graph.current.layout(props.layout || DEFAULT_LAYOUT).run();
    graph.current.nodes().on("select", (e) => {
      setSelectedNode(e.target);
    });
    graph.current.nodes().on("unselect", (e) => {
      setSelectedNode(undefined);
    });
    graph.current.nodes().on("position", (e) => {
      popperRef.current?.update();
    });
    graph.current.on("pan zoom resize", () => {
      popperRef.current?.update();
    });
    props.onRender?.(graph.current);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [props.filters]);

  useEffect(() => {
    updatePopup();
  }, [selectedNode]);

  function applyFilters() {
    graph.current?.elements().removeClass("hidden");
    const selector = props.filters
      ?.map((term) => `[type="${term}"], [label="${term}"]`)
      .join(", ");
    if (selector) graph.current?.elements(selector).addClass("hidden");
  }

  function updatePopup() {
    if (selectedNode) {
      popperRef.current = (selectedNode as any).popper({
        content: popup.current!,
      }) as PopperInstance;
      popperRef.current.update();
    }
  }

  function zoomIn() {
    const currentZoom = graph.current?.zoom()!;
    graph.current?.zoom(currentZoom + 0.1);
  }

  function zoomOut() {
    const currentZoom = graph.current?.zoom()!;
    graph.current?.zoom(currentZoom - 0.1);
  }

  function exportImage() {
    html2canvas(container.current!).then((canvas) => {
      saver(canvas.toDataURL(), "graph-image.jpeg");
    });
  }

  function dowloadGraphJSON() {
    var jsonBlob = new Blob([JSON.stringify(graph.current?.json())], {
      type: "application/javascript;charset=utf-8",
    });
    saver(jsonBlob, "graph-data.json");
  }

  return (
    <>
      <div ref={container} className="h-full w-full bg-background"></div>
      {props.NodePopup && selectedNode && (
        <props.NodePopup popupRef={popup} selectedNode={selectedNode} />
      )}
      <div className="absolute bottom-6 left-12 flex items-end">
        <div className="me-4 flex flex-col rounded-full border bg-background/60 p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="link" onClick={zoomIn}>
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom in</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="link" onClick={zoomOut}>
                <Minus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom out</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex rounded-full border bg-background/60 p-1 px-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="me-2"
                size="icon"
                variant="link"
                onClick={exportImage}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save graph as image</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="link" onClick={dowloadGraphJSON}>
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save graph JSON</TooltipContent>
          </Tooltip>
        </div>
        {props.children}
      </div>
    </>
  );
}

const DEFAULT_LAYOUT = { name: "circle" };
const DEFAULT_STYLE: Stylesheet[] = [
  {
    selector: ".hidden",
    css: {
      display: "none",
    },
  },
];
