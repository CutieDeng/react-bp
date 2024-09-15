"use client";

import React, { useState, useCallback, useMemo } from 'react';
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
  MarkerType,
  EdgeProps,
  Connection,
  useReactFlow
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
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      title: 'NAND',
      titleAlign: 'right',
      label: 'NAND Gate',
      nodeType: 'logic',
      inputs: [{ color: '#ff0000' }, { color: '#ff0000' }],
      outputs: [{ color: '#00ff00' }],
    },
  },
  // ... more nodes
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'custom', data: { label: 'Connection' } },
];

const BlueprintEditor: React.FC = () => {
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
      // Check if the connection is valid (matching types)
      const sourceNode = getNode(params.source);
      const targetNode = getNode(params.target);
      if (sourceNode && targetNode) {
        const sourceOutput = sourceNode.data.outputs[parseInt(params.sourceHandle.split('-')[1])];
        const targetInput = targetNode.data.inputs[parseInt(params.targetHandle.split('-')[1])];
        if (sourceOutput.color === targetInput.color) {
          setEdges((eds) => addEdge({ ...params, type: 'custom', data: { label: 'Connection' } }, eds));
        } else {
          alert('Connection types do not match!');
        }
      }
    },
    [setEdges, getNode]
  );

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      const newNode = {
        id: `adjustment-${edge.id}`,
        type: 'custom',
        position: { x: (edge.sourceX + edge.targetX) / 2, y: (edge.sourceY + edge.targetY) / 2 },
        data: { label: 'Adjust', inputs: [{ color: '#888' }], outputs: [{ color: '#888' }] },
      };
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds.filter((e) => e.id !== edge.id),
        { id: `${edge.id}-1`, source: edge.source, target: newNode.id, type: 'custom' },
        { id: `${edge.id}-2`, source: newNode.id, target: edge.target, type: 'custom' },
      ]);
    },
    [setNodes, setEdges]
  );

  const onElementClick = useCallback(
    (event, element) => {
      if (event.shiftKey) {
        if (element.source) {
          // It's an edge
          setEdges((eds) => eds.filter((e) => e.id !== element.id));
        } else {
          // It's a node
          setEdges((eds) => eds.filter((e) => e.source !== element.id && e.target !== element.id));
        }
      }
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '500px' }}>
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
    </div>
  );
};

export default BlueprintEditor;