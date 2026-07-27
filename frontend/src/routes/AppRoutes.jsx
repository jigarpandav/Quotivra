import { Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";

import Quotation from "../pages/Quotation/Quotation";
import ViewQuotation from "../pages/Quotation/ViewQuotation";

import CompanySetting from "../pages/CompanySetting/CompanySetting";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import QuotationInvoice from "../pages/Quotation/QuotationInvoice";
import ViewCompanySetting from "../pages/CompanySetting/ViewCompanySetting";
import UpdateCompanySetting from "../pages/CompanySetting/UpdateCompanySetting";
import UpdateQuotation from "../pages/Quotation/UpdateQuotation";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import ChangePassword from "../pages/Auth/ChangePassword";
import SendQuotationInvoice from "../pages/Quotation/SendQuotationInvoice";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quotations"
        element={
          <ProtectedRoute>
            <Quotation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quotations/add"
        element={
          <ProtectedRoute>
            <Quotation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quotations/edit/:id"
        element={
          <ProtectedRoute>
            <Quotation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quotations/view"
        element={
          <ProtectedRoute>
            <ViewQuotation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company-setting"
        element={
          <ProtectedRoute>
            <CompanySetting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotations/invoice/:id"
        element={
          <ProtectedRoute>
            <QuotationInvoice />
          </ProtectedRoute>
        }
      />
            <Route
        path="/company-setting/view"
        element={
          <ProtectedRoute>
            <ViewCompanySetting />
          </ProtectedRoute>
        }
      />
        <Route
        path="/company-settings/:id"
        element={
          <ProtectedRoute>
            <UpdateCompanySetting />
          </ProtectedRoute>
        }/>
        <Route
        path="/update-Quotation/:id"
        element={
          <ProtectedRoute>
            <UpdateQuotation />
          </ProtectedRoute>
        }/>
        <Route
        path="/update-quotation/:id"
        element={
          <ProtectedRoute>
            <UpdateQuotation />
          </ProtectedRoute>
        }/>

        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/send-quotation-invoice/:id" element={
            <SendQuotationInvoice />
        } />



    </Routes>
  );
};

export default AppRoutes;
