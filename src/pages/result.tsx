import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Bar from "../graph/bar.client";
// import Chat, { ChatContext } from "~/components/chat";
import { AnnotationDataContext } from "./../context";
import { useLocation, useNavigate } from "react-router-dom"
// import { useLocation, useNavigate } from "@remix-run/react";
import { AlertTriangle, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnotationResultGraph, {
  COLOR_MAPPING,
} from "../graph/annotation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Progress from "../graph/progress";

export function Result () {
  const [cont, setCont] = useState<HTMLElement | null>(null);
  const [filters, setFilteredTerms] = useState<string[]>([]);
  const annotation = useContext(AnnotationDataContext);
  // const { sendPrompt } = useContext(ChatContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state?.reload) navigate(".", { state: { reload: false } });
    console.log({annotation})
    // writeToOutput(annotation.result)
    // writeToOutput({"key":"value"})
  }, []);


  useEffect(() => {
    if (window) setCont(document.getElementById("cont"));
  }, []);

  const totalNonParentNodeCount = useMemo(
    () =>{
      annotation?.request?.nodes.filter((n: any) => n.type !== "parent").length ||
      0},
    [annotation],
  );

  const onFilterChange = useCallback(
    (item: string) =>
      setFilteredTerms((items) => {
      console.log({items})
        return items.includes(item)
          ? items.filter((i) => i !== item)
          : [...items, item];
      }),
    [],
  );

  const onExplainNode = useCallback((n: string) => 
    // sendPrompt(n)
  console.log("send prompt")
  , []
  );

  if (typeof window === "undefined") return <></>;

  // if we are reloading the page re-fetching the result, we do not want the previous result
  // to show up first. So we return an empty page as we load the result
  if (location?.state?.reload) return <></>;

  if (!annotation) return <></>;

  if (annotation.status === "PENDING" && !annotation.nodes) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>
          <h2 className="mb-4">Generating annotation result ...</h2>
          <Progress />
        </div>
      </div>
    );
  }

  if (annotation.status === "FAILED" && !annotation.nodes) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-destructive">
          <AlertTriangle className="me-4 inline" /> Result could not be
          generated.
        </p>
      </div>
    );
  }
  if (!annotation.nodes.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-1/3 flex-col items-center">
          {/* <img src={empty} className="h-72 w-72 dark:invert-[0.95]" /> */}
          <h2 className="mb-4 text-xl font-bold text-foreground/70">
            No matching results
          </h2>
          <p className="mb-8 text-center text-foreground/50">
            Your query did not return any matching results. Please modify the
            query and re-run it.
          </p>
        </div>
      </div>
    );
  }


  return (
    <>
      <div id="cont" className="absolute left-0 top-0 h-full w-full"></div>
      <AnnotationResultGraph
        data={{
          elements: { nodes: annotation.nodes, edges: annotation.edges },
        }}
        onExplainNode={onExplainNode}
        filters={filters}
      >
        {/* <ResultSummary
          wrapper={cont}
          summary={annotation.summary}
          nodeTypeCounts={annotation?.node_count_by_label}
          edgeTypeCounts={annotation?.edge_count_by_label}
        /> */}
      </AnnotationResultGraph>
      {/* <Legend
        filters={filters}
        onFilterToggle={onFilterChange}
        nodeTypeCounts={annotation.node_count_by_label}
        edgeTypeCounts={annotation.edge_count_by_label}
        totalEdgeCount={annotation.edge_count}
        totalNodeCount={annotation.node_count}
        totalNonParentNodeCount={totalNonParentNodeCount}
      />
      {/* {annotation && <Chat />} */}
    </>
  );
};

interface LegendProps {
  filters: string[];
  onFilterToggle: (filter: string) => void;
  nodeTypeCounts: { label: string; count: number }[];
  edgeTypeCounts: { label: string; count: number }[];
  totalEdgeCount: number;
  totalNodeCount: number;
  totalNonParentNodeCount: number;
}

function Legend(props: LegendProps) {
  const percentageOfDisplayedNodes =
    (props.totalNonParentNodeCount * 100) / props.totalNodeCount;

  return (
    <div className="absolute right-4 top-4">
      {percentageOfDisplayedNodes < 100 && (
        <p className="mb-4 max-w-64 text-sm text-orange-600">
          <AlertTriangle size={16} className="me-1 inline" /> Showing{" "}
          {percentageOfDisplayedNodes.toFixed(2) + "%"} of nodes. The full
          result can be downloaded.
        </p>
      )}
      <div className="rounded border bg-background/75 p-4 pt-2">
        <div className="mb-1 flex w-full justify-center">
          <div className="h-2 w-1/2 rounded-xl bg-border"></div>
        </div>
        <Accordion
          type="multiple"
          className="min-w-36"
          defaultValue={["nodes", "edges"]}
        >
          <AccordionItem value="nodes" className="border-0 p-0">
            <AccordionTrigger>
              <span className="font-mono text-xs font-bold">
                Nodes ({props.totalNodeCount})
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <ul>
                {props.nodeTypeCounts.map((n: any) => (
                  <li
                    key={n.label}
                    className={`mb-1 flex select-none items-center text-sm hover:cursor-pointer ${props.filters.includes(n.label) && "line-through opacity-50"}`}
                    onClick={() => props.onFilterToggle(n.label)}
                  >
                    <div
                      className="me-1 h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          COLOR_MAPPING[n.label as keyof typeof COLOR_MAPPING],
                      }}
                    ></div>{" "}
                    {n.label} ({n.count})
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="edges" className="border-0 p-0">
            <AccordionTrigger>
              <span className="font-mono text-xs font-bold">
                Edges ({props.totalEdgeCount})
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <ul>
                {props.edgeTypeCounts.map((e: any) => (
                  <li
                    key={e.label}
                    className={`mb-1 flex select-none items-center text-sm hover:cursor-pointer ${props.filters.includes(e.label) && "line-through opacity-50"}`}
                    onClick={() => props.onFilterToggle(e.label)}
                  >
                    <div className="me-1 h-3 w-3 rounded-full bg-border"></div>{" "}
                    {e.label} ({e.count})
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

interface ResultSummaryProps {
  wrapper?: HTMLElement | null;
  summary: string;
  nodeTypeCounts: { label: string; count: number }[];
  edgeTypeCounts: { label: string; count: number }[];
}

function ResultSummary(props: ResultSummaryProps) {
  const [summaryShown, setShowSummary] = useState(false);

  return (
    <Sheet open={summaryShown} onOpenChange={setShowSummary}>
      <SheetTrigger asChild>
        <div className="ms-4 flex rounded-full border bg-background/60 p-1 px-6">
          <Tooltip>
            <TooltipTrigger className="p-0" asChild>
              <Button size="icon" variant="link">
                <BookOpenText className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Graph description</TooltipContent>
          </Tooltip>
        </div>
      </SheetTrigger>
      <SheetContent
        container={props.wrapper}
        side="left"
        className="w-3/4 overflow-y-auto px-12 pb-12"
      >
        <SheetHeader>
          <SheetTitle className="mb-4">Summary</SheetTitle>
        </SheetHeader>
        <p className="mb-8">{props.summary}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <h2 className="mb-4 font-bold">Node count</h2>
            <Bar
              data={props.nodeTypeCounts.map((a) => a.count)}
              categories={props.nodeTypeCounts.map((a) => a.label)}
            />
          </div>
          <div>
            <h2 className="mb-4 font-bold">Edge count</h2>
            <Bar
              data={props.edgeTypeCounts.map((a) => a.count)}
              categories={props.edgeTypeCounts.map((a) => a.label)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
