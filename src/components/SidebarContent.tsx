
import React from 'react';
import { ProcessingProgress, ExportFormat } from '@/lib/types';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import ExportOptions from '@/components/ExportOptions';

interface SidebarContentProps {
  processingProgress: ProcessingProgress;
  handleStartProcessing: () => void;
  handleExport: (format: ExportFormat) => void;
  disableExport: boolean;
  disableProcessing: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  processingProgress,
  handleStartProcessing,
  handleExport,
  disableExport,
  disableProcessing
}) => {
  return (
    <div className="flex flex-col gap-6">
      <ProcessingIndicator 
        progress={processingProgress}
      />
      
      {/* Process button */}
      <div className="neo-blur rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3">Processamento</h3>
        <button
          type="button"
          disabled={disableProcessing}
          className="w-full py-2.5 px-4 rounded-md transition-all bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          onClick={handleStartProcessing}
        >
          <span>Iniciar Análise Automática</span>
        </button>
        <p className="text-xs text-muted-foreground">
          Analisa o vídeo referência e encontra correspondências nos vídeos brutos com base na similaridade visual.
        </p>
      </div>
      
      <ExportOptions
        onExport={handleExport}
        disabled={disableExport}
      />
      
      {/* Instructions */}
      <div className="neo-blur rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Como Funciona</h3>
        <ol className="text-xs text-muted-foreground space-y-3 list-decimal pl-4">
          <li>Faça upload de um <span className="text-foreground">vídeo referência</span> - um vídeo de casamento já editado</li>
          <li>Adicione seus <span className="text-foreground">vídeos brutos</span> que deseja usar para uma nova edição</li>
          <li>Clique em <span className="text-foreground">Iniciar Análise Automática</span> para analisar o vídeo referência e criar uma nova edição com suas imagens</li>
          <li>Revise as correspondências de cenas geradas pela IA</li>
          <li>Exporte o arquivo para importar no seu software de edição preferido</li>
        </ol>
      </div>
    </div>
  );
};

export default SidebarContent;
