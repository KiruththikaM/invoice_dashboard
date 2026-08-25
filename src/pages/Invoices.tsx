import { useState } from 'react';
import { Search, Plus, Download, Edit, Trash2, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import FileViewerModal from '../components/FileViewerModal';

interface InvoiceItem {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
}

const mockInvoices: InvoiceItem[] = [
  {
    id: 'INV-000001',
    client: 'Studio Shodwe',
    amount: 755.00,
    date: '2030-06-02',
    status: 'Paid',
    fileUrl: 'https://www.billdu.com/wp-content/uploads/2023/04/UK-invoice-template_2.png',
    fileType: 'image'
  },
  {
    id: 'INV-1001',
    client: 'Acme Corp',
    amount: 1500.00,
    date: '2023-10-15',
    status: 'Paid',
    fileUrl: 'https://www.image2url.com/r2/default/documents/1787647917780-45c3835c-61e0-44b8-afc5-ea34cc4926bc.pdf',
    fileType: 'pdf'
  },
  {
    id: 'INV-1002',
    client: 'Globex Inc',
    amount: 2350.50,
    date: '2023-10-18',
    status: 'Pending',
    fileUrl: 'https://res.cloudinary.com/dja3z8nt6/image/upload/v1770406352/wp-migration/external-11dcf6ab09fb.png',
    fileType: 'image'
  },
  {
    id: 'INV-1003',
    client: 'Initech',
    amount: 450.00,
    date: '2023-10-20',
    status: 'Overdue',
    fileUrl: 'https://www.image2url.com/r2/default/documents/1787648242473-44393270-73b1-436a-aede-c103ff6a900e.pdf',
    fileType: 'pdf'
  },
  {
    id: 'INV-1004',
    client: 'Soylent Corp',
    amount: 3200.00,
    date: '2023-10-22',
    status: 'Draft',
    fileUrl: 'https://static.vecteezy.com/system/resources/previews/010/938/669/non_2x/professional-business-invoice-template-invoice-for-your-company-business-print-ready-invoice-template-pro-vector.jpg',
    fileType: 'image'
  },
];

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ url: string; type: 'pdf' | 'image'; title: string } | null>(null);

  const handleDownload = async (e: React.MouseEvent, invoice: InvoiceItem) => {
    e.stopPropagation();
    try {
      const response = await fetch(invoice.fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = invoice.fileUrl.split('/').pop() || `${invoice.id}.${invoice.fileType}`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed, using fallback', error);
      const link = document.createElement('a');
      link.href = invoice.fileUrl;
      const fileName = invoice.fileUrl.split('/').pop() || `${invoice.id}.${invoice.fileType}`;
      link.setAttribute('download', fileName);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Invoices</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your invoices, view documents, or edit receipt images</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm shadow-indigo-200 hover:shadow-md hover:-translate-y-0.5">
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search invoices by client or ID..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                  onClick={() => setSelectedFile({ url: invoice.fileUrl, type: invoice.fileType, title: `${invoice.id} - ${invoice.client}` })}
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {invoice.client}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {invoice.fileType === 'pdf' ? (
                        <FileText className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      {invoice.fileType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button
                        onClick={() => setSelectedFile({ url: invoice.fileUrl, type: invoice.fileType, title: `${invoice.id} - ${invoice.client}` })}
                        className="p-1.5 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-colors"
                        title="View / Edit Document"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDownload(e, invoice)}
                        className="p-1.5 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors" 
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 hover:text-indigo-600 rounded-lg transition-colors" title="Edit details"><Edit className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <FileText className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No invoices found</p>
              <p className="text-sm mt-1">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </div>


      {selectedFile && (
        <FileViewerModal
          fileUrl={selectedFile.url}
          fileType={selectedFile.type}
          title={selectedFile.title}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};

export default Invoices;


