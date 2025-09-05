import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Notices from './pages/Notices';
import Admin from './pages/admin.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './state/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { isAdmin } from './lib/appwrite';
import Marketplace from "./pages/marketplace";
import BuyPage from "./pages/BuyPage";
import './styles.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Notices />} />
           <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin isAdminFn={isAdmin}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}