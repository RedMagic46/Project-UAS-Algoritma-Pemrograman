import { Binary, Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface MainMenuProps {
  onSelectModule: (module: 'bst' | 'dijkstra') => void;
}

export function MainMenu({ onSelectModule }: MainMenuProps) {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4 text-indigo-900">Program Edukasi Algoritma</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pelajari dan visualisasikan algoritma fundamental dalam ilmu komputer.
          Pilih modul di bawah untuk memulai pembelajaran interaktif.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-300"
              onClick={() => onSelectModule('bst')}>
          <CardHeader>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Binary className="w-6 h-6 text-indigo-600" />
            </div>
            <CardTitle>Binary Search Tree (BST)</CardTitle>
            <CardDescription>
              Visualisasi struktur data pohon biner terurut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• Input angka satu per satu</li>
              <li>• Visualisasi tree secara real-time</li>
              <li>• Fitur pencarian dengan log detail</li>
            </ul>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Mulai Modul BST
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300"
              onClick={() => onSelectModule('dijkstra')}>
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Algoritma Dijkstra</CardTitle>
            <CardDescription>
              Visualisasi pencarian jalur terpendek dalam graf
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• Input graf dengan node dan bobot</li>
              <li>• Pilih node awal</li>
              <li>• Visualisasi step-by-step kalkulasi</li>
            </ul>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Mulai Modul Dijkstra
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
