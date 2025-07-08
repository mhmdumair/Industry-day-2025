import HomeNavBar from '@/components/home/home-navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className='h-full w-full'>
        <HomeNavBar />
        {children}
      </main>
  );
}
