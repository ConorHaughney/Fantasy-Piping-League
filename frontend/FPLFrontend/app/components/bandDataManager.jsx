'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Export utility functions outside the component
export const getBandsFromCache = () => {
    try {
        if (typeof window === 'undefined') return [];
        const cachedBands = localStorage.getItem('cached_bands');
        return cachedBands ? JSON.parse(cachedBands) : [];
    } catch (error) {
        console.error('Error getting cached bands:', error);
        return [];
    }
};

export const searchBands = (searchTerm) => {
    const bands = getBandsFromCache();

    if (searchTerm.length < 2) return [];

    return bands.filter(band => {
        const bandName = band.bands || band.name || band.band_name || '';
        return bandName.toLowerCase().includes(searchTerm.toLowerCase());
    }).slice(0, 10);
};

export const clearBandsCache = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cached_bands');
    localStorage.removeItem('bands_cache_expiry');
};

const BandDataManager = () => {
    const [mounted, setMounted] = useState(false);
    const BANDS_CACHE_KEY = 'cached_bands';
    const CACHE_EXPIRY_KEY = 'bands_cache_expiry';
    const CACHE_DURATION = 24 * 60 * 60 * 1000;

    const getSupabaseClient = () => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase environment variables');
            return null;
        }

        return createClient(supabaseUrl, supabaseKey);
    };

    const fetchAndCacheBands = async () => {
        try {
            const supabase = getSupabaseClient();
            if (!supabase) return;

            const { data: bands, error } = await supabase
                .from('Bands')
                .select('*');

            if (!error && bands && bands.length > 0) {
                localStorage.setItem(BANDS_CACHE_KEY, JSON.stringify(bands));
                localStorage.setItem(CACHE_EXPIRY_KEY, Date.now().toString());
            }
        } catch (error) {
            console.error('Error fetching band data:', error);
        }
    };

    const isCacheValid = () => {
        if (!mounted) return false;
        const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        if (!cacheExpiry) return false;
        const expiryTime = parseInt(cacheExpiry) + CACHE_DURATION;
        return Date.now() < expiryTime;
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const initializeData = () => {
            const token = localStorage.getItem('token');
            if (token && !isCacheValid()) {
                fetchAndCacheBands();
            }
        };

        setTimeout(initializeData, 100);
    }, [mounted]);

    return null;
};

export default BandDataManager;