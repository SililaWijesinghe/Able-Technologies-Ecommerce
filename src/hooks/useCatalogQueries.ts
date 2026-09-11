import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchProducts, fetchSettings, fetchProduct } from '../services/api';

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await fetchCategories();
    }
  });
}

// Fetch products with optional filters
export function useProducts(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      return await fetchProducts(filters || {});
    }
  });
}

// Fetch a single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      return await fetchProduct(id);
    },
    enabled: !!id
  });
}

// Fetch store settings
export function useStoreSettings() {
  return useQuery({
    queryKey: ['store_settings'],
    queryFn: async () => {
      return await fetchSettings();
    }
  });
}
