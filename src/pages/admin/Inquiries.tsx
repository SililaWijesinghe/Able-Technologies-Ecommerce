import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_inquiries')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch inquiries');
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('service_inquiries')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Inquiry marked as ${status}`);
      fetchInquiries();
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-black text-[#0b1042] mb-6">Service & Rentals Inquiries</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Date', 'Customer', 'Contact', 'Product', 'Type', 'Message', 'Status', 'Action'].map(h => (
                <th key={h} className="p-4 text-xs font-bold text-gray-900">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <tr key={inquiry.id} className="border-b border-gray-50 text-sm">
                <td className="p-4">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{inquiry.customer_name}</td>
                <td className="p-4">{inquiry.email}<br />{inquiry.phone}</td>
                <td className="p-4">{inquiry.products?.name}</td>
                <td className="p-4">{inquiry.inquiry_type}</td>
                <td className="p-4 max-w-[200px] truncate">{inquiry.message}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black ${inquiry.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {inquiry.status || 'Pending'}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={inquiry.status || 'Pending'} 
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className="text-xs border rounded-lg p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
