
import React from 'react';
import Layout from '@/components/Layout';
import MainContent from '@/components/MainContent';
import SidebarContent from '@/components/SidebarContent';
import { useVideos } from '@/hooks/useVideos';
import { useProcessingManager } from '@/components/ProcessingManager';

const Index: React.FC = () => {
  // Get video state and handlers from hooks
  const {
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
    uploadProgress,
    isUploading,
    cancelUpload
  } = useVideos();
  
  // Get processing handlers from the custom hook
  const { handleStartProcessing, handleExport } = useProcessingManager({
    processingProgress,
    setProcessingProgress,
    sceneMatches,
    setSceneMatches,
    referenceVideoExists: !!referenceVideo,
    rawVideosExist: rawVideos.length > 0,
    referenceVideo,
    rawVideos
  });
  
  // Calculate current match
  const currentMatch = sceneMatches.length > 0 ? sceneMatches[currentMatchIndex] : null;
  
  // Calculate disabled states
  const disableProcessing = !referenceVideo || rawVideos.length === 0 || 
    (processingProgress.stage !== 'idle' && processingProgress.stage !== 'completed') ||
    isUploading;
  const disableExport = sceneMatches.length === 0;
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MainContent 
          referenceVideo={referenceVideo}
          rawVideos={rawVideos}
          currentMatch={currentMatch}
          sceneMatches={sceneMatches}
          currentMatchIndex={currentMatchIndex}
          handlePrevScene={handlePrevScene}
          handleNextScene={handleNextScene}
          handleFilesAdded={handleFilesAdded}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
          cancelUpload={cancelUpload}
        />
        
        <SidebarContent 
          processingProgress={processingProgress}
          handleStartProcessing={handleStartProcessing}
          handleExport={handleExport}
          disableExport={disableExport}
          disableProcessing={disableProcessing}
        />
      </div>
    </Layout>
  );
};

export default Index;
