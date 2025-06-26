import HomeNavBar from '@/components/HomeNavBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main>
        <HomeNavBar />
        {children}
      </main>
  );
}
