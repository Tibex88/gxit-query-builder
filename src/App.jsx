import { QueryBuilder, QueryBuilderContext , Icon} from '@yisehak-awm/query-builder'
import classes  from './config/style'
import { nodeDefinitions, edgeDefinitions } from "./config/schema"
import formFields from './config/form'
import { ReactFlowProvider } from "@xyflow/react";
import '@yisehak-awm/query-builder/dist/index.min.css'


function App() {

  return (
    // <div>
    <ReactFlowProvider>
      <QueryBuilderContext.Provider
        value={{
          style: classes,
          nodeDefinitions,
          edgeDefinitions,
          forms: formFields,
          icons: Icon,
        }}
      >
        <QueryBuilder nodes={[]} edges={[]} onSubmit={() => {}} />
      </QueryBuilderContext.Provider>
    </ReactFlowProvider>
    // </div>
  )
}

export default App
