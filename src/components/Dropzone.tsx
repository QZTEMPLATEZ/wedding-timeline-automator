
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, FileVideo, Plus, File } from 'lucide-react';
import { VideoFile } from '@/lib/types';

interface DropzoneProps {
  onFilesAdded: (files: VideoFile[], type: 'raw' | 'reference') => void;
  type: 'raw' | 'reference';
  className?: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  files?: VideoFile[];
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesAdded,
  type,
  className,
  label,
  accept = 'video/*',
  multiple = true,
  files = []
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const videoFiles: VideoFile[] = droppedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      path: URL.createObjectURL(file),
      type: type,
    }));

    onFilesAdded(videoFiles, type);
  }, [onFilesAdded, type]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const videoFiles: VideoFile[] = selectedFiles.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        path: URL.createObjectURL(file),
        type: type,
      }));

      onFilesAdded(videoFiles, type);
    }
  }, [onFilesAdded, type]);

  return (
    <div className={cn("flex flex-col", className)}>
      <label 
        htmlFor={`file-upload-${type}`}
        className={cn(
          "glass-morphism border border-dashed rounded-lg cursor-pointer",
          "flex flex-col items-center justify-center p-6 transition-all duration-200",
          "hover:border-primary/40 hover:bg-primary/5",
          isDragging ? "border-primary/70 bg-primary/10" : "border-border/50",
          files.length > 0 ? "h-auto" : "h-40"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {files.length === 0 ? (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-scale-in">
                {type === 'reference' ? (
                  <FileVideo className="w-6 h-6 text-primary" />
                ) : (
                  <Upload className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-sm mb-1 font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
              <span className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                {type === 'reference' ? '1 video max' : 'Multiple videos'}
              </span>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</h3>
                <button
                  type="button"
                  className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById(`file-upload-${type}`)?.click();
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Add more
                </button>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center gap-2 text-xs p-2 rounded-md bg-secondary/30"
                  >
                    <File className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate flex-1">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <input
          id={`file-upload-${type}`}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple && type !== 'reference'}
        />
      </label>
    </div>
  );
};

export default Dropzone;
