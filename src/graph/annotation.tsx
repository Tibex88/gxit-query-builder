import { StylesheetCSS } from "cytoscape";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import CytoscapeBaseGraph from "./base";
import { useMemo } from "react";
import { Theme, useTheme } from "remix-themes";
import colors from "tailwindcss/colors";

// const LAYOUT = {
//   name: "elk",
//   nodeDimensionsIncludeLabels: true,
//   elk: {
//     algorithm: "layered",
//     "spacing.nodeNodeBetweenLayers": 400,
//     "spacing.componentComponent": 300,
//   },
// };

const LAYOUT = {
  name: "dagre",
  nodeDimensionsIncludeLabels: true,
  rankSep: 300,
  edgeSep: 100,
  rankDir: "LR",
  elk: {
    algorithm: "layered",
    "spacing.nodeNodeBetweenLayers": 200,
    "spacing.nodeNode": 80,
  },
};

export const COLOR_MAPPING = {
  gene: `#EF4444`,
  protein: "#22C55E",
  exon: "#F97316",
  transcript: "#3B82F6",
  snp: "#EAB308",
  sv: "#8B5CF6",
  enhancer: "#EC4899",
  super_enhancer: "#14B8A6",
  promoter: "#6366F1",
  non_coding_rna: "#06B6D4",
  pathway: "#F472B6",
  go: "#22C55E",
  uberon: "#0EA5E9",
  clo: "#22C55E",
  cl: "#EC4899",
  efo: "#14B8A6",
  bto: "#EAB308",
  motif: "#22C55E",
  tad: "#F97316",
};

export default ({ data, onExplainNode, ...otherProps }: any) => {
  // const [theme] = useTheme();

  const STYLE: Stylesheet[] = useMemo(() => {
    return [
      {
        selector: "node",
        style: {
          label: "data(name)",
          "font-family": "monospace",
          "min-zoomed-font-size": 4,
        },
      },
      {
        selector: "edge",
        style: {
          label: "data(label)",
          "font-family": "monospace",
          // "text-outline-color":
            // theme == Theme.DARK ? colors.slate[950] : colors.white,
          "text-outline-width": 5,
          "target-arrow-shape": "chevron",
          "arrow-scale": 2,
          "curve-style": "bezier",
          // "line-color": colors.slate[theme == Theme.DARK ? 600 : 300],
          // "target-arrow-color": colors.slate[theme == Theme.DARK ? 600 : 300],
          // color: theme == Theme.DARK ? colors.white : colors.black,
          "min-zoomed-font-size": 4,
        },
      },
      ...Object.keys(COLOR_MAPPING).map((k) => ({
        selector: `node[type="${k}"]`,
        style: {
          "background-opacity": 0.7,
          "background-color": (COLOR_MAPPING as any)[k],
          color: colors.black,
        },
      })),
      {
        selector: 'node[type="parent"]',
        style: {
          label: "",
          "background-opacity": 0,
          // "border-color": colors.slate[theme == Theme.DARK ? 600 : 300],
          "border-width": 3,
          "border-style": "dashed",
          opacity: 1,
        },
      },
    ];
  }, 
  []
  // [theme]
);

  const ContextMenu = ({
    popupRef,
    selectedNode,
  }: {
    popupRef: React.RefObject<HTMLDivElement>;
    selectedNode: any;
  }) => (
    <div
      ref={popupRef}
      className="absolute rounded-md bg-primary text-xs text-background/65"
    >
      <p className="p-2 font-mono">
        {selectedNode?.data().name || selectedNode?.data().id}
      </p>
      <Button
        onClick={() =>
          onExplainNode(
            `Explain ${selectedNode?.data().type} "${selectedNode?.data().name || selectedNode?.data().id}"`,
          )
        }
      >
        <Sparkles className="me-2 inline h-4 w-4" /> Explain this node
      </Button>
    </div>
  );

  return (
    <>
      <CytoscapeBaseGraph
        elements={data.elements}
        style={STYLE}
        layout={LAYOUT}
        // NodePopup={ContextMenu}
        {...otherProps}
      />
    </>
  );
};
