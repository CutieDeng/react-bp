// app/components/BlueprintEditor.tsx
"use client";

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Edge,
  Node,
  NodeProps,
  Handle,
  Position,
  EdgeProps,
  Connection,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';


// Custom Node component
const CustomNode = ({ data, isConnectable }: NodeProps) => {
    return (
      <div className={`custom-node ${data.nodeType}`}>
        <div className="title" style={{ textAlign: data.titleAlign || 'center' }}>
          {data.title}
        </div>
        <div className="content">
          <div className="inputs">
            {data.inputs.map((input, index) => (
              <Handle
                key={`input-${index}`}
                type="target"
                position={Position.Left}
                id={`input-${index}`}
                style={{ background: input.color }}
                isConnectable={isConnectable}
              />
            ))}
          </div>
          <div className="label">{data.label}</div>
          <div className="outputs">
            {data.outputs.map((output, index) => (
              <Handle
                key={`output-${index}`}
                type="source"
                position={Position.Right}
                id={`output-${index}`}
                style={{ background: output.color }}
                isConnectable={isConnectable}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Custom Edge component
  const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
  }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  
    return (
      <>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        <text>
          <textPath href={`#${id}`} style={{ fontSize: 12 }} startOffset="50%" textAnchor="middle">
            {data.label}
          </textPath>
        </text>
      </>
    );
  };

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const initialNodes: Node[] = [
  // ... your initial nodes
];

const initialEdges: Edge[] = [
  // ... your initial edges
];

const Flow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { getNode } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      // ... connection logic remains the same
    },
    [setEdges, getNode]
  );

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      // ... double-click logic remains the same
    },
    [setNodes, setEdges]
  );

  const onElementClick = useCallback(
    (event, element) => {
      // ... click logic remains the same
    },
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeDoubleClick={onEdgeDoubleClick}
      onEdgeClick={onElementClick}
      onNodeClick={onElementClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

const BlueprintEditor: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
};

export default BlueprintEditor;