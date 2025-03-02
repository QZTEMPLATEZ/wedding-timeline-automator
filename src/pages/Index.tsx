
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Dropzone from '@/components/Dropzone';
import Timeline from '@/components/Timeline';
import VideoPlayer from '@/components/VideoPlayer';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import ExportOptions from '@/components/ExportOptions';
import { VideoFile, ProcessingProgress, TimelineSegment, ExportFormat } from '@/lib/types';
import { toast } from "sonner";

const Index: React.FC = () => {
  // Video files state
  const [rawVideos, setRawVideos] = useState<VideoFile[]>([]);
  const [referenceVideo, setReferenceVideo] = useState<VideoFile | null>(null);
  
  // Player state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Timeline segments - these would be generated from analysis in a real app
  const [timelineSegments, setTimelineSegments] = useState<TimelineSegment[]>([]);
  
  // Processing state
  const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({
    stage: 'idle',
    progress: 0
  });

  // Handle file uploads
  const handleFilesAdded = (files: VideoFile[], type: 'raw' | 'reference') => {
    if (type === 'reference') {
      setReferenceVideo(files[0]);
      toast.success(`Reference video "${files[0].name}" loaded successfully`);
    } else {
      setRawVideos((prevVideos) => [...prevVideos, ...files]);
      toast.success(`${files.length} raw video${files.length > 1 ? 's' : ''} loaded successfully`);
    }
  };
  
  // Handle seeking in the timeline
  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };
  
  // Handle simulated export process
  const handleExport = (format: ExportFormat) => {
    setProcessingProgress({
      stage: 'analyzing',
      progress: 0,
      message: 'Analyzing reference video...'
    });
    
    // Simulate processing stages with timeouts
    setTimeout(() => {
      setProcessingProgress({
        stage: 'matching',
        progress: 25,
        message: 'Matching scenes with raw footage...'
      });
      
      setTimeout(() => {
        setProcessingProgress({
          stage: 'building',
          progress: 60,
          message: 'Building timeline structure...'
        });
        
        setTimeout(() => {
          setProcessingProgress({
            stage: 'exporting',
            progress: 85,
            message: `Generating ${format.toUpperCase()} file...`
          });
          
          setTimeout(() => {
            setProcessingProgress({
              stage: 'completed',
              progress: 100
            });
            
            toast.success(`Timeline exported as ${format.toUpperCase()} successfully`);
          }, 1500);
        }, 2000);
      }, 2000);
    }, 2000);
  };
  
  // Generate mock timeline segments when a reference video is loaded
  useEffect(() => {
    if (referenceVideo && duration > 0) {
      // Create random segments for demonstration
      const segments: TimelineSegment[] = [];
      let currentPosition = 0;
      
      while (currentPosition < duration) {
        const segmentDuration = Math.random() * 20 + 3; // Random duration between 3-23 seconds
        
        if (currentPosition + segmentDuration > duration) {
          // Last segment
          segments.push({
            id: `segment-${segments.length}`,
            start: currentPosition,
            end: duration,
            sourceId: referenceVideo.id,
            type: 'scene'
          });
          break;
        }
        
        segments.push({
          id: `segment-${segments.length}`,
          start: currentPosition,
          end: currentPosition + segmentDuration,
          sourceId: referenceVideo.id,
          type: 'scene'
        });
        
        currentPosition += segmentDuration;
      }
      
      setTimelineSegments(segments);
    }
  }, [referenceVideo, duration]);
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Video player section */}
          <div className="glass-morphism rounded-lg p-4">
            <h2 className="text-sm font-medium mb-3">Preview</h2>
            <VideoPlayer
              src={referenceVideo?.path}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setDuration}
              className="aspect-video"
            />
            
            {/* Timeline */}
            {referenceVideo && duration > 0 && (
              <Timeline
                segments={timelineSegments}
                duration={duration}
                currentTime={currentTime}
                onSeek={handleSeek}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                className="mt-4"
                videos={referenceVideo ? [referenceVideo, ...rawVideos] : rawVideos}
              />
            )}
          </div>
          
          {/* Upload section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropzone
              onFilesAdded={(files) => handleFilesAdded(files, 'reference')}
              type="reference"
              label="Reference Video"
              multiple={false}
              files={referenceVideo ? [referenceVideo] : []}
            />
            
            <Dropzone
              onFilesAdded={(files) => handleFilesAdded(files, 'raw')}
              type="raw"
              label="Raw Footage"
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
          
          <ExportOptions
            onExport={handleExport}
            disabled={!referenceVideo || rawVideos.length === 0 || processingProgress.stage !== 'idle' && processingProgress.stage !== 'completed'}
          />
          
          {/* Instructions */}
          <div className="neo-blur rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">How it works</h3>
            <ol className="text-xs text-muted-foreground space-y-3 list-decimal pl-4">
              <li>Upload a <span className="text-foreground">reference video</span> - an already edited wedding video</li>
              <li>Add your <span className="text-foreground">raw footage</span> that you want to use for a new edit</li>
              <li>Click <span className="text-foreground">Export Timeline</span> to analyze the reference and create a new edit with your footage</li>
              <li>Import the generated file into your preferred editing software</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
