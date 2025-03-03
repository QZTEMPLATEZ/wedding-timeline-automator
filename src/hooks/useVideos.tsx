
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
  
  // Upload state for large files
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isUploading, setIsUploading] = useState(false);

  // Handle file uploads with chunking for large files
  const handleFilesAdded = (files: VideoFile[], type: 'raw' | 'reference') => {
    if (type === 'reference') {
      // Check file size
      if (files[0].size && files[0].size > 1000000000) { // > 1GB
        handleLargeFileUpload(files[0], type);
      } else {
        setReferenceVideo(files[0]);
        toast.success(`Vídeo referência "${files[0].name}" carregado com sucesso`);
      }
    } else {
      const largeFiles = files.filter(file => file.size && file.size > 1000000000);
      const regularFiles = files.filter(file => !file.size || file.size <= 1000000000);
      
      // Handle regular files immediately
      if (regularFiles.length > 0) {
        setRawVideos((prevVideos) => [...prevVideos, ...regularFiles]);
        toast.success(`${regularFiles.length} vídeo${regularFiles.length > 1 ? 's' : ''} bruto${regularFiles.length > 1 ? 's' : ''} carregado${regularFiles.length > 1 ? 's' : ''} com sucesso`);
      }
      
      // Handle large files with chunking
      if (largeFiles.length > 0) {
        largeFiles.forEach(file => handleLargeFileUpload(file, type));
      }
    }
  };
  
  // Function to handle large file uploads with chunking
  const handleLargeFileUpload = (file: VideoFile, type: 'raw' | 'reference') => {
    // In a real implementation, this would use the File API to split the file into chunks
    // and upload each chunk separately, tracking progress
    
    setIsUploading(true);
    setUploadProgress(prev => ({ ...prev, [file.id]: 0 }));
    
    // Simulate chunk upload with progress
    let progress = 0;
    const totalChunks = 20; // Simulate 20 chunks
    const updateInterval = setInterval(() => {
      progress += 5;
      setUploadProgress(prev => ({ ...prev, [file.id]: Math.min(progress, 100) }));
      
      // When done
      if (progress >= 100) {
        clearInterval(updateInterval);
        setIsUploading(false);
        
        // Add the file to our state
        if (type === 'reference') {
          setReferenceVideo(file);
          toast.success(`Vídeo referência grande "${file.name}" processado com sucesso`);
        } else {
          setRawVideos(prev => [...prev, file]);
          toast.success(`Vídeo bruto grande "${file.name}" processado com sucesso`);
        }
        
        // Clean up progress tracking
        setUploadProgress(prev => {
          const newState = { ...prev };
          delete newState[file.id];
          return newState;
        });
      }
    }, 300);
  };
  
  // Capture optimized video thumbnails
  const generateThumbnail = async (videoFile: VideoFile): Promise<string> => {
    // In a real implementation, we would use HTML5 Canvas or a library to generate a thumbnail
    // For now, we'll just return a placeholder
    return videoFile.preview || '';
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

  // Cancel an ongoing upload
  const cancelUpload = (fileId: string) => {
    // In a real implementation, this would abort the fetch/upload process
    setUploadProgress(prev => {
      const newState = { ...prev };
      delete newState[fileId];
      return newState;
    });
    toast.info(`Upload cancelado`);
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
    setRawVideosCategories,
    uploadProgress,
    isUploading,
    cancelUpload,
    generateThumbnail
  };
};
