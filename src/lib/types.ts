
export interface VideoFile {
  id: string;
  name: string;
  path: string;
  type: 'raw' | 'reference';
  duration?: number;
  preview?: string;
}

export interface SceneMatch {
  id: string;
  referenceStart: number; // Start time in reference video (seconds)
  referenceEnd: number; // End time in reference video (seconds)
  rawVideoId: string; // ID of the matching raw video
  rawVideoStart: number; // Start time in raw video (seconds)
  rawVideoEnd: number; // End time in raw video (seconds)
  similarityScore: number; // 0-1 score of how similar the scenes are
  sceneType: 'making_of_bride' | 'making_of_groom' | 'ceremony' | 'decoration' | 'party' | 'unknown';
}

export interface ProcessingProgress {
  stage: 'idle' | 'analyzing' | 'matching' | 'building' | 'exporting' | 'completed' | 'error';
  progress: number; // 0-100
  message?: string;
}

export type ExportFormat = 'xml' | 'edl' | 'fcpxml';

// Add TimelineSegment interface to fix build error
export interface TimelineSegment {
  id: string;
  start: number;
  end: number;
  type: string;
  color?: string;
}
