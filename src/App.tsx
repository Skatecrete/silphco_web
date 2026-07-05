import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LandingPage } from '@/components/landing/LandingPage';
import { PasswordGate } from '@/components/gate/PasswordGate';
import { LoginScreen } from '@/components/login/LoginScreen';
import { DialRotator } from '@/components/home/DialRotator';
import { SpawnsPage } from '@/components/spawns/SpawnsPage';
import { RaidsPage } from '@/components/raids/RaidsPage';
import { DexPage } from '@/components/dex/DexPage';
import { EventsPage } from '@/components/events/EventsPage';
import { OrdersPage } from '@/components/orders/OrdersPage';
import { HistoryPage } from '@/components/history/HistoryPage';
import { useAppStore } from '@/stores/appStore';
import { useUser } from '@/hooks/useUser';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
      <h1 className="text-white text-2xl font-bold">{title}</h1>
      <p className="text-gray-400 mt-2">Coming soon...</p>
    </div>
  );
}

function LogoutHandler() {
  const { logout } = useUser();
  const { lock } = useAppStore();

  logout();
  lock();

  return <Navigate to="/gate" replace />;
}

function PasswordGateWrapper() {
  const { unlock, isUnlocked } = useAppStore();

  if (isUnlocked) {
    return <Navigate to="/app/login" replace />;
  }

  return <PasswordGate onSuccess={unlock} />;
}

// Protected route wrapper
function ProtectedRoute() {
  const { isUnlocked } = useAppStore();
  const { isLoggedIn } = useUser();

  if (!isUnlocked) {
    return <Navigate to="/gate" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/app/login" replace />;
  }

  return <Outlet />;
}

// App wrapper (unlocked but not necessarily logged in)
function AppWrapper() {
  const { isUnlocked } = useAppStore();

  if (!isUnlocked) {
    return <Navigate to="/gate" replace />;
  }

  return <Outlet />;
}

function App() {
  const { isUnlocked } = useAppStore();

  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/gate" element={<PasswordGateWrapper />} />

        {/* App - requires unlock */}
        <Route element={<AppWrapper />}>
          <Route path="/app/login" element={<LoginScreen />} />
          <Route path="/app/logout" element={<LogoutHandler />} />

          {/* Protected - requires unlock + login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app/home" element={<DialRotator />} />
            <Route path="/app/spawns" element={<SpawnsPage />} />
            <Route path="/app/raids" element={<RaidsPage />} />
            <Route path="/app/dex" element={<DexPage />} />
            <Route path="/app/events" element={<EventsPage />} />
            <Route path="/app/orders" element={<OrdersPage />} />
            <Route path="/app/history" element={<HistoryPage />} />
          </Route>

          <Route path="/app/*" element={<Navigate to="/app/home" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;