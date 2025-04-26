import { createContext } from "react";
import { NodeIconsMap } from "./node";
import { NodeClassDefinitionMap, NodeFormFieldsMap } from "./node";
import { EdgeDefinition, NodeDefinition } from "./builder";

interface QueryBuilderData {
  icons?: NodeIconsMap;
  forms?: NodeFormFieldsMap;
  style?: NodeClassDefinitionMap;
  nodeDefinitions: NodeDefinition[];
  edgeDefinitions: EdgeDefinition[];
}

const defaultValues: QueryBuilderData = {
  forms: {},
  icons: {},
  style: {},
  nodeDefinitions: [],
  edgeDefinitions: [],
};

export const QueryBuilderContext =
  createContext<QueryBuilderData>(defaultValues);
