// 更新 CustomNode 组件
const CustomNode = ({ data, isConnectable }: NodeProps) => {
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
                  isConnectable={isConnectable}
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
                  isConnectable={isConnectable}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };