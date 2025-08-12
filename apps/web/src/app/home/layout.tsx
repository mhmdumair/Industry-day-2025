import HomeNavbarWrapper from "@/components/home/HomeNavbarWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className='h-full w-full flex justify-center'>
        <div className="w-[94%] mt-3">
          <HomeNavbarWrapper />
          {children}
        </div>
      </main>
  );
}
