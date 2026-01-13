interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface GraphVisualizerProps {
  nodes: string[];
  edges: Edge[];
  currentStep?: {
    current: string;
    visited: string[];
    distances: { [key: string]: number | string };
    source: string;
  };
}

export function GraphVisualizer({ nodes, edges, currentStep }: GraphVisualizerProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Graf kosong - Tambahkan edge untuk memulai
      </div>
    );
  }

  // Simple circular layout for nodes
  const centerX = 300;
  const centerY = 250;
  const radius = Math.min(120, 200 - nodes.length * 5);
  
  const nodePositions = new Map<string, { x: number; y: number }>();
  nodes.forEach((node, index) => {
    const angle = (index * 2 * Math.PI) / nodes.length - Math.PI / 2;
    nodePositions.set(node, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });

  const nodeRadius = 30;

  return (
    <div className="w-full bg-white rounded-lg p-4 border-2 border-gray-200 overflow-auto">
      <div className="flex justify-center min-w-max">
        <svg
          width="600"
          height="500"
          viewBox="0 0 600 500"
          className="max-w-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Draw edges */}
          {edges.map((edge, idx) => {
            const fromPos = nodePositions.get(edge.from);
            const toPos = nodePositions.get(edge.to);
            if (!fromPos || !toPos) return null;

            // Calculate midpoint for weight label
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            // Determine if this edge is on the current path
            const isActive = currentStep && (
              currentStep.current === edge.from || 
              currentStep.current === edge.to ||
              (currentStep.visited.includes(edge.from) && currentStep.visited.includes(edge.to))
            );

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={isActive ? '#8b5cf6' : '#d1d5db'}
                  strokeWidth={isActive ? '3' : '2'}
                  opacity={isActive ? 1 : 0.6}
                />
                {/* Weight label */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="15"
                  fill="white"
                  stroke={isActive ? '#8b5cf6' : '#9ca3af'}
                  strokeWidth="2"
                />
                <text
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? '#8b5cf6' : '#6b7280'}
                  fontSize="12"
                  fontWeight="600"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => {
            const pos = nodePositions.get(node);
            if (!pos) return null;

            const isSource = currentStep && node === currentStep.source;
            const isCurrent = currentStep && node === currentStep.current;
            const isVisited = currentStep && currentStep.visited.includes(node);
            const distance = currentStep?.distances[node];

            let fillColor = 'white';
            let strokeColor = '#10b981';
            let textColor = '#10b981';

            if (isSource) {
              fillColor = '#10b981';
              strokeColor = '#10b981';
              textColor = 'white';
            } else if (isCurrent) {
              fillColor = '#f59e0b';
              strokeColor = '#f59e0b';
              textColor = 'white';
            } else if (isVisited) {
              fillColor = '#8b5cf6';
              strokeColor = '#8b5cf6';
              textColor = 'white';
            }

            return (
              <g key={`node-${node}`}>
                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                />
                {/* Node label */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize="20"
                  fontWeight="700"
                >
                  {node}
                </text>
                {/* Distance label */}
                {currentStep && distance !== undefined && (
                  <text
                    x={pos.x}
                    y={pos.y + nodeRadius + 20}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="14"
                    fontWeight="600"
                  >
                    {distance}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      {currentStep && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-500"></div>
            <span>Source</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600 border-2 border-purple-600"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-emerald-500"></div>
            <span>Unvisited</span>
          </div>
        </div>
      )}
    </div>
  );
}
