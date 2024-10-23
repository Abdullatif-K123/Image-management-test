'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from '@/components/Navbar';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
