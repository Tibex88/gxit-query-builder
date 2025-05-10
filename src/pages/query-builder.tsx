import React from 'react'
import classes  from '../config/style'
import formFields from '../config/form'
import { ReactFlowProvider } from "@xyflow/react";
import { nodeDefinitions, edgeDefinitions } from "../config/schema"
import Icons from '../config/icons';
import { useRunQuery } from '../action';

import '@yisehak-awm/query-builder/dist/index.min.css'
import { QueryBuilder, QueryBuilderContext , Icon} from '@yisehak-awm/query-builder'

export function QB() {

  const { runQuery, busy } = useRunQuery();

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
        <QueryBuilder busy={busy} nodes={[]} edges={[]} onSubmit={runQuery} />
      </QueryBuilderContext.Provider>
    </ReactFlowProvider>
  )
}

