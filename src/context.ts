import { createContext } from "react";
import { Annotation } from "./action";
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

interface User {
  email: string;
  token: string;
  access_token: string;
  refresh_token: string;
}

export const AnnotationDataContext = createContext<Annotation | null>(null);
export const UserDataContext = createContext<User | null>(null);
