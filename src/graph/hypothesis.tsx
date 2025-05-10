import { useMemo } from "react";
import { Core, NodeDefinition, EdgeDefinition, Stylesheet } from "cytoscape";
import { Button } from "@/components/ui/button";
import { LibraryBig, Sparkles } from "lucide-react";
import CytoscapeBaseGraph from "./base";
import colors from "tailwindcss/colors";
import { useTheme, Theme } from "remix-themes";
import { useNavigate } from "@remix-run/react";

const LAYOUT = {
  name: "elk",
  elk: {
    algorithm: "layered",
    "elk.direction": "RIGHT",
    "elk.alignment": "RIGHT",
    "nodePlacement.strategy": "BRANDES_KOEPF",
    "spacing.nodeNode": 400,
    "spacing.nodeNodeBetweenLayers": 300,
    "wrapping.strategy": "SINGLE_EDGE",
  },
};

export default ({ p, graph, onExplainNode, causalGene }: any) => {
  const [theme] = useTheme();
  const navigate = useNavigate();

  const STYLE: Stylesheet[] = useMemo(() => {
    return [
      {
        selector: "edge",
        style: {
          "target-arrow-shape": "chevron",
          "arrow-scale": 2,
          "curve-style": "bezier",
          "line-color": colors.slate[theme == Theme.DARK ? 600 : 300],
          "target-arrow-color": colors.slate[theme == Theme.DARK ? 600 : 300],
          width: 2,
          label: "data(label)",
          "text-outline-color":
            theme == Theme.DARK ? colors.slate[950] : colors.white,
          "text-outline-width": 10,
          "taxi-direction": "vertical",
          "font-family": "monospace",
          "font-size": "10px",
          color: theme == Theme.DARK ? colors.white : colors.black,
        },
      },
      {
        selector: "node",
        style: {
          shape: "round-rectangle",
          label: "data(longestText)",
          width: "label",
          "text-valign": "center",
          "text-halign": "center",
          "padding-right": "30px",
          "padding-left": "30px",
          "background-color": colors.sky[300],
          "border-width": 1,
          "border-color": "#5CC0FF",
          "border-style": "solid",
          "font-family": "monospace",
          "font-size": "12px",
          "text-opacity": 0,
          "background-opacity": 0.3,
        },
      },

      {
        selector: 'node[label*="=>"]',
        style: {
          "background-color": "#e4ccff",
          "border-color": "#BC85FF",
          color: "#1C003D",
        },
      },
      {
        selector: 'node[type="tad"]',
        style: {
          "background-color": colors.red[700],
          "border-color": "#E6AA68",
        },
      },
      {
        selector: 'node[type="gene"]',
        style: {
          "background-color": colors.green[300],
          "border-color": colors.green[500],
        },
      },
      {
        selector: 'node[type="parent"]',
        style: {
          label: "",
          "background-opacity": 0,
          "border-color": colors.slate[300],
          "border-width": 1,
          "border-style": "dashed",
          opacity: 1,
        },
      },
      {
        selector: 'node[type="phenotype"]',
        style: {
          "background-color": colors.purple[300],
          "border-color": colors.purple[500],
        },
      },
      {
        selector: 'node[type="go"]',
        style: {
          "background-color": colors.yellow[300],
          "border-color": colors.yellow[500],
        },
      },
      {
        selector: 'node[type="tfbs"]',
        style: {
          "background-color": colors.indigo[300],
          "border-color": colors.indigo[500],
        },
      },
      {
        selector: 'node[type="super_enhancer"]',
        style: {
          "background-color": colors.orange[300],
          "border-color": colors.orange[500],
        },
      },
      {
        selector: 'node[label="false"]',
        style: {
          shape: "ellipse",
          "background-color": "#ffb8b3",
          "border-color": "#ff9790",
          color: "#3D0300",
        },
      },
      {
        selector: "node[bold='true']",
        style: {
          "background-opacity": 0.4,
        },
      },
    ];
  }, [theme]);

  const elements = useMemo(() => {
    if (!graph) return;

    const elements = {
      nodes: graph.nodes.map((n: any) => ({
        data: {
          ...n,
          type: n.type?.toLowerCase(),
          bold:
            n.type?.toLowerCase() === "gene" && n.name === causalGene
              ? "true"
              : "false",
          longestText: [n.id, n.type, n.name || " "].sort(
            (a, b) => b.length - a.length,
          )[0],
        },
      })),
      edges: graph.edges.map((e: any) => ({
        data: {
          ...e,
        },
      })),
    };

    // add a parent node for coexpressed nodes
    elements.nodes.push({
      data: {
        id: "parent",
        type: "parent",
      },
    });

    const genes = elements.edges.reduce(
      (acc: EdgeDefinition[], e: EdgeDefinition) => {
        if (e.data.label === "coexpressed_with") {
          return [...acc, e.data.target];
        }
        return acc;
      },
      [],
    );

    elements.nodes = elements.nodes.map((n: NodeDefinition) => {
      return {
        ...n,
        data: {
          ...n.data,
          parent: genes.includes(n.data.id) ? "parent" : null,
        },
      };
    });

    elements.edges = elements.edges.map((e: EdgeDefinition) => {
      if (e.data.label === "coexpressed_with") {
        return { ...e, data: { ...e.data, target: "parent" } };
      }
      if (e.data.label === "enriched_in") {
        return { ...e, data: { ...e.data, source: "parent" } };
      }
      return e;
    });

    elements.edges = elements.edges.map((e: EdgeDefinition) => {
      if (e.data.label === "coexpressed_with") {
        return { ...e, data: { ...e.data, target: "parent" } };
      }
      if (e.data.label === "enriched_in") {
        return { ...e, data: { ...e.data, source: "parent" } };
      }
      return e;
    });

    elements.edges = elements.edges.reduce(
      (acc: EdgeDefinition[], e: EdgeDefinition) => {
        if (
          e.data.label === "coexpressed_with" &&
          acc.find((a) => a.data.label === "coexpressed_with")
        ) {
          return acc;
        }
        if (
          e.data.label === "enriched_in" &&
          acc.find((a) => a.data.label === "enriched_in")
        ) {
          return acc;
        }
        return [...acc, e];
      },
      [],
    );

    elements.edges = elements.edges.map((e: EdgeDefinition) =>
      e.data.label === "enriched_in"
        ? {
            ...e,
            data: { ...e.data, label: `${e.data.label} (p-value: ${p})` },
          }
        : e,
    );

    return elements;
  }, [graph]);

  function renderCustomNodeLabels(graph: Core) {
    if (graph) {
      (graph as any).nodeHtmlLabel([
        {
          query: "node",
          halign: "center",
          valign: "center",
          halignBox: "center",
          valignBox: "center",
          cssClass: "",
          tpl(data: any) {
            if (data.type === "parent") return ``;
            return `<div class="node_wrapper ${data.type}">
                <p class="font-bold">${data.type.toUpperCase()}</p>
                <p>${data.name || " "}</p>
                <p class="${data.type}" class="id">${["go", "gene", "phenotype"].includes(data.type) ? data.id.toUpperCase() : data.id}</p>
              <div>`;
          },
        },
      ]);
    }
  }

  const ContextMenu = ({
    popupRef,
    selectedNode,
  }: {
    popupRef: React.RefObject<HTMLDivElement>;
    selectedNode: any;
  }) => {
    if (selectedNode?.data().id === "parent") return null;
    return (
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
              `Explain ${selectedNode?.data().type || "node"} ${selectedNode?.data().name || selectedNode?.data().id}`,
            )
          }
        >
          <Sparkles className="me-1 inline h-4 w-4" /> Explain this node
        </Button>
        <Button
          onClick={() =>
            navigate(
              `/annotation/query-builder?type=${selectedNode?.data().type}&id=${selectedNode?.data().id}`,
            )
          }
        >
          <LibraryBig className="me-1 inline h-4 w-4" /> Annotate
        </Button>
      </div>
    );
  };

  return (
    <>
      <CytoscapeBaseGraph
        elements={elements}
        layout={LAYOUT}
        style={STYLE}
        NodePopup={ContextMenu}
        onRender={renderCustomNodeLabels}
      />
    </>
  );
};
