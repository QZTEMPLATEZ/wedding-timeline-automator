
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Dropzone from '@/components/Dropzone';
import SplitViewComparison from '@/components/SplitViewComparison';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import ExportOptions from '@/components/ExportOptions';
import { VideoFile, ProcessingProgress, SceneMatch, ExportFormat } from '@/lib/types';
import { toast } from "sonner";

const Index: React.FC = () => {
  // Video files state
  const [rawVideos, setRawVideos] = useState<VideoFile[]>([]);
  const [referenceVideo, setReferenceVideo] = useState<VideoFile | null>(null);
  
  // Matching state
  const [sceneMatches, setSceneMatches] = useState<SceneMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
  // Processing state
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({
    stage: 'idle',
    progress: 0
  });

  // Handle file uploads
  const handleFilesAdded = (files: VideoFile[], type: 'raw' | 'reference') => {
    if (type === 'reference') {
      setReferenceVideo(files[0]);
      toast.success(`Vídeo referência "${files[0].name}" carregado com sucesso`);
    } else {
      setRawVideos((prevVideos) => [...prevVideos, ...files]);
      toast.success(`${files.length} vídeo${files.length > 1 ? 's' : ''} bruto${files.length > 1 ? 's' : ''} carregado${files.length > 1 ? 's' : ''} com sucesso`);
    }
  };
  
  // Generate mock scene matches when videos are loaded
  useEffect(() => {
    if (referenceVideo && rawVideos.length > 0 && processingProgress.stage === 'completed') {
      // This is just simulated data - in a real app this would come from the analysis process
      const mockSceneTypes: SceneMatch['sceneType'][] = [
        'making_of_bride', 'making_of_groom', 'ceremony', 'decoration', 'party'
      ];
      
      const newMatches: SceneMatch[] = [];
      let currentTime = 0;
      
      // Generate 8-12 random scene matches
      const numScenes = Math.floor(Math.random() * 5) + 8; // 8-12 scenes
      
      for (let i = 0; i < numScenes; i++) {
        const sceneDuration = Math.random() * 15 + 5; // 5-20 seconds
        const randomRawVideo = rawVideos[Math.floor(Math.random() * rawVideos.length)];
        const rawVideoStart = Math.random() * 30; // Random start time in raw video
        
        newMatches.push({
          id: `match-${i}`,
          referenceStart: currentTime,
          referenceEnd: currentTime + sceneDuration,
          rawVideoId: randomRawVideo.id,
          rawVideoStart: rawVideoStart,
          rawVideoEnd: rawVideoStart + sceneDuration,
          similarityScore: Math.random() * 0.3 + 0.7, // 0.7-1.0 similarity score
          sceneType: mockSceneTypes[Math.floor(Math.random() * mockSceneTypes.length)]
        });
        
        currentTime += sceneDuration;
      }
      
      setSceneMatches(newMatches);
    }
  }, [referenceVideo, rawVideos, processingProgress.stage]);
  
  // Handle scene navigation
  const handleNextScene = () => {
    if (sceneMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % sceneMatches.length);
    }
  };
  
  const handlePrevScene = () => {
    if (sceneMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + sceneMatches.length) % sceneMatches.length);
    }
  };
  
  // Handle simulated analysis and export process
  const handleStartProcessing = () => {
    if (!referenceVideo || rawVideos.length === 0) {
      toast.error('Por favor, adicione um vídeo referência e pelo menos um vídeo bruto');
      return;
    }
    
    setSceneMatches([]);
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
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Split View Comparison */}
          <div className="glass-morphism rounded-lg p-4">
            <h2 className="text-sm font-medium mb-3">Visualização de Cenas</h2>
            <SplitViewComparison
              referenceVideo={referenceVideo}
              rawVideos={rawVideos}
              currentMatch={sceneMatches.length > 0 ? sceneMatches[currentMatchIndex] : null}
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
            
            <Dropzone
              onFilesAdded={(files) => handleFilesAdded(files, 'raw')}
              type="raw"
              label="Vídeos Brutos"
              multiple={true}
              files={rawVideos}
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <ProcessingIndicator 
            progress={processingProgress}
          />
          
          {/* Process button */}
          <div className="neo-blur rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Processamento</h3>
            <button
              type="button"
              disabled={!referenceVideo || rawVideos.length === 0 || processingProgress.stage !== 'idle' && processingProgress.stage !== 'completed'}
              className="w-full py-2.5 px-4 rounded-md transition-all bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              onClick={handleStartProcessing}
            >
              <span>Iniciar Análise Automática</span>
            </button>
            <p className="text-xs text-muted-foreground">
              Analisa o vídeo referência e encontra correspondências nos vídeos brutos com base na similaridade visual.
            </p>
          </div>
          
          <ExportOptions
            onExport={handleExport}
            disabled={sceneMatches.length === 0}
          />
          
          {/* Instructions */}
          <div className="neo-blur rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Como Funciona</h3>
            <ol className="text-xs text-muted-foreground space-y-3 list-decimal pl-4">
              <li>Faça upload de um <span className="text-foreground">vídeo referência</span> - um vídeo de casamento já editado</li>
              <li>Adicione seus <span className="text-foreground">vídeos brutos</span> que deseja usar para uma nova edição</li>
              <li>Clique em <span className="text-foreground">Iniciar Análise Automática</span> para analisar o vídeo referência e criar uma nova edição com suas imagens</li>
              <li>Revise as correspondências de cenas geradas pela IA</li>
              <li>Exporte o arquivo para importar no seu software de edição preferido</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
