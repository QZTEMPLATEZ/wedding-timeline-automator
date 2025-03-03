
import { useState, useEffect } from 'react';
import { VideoFile, SceneMatch, ProcessingProgress, VideoCategory } from '@/lib/types';
import { toast } from "sonner";

export const useVideos = () => {
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
  
  // Set categories for raw videos
  const setRawVideosCategories = (videoId: string, category: VideoCategory) => {
    setRawVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId ? { ...video, category } : video
      )
    );
  };

  // Scene navigation handlers
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

  return {
    rawVideos,
    referenceVideo,
    sceneMatches,
    setSceneMatches,
    currentMatchIndex,
    processingProgress,
    setProcessingProgress,
    handleFilesAdded,
    handleNextScene,
    handlePrevScene,
    setRawVideosCategories
  };
};
