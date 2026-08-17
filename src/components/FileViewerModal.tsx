import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor';
import { X } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface FileViewerModalProps {
  fileUrl: string;
  fileType: 'pdf' | 'image';
  title?: string;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ fileUrl, fileType, title = 'Invoice Document', onClose }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">{title}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${fileType === 'pdf' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
              {fileType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <div className="flex-1 overflow-hidden relative bg-gray-100">
          {fileType === 'pdf' ? (
            <div className="h-full w-full">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
          ) : (
            <div className="h-full w-full relative">
              <FilerobotImageEditor
                source={fileUrl}
                onSave={(editedImageObject) => {
                  if (editedImageObject.imageBase64) {
                    const link = document.createElement('a');
                    link.href = editedImageObject.imageBase64;
                    link.download = `edited-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
                    link.click();
                  }
                }}
                onClose={onClose}
                annotationsCommon={{ fill: '#ff0000' }}
                Text={{ text: 'Invoice Note' }}
                tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE]}
                defaultTabId={TABS.ANNOTATE}
                defaultToolId={TOOLS.TEXT}
                savingPixelRatio={3}
                previewPixelRatio={2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
