import React from 'react';
import { QueryClient, QueryClientProvider }from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false
        }
    }
});

export function QueryApp({children}) {
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}