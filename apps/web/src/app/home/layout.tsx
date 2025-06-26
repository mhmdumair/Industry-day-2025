import HomeNavBar from '@/components/HomeNavBar';

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
