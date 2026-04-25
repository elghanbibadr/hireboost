import { DashboardSidebar } from '@/components/dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 flex flex-col md:ml-0">
        <div className="flex-grow">
          {children}
        </div>
      </main>
    </div>
  )
}
