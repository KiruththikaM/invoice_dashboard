import React, { useState, useRef, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCcw, RotateCwSquare } from 'lucide-react';

interface FileViewerModalProps {
  fileUrl: string;
  fileType: 'pdf' | 'image';
  title?: string;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({ fileUrl, fileType, title = 'Invoice Document', onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const touchStartDist = useRef<number | null>(null);
  const initialScale = useRef<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(scale);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => {
    setScale(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => prev + 90);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleNativeTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchStartDist.current = getDistance(e.touches);
        initialScale.current = scaleRef.current;
      }
    };

    const handleNativeTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        if (touchStartDist.current !== null) {
          const currentDist = getDistance(e.touches);
          const scaleFactor = currentDist / touchStartDist.current;
          const newScale = Math.min(Math.max(initialScale.current * scaleFactor, 0.25), 4);
          setScale(newScale);
        }
      }
    };

    const handleNativeTouchEnd = () => {
      touchStartDist.current = null;
    };

    const handleNativeWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setScale(prev => Math.min(prev + 0.1, 4));
        } else {
          setScale(prev => Math.max(prev - 0.1, 0.25));
        }
      }
    };

    container.addEventListener('touchstart', handleNativeTouchStart, { passive: false });
    container.addEventListener('touchmove', handleNativeTouchMove, { passive: false });
    container.addEventListener('touchend', handleNativeTouchEnd);
    container.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleNativeTouchStart);
      container.removeEventListener('touchmove', handleNativeTouchMove);
      container.removeEventListener('touchend', handleNativeTouchEnd);
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

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
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${fileType === 'pdf' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
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
            <div className="relative w-full h-full flex flex-col bg-gray-200/50 overflow-hidden">
              <div className="flex-shrink-0 w-full flex justify-center p-3 z-10">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-gray-200/50">
                  <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 transition-colors" title="Zoom Out">
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold w-12 text-center text-gray-800">{Math.round(scale * 100)}%</span>
                  <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 transition-colors" title="Zoom In">
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1"></div>
                  <button onClick={handleRotate} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 transition-colors" title="Rotate">
                    <RotateCwSquare className="w-5 h-5" />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1"></div>
                  <button onClick={handleResetZoom} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 transition-colors" title="Reset Zoom">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div
                ref={containerRef}
                className="flex-1 w-full flex items-center justify-center p-4 overflow-auto touch-pan-x touch-pan-y"
              >
                <div
                  style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
                  className="flex items-center justify-center w-full h-full"
                >
                  <img
                    src={fileUrl}
                    alt={title}
                    className="max-w-full max-h-full object-contain drop-shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewerModal;
