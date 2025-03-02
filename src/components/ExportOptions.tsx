
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ExportFormat } from '@/lib/types';
import { Download, Check } from 'lucide-react';

interface ExportOptionsProps {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
  className?: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  disabled = false,
  className
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xml');
  
  const formats: { value: ExportFormat; label: string; description: string }[] = [
    { 
      value: 'xml', 
      label: 'Premiere Pro XML', 
      description: 'Compatible with Adobe Premiere Pro' 
    },
    { 
      value: 'edl', 
      label: 'EDL', 
      description: 'Compatible with most editing software' 
    },
    { 
      value: 'fcpxml', 
      label: 'Final Cut Pro XML', 
      description: 'Compatible with Apple Final Cut Pro' 
    }
  ];
  
  return (
    <div className={cn("neo-blur rounded-lg p-4", className)}>
      <h3 className="text-sm font-medium mb-3">Export Format</h3>
      
      <div className="space-y-2 mb-4">
        {formats.map((format) => (
          <button
            key={format.value}
            type="button"
            disabled={disabled}
            className={cn(
              "w-full text-left p-3 rounded-md transition-all flex items-start gap-3",
              "hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary/40",
              selectedFormat === format.value 
                ? "bg-primary/10 border border-primary/30" 
                : "border border-transparent",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => setSelectedFormat(format.value)}
          >
            <div className={cn(
              "w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center",
              selectedFormat === format.value 
                ? "border-primary bg-primary/20" 
                : "border-muted-foreground"
            )}>
              {selectedFormat === format.value && (
                <Check className="w-3 h-3 text-primary" />
              )}
            </div>
            
            <div>
              <span className="block text-sm font-medium">{format.label}</span>
              <span className="block text-xs text-muted-foreground">{format.description}</span>
            </div>
          </button>
        ))}
      </div>
      
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "w-full py-2.5 px-4 rounded-md transition-all",
          "bg-primary text-primary-foreground flex items-center justify-center gap-2",
          "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => onExport(selectedFormat)}
      >
        <Download className="w-4 h-4" />
        <span>Export Timeline</span>
      </button>
    </div>
  );
};

export default ExportOptions;
