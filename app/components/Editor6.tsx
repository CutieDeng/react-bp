"use client";

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import './blueprint3.css';

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div className={`ue5-node ${data.nodeType}`}>
      <div className="node-header">
        <div className="node-title">{data.title}</div>
        <div className="node-subtitle">{data.subtitle}</div>
      </div>
      <div className="node-content">
        <div className="node-inputs">
          {data.inputs.map((input, index) => (
            <div key={`input-${index}`} className="node-port">
              <Handle
                type="target"
                position={Position.Left}
                id={`input-${index}`}
                style={{ background: input.color }}
              />
              <span className="port-label">{input.label}</span>
            </div>
          ))}
        </div>
        <div className="node-outputs">
          {data.outputs.map((output, index) => (
            <div key={`output-${index}`} className="node-port">
              <span className="port-label">{output.label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={`output-${index}`}
                style={{ background: output.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      title: 'On Component Begin Overlap',
      subtitle: '(Box)',
      nodeType: 'event',
      inputs: [],
      outputs: [
        { label: 'Exec', color: '#ff0000' },
        { label: 'Overlapped Component', color: '#4da6ff' },
        { label: 'Other Actor', color: '#4da6ff' },
        { label: 'Other Comp', color: '#4da6ff' },
        { label: 'Other Body Index', color: '#7fff00' },
        { label: 'From Sweep', color: '#ff4d4d' },
        { label: 'Sweep Result', color: '#4da6ff' },
      ],
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 500, y: 100 },
    data: {
      title: 'Print String',
      subtitle: '',
      nodeType: 'function',
      inputs: [
        { label: 'Exec', color: '#ff0000' },
        { label: 'In String', color: '#ffa500' },
        { label: 'Text Color', color: '#ff00ff' },
        { label: 'Duration', color: '#7fff00' },
      ],
      outputs: [
        { label: 'Exec', color: '#ff0000' },
      ],
    },
  },
];

const initialEdges: Edge[] = [];

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

const BlueprintEditor: React.FC<{ width?: string; height?: string }> = ({
  width = '100%',
  height = '600px',
}) => {
  return (
    <div style={{ width, height }} className="blueprint-editor">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
};

export default BlueprintEditor;