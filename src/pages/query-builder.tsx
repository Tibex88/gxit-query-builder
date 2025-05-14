import React from 'react'
import classes  from '../config/style'
import formFields from '../config/form'
import { ReactFlowProvider } from "@xyflow/react";
import { nodeDefinitions, edgeDefinitions } from "../config/schema"
import Icons from '../config/icons';
import { useRunQuery } from '../action';

import '@yisehak-awm/query-builder/dist/index.min.css'
import { QueryBuilder, QueryBuilderContext , Icon} from '@yisehak-awm/query-builder'
import { Outlet } from 'react-router-dom';

export function QB() {

  const { runQuery, busy } = useRunQuery();
  const isRootPath = !location.pathname.includes("/annotation/");

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
        {isRootPath ? (
          <QueryBuilder busy={busy} nodes={[]} edges={[]} onSubmit={runQuery} />
        ) : (
          <Outlet />
        )}
      </QueryBuilderContext.Provider>
    </ReactFlowProvider>
  )
}

