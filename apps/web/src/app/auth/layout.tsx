export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="">
          <div className="px-4">{children}</div>
    </main>
);

}
