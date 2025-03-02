
export interface VideoFile {
  id: string;
  name: string;
  path: string;
  type: 'raw' | 'reference';
  duration?: number;
  preview?: string;
}

export interface TimelineSegment {
  id: string;
  start: number; // Start time in seconds
  end: number; // End time in seconds
  sourceId: string; // Reference to the source video ID
  type: 'scene' | 'transition';
}

export interface ProcessingProgress {
  stage: 'idle' | 'analyzing' | 'matching' | 'building' | 'exporting' | 'completed' | 'error';
  progress: number; // 0-100
  message?: string;
}

export type ExportFormat = 'xml' | 'edl' | 'fcpxml';
