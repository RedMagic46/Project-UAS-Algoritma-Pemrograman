import { useState } from 'react';
import { ArrowLeft, Plus, Play, Trash2, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraphVisualizer } from './GraphVisualizer';

interface DijkstraModuleProps {
  onBack: () => void;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface StepLog {
  step: number;
  current: string;
  distances: { [key: string]: number | string };
  visited: string[];
  description: string;
}

class DijkstraGraph {
  adjacencyList: Map<string, Map<string, number>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addEdge(from: string, to: string, weight: number) {
    if (!this.adjacencyList.has(from)) {
      this.adjacencyList.set(from, new Map());
    }
    if (!this.adjacencyList.has(to)) {
      this.adjacencyList.set(to, new Map());
    }

    this.adjacencyList.get(from)!.set(to, weight);
    // Untuk graf tidak berarah, tambahkan edge sebaliknya
    this.adjacencyList.get(to)!.set(from, weight);
  }

  getNodes(): string[] {
    return Array.from(this.adjacencyList.keys()).sort();
  }

  dijkstra(start: string): { distances: { [key: string]: number }, steps: StepLog[] } {
    const distances: { [key: string]: number } = {};
    const visited = new Set<string>();
    const steps: StepLog[] = [];
    const nodes = this.getNodes();

    // Inisialisasi jarak
    nodes.forEach(node => {
      distances[node] = node === start ? 0 : Infinity;
    });

    steps.push({
      step: 0,
      current: start,
      distances: { ...distances, ...Object.fromEntries(Object.entries(distances).map(([k, v]) => [k, v === Infinity ? '∞' : v])) },
      visited: [],
      description: `🚀 Inisialisasi: Set jarak ${start} = 0, semua node lain = ∞`
    });

    let stepCount = 1;

    while (visited.size < nodes.length) {
      // Cari node belum dikunjungi dengan jarak terkecil
      let currentNode: string | null = null;
      let minDistance = Infinity;

      for (const node of nodes) {
        if (!visited.has(node) && distances[node] < minDistance) {
          minDistance = distances[node];
          currentNode = node;
        }
      }

      if (currentNode === null || minDistance === Infinity) {
        break;
      }

      visited.add(currentNode);
      const neighbors = this.adjacencyList.get(currentNode);

      if (neighbors) {
        for (const [neighbor, weight] of neighbors.entries()) {
          if (!visited.has(neighbor)) {
            const newDistance = distances[currentNode] + weight;
            
            if (newDistance < distances[neighbor]) {
              const oldDist = distances[neighbor];
              distances[neighbor] = newDistance;
              
              steps.push({
                step: stepCount++,
                current: currentNode,
                distances: { ...distances, ...Object.fromEntries(Object.entries(distances).map(([k, v]) => [k, v === Infinity ? '∞' : v])) },
                visited: Array.from(visited),
                description: `📍 Kunjungi ${currentNode} → Update jarak ${neighbor}: ${oldDist === Infinity ? '∞' : oldDist} → ${newDistance} (via ${currentNode}, bobot ${weight})`
              });
            }
          }
        }
      }

      if (neighbors && neighbors.size > 0) {
        const neighborsStr = Array.from(neighbors.keys()).join(', ');
        steps.push({
          step: stepCount++,
          current: currentNode,
          distances: { ...distances, ...Object.fromEntries(Object.entries(distances).map(([k, v]) => [k, v === Infinity ? '∞' : v])) },
          visited: Array.from(visited),
          description: `✅ Tandai ${currentNode} sebagai dikunjungi. Tetangga: ${neighborsStr}`
        });
      }
    }

    return { distances, steps };
  }
}

export function DijkstraModule({ onBack }: DijkstraModuleProps) {
  const [graph] = useState(() => new DijkstraGraph());
  const [edges, setEdges] = useState<Edge[]>([]);
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [weight, setWeight] = useState('');
  const [startNode, setStartNode] = useState('');
  const [steps, setSteps] = useState<StepLog[]>([]);
  const [finalDistances, setFinalDistances] = useState<{ [key: string]: number } | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [message, setMessage] = useState('');

  // Helper function to filter only letters
  const filterLettersOnly = (value: string): string => {
    return value.replace(/[^a-zA-Z]/g, '').toUpperCase();
  };

  // Helper function to validate if string contains only letters
  const isValidNodeName = (value: string): boolean => {
    return /^[a-zA-Z]+$/.test(value.trim());
  };

  const handleAddEdge = () => {
    const from = fromNode.trim().toUpperCase();
    const to = toNode.trim().toUpperCase();
    const w = parseInt(weight);

    if (!from || !to) {
      setMessage('❌ Masukkan node awal dan tujuan!');
      return;
    }

    // Validate that nodes contain only letters
    if (!isValidNodeName(from)) {
      setMessage('❌ Node awal harus berupa huruf saja (tidak boleh angka)!');
      return;
    }

    if (!isValidNodeName(to)) {
      setMessage('❌ Node tujuan harus berupa huruf saja (tidak boleh angka)!');
      return;
    }

    if (isNaN(w) || w <= 0) {
      setMessage('❌ Masukkan bobot yang valid (angka positif)!');
      return;
    }

    graph.addEdge(from, to, w);
    setEdges([...edges, { from, to, weight: w }]);
    setMessage(`✅ Edge ditambahkan: ${from} ↔ ${to} (bobot: ${w})`);
    setFromNode('');
    setToNode('');
    setWeight('');
  };

  const handleRunDijkstra = () => {
    if (!startNode) {
      setMessage('❌ Pilih node awal terlebih dahulu!');
      return;
    }

    const result = graph.dijkstra(startNode);
    setSteps(result.steps);
    setFinalDistances(result.distances);
    setCurrentStepIndex(0);
    setMessage('');
  };

  const handleReset = () => {
    graph.adjacencyList.clear();
    setEdges([]);
    setSteps([]);
    setFinalDistances(null);
    setStartNode('');
    setCurrentStepIndex(0);
    setMessage('');
  };

  const handleQuickStart = () => {
    graph.adjacencyList.clear();
    
    // Generate random graf dengan 5 node
    const nodeNames = ['A', 'B', 'C', 'D', 'E'];
    const generatedEdges: Edge[] = [];
    
    // Buat graf terhubung dengan minimal spanning tree terlebih dahulu
    for (let i = 0; i < nodeNames.length - 1; i++) {
      const from = nodeNames[i];
      const to = nodeNames[i + 1];
      const weight = Math.floor(Math.random() * 10) + 1; // 1-10
      generatedEdges.push({ from, to, weight });
    }
    
    // Tambahkan beberapa edge random untuk membuat graf lebih kompleks
    const extraEdgeCount = Math.floor(Math.random() * 4) + 2; // 2-5 edge tambahan
    for (let i = 0; i < extraEdgeCount; i++) {
      const from = nodeNames[Math.floor(Math.random() * nodeNames.length)];
      const to = nodeNames[Math.floor(Math.random() * nodeNames.length)];
      
      // Pastikan tidak self-loop dan belum ada
      if (from !== to) {
        const exists = generatedEdges.some(e => 
          (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        
        if (!exists) {
          const weight = Math.floor(Math.random() * 10) + 1;
          generatedEdges.push({ from, to, weight });
        }
      }
    }
    
    // Tambahkan semua edge ke graph
    generatedEdges.forEach(edge => {
      graph.addEdge(edge.from, edge.to, edge.weight);
    });
    
    setEdges(generatedEdges);
    setStartNode('A');
    setMessage(`✅ Graf random berhasil dimuat! ${generatedEdges.length} edge, 5 node`);
  };

  const nodes = graph.getNodes();

  return (
    <div className="py-8">
      <Button 
        onClick={onBack}
        variant="ghost"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Menu
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-purple-900">Algoritma Dijkstra</h1>
        <p className="text-gray-600">
          Algoritma Dijkstra menemukan jalur terpendek dari satu node ke semua node lainnya dalam graf berbobot.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Tambah Edge (Sisi Graf)
              </CardTitle>
              <CardDescription>
                Buat graf dengan menambahkan edge beserta bobotnya. Node hanya bisa menggunakan huruf (A-Z), tidak bisa menggunakan angka.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Node A"
                  value={fromNode}
                  onChange={(e) => {
                    const filtered = filterLettersOnly(e.target.value);
                    setFromNode(filtered);
                  }}
                  className="uppercase"
                  maxLength={1}
                  title="Hanya huruf yang diperbolehkan"
                />
                <Input
                  placeholder="Node B"
                  value={toNode}
                  onChange={(e) => {
                    const filtered = filterLettersOnly(e.target.value);
                    setToNode(filtered);
                  }}
                  className="uppercase"
                  maxLength={1}
                  title="Hanya huruf yang diperbolehkan"
                />
                <Input
                  type="number"
                  placeholder="Bobot"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <Button onClick={handleAddEdge} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Edge
              </Button>

              <Button 
                onClick={handleQuickStart}
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                ⚡ Coba Graf Contoh
              </Button>

              {message && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm">
                    {message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Graf Saat Ini</CardTitle>
              <CardDescription>
                {edges.length} edge, {nodes.length} node
              </CardDescription>
            </CardHeader>
            <CardContent>
              {edges.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada edge. Tambahkan edge untuk memulai.</p>
              ) : (
                <div className="space-y-2">
                  {edges.map((edge, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                      <span className="font-mono">
                        {edge.from} ↔ {edge.to}
                      </span>
                      <span className="text-purple-600 font-semibold">
                        Bobot: {edge.weight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Jalankan Dijkstra
              </CardTitle>
              <CardDescription>
                Pilih node awal untuk memulai algoritma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={startNode} onValueChange={setStartNode}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih node awal..." />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node} value={node}>{node}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleRunDijkstra}
                disabled={nodes.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Jalankan Algoritma
              </Button>

              <Button 
                onClick={handleReset}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Graf
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Section */}
        <div className="space-y-6">
          {steps.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Visualisasi Step-by-Step</CardTitle>
                  <CardDescription>
                    Step {currentStepIndex + 1} dari {steps.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                      disabled={currentStepIndex === 0}
                      variant="outline"
                      size="sm"
                    >
                      ← Prev
                    </Button>
                    <Button
                      onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
                      disabled={currentStepIndex === steps.length - 1}
                      variant="outline"
                      size="sm"
                    >
                      Next →
                    </Button>
                    <div className="ml-auto text-sm text-gray-600 flex items-center">
                      Step {steps[currentStepIndex].step}
                    </div>
                  </div>

                  <Alert className="bg-purple-50 border-purple-200">
                    <AlertDescription className="text-sm">
                      {steps[currentStepIndex].description}
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-xs space-y-1">
                      <div className="text-yellow-400 mb-2">Jarak Terkini:</div>
                      {Object.entries(steps[currentStepIndex].distances).map(([node, dist]) => (
                        <div key={node} className="flex justify-between">
                          <span>{node}:</span>
                          <span className={dist === '∞' ? 'text-gray-500' : 'text-green-300'}>
                            {dist}
                          </span>
                        </div>
                      ))}
                      <div className="text-yellow-400 mt-3 mb-1">Node Dikunjungi:</div>
                      <div>{steps[currentStepIndex].visited.join(', ') || 'Belum ada'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {finalDistances && currentStepIndex === steps.length - 1 && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-base">🎯 Hasil Akhir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Jarak Terpendek dari {startNode}:</p>
                      {Object.entries(finalDistances).map(([node, dist]) => (
                        <div key={node} className="flex justify-between bg-white p-2 rounded">
                          <span>{startNode} → {node}:</span>
                          <span className="font-bold text-green-700">
                            {dist === Infinity ? '∞ (tidak terhubung)' : dist}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Visualisasi Graf
              </CardTitle>
              <CardDescription>
                {steps.length > 0 
                  ? `Step ${currentStepIndex + 1} dari ${steps.length}`
                  : 'Struktur graf saat ini'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraphVisualizer
                nodes={nodes}
                edges={edges}
                currentStep={steps.length > 0 ? {
                  current: steps[currentStepIndex].current,
                  visited: steps[currentStepIndex].visited,
                  distances: steps[currentStepIndex].distances,
                  source: startNode,
                } : undefined}
              />
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-base">💡 Cara Kerja Dijkstra</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>1. Inisialisasi:</strong> Set jarak node awal = 0, lainnya = ∞</p>
              <p><strong>2. Iterasi:</strong> Pilih node belum dikunjungi dengan jarak terkecil</p>
              <p><strong>3. Update:</strong> Periksa tetangga, update jarak jika ditemukan jalur lebih pendek</p>
              <p><strong>4. Ulangi:</strong> Tandai node sebagai dikunjungi, ulangi hingga semua node selesai</p>
              <p><strong>Kompleksitas:</strong> O((V + E) log V) dengan priority queue</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}