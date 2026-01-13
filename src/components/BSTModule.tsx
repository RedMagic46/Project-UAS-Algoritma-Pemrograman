import { useState } from 'react';
import { ArrowLeft, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { TreeVisualizer } from './TreeVisualizer';

interface BSTModuleProps {
  onBack: () => void;
}

class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number): string[] {
    const logs: string[] = [];
    logs.push(`🔵 Memasukkan nilai: ${value}`);
    
    if (this.root === null) {
      this.root = new TreeNode(value);
      logs.push(`✅ Nilai ${value} menjadi root (akar pohon)`);
      return logs;
    }

    let current = this.root;
    let path = [current.value];

    while (true) {
      if (value === current.value) {
        logs.push(`⚠️ Nilai ${value} sudah ada di tree`);
        return logs;
      }

      if (value < current.value) {
        logs.push(`📍 ${value} < ${current.value}, pergi ke kiri`);
        path.push(current.value);
        
        if (current.left === null) {
          current.left = new TreeNode(value);
          logs.push(`✅ Nilai ${value} dimasukkan sebagai anak kiri dari ${current.value}`);
          logs.push(`🛤️ Jalur: ${path.join(' → ')} → ${value}`);
          return logs;
        }
        current = current.left;
      } else {
        logs.push(`📍 ${value} > ${current.value}, pergi ke kanan`);
        path.push(current.value);
        
        if (current.right === null) {
          current.right = new TreeNode(value);
          logs.push(`✅ Nilai ${value} dimasukkan sebagai anak kanan dari ${current.value}`);
          logs.push(`🛤️ Jalur: ${path.join(' → ')} → ${value}`);
          return logs;
        }
        current = current.right;
      }
    }
  }

  search(value: number): { found: boolean; logs: string[] } {
    const logs: string[] = [];
    logs.push(`🔍 Mencari nilai: ${value}`);

    if (this.root === null) {
      logs.push(`❌ Tree kosong, nilai ${value} tidak ditemukan`);
      return { found: false, logs };
    }

    let current: TreeNode | null = this.root;
    let depth = 0;

    while (current !== null) {
      depth++;
      logs.push(`📌 Level ${depth}: Memeriksa node ${current.value}`);

      if (value === current.value) {
        logs.push(`✅ Nilai ${value} ditemukan di level ${depth}!`);
        return { found: true, logs };
      }

      if (value < current.value) {
        logs.push(`   ${value} < ${current.value}, pergi ke kiri`);
        current = current.left;
      } else {
        logs.push(`   ${value} > ${current.value}, pergi ke kanan`);
        current = current.right;
      }
    }

    logs.push(`❌ Nilai ${value} tidak ditemukan di tree`);
    return { found: false, logs };
  }

  getTreeStructure(): string[] {
    if (this.root === null) {
      return ['Tree kosong'];
    }

    const lines: string[] = [];
    this.buildTreeLines(this.root, '', true, lines);
    return lines;
  }

  private buildTreeLines(node: TreeNode | null, prefix: string, isLeft: boolean, lines: string[]): void {
    if (node === null) return;

    const nodeStr = `${prefix}${isLeft ? '├── ' : '└── '}[${node.value}]`;
    lines.push(nodeStr);

    const newPrefix = prefix + (isLeft ? '│   ' : '    ');

    if (node.left !== null || node.right !== null) {
      if (node.left !== null) {
        this.buildTreeLines(node.left, newPrefix, true, lines);
      } else {
        lines.push(`${newPrefix}├── [ ]`);
      }

      if (node.right !== null) {
        this.buildTreeLines(node.right, newPrefix, false, lines);
      } else {
        lines.push(`${newPrefix}└── [ ]`);
      }
    }
  }
}

export function BSTModule({ onBack }: BSTModuleProps) {
  const [bst] = useState(() => new BinarySearchTree());
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [treeKey, setTreeKey] = useState(0); // Key untuk memaksa re-render
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [treeStructure, setTreeStructure] = useState<string[]>(['Tree kosong']);
  const [logs, setLogs] = useState<string[]>([]);
  const [searchLogs, setSearchLogs] = useState<string[]>([]);

  const handleInsert = () => {
    const num = parseInt(inputValue);
    if (isNaN(num)) {
      setLogs(['❌ Masukkan angka yang valid!']);
      return;
    }

    const insertLogs = bst.insert(num);
    setLogs(insertLogs);
    setTreeStructure(bst.getTreeStructure());
    // Force update by creating a new reference to root and incrementing key
    setRoot(bst.root);
    setTreeKey(prev => prev + 1);
    setInputValue('');
  };

  const handleSearch = () => {
    const num = parseInt(searchValue);
    if (isNaN(num)) {
      setSearchLogs(['❌ Masukkan angka yang valid!']);
      return;
    }

    const result = bst.search(num);
    setSearchLogs(result.logs);
  };

  const handleReset = () => {
    bst.root = null;
    setRoot(null);
    setTreeKey(prev => prev + 1);
    setTreeStructure(['Tree kosong']);
    setLogs([]);
    setSearchLogs([]);
    setInputValue('');
    setSearchValue('');
  };

  const handleQuickStart = () => {
    // Generate random unique numbers
    const count = 7;
    const randomValues = new Set<number>();
    
    while (randomValues.size < count) {
      const randomNum = Math.floor(Math.random() * 100) + 1; // 1-100
      randomValues.add(randomNum);
    }
    
    const exampleValues = Array.from(randomValues);
    bst.root = null;
    
    const allLogs: string[] = [`🎯 Memasukkan data random: ${exampleValues.join(', ')}\n`];
    exampleValues.forEach(val => {
      const insertLogs = bst.insert(val);
      allLogs.push(...insertLogs, '');
    });
    
    setLogs(allLogs);
    setTreeStructure(bst.getTreeStructure());
    // Force update by creating a new reference to root and incrementing key
    setRoot(bst.root);
    setTreeKey(prev => prev + 1);
  };

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
        <h1 className="mb-2 text-indigo-900">Binary Search Tree (BST)</h1>
        <p className="text-gray-600">
          BST adalah struktur data pohon di mana setiap node memiliki nilai lebih besar dari semua node di subpohon kiri
          dan lebih kecil dari semua node di subpohon kanan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Masukkan Angka
              </CardTitle>
              <CardDescription>
                Tambahkan angka ke dalam BST
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Masukkan angka..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                />
                <Button onClick={handleInsert} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </Button>
              </div>

              <Button 
                onClick={handleQuickStart}
                variant="outline"
                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                ⚡ Coba Contoh Data
              </Button>

              {logs.length > 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription>
                    <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto">
                      {logs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Cari Angka
              </CardTitle>
              <CardDescription>
                Cari nilai dalam BST dengan log detail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Cari angka..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                  <Search className="w-4 h-4 mr-2" />
                  Cari
                </Button>
              </div>

              {searchLogs.length > 0 && (
                <Alert className="bg-purple-50 border-purple-200">
                  <AlertDescription>
                    <div className="space-y-1 font-mono text-xs">
                      {searchLogs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleReset}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Reset Tree
          </Button>
        </div>

        {/* Visualization Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Visualisasi Tree</CardTitle>
              <CardDescription>
                Struktur BST saat ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TreeVisualizer key={treeKey} root={root} />
            </CardContent>
          </Card>

          <Card className="mt-6 bg-indigo-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-base">💡 Cara Kerja BST</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>Insert:</strong> Bandingkan nilai baru dengan node saat ini. Jika lebih kecil, masuk ke kiri; jika lebih besar, masuk ke kanan.</p>
              <p><strong>Search:</strong> Mulai dari root, bandingkan nilai target dengan node saat ini, lalu ikuti arah yang sesuai.</p>
              <p><strong>Kompleksitas:</strong> O(log n) untuk tree seimbang, O(n) untuk worst case.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}