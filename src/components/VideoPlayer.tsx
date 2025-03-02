
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src?: string;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onDurationChange,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle play/pause
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);
  
  // Handle seeking
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Only update the time if the difference is significant to avoid loop
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  
  return (
    <div className={cn("w-full bg-black/20 rounded-lg overflow-hidden glass-morphism", className)}>
      {src ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={src}
          onTimeUpdate={() => {
            if (videoRef.current) {
              onTimeUpdate(videoRef.current.currentTime);
            }
          }}
          onDurationChange={() => {
            if (videoRef.current) {
              onDurationChange(videoRef.current.duration);
            }
          }}
          onEnded={() => {
            onTimeUpdate(0);
          }}
        />
      ) : (
        <div className="w-full h-full min-h-[240px] flex items-center justify-center bg-black/30 text-muted-foreground text-sm">
          No video selected
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
