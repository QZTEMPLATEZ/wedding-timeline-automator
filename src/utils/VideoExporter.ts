
import { SceneMatch, VideoFile } from '@/lib/types';

export class VideoExporter {
  static generateXML(sceneMatches: SceneMatch[], rawVideos: VideoFile[]): string {
    // Gera um arquivo XML compatível com Premiere Pro
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<xmeml version="4">\n';
    xml += '  <sequence>\n';
    xml += '    <name>Wedding Edit</name>\n';
    xml += '    <duration>3600</duration>\n';
    xml += '    <rate>\n';
    xml += '      <timebase>30</timebase>\n';
    xml += '      <ntsc>TRUE</ntsc>\n';
    xml += '    </rate>\n';
    xml += '    <media>\n';
    xml += '      <video>\n';
    
    // Adiciona cada cena à timeline
    sceneMatches.forEach((match, index) => {
      const rawVideo = rawVideos.find(v => v.id === match.rawVideoId);
      if (!rawVideo) return;
      
      xml += `        <track>\n`;
      xml += `          <clipitem id="clipitem-${index+1}">\n`;
      xml += `            <name>${rawVideo.name} - ${match.sceneType}</name>\n`;
      xml += `            <duration>${(match.rawVideoEnd - match.rawVideoStart) * 30}</duration>\n`;
      xml += `            <rate>\n`;
      xml += `              <timebase>30</timebase>\n`;
      xml += `              <ntsc>TRUE</ntsc>\n`;
      xml += `            </rate>\n`;
      xml += `            <start>${match.referenceStart * 30}</start>\n`;
      xml += `            <end>${match.referenceEnd * 30}</end>\n`;
      xml += `            <file id="file-${index+1}">\n`;
      xml += `              <name>${rawVideo.name}</name>\n`;
      xml += `              <pathurl>file://${rawVideo.path}</pathurl>\n`;
      xml += `            </file>\n`;
      xml += `          </clipitem>\n`;
      xml += `        </track>\n`;
    });
    
    xml += '      </video>\n';
    xml += '    </media>\n';
    xml += '  </sequence>\n';
    xml += '</xmeml>';
    
    return xml;
  }
  
  static generateEDL(sceneMatches: SceneMatch[], rawVideos: VideoFile[]): string {
    // Gera um arquivo EDL (Edit Decision List)
    let edl = 'TITLE: Wedding Edit\nFCM: NON-DROP FRAME\n\n';
    
    sceneMatches.forEach((match, index) => {
      const rawVideo = rawVideos.find(v => v.id === match.rawVideoId);
      if (!rawVideo) return;
      
      const eventNum = (index + 1).toString().padStart(3, '0');
      const srcIn = this.formatTimecode(match.rawVideoStart);
      const srcOut = this.formatTimecode(match.rawVideoEnd);
      const recIn = this.formatTimecode(match.referenceStart);
      const recOut = this.formatTimecode(match.referenceEnd);
      
      edl += `${eventNum}  ${rawVideo.name.slice(0, 8)} V     C        ${srcIn} ${srcOut} ${recIn} ${recOut}\n`;
      edl += `* FROM CLIP NAME: ${rawVideo.name}\n`;
      edl += `* SCENE: ${match.sceneType}\n\n`;
    });
    
    return edl;
  }
  
  static generateFCPXML(sceneMatches: SceneMatch[], rawVideos: VideoFile[]): string {
    // Gera um arquivo XML compatível com Final Cut Pro
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<!DOCTYPE fcpxml>\n';
    xml += '<fcpxml version="1.9">\n';
    xml += '  <resources>\n';
    
    // Define recursos (vídeos)
    rawVideos.forEach((video, index) => {
      xml += `    <asset id="asset-${index+1}" name="${video.name}" src="file://${video.path}" />\n`;
    });
    
    xml += '  </resources>\n';
    xml += '  <library>\n';
    xml += '    <event name="Wedding Edit">\n';
    xml += '      <project name="Wedding Timeline">\n';
    xml += '        <sequence>\n';
    xml += '          <spine>\n';
    
    // Adiciona cada cena à timeline
    sceneMatches.forEach((match, index) => {
      const rawVideoIndex = rawVideos.findIndex(v => v.id === match.rawVideoId);
      if (rawVideoIndex === -1) return;
      
      const duration = match.referenceEnd - match.referenceStart;
      
      xml += `            <clip name="${match.sceneType}" offset="${match.referenceStart}s" duration="${duration}s">\n`;
      xml += `              <video ref="asset-${rawVideoIndex+1}" offset="${match.rawVideoStart}s" duration="${duration}s" />\n`;
      xml += `            </clip>\n`;
    });
    
    xml += '          </spine>\n';
    xml += '        </sequence>\n';
    xml += '      </project>\n';
    xml += '    </event>\n';
    xml += '  </library>\n';
    xml += '</fcpxml>';
    
    return xml;
  }
  
  private static formatTimecode(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 30);
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  }
}
