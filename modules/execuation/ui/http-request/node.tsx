"use client";

import { Method } from "@/types";
import { Node, NodeProps } from "@xyflow/react";
import * as React from "react";
import { BaseExecuationNode } from "../base-execuation-node";
import { GlobeIcon } from "lucide-react";

interface HttpRequestNodeData {
  endpoint?: string;
  body?: string;
  [key: string]: unknown;
  method?: Method;
}

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = React.memo(function (props: NodeProps<HttpRequestNodeType>) {
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData?.endpoint ? `${nodeData.method || "GET"}: ${nodeData.endpoint}` : "Not configured";

  return (
    <>
      <BaseExecuationNode
        {...props}
        id={props.id}
        name="HTTP Request"
        icon={GlobeIcon}
        descritpion={description}
        onSetting={() => {}}
        onDubbleClick={() => {}}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
