import './App.css';
import { AuthProvider } from "./auth/AuthContext.tsx";
import { BrowserRouter, Routes } from "react-router-dom";
import { Route, Navigate } from "react-router-dom";
import AuthPage from "./components/pages/auth/AuthPage.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import PublicOnlyRoute from "./auth/PublicOnlyRoutes.tsx";
import DeckPage from "./components/pages/home/DeckPage.tsx";


function App() { 

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <DeckPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

