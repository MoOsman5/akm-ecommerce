import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'AKM — Premium Streetwear & Clothing',
  description: 'Discover the latest streetwear collection from AKM. Premium quality clothing, hoodies, t-shirts, and accessories.',
  keywords: 'AKM, streetwear, clothing, fashion, t-shirts, hoodies, jackets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-dark-900 dark:bg-dark-950 dark:text-dark-50 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
