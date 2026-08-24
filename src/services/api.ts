const API_BASE = '/api';

export const fetchSettings = async () => {
    try {
        const res = await fetch(`${API_BASE}/settings/public`);
        if (!res.ok) throw new Error('Failed to fetch settings');
        return await res.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
};

export const fetchCategories = async () => {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        return await res.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

export const fetchProducts = async (params: Record<string, string> = {}) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `${API_BASE}/products?${queryParams}` : `${API_BASE}/products`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        return await res.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const fetchProduct = async (id: string) => {
    try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        return await res.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};
