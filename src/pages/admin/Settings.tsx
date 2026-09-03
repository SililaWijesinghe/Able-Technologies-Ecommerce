import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, Phone, Mail, Clock, Store, ShoppingCart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Settings() {
  const toast = useToast();
  const [supportEmail, setSupportEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showPrices, setShowPrices] = useState(true);
  const [enableCheckout, setEnableCheckout] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSupportEmail(data.support_email || '');
        setWhatsappNumber(data.whatsapp_number || '');
        setShowPrices(data.show_prices !== false);
        setEnableCheckout(data.enable_checkout !== false);
        setUpdatedAt(data.updated_at);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load store settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!whatsappNumber.trim()) {
      toast.error('WhatsApp number is required.');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (supportEmail && !emailRegex.test(supportEmail)) {
      toast.error('Please enter a valid support email address.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        support_email: supportEmail,
        whatsapp_number: whatsappNumber,
        show_prices: showPrices,
        enable_checkout: enableCheckout,
        updated_at: new Date().toISOString()
      };

      // Upsert the singleton row
      const { data, error } = await supabase
        .from('store_settings')
        .upsert({ id: 1, ...payload })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUpdatedAt(data.updated_at);
      }

      toast.success('Store settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save store settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-sm text-gray-500">Manage your general store configuration and contact details.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Form Card 1: Customer Contact & Support Channels */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Customer Contact & Support Channels</h3>
                <p className="text-sm text-gray-500">Details used across the storefront for customer support.</p>
              </div>
              <div className="p-6 space-y-5">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Support Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="support@abletechnologies.com"
                      className="pl-10 w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Business Hotline <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="tel" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="pl-10 w-full rounded-lg border-gray-300 border px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Form Card 2: E-Commerce & Storefront Mode */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">E-Commerce & Storefront Mode</h3>
                <p className="text-sm text-gray-500">Control global catalog visibility and checkout capabilities.</p>
              </div>
              <div className="p-6 space-y-6">
                
                {/* Show Prices Toggle */}
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <label className="text-sm font-bold text-gray-900 block mb-1">Show Prices Globally</label>
                    <p className="text-sm text-gray-500">Display product prices on the storefront. Turn off to hide all pricing.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={showPrices}
                      onChange={(e) => setShowPrices(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Enable Checkout Toggle */}
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <label className="text-sm font-bold text-gray-900 block mb-1">Enable Online Checkout</label>
                    <p className="text-sm text-gray-500">Allow users to pay online. Turn off to convert the cart into an "Order/Quote Request" system.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={enableCheckout}
                      onChange={(e) => setEnableCheckout(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Form Card 2: System Info (Read-Only) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-900">System Info</h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3 text-sm text-gray-600">
                  <Clock size={16} className="mt-0.5 text-gray-400 shrink-0" />
                  <div>
                    <span className="block font-medium text-gray-900">Last Updated</span>
                    {updatedAt ? new Date(updatedAt).toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
