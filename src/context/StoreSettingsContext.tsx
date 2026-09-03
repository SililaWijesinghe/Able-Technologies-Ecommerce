import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface StoreSettings {
  show_prices: boolean;
  enable_checkout: boolean;
  support_email: string | null;
  whatsapp_number: string | null;
}

interface StoreSettingsContextType {
  settings: StoreSettings;
  loading: boolean;
}

const defaultSettings: StoreSettings = {
  show_prices: true,
  enable_checkout: true,
  support_email: 'able@ablero.com',
  whatsapp_number: '+94 777 852 476',
};

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: defaultSettings,
  loading: true,
});

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching store settings:', error);
        } else if (data) {
          setSettings({
            show_prices: data.show_prices !== false,
            enable_checkout: data.enable_checkout !== false,
            support_email: data.support_email,
            whatsapp_number: data.whatsapp_number,
          });
        }
      } catch (err) {
        console.error('Failed to load store settings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Setup Supabase Realtime Subscription
    const channel = supabase
      .channel('store_settings_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'store_settings' },
        (payload) => {
          const newData = payload.new;
          if (newData && newData.id === 1) {
            setSettings({
              show_prices: newData.show_prices !== false,
              enable_checkout: newData.enable_checkout !== false,
              support_email: newData.support_email,
              whatsapp_number: newData.whatsapp_number,
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
