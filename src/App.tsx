import { useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated, loading, checkAuth, user } = useAuth();

  useEffect(() => {
    console.log('🎯 [App] Auth state changed:', { 
      isAuthenticated, 
      hasUser: !!user,
      userEmail: user?.email,
      loading 
    });
  }, [isAuthenticated, user, loading]);

  console.log('🔄 [App] Rendering with:', { isAuthenticated, loading });

  if (loading) {
    console.log('⏳ [App] Showing loading screen');
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <div style={{
          textAlign: "center",
          color: "#fff",
        }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ fontSize: "14px", fontWeight: 600 }}>Cargando...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Mostrar Login si no está autenticado
  if (!isAuthenticated) {
    console.log('🔓 [App] Not authenticated, showing Login');
    return <Login onLoginSuccess={checkAuth} />;
  }

  // Mostrar Dashboard si está autenticado
  console.log('🔒 [App] Authenticated, showing Dashboard');
  return <Dashboard />;
}

export default App;
