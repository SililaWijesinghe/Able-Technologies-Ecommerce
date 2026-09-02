import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle2, Clock, Mail, Wrench, Trash2, Eye, X, Phone, User, Calendar, MessageSquare, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Inquiries() {
  const [activeTab, setActiveTab] = useState<'contact' | 'service'>('contact');
  const [contactInquiries, setContactInquiries] = useState<any[]>([]);
  const [serviceInquiries, setServiceInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<'contact' | 'service' | null>(null);

  useEffect(() => {
    fetchAllInquiries();
  }, []);

  async function fetchAllInquiries() {
    setLoading(true);
    
    // Fetch Contact Inquiries
    const { data: contactData, error: contactError } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (contactError) {
      console.warn('Could not fetch contact_inquiries:', contactError.message);
    } else {
      setContactInquiries(contactData || []);
    }

    // Fetch Service Inquiries
    const { data: serviceData, error: serviceError } = await supabase
      .from('service_inquiries')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    
    if (serviceError) {
      console.warn('Could not fetch service_inquiries:', serviceError.message);
    } else {
      setServiceInquiries(serviceData || []);
    }

    setLoading(false);
  }

  const updateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Inquiry marked as ${status}`);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      fetchAllInquiries();
    }
  };

  const deleteContactInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact inquiry?')) return;
    const { error } = await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete inquiry');
    } else {
      toast.success('Inquiry deleted successfully');
      setSelectedInquiry(null);
      fetchAllInquiries();
    }
  };

  const updateServiceStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('service_inquiries')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Inquiry marked as ${status}`);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      fetchAllInquiries();
    }
  };

  const deleteServiceInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service inquiry?')) return;
    const { error } = await supabase
      .from('service_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete inquiry');
    } else {
      toast.success('Inquiry deleted successfully');
      setSelectedInquiry(null);
      fetchAllInquiries();
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0b1042]">Customer Inquiries & Messages</h2>
          <p className="text-gray-500 text-xs mt-1">Manage incoming contact form submissions and service/rental requests.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'contact' 
                ? 'bg-white text-[#0b1042] shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail size={14} />
            <span>General Contact ({contactInquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'service' 
                ? 'bg-white text-[#0b1042] shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wrench size={14} />
            <span>Service & Rentals ({serviceInquiries.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'contact' ? (
        <div className="overflow-x-auto">
          {contactInquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No general contact messages received yet.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Date', 'Name', 'Contact Info', 'Subject', 'Message', 'Preferred', 'Status', 'Actions'].map(h => (
                    <th key={h} className="p-4 text-xs font-bold text-gray-900">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contactInquiries.map(inquiry => (
                  <tr key={inquiry.id} className="border-b border-gray-50 text-sm hover:bg-gray-50/50">
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(inquiry.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-[#0b1042]">{inquiry.name}</td>
                    <td className="p-4 text-xs">
                      <div>{inquiry.email}</div>
                      <div className="text-gray-500">{inquiry.phone}</div>
                    </td>
                    <td className="p-4 font-semibold text-xs text-blue-600">{inquiry.subject}</td>
                    <td className="p-4 max-w-[220px] truncate text-gray-600 text-xs" title={inquiry.message}>
                      {inquiry.message}
                    </td>
                    <td className="p-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      {inquiry.contact_method || 'email'}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        inquiry.status === 'read' || inquiry.status === 'Reviewed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inquiry.status || 'unread'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => { setSelectedInquiry(inquiry); setSelectedType('contact'); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Full Message"
                      >
                        <Eye size={16} /> <span className="hidden sm:inline">View</span>
                      </button>
                      <select 
                        value={inquiry.status || 'unread'} 
                        onChange={(e) => updateContactStatus(inquiry.id, e.target.value)}
                        className="text-xs border rounded-lg p-1.5 bg-white font-medium"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="Contacted">Contacted</option>
                      </select>
                      <button 
                        onClick={() => deleteContactInquiry(inquiry.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          {serviceInquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No service or rental inquiries received yet.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Date', 'Customer', 'Contact', 'Product', 'Type', 'Message', 'Status', 'Actions'].map(h => (
                    <th key={h} className="p-4 text-xs font-bold text-gray-900">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {serviceInquiries.map(inquiry => (
                  <tr key={inquiry.id} className="border-b border-gray-50 text-sm hover:bg-gray-50/50">
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-[#0b1042]">{inquiry.customer_name}</td>
                    <td className="p-4 text-xs">
                      <div>{inquiry.email}</div>
                      <div className="text-gray-500">{inquiry.phone}</div>
                    </td>
                    <td className="p-4 text-xs font-semibold">{inquiry.products?.name || 'General Service'}</td>
                    <td className="p-4 text-xs font-bold text-blue-600 uppercase">{inquiry.inquiry_type}</td>
                    <td className="p-4 max-w-[200px] truncate text-xs text-gray-600" title={inquiry.message}>{inquiry.message}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${inquiry.status === 'Reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {inquiry.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => { setSelectedInquiry(inquiry); setSelectedType('service'); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                        title="View Full Message"
                      >
                        <Eye size={16} /> <span className="hidden sm:inline">View</span>
                      </button>
                      <select 
                        value={inquiry.status || 'Pending'} 
                        onChange={(e) => updateServiceStatus(inquiry.id, e.target.value)}
                        className="text-xs border rounded-lg p-1.5 bg-white font-medium"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Reviewed">Reviewed</option>
                      </select>
                      <button 
                        onClick={() => deleteServiceInquiry(inquiry.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Expanded Inquiry Modal Popup */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#0b1042] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  {selectedType === 'contact' ? <Mail size={20} /> : <Wrench size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    {selectedType === 'contact' ? 'General Contact Message' : 'Service & Rental Inquiry'}
                  </h3>
                  <p className="text-xs text-gray-300">
                    Received on {new Date(selectedInquiry.created_at || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Sender Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Name</span>
                  <div className="font-bold text-[#0b1042] text-sm flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    {selectedInquiry.name || selectedInquiry.customer_name}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</span>
                  <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    <a href={`mailto:${selectedInquiry.email}`} className="hover:underline text-blue-600">
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone Number</span>
                  <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <Phone size={16} className="text-blue-600" />
                    <a href={`tel:${selectedInquiry.phone}`} className="hover:underline text-blue-600">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>

                {selectedType === 'contact' ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preferred Contact Method</span>
                    <div className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                      {selectedInquiry.contact_method || 'Email'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Inquiry Type / Product</span>
                    <div className="font-semibold text-gray-800 text-sm">
                      <span className="text-blue-600 uppercase font-bold mr-2">{selectedInquiry.inquiry_type}</span>
                      {selectedInquiry.products?.name && <span className="text-gray-600">({selectedInquiry.products.name})</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Subject / Title */}
              {selectedType === 'contact' && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subject</span>
                  <div className="font-bold text-gray-900 text-base flex items-center gap-2 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                    <Tag size={16} className="text-blue-600" />
                    {selectedInquiry.subject}
                  </div>
                </div>
              )}

              {/* Full Message Content */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Message / Requirements</span>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[120px]">
                  {selectedInquiry.message || 'No additional message provided.'}
                </div>
              </div>

              {/* Status Update & Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-600">Current Status:</span>
                  <select
                    value={selectedInquiry.status || (selectedType === 'contact' ? 'unread' : 'Pending')}
                    onChange={(e) => {
                      if (selectedType === 'contact') {
                        updateContactStatus(selectedInquiry.id, e.target.value);
                      } else {
                        updateServiceStatus(selectedInquiry.id, e.target.value);
                      }
                    }}
                    className="text-xs border rounded-lg p-2 bg-white font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {selectedType === 'contact' ? (
                      <>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="Contacted">Contacted</option>
                      </>
                    ) : (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Reviewed">Reviewed</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      if (selectedType === 'contact') {
                        deleteContactInquiry(selectedInquiry.id);
                      } else {
                        deleteServiceInquiry(selectedInquiry.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={15} /> Delete Inquiry
                  </button>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="px-5 py-2 bg-[#0b1042] hover:bg-[#0b1042]/90 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

