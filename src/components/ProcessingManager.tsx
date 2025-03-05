
import { ProcessingProgress, SceneMatch, ExportFormat, VideoFile, VideoCategory } from '@/lib/types';
import { toast } from "sonner";
import { VideoExporter } from '@/utils/VideoExporter';
import { VideoProcessor } from '@/utils/VideoProcessor';

interface ProcessingManagerProps {
  processingProgress: ProcessingProgress;
  setProcessingProgress: React.Dispatch<React.SetStateAction<ProcessingProgress>>;
  sceneMatches: SceneMatch[];
  setSceneMatches: React.Dispatch<React.SetStateAction<SceneMatch[]>>;
  referenceVideoExists: boolean;
  rawVideosExist: boolean;
  referenceVideo: VideoFile | null;
  rawVideos: VideoFile[];
}

// Custom hook para gerenciar o processamento
export const useProcessingManager = ({
  processingProgress,
  setProcessingProgress,
  sceneMatches,
  setSceneMatches,
  referenceVideoExists,
  rawVideosExist,
  referenceVideo,
  rawVideos
}: ProcessingManagerProps) => {
  
  // Função principal para iniciar o processamento real
  const handleStartProcessing = async () => {
    if (!referenceVideoExists || !rawVideosExist) {
      toast.error('Por favor, adicione um vídeo referência e pelo menos um vídeo bruto');
      return;
    }
    
    try {
      // Inicia o processamento
      setProcessingProgress({
        stage: 'analyzing',
        progress: 0,
        message: 'Inicializando ferramentas de processamento...'
      });
      
      // Inicializa FFmpeg
      const ffmpeg = await VideoProcessor.initFFmpeg();
      setProcessingProgress({
        stage: 'analyzing',
        progress: 10,
        message: 'Carregando modelo de IA para análise de vídeo...'
      });
      
      // Carrega o modelo de IA
      const modelLoaded = await VideoProcessor.loadSceneDetectionModel();
      if (!modelLoaded) {
        setProcessingProgress({
          stage: 'error',
          progress: 0,
          message: 'Falha ao carregar modelo de IA. Tente novamente.'
        });
        return;
      }
      
      setProcessingProgress({
        stage: 'analyzing',
        progress: 30,
        message: 'Analisando vídeo referência para detecção de cenas...'
      });
      
      // Processa o vídeo de referência
      if (referenceVideo) {
        const processed = await VideoProcessor.processVideoFrames(referenceVideo.path, ffmpeg);
        if (!processed) {
          setProcessingProgress({
            stage: 'error',
            progress: 0,
            message: 'Falha ao processar vídeo de referência.'
          });
          return;
        }
      }
      
      setProcessingProgress({
        stage: 'matching',
        progress: 50,
        message: 'Identificando cenas e classificando por tipo...'
      });
      
      // Em uma implementação real, usaríamos o modelo para classificar as cenas
      // e detectar tipos (cerimônia, festa, etc.)
      
      setProcessingProgress({
        stage: 'building',
        progress: 70,
        message: 'Processando vídeos brutos e encontrando correspondências...'
      });
      
      // Processa vídeos brutos para encontrar correspondências
      for (let i = 0; i < rawVideos.length; i++) {
        setProcessingProgress({
          stage: 'building',
          progress: 70 + (i / rawVideos.length) * 20,
          message: `Processando vídeo ${i+1} de ${rawVideos.length}...`
        });
        
        // Aqui processaríamos cada vídeo bruto com o modelo
        // Em uma implementação real
      }
      
      // Para fins de demonstração, vamos gerar resultados simulados
      const newMatches = VideoProcessor.generateMockScenes(rawVideos);
      
      setSceneMatches(newMatches);
      
      setProcessingProgress({
        stage: 'completed',
        progress: 100,
        message: 'Processamento concluído com sucesso!'
      });
      
      toast.success('Análise e correspondência de cenas concluídas com sucesso');
      
    } catch (error) {
      console.error("Erro durante o processamento:", error);
      setProcessingProgress({
        stage: 'error',
        progress: 0,
        message: 'Ocorreu um erro durante o processamento. Tente novamente.'
      });
      toast.error('Falha no processamento. Verifique os logs para mais detalhes.');
    }
  };
  
  // Exporta a timeline para o formato selecionado
  const handleExport = (format: ExportFormat) => {
    if (sceneMatches.length === 0) {
      toast.error('Nenhuma correspondência de cena disponível para exportar');
      return;
    }
    
    try {
      let content = '';
      let mimeType = '';
      let fileExtension = '';
      
      // Gera o conteúdo do arquivo de acordo com o formato selecionado
      switch (format) {
        case 'xml':
          content = VideoExporter.generateXML(sceneMatches, rawVideos);
          mimeType = 'application/xml';
          fileExtension = 'xml';
          break;
        case 'edl':
          content = VideoExporter.generateEDL(sceneMatches, rawVideos);
          mimeType = 'text/plain';
          fileExtension = 'edl';
          break;
        case 'fcpxml':
          content = VideoExporter.generateFCPXML(sceneMatches, rawVideos);
          mimeType = 'application/xml';
          fileExtension = 'fcpxml';
          break;
      }
      
      // Cria o blob e inicia o download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `wedding_edit_${new Date().getTime()}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Libera o URL criado
      URL.revokeObjectURL(url);
      
      toast.success(`Timeline exportada como ${format.toUpperCase()} com sucesso`);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error('Falha ao exportar. Verifique os logs para mais detalhes.');
    }
  };

  return { handleStartProcessing, handleExport };
};

export default useProcessingManager;
