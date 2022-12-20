import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import NotFoundErrorPage from "./pages/error/NotFoundErrorPage";
import Login from "./pages/user/Login";
import Product from "./pages/store/Product";
import Store from "./pages/store/Store";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Logout from "./pages/user/Logout";
import Test from "./pages/Test";
import Confirm from "./pages/store/Confirm";
import AdminMain from "./pages/admin/AdminMain";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminUsers from "./pages/admin/AdminUsers";
import Order from "./pages/store/Order";
import PersonalPage from "./pages/user/PersonalPage";
import AccessErrorPage from "./pages/error/AccessErrorPage";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="" element={<Navigate to={"personal"} />} />

          <Route path="test" element={<Test />} />
          <Route path="personal" element={<PersonalPage />} />

          <Route path="store" element={<Store />} />
          <Route path="product" element={<Product />} />
          <Route path="confirm" element={<Confirm />} />
          <Route path="order" element={<Order />} />

          <Route path="admin" element={<AdminMain />}>
            <Route
              path=""
              element={<Navigate to="/admin/requests" />}
            />

            <Route path="orders" element={<AdminOrders />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="access-error" element={<AccessErrorPage />} />
        <Route path="*" element={<NotFoundErrorPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
