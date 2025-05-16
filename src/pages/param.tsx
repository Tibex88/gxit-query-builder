import { useContext, useMemo } from "react";
import { AnnotationDataContext } from "../context";
// import QueryBuilder from "@/components/query-builder";
import classes  from '../config/style'
import formFields from '../config/form'
import { nodeDefinitions, edgeDefinitions } from "../config/schema"
import Icons from '../config/icons';


import { useRunQuery } from "./../action";
import { Edge, Node, ReactFlowProvider } from "@xyflow/react";
import { QueryBuilder, QueryBuilderContext , Icon} from '@yisehak-awm/query-builder'

import '@yisehak-awm/query-builder/dist/index.min.css'

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
          qb_node_type: n.type,
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
  <ReactFlowProvider>
          <QueryBuilderContext.Provider
        value={{
          style: classes,
          nodeDefinitions,
          edgeDefinitions,
          forms: formFields,
          icons: Icons,
        }}>
    <QueryBuilder
      busy={busy}
      onSubmit={runQuery}
      nodes={nodes}
      edges={edges}
      // This indicate wether the provided query was already run and has results
      // This affects the label of the "Run query" button
      
      previouslyRun={true}
    />
        </QueryBuilderContext.Provider>
    </ReactFlowProvider>
  );
};
