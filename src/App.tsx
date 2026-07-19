import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';
import { PasswordGate } from '@/components/gate/PasswordGate';
import { LoginScreen } from '@/components/login/LoginScreen';
import { Home } from '@/components/home/Home';
import { SpawnsPage } from '@/components/spawns/SpawnsPage';
import { RaidsPage } from '@/components/raids/RaidsPage';
import { DexPage } from '@/components/dex/DexPage';
import { EventsPage } from '@/components/events/EventsPage';
import { OrdersPage } from '@/components/orders/OrdersPage';
import { HistoryPage } from '@/components/history/HistoryPage';
import { ViewAllPokemon } from '@/components/viewall/ViewAllPokemon';
import { ServicesPage } from '@/components/services/ServicesPage';
import { InfographicsPage } from '@/components/infographics/InfographicsPage';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminLoginDialog } from '@/components/admin/AdminLoginDialog';
import { PromoCodeDialog } from '@/components/promo/PromoCodeDialog';
import { Layout } from '@/components/common/Layout';
import { useAppStore } from '@/stores/appStore';
import { useUser } from '@/hooks/useUser';

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

function AppWrapper() {
  const { isUnlocked } = useAppStore();

  if (!isUnlocked) {
    return <Navigate to="/gate" replace />;
  }

  return <Outlet />;
}

function App() {
  const { isUnlocked } = useAppStore();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [showPromoDialog, setShowPromoDialog] = useState(false);

  const handleAdminLogin = (name: string) => {
    setAdminName(name);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setAdminName(null);
  };

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
            <Route path="/app/home" element={<Home onPromoClick={() => setShowPromoDialog(true)} />} />
            <Route path="/app/spawns" element={<SpawnsPage />} />
            <Route path="/app/raids" element={<RaidsPage />} />
            <Route path="/app/dex" element={<DexPage />} />
            <Route path="/app/events" element={<EventsPage />} />
            <Route path="/app/orders" element={<OrdersPage />} />
            <Route path="/app/history" element={<HistoryPage />} />
            <Route path="/app/viewall" element={<ViewAllPokemon />} />
            <Route path="/app/services" element={<ServicesPage />} />
            <Route path="/app/infographics" element={<InfographicsPage />} />
            <Route
              path="/app/admin"
              element={
                adminName ? (
                  <AdminDashboard adminName={adminName} onLogout={handleAdminLogout} />
                ) : (
                  <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
                      <p style={{ color: '#ffffff', fontSize: '18px', marginBottom: '16px' }}>Please log in as admin</p>
                      <button
                        onClick={() => setShowAdminLogin(true)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#7627C5',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Admin Login
                      </button>
                    </div>
                  </div>
                )
              }
            />
          </Route>

          <Route path="/app/*" element={<Navigate to="/app/home" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Admin Login Dialog */}
      <AdminLoginDialog
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />

      {/* Promo Code Dialog - rendered at root level */}
      <PromoCodeDialog
        isOpen={showPromoDialog}
        onClose={() => setShowPromoDialog(false)}
      />
    </HashRouter>
  );
}

export default App;