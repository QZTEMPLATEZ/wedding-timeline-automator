
import React from 'react';
import { ProcessingProgress, SceneMatch, ExportFormat } from '@/lib/types';
import { toast } from "sonner";

interface ProcessingManagerProps {
  processingProgress: ProcessingProgress;
  setProcessingProgress: React.Dispatch<React.SetStateAction<ProcessingProgress>>;
  sceneMatches: SceneMatch[];
  referenceVideoExists: boolean;
  rawVideosExist: boolean;
}

export const ProcessingManager: React.FC<ProcessingManagerProps> = ({
  processingProgress,
  setProcessingProgress,
  sceneMatches,
  referenceVideoExists,
  rawVideosExist
}) => {
  // Handle simulated analysis and export process
  const handleStartProcessing = () => {
    if (!referenceVideoExists || !rawVideosExist) {
      toast.error('Por favor, adicione um vídeo referência e pelo menos um vídeo bruto');
      return;
    }
    
    setProcessingProgress({
      stage: 'analyzing',
      progress: 0,
      message: 'Analisando vídeo referência...'
    });
    
    // Simulate processing stages with timeouts
    setTimeout(() => {
      setProcessingProgress({
        stage: 'matching',
        progress: 30,
        message: 'Identificando cenas e classificando por tipo...'
      });
      
      setTimeout(() => {
        setProcessingProgress({
          stage: 'building',
          progress: 65,
          message: 'Encontrando correspondências nas imagens brutas...'
        });
        
        setTimeout(() => {
          setProcessingProgress({
            stage: 'exporting',
            progress: 90,
            message: 'Finalizando substituições e preparando visualização...'
          });
          
          setTimeout(() => {
            setProcessingProgress({
              stage: 'completed',
              progress: 100
            });
            
            toast.success('Análise e correspondência de cenas concluídas com sucesso');
          }, 1500);
        }, 2000);
      }, 2000);
    }, 2000);
  };
  
  // Handle export
  const handleExport = (format: ExportFormat) => {
    if (sceneMatches.length === 0) {
      toast.error('Nenhuma correspondência de cena disponível para exportar');
      return;
    }
    
    // Simulate export download
    toast.success(`Timeline exportada como ${format.toUpperCase()} com sucesso`);
    
    // In a real app, this would generate and download the export file
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = '#';
      a.download = `wedding_edit_${new Date().getTime()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 500);
  };

  return { handleStartProcessing, handleExport };
};

export default ProcessingManager;
