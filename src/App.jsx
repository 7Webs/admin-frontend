import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import theme from './theme/theme';

// Layout Components
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard Pages
import VendorManagement from './pages/vendors/VendorManagement';
import InfluencerManagement from './pages/influencers/InfluencerManagement';
import Settings from './pages/settings/Settings';
import ContentModeration from './pages/content/ContentModeration';
import Analytics from './pages/analytics/Analytics';
import Profile from './pages/profile/Profile';
// Auth Context and Protected Route
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Home - Redirect to vendors by default */}
            <Route index element={<Navigate to="/vendors" replace />} />
            
            {/* Main Dashboard Routes */}
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="influencers" element={<InfluencerManagement />} />
            
            {/* Add more routes here */}
            <Route path="content-moderation" element={<ContentModeration />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
