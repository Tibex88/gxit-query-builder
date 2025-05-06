import classes  from './config/style'
import formFields from './config/form'
import { ReactFlowProvider } from "@xyflow/react";
import { nodeDefinitions, edgeDefinitions } from "./config/schema"
import Icons from './config/icons';
import '@yisehak-awm/query-builder/dist/index.min.css'
import { QueryBuilder, QueryBuilderContext , Icon} from '@yisehak-awm/query-builder'

function App() {

  return (
    <ReactFlowProvider>
      <QueryBuilderContext.Provider
        value={{
          style: classes,
          nodeDefinitions,
          edgeDefinitions,
          forms: formFields,
          icons: Icons,
        }}
      >
        <QueryBuilder nodes={[]} edges={[]} onSubmit={() => {}} />
      </QueryBuilderContext.Provider>
    </ReactFlowProvider>
  )
}

export default App
