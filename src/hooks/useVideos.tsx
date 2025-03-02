
import { useState, useEffect } from 'react';
import { VideoFile, SceneMatch, ProcessingProgress } from '@/lib/types';
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
    currentMatchIndex,
    processingProgress,
    setProcessingProgress,
    handleFilesAdded,
    handleNextScene,
    handlePrevScene
  };
};
