import React, { useEffect } from 'react'
import classes  from '../config/style'
import formFields from '../config/form'
import { ReactFlowProvider } from "@xyflow/react";
import { nodeDefinitions, edgeDefinitions } from "../config/schema"
import Icons from '../config/icons';
import { useRunQuery } from '../useRunQuery';

import '@yisehak-awm/query-builder/dist/index.min.css'
import { QueryBuilder, QueryBuilderContext , Icon} from '@yisehak-awm/query-builder'
import { Outlet, useNavigation } from 'react-router-dom';

export function QB() {

  useEffect(() => {
    const segments = location.pathname.split('/'); // ['', 'interactivetool', 'ep', 'uid', 'token', ...]
    const basePath = `/${segments.slice(1, 5).join('/')}`; // /interactivetool/ep/:uid/:token

}, []);

  const navigation = useNavigation()
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
            <>
        {navigation.state === "loading" && (
            <div className="glowing navigation-indicator absolute left-0 top-0 h-1 w-4/5 bg-foreground z-50"></div>
        )}
            <QueryBuilder busy={busy} nodes={[]} edges={[]} onSubmit={runQuery} />
          </>
          ) : (
            <Outlet />
          )}
      </QueryBuilderContext.Provider>
    </ReactFlowProvider>
  )
}

