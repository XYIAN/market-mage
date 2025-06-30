import { ProtectedRoute } from '@/lib/auth/protected-route'
import { MarketDashboard } from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MarketDashboard />
    </ProtectedRoute>
  )
}
