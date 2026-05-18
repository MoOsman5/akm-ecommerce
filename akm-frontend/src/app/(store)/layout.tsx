import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-28">{children}</main>
      <Footer />
    </>
  );
}
