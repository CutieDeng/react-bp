// 使用 React 和一些图形库(如 react-flow 或 rete.js)来实现基本框架
"use client";

import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background,
  addEdge,
  removeElements,
  isEdge
} from 'react-flow-renderer';

const initialElements = [
  { id: '1', type: 'input', data: { label: '输入节点' }, position: { x: 250, y: 5 } },
  { id: '2', type: 'default', data: { label: '默认节点' }, position: { x: 100, y: 100 } },
  { id: '3', type: 'output', data: { label: '输出节点' }, position: { x: 250, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const BlueprintEditor = () => {
  const [elements, setElements] = useState(initialElements);
  
  const onConnect = useCallback((params) => setElements((els) => addEdge(params, els)), []);
  
  const onElementsRemove = useCallback(
    (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els)),
    []
  );

  const onLoad = (reactFlowInstance) => {
    console.log('Flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
  };

  // 自定义连接验证逻辑
  const validateConnection = (connection) => {
    // 示例：禁止输出节点连接到输入节点
    if (connection.source === 'output' && connection.target === 'input') {
      alert('不允许输出节点连接到输入节点');
      return false;
    }
    return true;
  };

  // 自定义节点拖拽逻辑
  const onNodeDragStop = (event, node) => {
    console.log('Node dragged:', node);
    // 这里可以添加节点位置限制或吸附效果
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        validateConnection={validateConnection}
        onNodeDragStop={onNodeDragStop}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default BlueprintEditor;