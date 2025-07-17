import Navbar from "@/components/custom/home/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className='h-full w-full'>
        
          <Navbar />
        {children}
      </main>
  );
}