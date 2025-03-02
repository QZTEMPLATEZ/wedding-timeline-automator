
import React from 'react';
import { cn } from '@/lib/utils';
import { ProcessingProgress } from '@/lib/types';

interface ProcessingIndicatorProps {
  progress: ProcessingProgress;
  className?: string;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({
  progress,
  className
}) => {
  const getStageLabel = (stage: ProcessingProgress['stage']) => {
    switch (stage) {
      case 'idle': return 'Ready';
      case 'analyzing': return 'Analyzing videos';
      case 'matching': return 'Matching scenes';
      case 'building': return 'Building timeline';
      case 'exporting': return 'Generating export file';
      case 'completed': return 'Process completed';
      case 'error': return 'Error';
      default: return 'Unknown stage';
    }
  };
  
  const getStatusColor = (stage: ProcessingProgress['stage']) => {
    switch (stage) {
      case 'idle': return 'bg-secondary/50';
      case 'analyzing':
      case 'matching':
      case 'building':
      case 'exporting':
        return 'bg-primary animate-pulse-processing';
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-destructive';
      default: return 'bg-secondary';
    }
  };
  
  const isActive = progress.stage !== 'idle' && progress.stage !== 'completed' && progress.stage !== 'error';
  
  return (
    <div className={cn("neo-blur rounded-lg p-4", className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-3 h-3 rounded-full", getStatusColor(progress.stage))} />
        <span className="text-sm font-medium">{getStageLabel(progress.stage)}</span>
      </div>
      
      {isActive && (
        <>
          <div className="w-full h-1.5 bg-secondary/30 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{progress.message || 'Processing...'}</span>
            <span className="font-mono">{progress.progress.toFixed(0)}%</span>
          </div>
        </>
      )}
      
      {progress.stage === 'completed' && (
        <p className="text-xs text-muted-foreground">Your export file is ready to be downloaded.</p>
      )}
      
      {progress.stage === 'error' && (
        <p className="text-xs text-destructive">{progress.message || 'An error occurred during processing.'}</p>
      )}
    </div>
  );
};

export default ProcessingIndicator;
