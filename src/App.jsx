import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAuction from "./pages/CreateAuction";
import AuctionDetails from "./pages/AuctionDetails";
import TransactionHistory from "./pages/TransactionHistory";
import SellerEarnings from "./pages/SellerEarning";
import Navbar from "./pages/Navbar";
import Register from "./pages/Register";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Wallet from "./pages/Wallet";
import MyBids from "./pages/MyBids";
import AdminDashboard from "./pages/AdminDashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
        <Toaster
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "14px",
              fontSize: "14px",
              padding: "12px 16px",
              background: "#ffffff",
              color: "#1f2937", // gray-800
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            },

            success: {
              style: {
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#ffffff",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#22c55e",
              },
            },

            error: {
              style: {
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#ffffff",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#ef4444",
              },
            },

            loading: {
              style: {
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#ffffff",
              },
            },
          }}
        />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes allowedRoles={["BUYER", "SELLER", "ADMIN"]}>
                <Navbar />
                <Dashboard />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/create-auction"
            element={
              <ProtectedRoutes allowedRoles={["SELLER"]}>
                <Navbar />
                <CreateAuction />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/auction/:id"
            element={
              <ProtectedRoutes allowedRoles={["BUYER"]}>
                <Navbar />
                <AuctionDetails />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoutes allowedRoles={["BUYER"]}>
                <TransactionHistory />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/seller-earnings"
            element={
              <ProtectedRoutes allowedRoles={["SELLER"]}>
                <Navbar />
                <SellerEarnings />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoutes allowedRoles={["BUYER"]}>
                <Wallet />
              </ProtectedRoutes>
            }
          />

          <Route path="/register" element={<Register />} />

          <Route
            path="/mybids"
            element={
              <ProtectedRoutes allowedRoles={["BUYER"]}>
                <MyBids />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoutes allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
