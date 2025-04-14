export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {children}
      </div>
    </div>
  )
}