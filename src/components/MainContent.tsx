
import React from 'react';
import { VideoFile, SceneMatch } from '@/lib/types';
import SplitViewComparison from '@/components/SplitViewComparison';
import Dropzone from '@/components/Dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { FolderCheck, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface MainContentProps {
  referenceVideo: VideoFile | null;
  rawVideos: VideoFile[];
  currentMatch: SceneMatch | null;
  sceneMatches: SceneMatch[];
  currentMatchIndex: number;
  handlePrevScene: () => void;
  handleNextScene: () => void;
  handleFilesAdded: (files: VideoFile[], type: 'raw' | 'reference') => void;
  uploadProgress?: {[key: string]: number};
  isUploading?: boolean;
  cancelUpload?: (fileId: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  referenceVideo,
  rawVideos,
  currentMatch,
  sceneMatches,
  currentMatchIndex,
  handlePrevScene,
  handleNextScene,
  handleFilesAdded,
  uploadProgress = {},
  isUploading = false,
  cancelUpload
}) => {
  const navigate = useNavigate();
  
  const handleRawVideosAdded = (files: VideoFile[]) => {
    handleFilesAdded(files, 'raw');
    if (files.length > 0 && !isUploading) {
      navigate('/organizacao');
    }
  };

  const filesInProgress = Object.keys(uploadProgress);

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
      
      {/* Upload progress for large files */}
      {isUploading && filesInProgress.length > 0 && (
        <div className="glass-morphism rounded-lg p-4">
          <h2 className="text-sm font-medium mb-3">Uploads em Andamento</h2>
          <div className="space-y-4">
            {filesInProgress.map(fileId => (
              <div key={fileId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate">Processando arquivo grande...</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono">{uploadProgress[fileId]}%</span>
                    {cancelUpload && (
                      <button
                        onClick={() => cancelUpload(fileId)}
                        className="text-xs p-1 rounded-full hover:bg-secondary/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <Progress value={uploadProgress[fileId]} className="h-1.5" />
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              Arquivos grandes são processados em partes para melhor desempenho.
              Não feche o navegador durante o processo.
            </p>
          </div>
        </div>
      )}
      
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
            onFilesAdded={handleRawVideosAdded}
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
