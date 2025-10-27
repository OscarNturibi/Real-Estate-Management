import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Public pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// Tenant pages
import TenantLogin from "./pages/tenants/TenantLogin";
import TenantRegister from "./pages/tenants/TenantRegister";
import TenantDashboard from "./pages/tenants/TenantDashboard";
import TenantProfileUpdate from "./pages/tenants/TenantProfileUpdate";

// Owner pages
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Register from "./pages/owner/Register";
import Update from "./pages/owner/Update";
import OwnerBenefit from "./pages/owner/OwnerBenefit";

// Property pages
import CreateProperty from "./pages/property/CreateProperty";
import ShowProperty from "./pages/property/ShowProperty";
import UpdateProperty from "./pages/property/UpdateProperty";
import ViewProperty from "./pages/property/ViewProperty";
import SearchProperties from "./pages/property/SearchProperties"; // ✅ actual import

// Messages
import Message from "./pages/messages/Message";
import ViewMessage from "./pages/messages/ViewMessage";

// ✅ DummySearch (for quick testing only, can remove later)
const DummySearch = () => <h2>Search works!</h2>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ✅ Shared Layout Wrapper */}
          <Route path="/" element={<Layout />}>
            
            {/* ✅ Public Routes */}
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="tenant-login" element={<TenantLogin />} />
            <Route path="tenant-register" element={<TenantRegister />} />
            <Route path="owner-login" element={<OwnerLogin />} />
            <Route path="owner-register" element={<Register />} />
            <Route path="search-properties" element={<SearchProperties/>} /> 


            {/* ✅ Tenant Private Routes */}
            <Route
              path="tenant-dashboard"
              element={
                <PrivateRoute role="tenant">
                  <TenantDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="tenant-profile"
              element={
                <PrivateRoute role="tenant">
                  <TenantProfileUpdate />
                </PrivateRoute>
              }
            />

            {/* ✅ Owner Private Routes */}
            <Route
              path="owner-dashboard"
              element={
                <PrivateRoute role="owner">
                  <OwnerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="owner-update"
              element={
                <PrivateRoute role="owner">
                  <Update />
                </PrivateRoute>
              }
            />
            <Route
              path="owner-benefit"
              element={
                <PrivateRoute role="owner">
                  <OwnerBenefit />
                </PrivateRoute>
              }
            />

            {/* ✅ Owner-only Property Mgmt */}
            <Route
              path="create-property"
              element={
                <PrivateRoute role="owner">
                  <CreateProperty />
                </PrivateRoute>
              }
            />
            <Route
              path="show-property/:id"
              element={
                <PrivateRoute role="owner">
                  <ShowProperty />
                </PrivateRoute>
              }
            />

            {/* ✅ Both Tenant & Owner Allowed */}
            <Route
              path="view-property/:id"
              element={
                <PrivateRoute>
                  <ViewProperty />
                </PrivateRoute>
              }
            />

            {/* ✅ Messages (Both Allowed) */}
            <Route
              path="messages"
              element={
                <PrivateRoute>
                  <Message />
                </PrivateRoute>
              }
            />
            <Route
              path="messages/:id"
              element={
                <PrivateRoute>
                  <ViewMessage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
