import { useContext, useMemo } from "react";
import { AnnotationDataContext } from "../context";
// import QueryBuilder from "@/components/query-builder";
import { QueryBuilder } from "../builder";
import { useRunQuery } from "./../action";
import { Edge, Node } from "@xyflow/react";

export function Param () {
  const annotation = useContext(AnnotationDataContext);
  const { runQuery, busy } = useRunQuery(annotation?.annotation_id);

  const nodes: Node[] = useMemo(() => {
    return (
      annotation?.request.nodes.map((n) => ({
        id: n.node_id,
        type: "custom",
        data: {
          id: n.id,
          type: n.type,
          ...n.properties,
        },
        position: { x: 0, y: 0 },
      })) || []
    );
  }, [annotation]);

  const edges: Edge[] = useMemo(() => {
    return (
      annotation?.request.predicates.map((e) => ({
        id: e.source + e.type + e.target,
        type: "custom",
        source: e.source,
        target: e.target,
        data: {
          edgeType: e.type,
          options: [],
        },
      })) || []
    );
  }, [annotation]);

  if (typeof window == "undefined") return <></>;

  return (
    <QueryBuilder
      busy={busy}
      onSubmit={runQuery}
      nodes={nodes}
      edges={edges}
      // This indicate wether the provided query was already run and has results
      // This affects the label of the "Run query" button
      
      previouslyRun={true}
    />
  );
};
