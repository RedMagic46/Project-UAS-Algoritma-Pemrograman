import { useMemo } from 'react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface TreeVisualizerProps {
  root: TreeNode | null;
}

interface NodePosition {
  x: number;
  y: number;
  value: number;
}

export function TreeVisualizer({ root }: TreeVisualizerProps) {
  const visualization = useMemo(() => {
    if (!root) return null;

    const nodeRadius = 20;
    const levelHeight = 60;
    const minHorizontalSpacing = 15;

    // Calculate positions for all nodes
    const positions: NodePosition[] = [];
    const edges: { from: NodePosition; to: NodePosition }[] = [];

    const calculatePositions = (
      node: TreeNode | null,
      x: number,
      y: number,
      horizontalOffset: number,
      parentPos?: NodePosition
    ) => {
      if (!node) return;

      const pos: NodePosition = { x, y, value: node.value };
      positions.push(pos);

      if (parentPos) {
        edges.push({ from: parentPos, to: pos });
      }

      const newOffset = horizontalOffset / 2;
      
      if (node.left) {
        calculatePositions(node.left, x - horizontalOffset, y + levelHeight, newOffset, pos);
      }
      
      if (node.right) {
        calculatePositions(node.right, x + horizontalOffset, y + levelHeight, newOffset, pos);
      }
    };

    // Get tree depth to calculate initial offset
    const getDepth = (node: TreeNode | null): number => {
      if (!node) return 0;
      return 1 + Math.max(getDepth(node.left), getDepth(node.right));
    };

    const depth = getDepth(root);
    
    // Calculate spacing to ensure all nodes fit properly
    const initialOffset = Math.pow(2, depth - 1) * minHorizontalSpacing;
    
    // Start from center (0, 0) and calculate positions
    calculatePositions(root, 0, 0, initialOffset);

    // Calculate bounds of all nodes
    if (positions.length === 0) return null;

    const minX = Math.min(...positions.map(p => p.x)) - nodeRadius;
    const maxX = Math.max(...positions.map(p => p.x)) + nodeRadius;
    const minY = Math.min(...positions.map(p => p.y)) - nodeRadius;
    const maxY = Math.max(...positions.map(p => p.y)) + nodeRadius;

    // Add padding
    const padding = 40;
    const viewBoxX = minX - padding;
    const viewBoxY = minY - padding;
    const viewBoxWidth = (maxX - minX) + padding * 2;
    const viewBoxHeight = (maxY - minY) + padding * 2;

    return {
      positions,
      edges,
      nodeRadius,
      viewBox: `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`,
    };
  }, [root]);

  if (!root) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Tree kosong - Tambahkan angka untuk memulai
      </div>
    );
  }

  if (!visualization) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-lg p-4 border-2 border-gray-200">
      <svg
        viewBox={visualization.viewBox}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        style={{ minHeight: '400px', maxHeight: '600px' }}
      >
        {/* Draw edges */}
        {visualization.edges.map((edge, idx) => (
          <g key={`edge-${idx}`}>
            <line
              x1={edge.from.x}
              y1={edge.from.y + visualization.nodeRadius}
              x2={edge.to.x}
              y2={edge.to.y - visualization.nodeRadius}
              stroke="#10b981"
              strokeWidth="3"
            />
          </g>
        ))}

        {/* Draw nodes */}
        {visualization.positions.map((pos, idx) => (
          <g key={`node-${idx}`}>
            {/* Node circle background */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={visualization.nodeRadius}
              fill="white"
              stroke="#10b981"
              strokeWidth="3"
            />
            {/* Node value */}
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#10b981"
              fontSize="18"
              fontWeight="600"
            >
              {pos.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}