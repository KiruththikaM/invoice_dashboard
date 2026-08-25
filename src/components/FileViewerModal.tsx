import React from 'react';
import { X, Download } from 'lucide-react';

interface FileViewerModalProps {
  fileUrl: string;
  fileType: 'pdf' | 'image';
  title?: string;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ fileUrl, fileType, title = 'Invoice Document', onClose }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = fileUrl.split('/').pop() || `${title.replace(/\s+/g, '-').toLowerCase()}.${fileType === 'pdf' ? 'pdf' : 'png'}`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed, using fallback', error);
      const link = document.createElement('a');
      link.href = fileUrl;
      const fileName = fileUrl.split('/').pop() || `${title.replace(/\s+/g, '-').toLowerCase()}.${fileType === 'pdf' ? 'pdf' : 'png'}`;
      link.setAttribute('download', fileName);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">{title}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${
              fileType === 'pdf' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
              {fileType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium shadow-sm"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors ml-2"
              title="Close modal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-gray-100 flex items-center justify-center">
          {fileType === 'pdf' ? (
            <iframe 
              src={fileUrl} 
              className="w-full h-full border-none"
              title={title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 bg-gray-200/50">
              <img 
                src={fileUrl} 
                alt={title} 
                className="max-w-full max-h-full object-contain drop-shadow-sm" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
