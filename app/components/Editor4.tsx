// app/components/BlueprintEditor.tsx
"use client";

import React, { useState, useCallback, useRef } from 'react';
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
  Connection,
  useReactFlow,
  ReactFlowProvider,
  Panel
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

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      title: 'NAND',
      titleAlign: 'right',
      label: 'NAND Gate',
      nodeType: 'logic',
      inputs: [{ color: '#ff0000' }, { color: '#ff0000' }],
      outputs: [{ color: '#00ff00' }],
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: {
      title: 'OR',
      titleAlign: 'center',
      label: 'OR Gate',
      nodeType: 'logic',
      inputs: [{ color: '#ff0000' }, { color: '#ff0000' }],
      outputs: [{ color: '#00ff00' }],
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', sourceHandle: 'output-0', targetHandle: 'input-0' },
];

const Flow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedElements, setSelectedElements] = useState<(Node | Edge)[]>([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { getNode, project } = useReactFlow();

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
      const sourceNode = getNode(params.source);
      const targetNode = getNode(params.target);
      if (sourceNode && targetNode) {
        const sourceOutput = sourceNode.data.outputs[parseInt(params.sourceHandle.split('-')[1])];
        const targetInput = targetNode.data.inputs[parseInt(params.targetHandle.split('-')[1])];
        if (sourceOutput.color === targetInput.color) {
          setEdges((eds) => addEdge(params, eds));
        } else {
          alert('Connection types do not match!');
        }
      }
    },
    [setEdges, getNode]
  );

  const onSelectionChange = useCallback(
    (elements) => setSelectedElements(elements),
    [setSelectedElements]
  );

  const onContextMenu = useCallback(
    (event: React.MouseEvent, node: Node | null) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const rect = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });

      const nodeTypes = [
        { type: 'NAND', inputs: 2, outputs: 1 },
        { type: 'OR', inputs: 2, outputs: 1 },
        { type: 'AND', inputs: 2, outputs: 1 },
        { type: 'NOT', inputs: 1, outputs: 1 },
      ];

      const menu = document.createElement('div');
      menu.className = 'context-menu';
      menu.style.position = 'absolute';
      menu.style.left = `${event.clientX}px`;
      menu.style.top = `${event.clientY}px`;
      menu.style.backgroundColor = 'white';
      menu.style.border = '1px solid black';
      menu.style.padding = '5px';

      nodeTypes.forEach((nodeType) => {
        const item = document.createElement('div');
        item.innerText = `Add ${nodeType.type}`;
        item.onclick = () => {
          const newNode: Node = {
            id: `${nodeType.type}-${Date.now()}`,
            type: 'custom',
            position,
            data: {
              title: nodeType.type,
              titleAlign: 'center',
              label: `${nodeType.type} Gate`,
              nodeType: 'logic',
              inputs: Array(nodeType.inputs).fill({ color: '#ff0000' }),
              outputs: Array(nodeType.outputs).fill({ color: '#00ff00' }),
            },
          };
          setNodes((nds) => [...nds, newNode]);
          document.body.removeChild(menu);
        };
        menu.appendChild(item);
      });

      if (node) {
        const deleteItem = document.createElement('div');
        deleteItem.innerText = 'Delete Node';
        deleteItem.onclick = () => {
          setNodes((nds) => nds.filter((n) => n.id !== node.id));
          setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
          document.body.removeChild(menu);
        };
        menu.appendChild(deleteItem);
      }

      document.body.appendChild(menu);

      const handleClickOutside = (e: MouseEvent) => {
        if (!menu.contains(e.target as Node)) {
          document.body.removeChild(menu);
          document.removeEventListener('click', handleClickOutside);
        }
      };

      document.addEventListener('click', handleClickOutside);
    },
    [project, setNodes, setEdges]
  );

  const onPaneClick = useCallback(() => {
    setSelectedElements([]);
  }, [setSelectedElements]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onContextMenu={onContextMenu}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        multiSelectionKeyCode="Control"
        deleteKeyCode="Delete"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        <Panel position="top-left">
          <button onClick={() => console.log(selectedElements)}>Log Selected</button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const BlueprintEditor: React.FC<{
  width?: string | number;
  height?: string | number;
}> = ({ width = '100%', height = '500px' }) => {
  return (
    <div style={{ width, height }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
};

export default BlueprintEditor;