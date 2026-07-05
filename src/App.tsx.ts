// Add these imports at the top
import { HistoryPage } from '@/components/history/HistoryPage';

// Add this route inside the /app/* section:
<Route
  path="history"
  element={
    isLoggedIn ? (
      <HistoryPage />
    ) : (
      <Navigate to="/app/login" replace />
    )
  }
/>