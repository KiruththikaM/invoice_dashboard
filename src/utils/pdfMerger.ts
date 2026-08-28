import { PDFDocument, PageSizes } from 'pdf-lib';

export interface FileToMerge {
  url: string;
  type: 'pdf' | 'image';
}

const getSafeUrl = (url: string) => {
  if (url.includes('image2url.com')) {
    return url.replace('https://www.image2url.com', '/api-pdf');
  }
  return url;
};

export const mergeFilesToPdfUrl = async (files: FileToMerge[]): Promise<string> => {
  const mergedPdf = await PDFDocument.create();

 
  const [a4Width, a4Height] = PageSizes.A4;

  for (const file of files) {
    try {
      const targetUrl = getSafeUrl(file.url);
      const response = await fetch(targetUrl);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();

      if (file.type === 'pdf') {
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
        
        copiedPages.forEach((page) => {
      
          page.setSize(a4Width, a4Height);
          mergedPdf.addPage(page);
        });
      } else {
        let image;
        const lowerUrl = file.url.toLowerCase();

        if (lowerUrl.endsWith('.png')) {
          image = await mergedPdf.embedPng(arrayBuffer);
        } else {
          image = await mergedPdf.embedJpg(arrayBuffer);
        }

       
        const page = mergedPdf.addPage(PageSizes.A4);

        
        const scale = Math.min(a4Width / image.width, a4Height / image.height);
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

       
        const x = (a4Width - scaledWidth) / 2;
        const y = (a4Height - scaledHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }
    } catch (err) {
      console.error(`Failed to process file: ${file.url}`, err);
    }
  }

  if (mergedPdf.getPageCount() === 0) {
    throw new Error('No valid pages could be merged');
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};