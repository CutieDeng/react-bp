// app/page.tsx
"use client";

import React, { useState, useCallback } from 'react';

// 假设这些是你自定义的组件或类型
import { NodeType, EdgeType, Position } from './types';
import Node from './components/Node';
import Edge from './components/Edge';

const initialElements = [
  { id: '1', type: 'input', data: { label: '输入节点' }, position: { x: 250, y: 5 } },
  { id: '2', type: 'default', data: { label: '默认节点' }, position: { x: 100, y: 100 } },
  { id: '3', type: 'output', data: { label: '输出节点' }, position: { x: 250, y: 200 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const BlueprintEditor = () => {
  const [elements, setElements] = useState(initialElements);
  
  const onConnect = useCallback((params: { source: string; target: string }) => {
    setElements((els) => [...els, { id: `e${params.source}-${params.target}`, ...params }]);
  }, []);
  
  const onElementsRemove = useCallback((elementsToRemove: Array<NodeType | EdgeType>) => {
    setElements((els) => els.filter((el) => !elementsToRemove.includes(el)));
  }, []);

  const validateConnection = (connection: { source: string; target: string }) => {
    if (connection.source === 'output' && connection.target === 'input') {
      alert('不允许输出节点连接到输入节点');
      return false;
    }
    return true;
  };

  const onNodeDragStop = (event: React.MouseEvent, node: NodeType) => {
    console.log('Node dragged:', node);
    // 更新节点位置
    setElements((els) =>
      els.map((el) => (el.id === node.id ? { ...el, position: node.position } : el))
    );
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {elements.map((el) =>
        el.type ? (
          <Node
            key={el.id}
            {...el}
            onDragStop={onNodeDragStop}
          />
        ) : (
          <Edge
            key={el.id}
            {...el}
          />
        )
      )}
    </div>
  );
};

export default BlueprintEditor;