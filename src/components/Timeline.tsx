
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TimelineSegment, VideoFile } from '@/lib/types';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface TimelineProps {
  segments: TimelineSegment[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  className?: string;
  videos?: VideoFile[];
}

export const Timeline: React.FC<TimelineProps> = ({
  segments,
  duration,
  currentTime,
  onSeek,
  isPlaying,
  onPlayPause,
  className,
  videos = []
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Convert time in seconds to a formatted string (MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle timeline clicks for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;
    const seekTime = percent * duration;
    onSeek(seekTime);
  };
  
  // Handle mouse down for dragging playhead
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };
  
  // Handle mouse move for continuous seeking during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, offsetX / rect.width));
      const seekTime = percent * duration;
      onSeek(seekTime);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, onSeek]);
  
  // Calculate playhead position as percentage
  const playheadPosition = `${(currentTime / duration) * 100}%`;
  
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-1">
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-xs font-mono text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div 
        ref={timelineRef}
        className="timeline-track"
        onClick={handleTimelineClick}
        onMouseDown={handleMouseDown}
      >
        {segments.map((segment) => {
          const startPercent = (segment.start / duration) * 100;
          const widthPercent = ((segment.end - segment.start) / duration) * 100;
          
          return (
            <div 
              key={segment.id}
              className="timeline-segment"
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`
              }}
              title={`${videos.find(v => v.id === segment.sourceId)?.name || 'Unknown'} (${formatTime(segment.start)}-${formatTime(segment.end)})`}
            />
          );
        })}
        
        <div 
          className="timeline-playhead"
          style={{ left: playheadPosition }}
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>00:00</span>
        <span>{formatTime(duration / 4)}</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime(duration * 3 / 4)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Timeline;
