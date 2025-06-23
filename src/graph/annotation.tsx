import { StylesheetCSS } from "cytoscape";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import CytoscapeBaseGraph from "./base";
import { useMemo } from "react";
import { Theme, useTheme } from "remix-themes";
import colors from "tailwindcss/colors";
import { ColumnDef, flexRender, Table } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/column-header";

import { Input } from "@/components/ui/input";
import { useDataTable } from "../data-table/index";
// import { sendPrompt } from "../chat/send-prompt";
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
          "text-outline-color": "white",
          theme: colors.white,
          "text-outline-width": 5,
          "target-arrow-shape": "chevron",
          "arrow-scale": 2,
          "curve-style": "bezier",
          "line-color": colors.slate[300],
          "target-arrow-color": colors.slate[300],
          color: colors.black,
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

  // const ContextMenu = ({
  //   popupRef,
  //   selectedNode,
  // }: {
  //   popupRef: React.RefObject<HTMLDivElement>;
  //   selectedNode: any;
  // }) => (
  //   <div
  //     ref={popupRef}
  //     className="absolute rounded-md bg-primary text-xs text-background/65"
  //   >
  //     <p className="p-2 font-mono">
  //       {selectedNode?.data().name || selectedNode?.data().id}
  //     </p>
  //     <Button
  //       onClick={() =>
  //         onExplainNode(
  //           `Explain ${selectedNode?.data().type} "${selectedNode?.data().name || selectedNode?.data().id}"`,
  //         )
  //       }
  //     >
  //       <Sparkles className="me-2 inline h-4 w-4" /> Explain this node
  //     </Button>
  //   </div>
  // );

    const ContextMenu = ({
    popupRef,
    selectedNode,
  }: {
    popupRef: React.RefObject<HTMLDivElement>;
    selectedNode: any;
  }) => {
    const data = selectedNode?.data();
    if (data.source) return <div ref={popupRef}></div>;
    const nodes = useMemo(
      () =>
        data.nodes?.map((n: any, i: number) => ({ serial: i + 1, ...n })) || [],
      [data.nodes],
    );

    const columns: ColumnDef<any>[] = useMemo(() => {
      if (!data.nodes?.length) return [];
      return Object.keys(data.nodes[0])
        .filter((k) => k !== "type")
        .map((k) => ({
          id: k,
          accessorKey: k,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={k} />
          ),
        }));
    }, [selectedNode]);

    const table: Table<{ id: string }> = useDataTable(columns, nodes);

    if (data.nodes?.length) {
      return (
        <div
          ref={popupRef}
          className="absolute z-50 mt-8 rounded-md bg-primary text-background/65"
        >
          {data.nodes?.length > 1 && (
            <>
              <p className="m-4 mb-0 font-mono text-xs">
                {data.name || data.id}
              </p>
              <Input
                placeholder="Search ..."
                className="mb-1 border-0 focus:outline-none focus-visible:ring-0"
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value);
                }}
              />
            </>
          )}
          <table className="w-full border-y text-left text-sm">
            <thead className="border-y">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th className="px-2" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    className="hover:cursor-pointer hover:text-background"
                    // onClick={() => sendPrompt(`Explain ${row.getValue("id")}`)}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-2" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {data.nodes.length == 1 && (
            <Button
              onClick={() =>
                onExplainNode(`Explain ${data.type} "${data.name || data.id}"`)
              }
            >
              <Sparkles className="me-2 inline h-4 w-4" /> Explain this node
            </Button>
          )}
          {data.nodes.length > 1 && (
            <div className="mx-2 flex items-center justify-between">
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ArrowLeft className="me-2 inline" /> Prev{" "}
              </Button>
              <p className="mx-2 text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </p>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next <ArrowRight className="ms-2 inline" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={popupRef}
        className="absolute rounded-md bg-primary text-xs text-background/65"
      >
        <p className="p-2 font-mono">{data.name || data.id}</p>
        <Button
          onClick={() =>
            onExplainNode(`Explain ${data.type} "${data.name || data.id}"`)
          }
        >
          <Sparkles className="me-2 inline h-4 w-4" /> Explain this node
        </Button>
      </div>
    );
  };



  return (
    <>
      <CytoscapeBaseGraph
        elements={data.elements}
        style={STYLE}
        layout={LAYOUT}
        NodePopup={ContextMenu}
        {...otherProps}
      />
    </>
  );
};
