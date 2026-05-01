import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanelLayout from "./AdminPanel";
import { adminRoutes } from "./adminRoutes";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import ResetPassword from "./Pages/ResetPassword";
import CompanyProfile from "./Pages/CompanyProfile";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* 🔓 Login Route */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route path="/profile" element={<Profile />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/company-profile"
        element={<CompanyProfile />}
      />

      {/* 🔒 Protected Admin Routes */}
      {adminRoutes.map((section) =>
        section.routes.map((r, i) => {
          const Component = r.component;

          return (
            <Route
              key={i}
              path={r.path}
              element={
                <ProtectedRoute>
                  <AdminPanelLayout>
                    <Component />
                  </AdminPanelLayout>
                </ProtectedRoute>
              }
            />
          );
        })
      )}

      {/* 🔁 Default Redirect */}
      <Route
        path="*"
        element={
          token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
}

export default App;