import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { EdgeDefinition } from "./builder";

export interface CustomEdgeProps extends EdgeProps {
  data: {
    edgeType: string;
    options: EdgeDefinition[];
  };
}

export default function (props: CustomEdgeProps) {
  const { updateEdgeData, deleteElements } = useReactFlow();
  const [path, labelX, labelY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });

  function updateEdgeType(type: string) {
    updateEdgeData(props.id, { edgeType: type });
  }

  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        markerEnd={props.markerEnd}
        style={{ ...props.style, strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          className="pointer-events-auto absolute text-xs"
          style={{
            transform: `translate(-75%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <EdgeTypeSelector
            options={props.data?.options}
            currentEdgeType={props.data.edgeType}
            onSelect={updateEdgeType}
            onDelete={() => deleteElements({ edges: [{ id: props.id }] })}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

function EdgeTypeSelector(props: {
  currentEdgeType: string;
  options: EdgeDefinition[];
  onSelect: (value: string) => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <p className="bg-background">
          {props.currentEdgeType} <ChevronDown className="inline w-4" />
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{props.currentEdgeType}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={props.currentEdgeType}
          onValueChange={props.onSelect}
        >
          {props.options.map((e) => (
            <DropdownMenuRadioItem key={e.label} value={e.label}>
              {e.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={props.onDelete}
          className="text-destructive hover:cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
