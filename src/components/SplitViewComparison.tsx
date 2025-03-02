
import React from 'react';
import { cn } from '@/lib/utils';
import { VideoFile, SceneMatch } from '@/lib/types';

interface SplitViewComparisonProps {
  referenceVideo: VideoFile | null;
  rawVideos: VideoFile[];
  currentMatch: SceneMatch | null;
  className?: string;
}

export const SplitViewComparison: React.FC<SplitViewComparisonProps> = ({
  referenceVideo,
  rawVideos,
  currentMatch,
  className
}) => {
  const getRawVideoById = (id: string): VideoFile | undefined => {
    return rawVideos.find(video => video.id === id);
  };

  const getSceneTypeLabel = (type: SceneMatch['sceneType']): string => {
    switch (type) {
      case 'making_of_bride': return 'Making of Noiva';
      case 'making_of_groom': return 'Making of Noivo';
      case 'ceremony': return 'Cerimônia';
      case 'decoration': return 'Decoração';
      case 'party': return 'Festa';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className={cn("w-full rounded-lg overflow-hidden bg-black/20 glass-morphism", className)}>
      {currentMatch && referenceVideo ? (
        <div className="flex flex-col">
          {/* Scene Type Label */}
          <div className="bg-primary/20 py-2 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-subtle"></div>
              <span className="text-sm font-medium">
                {getSceneTypeLabel(currentMatch.sceneType)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Similaridade: {(currentMatch.similarityScore * 100).toFixed(0)}%
            </span>
          </div>
          
          {/* Split View */}
          <div className="flex flex-col sm:flex-row">
            {/* Reference Video */}
            <div className="flex-1 p-1 border-r border-border/20">
              <div className="flex flex-col h-full">
                <span className="text-xs text-center py-1 bg-secondary/20">Vídeo Referência</span>
                <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden flex-1">
                  {referenceVideo.path ? (
                    <img 
                      src={referenceVideo.preview || referenceVideo.path} 
                      alt="Reference frame" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem visualização</span>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                    <span className="text-[10px] bg-black/60 px-2 py-1 rounded">
                      {currentMatch.referenceStart.toFixed(2)}s - {currentMatch.referenceEnd.toFixed(2)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Raw Video Match */}
            <div className="flex-1 p-1">
              <div className="flex flex-col h-full">
                <span className="text-xs text-center py-1 bg-primary/20">Substituição</span>
                <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden flex-1">
                  {currentMatch && getRawVideoById(currentMatch.rawVideoId)?.path ? (
                    <img 
                      src={getRawVideoById(currentMatch.rawVideoId)?.preview || getRawVideoById(currentMatch.rawVideoId)?.path} 
                      alt="Raw video frame" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem visualização</span>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                    <span className="text-[10px] bg-black/60 px-2 py-1 rounded">
                      {currentMatch.rawVideoStart.toFixed(2)}s - {currentMatch.rawVideoEnd.toFixed(2)}s
                    </span>
                    <span className="text-[10px] bg-primary/60 px-2 py-1 rounded">
                      {getRawVideoById(currentMatch.rawVideoId)?.name || 'Video não encontrado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video flex items-center justify-center text-muted-foreground text-sm">
          Nenhuma correspondência para visualizar.
          <br />
          Importe vídeos e inicie o processamento para ver os resultados.
        </div>
      )}
    </div>
  );
};

export default SplitViewComparison;
