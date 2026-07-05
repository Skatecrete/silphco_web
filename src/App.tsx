import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Component that handles password success
function PasswordGateWrapper() {
  const { unlock } = useAppStore();
  const { isUnlocked } = useAppStore();

  if (isUnlocked) {
    return <Navigate to="/app/login" replace />;
  }

  return <PasswordGate onSuccess={unlock} />;
}

function App() {
  const { isUnlocked } = useAppStore();
  const { isLoggedIn } = useUser();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/gate" element={<PasswordGateWrapper />} />

        <Route
          path="/app/*"
          element={
            isUnlocked ? (
              <div />
            ) : (
              <Navigate to="/gate" replace />
            )
          }
        >
          <Route
            path="login"
            element={
              isLoggedIn ? (
                <Navigate to="/app/home" replace />
              ) : (
                <LoginScreen />
              )
            }
          />

          <Route
            path="home"
            element={
              isLoggedIn ? (
                <DialRotator />
              ) : (
                <Navigate to="/app/login" replace />
              )
            }
          />

          <Route path="logout" element={<LogoutHandler />} />

          <Route
            path="spawns"
            element={
              isLoggedIn ? (
                <SpawnsPage />
              ) : (
                <Navigate to="/app/login" replace />
              )
            }
          />

          <Route
            path="raids"
            element={
              isLoggedIn ? (
                <RaidsPage />
              ) : (
                <Navigate to="/app/login" replace />
              )
            }
          />

          <Route
            path="dex"
            element={
              isLoggedIn ? (
                <DexPage />
              ) : (
                <Navigate to="/app/login" replace />
              )
            }
          />

          <Route
            path="events"
            element={
              isLoggedIn ? (
                <EventsPage />
              ) : (
                <Navigate to="/app/login" replace />
              )
            }
          />

          <Route
            path="orders"
            element={
              isLoggedIn ? (
                <OrdersPage />
              ) : (
                <Navigate to="/app/login" replace />
              )
            }
          />

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

          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;