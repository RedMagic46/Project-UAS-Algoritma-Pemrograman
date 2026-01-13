import { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { BSTModule } from './components/BSTModule';
import { DijkstraModule } from './components/DijkstraModule';

type Module = 'menu' | 'bst' | 'dijkstra';

export default function App() {
  const [currentModule, setCurrentModule] = useState<Module>('menu');

  const handleSelectModule = (module: Module) => {
    setCurrentModule(module);
  };

  const handleBackToMenu = () => {
    setCurrentModule('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {currentModule === 'menu' && (
          <MainMenu onSelectModule={handleSelectModule} />
        )}
        {currentModule === 'bst' && (
          <BSTModule onBack={handleBackToMenu} />
        )}
        {currentModule === 'dijkstra' && (
          <DijkstraModule onBack={handleBackToMenu} />
        )}
      </div>
    </div>
  );
}
