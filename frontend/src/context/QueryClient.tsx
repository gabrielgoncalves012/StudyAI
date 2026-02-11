import React from 'react';
import { QueryClient, QueryClientProvider }from '@tanstack/react-query';

export const queryClient = new QueryClient();

export function QueryApp({children}) {
    
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}