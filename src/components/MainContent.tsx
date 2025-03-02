
import React from 'react';
import { VideoFile, SceneMatch } from '@/lib/types';
import SplitViewComparison from '@/components/SplitViewComparison';
import Dropzone from '@/components/Dropzone';
import { Link } from 'react-router-dom';
import { FolderCheck } from 'lucide-react';

interface MainContentProps {
  referenceVideo: VideoFile | null;
  rawVideos: VideoFile[];
  currentMatch: SceneMatch | null;
  sceneMatches: SceneMatch[];
  currentMatchIndex: number;
  handlePrevScene: () => void;
  handleNextScene: () => void;
  handleFilesAdded: (files: VideoFile[], type: 'raw' | 'reference') => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  referenceVideo,
  rawVideos,
  currentMatch,
  sceneMatches,
  currentMatchIndex,
  handlePrevScene,
  handleNextScene,
  handleFilesAdded
}) => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      {/* Split View Comparison */}
      <div className="glass-morphism rounded-lg p-4">
        <h2 className="text-sm font-medium mb-3">Visualização de Cenas</h2>
        <SplitViewComparison
          referenceVideo={referenceVideo}
          rawVideos={rawVideos}
          currentMatch={currentMatch}
          className="mb-3"
        />
        
        {/* Scene navigation controls */}
        {sceneMatches.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              className="text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/70 transition-colors"
              onClick={handlePrevScene}
            >
              Cena Anterior
            </button>
            <span className="text-xs text-muted-foreground">
              Cena {currentMatchIndex + 1} de {sceneMatches.length}
            </span>
            <button
              className="text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/70 transition-colors"
              onClick={handleNextScene}
            >
              Próxima Cena
            </button>
          </div>
        )}
      </div>
      
      {/* Upload section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropzone
          onFilesAdded={(files) => handleFilesAdded(files, 'reference')}
          type="reference"
          label="Vídeo Referência"
          multiple={false}
          files={referenceVideo ? [referenceVideo] : []}
        />
        
        <div className="flex flex-col gap-4">
          <Dropzone
            onFilesAdded={(files) => handleFilesAdded(files, 'raw')}
            type="raw"
            label="Organizar Vídeos"
            multiple={true}
            files={rawVideos}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
