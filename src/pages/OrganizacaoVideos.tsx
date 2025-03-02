
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { VideoFile, VideoCategory } from '@/lib/types';
import { useVideos } from '@/hooks/useVideos';
import { ArrowLeft, CheckCircle, PlayCircle, Tag } from 'lucide-react';
import { toast } from 'sonner';

const videoCategories: { value: VideoCategory; label: string; color: string }[] = [
  { value: 'making_of_bride', label: 'Making of Noiva', color: 'bg-pink-500' },
  { value: 'making_of_groom', label: 'Making of Noivo', color: 'bg-blue-500' },
  { value: 'ceremony', label: 'Cerimônia', color: 'bg-amber-500' },
  { value: 'decoration', label: 'Decoração', color: 'bg-emerald-500' },
  { value: 'party', label: 'Festa', color: 'bg-purple-500' },
  { value: 'unknown', label: 'Outros', color: 'bg-gray-500' },
];

const OrganizacaoVideos: React.FC = () => {
  const { rawVideos, setRawVideosCategories } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);

  // Preview video handler
  const handlePreviewVideo = (video: VideoFile) => {
    setSelectedVideo(video);
  };

  // Set category for a video
  const handleSetCategory = (video: VideoFile, category: VideoCategory) => {
    setRawVideosCategories(video.id, category);
    setSelectedCategory(category);
    toast.success(`Vídeo "${video.name}" categorizado como "${videoCategories.find(c => c.value === category)?.label}"`);
  };

  // Get category label
  const getCategoryLabel = (category?: VideoCategory) => {
    if (!category) return 'Não categorizado';
    return videoCategories.find(c => c.value === category)?.label || 'Desconhecido';
  };

  // Get category color
  const getCategoryColor = (category?: VideoCategory) => {
    if (!category) return 'bg-gray-300';
    return videoCategories.find(c => c.value === category)?.color || 'bg-gray-500';
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-xl font-bold">Organização de Vídeos</h1>
        </div>

        <div className="glass-morphism rounded-lg p-4">
          <h2 className="text-sm font-medium mb-4">Instruções</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Organize seus vídeos em categorias para melhorar a precisão do processo de substituição automática.
            Categorizar os vídeos ajuda o sistema a encontrar cenas similares dentro do mesmo contexto.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {videoCategories.map((category) => (
              <div key={category.value} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <span className="text-xs">{category.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 neo-blur rounded-lg p-4 h-fit">
            <h2 className="text-sm font-medium mb-3">Vídeos Brutos ({rawVideos.length})</h2>
            
            {rawVideos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-2">Nenhum vídeo bruto adicionado</p>
                <Link to="/" className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Adicionar Vídeos
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {rawVideos.map((video) => (
                  <div 
                    key={video.id} 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors cursor-pointer ${selectedVideo?.id === video.id ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                    onClick={() => handlePreviewVideo(video)}
                  >
                    <div className="w-12 h-12 bg-black/50 rounded flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-6 h-6 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{video.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(video.category)}`}></div>
                        <p className="text-xs text-muted-foreground truncate">{getCategoryLabel(video.category)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {selectedVideo ? (
              <>
                <div className="glass-morphism rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">{selectedVideo.name}</h3>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getCategoryColor(selectedVideo.category)}`}></div>
                      <span className="text-xs text-muted-foreground">{getCategoryLabel(selectedVideo.category)}</span>
                    </div>
                  </div>
                  <div className="aspect-video bg-black/90 rounded-md flex items-center justify-center mb-3">
                    {selectedVideo.path ? (
                      <video 
                        src={selectedVideo.path} 
                        className="w-full h-full rounded-md" 
                        controls 
                      />
                    ) : (
                      <div className="text-white/50 text-sm">Preview não disponível</div>
                    )}
                  </div>
                </div>

                <div className="neo-blur rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Categorizar Este Vídeo
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {videoCategories.map((category) => (
                      <button
                        key={category.value}
                        className={`flex items-center gap-2 p-2 rounded-md border transition-all ${
                          selectedVideo.category === category.value 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/30 hover:bg-primary/5'
                        }`}
                        onClick={() => handleSetCategory(selectedVideo, category.value)}
                      >
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="text-xs">{category.label}</span>
                        {selectedVideo.category === category.value && (
                          <CheckCircle className="w-3 h-3 ml-auto text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-morphism rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Tag className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-base font-medium mb-2">Selecione um vídeo para categorizar</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Clique em um vídeo na lista à esquerda para visualizá-lo e atribuir uma categoria.
                  A categorização ajuda o sistema a encontrar cenas similares com mais precisão.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizacaoVideos;
