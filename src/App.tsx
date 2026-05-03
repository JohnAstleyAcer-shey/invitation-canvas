import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import AuthPage from "./features/auth/pages/AuthPage";
import { AdminLayout } from "./features/admin/components/AdminLayout";
import { ProtectedRoute } from "./features/admin/components/ProtectedRoute";
import DashboardPage from "./features/admin/pages/DashboardPage";
import CreateInvitationPage from "./features/admin/pages/CreateInvitationPage";
import EditInvitationPage from "./features/admin/pages/EditInvitationPage";
import GuestManagementPage from "./features/admin/pages/GuestManagementPage";
import AnalyticsPage from "./features/admin/pages/AnalyticsPage";
import ActivityLogPage from "./features/admin/pages/ActivityLogPage";
import TemplatesPage from "./features/admin/pages/TemplatesPage";
import SettingsPage from "./features/admin/pages/SettingsPage";
import HelpPage from "./features/admin/pages/HelpPage";
import BlockEditorPage from "./features/blocks/pages/BlockEditorPage";
import TemplateCatalogPage from "./features/template-catalog/pages/TemplateCatalogPage";
import InvitationViewPage from "./features/invitation/pages/InvitationViewPage";
import { CustomerAdminProvider } from "./features/customer-portal/hooks/useCustomerAdmin";
import CustomerLoginPage from "./features/customer-portal/pages/CustomerLoginPage";
import { CustomerPortalLayout } from "./features/customer-portal/components/CustomerPortalLayout";
import CustomerDashboardPage from "./features/customer-portal/pages/CustomerDashboardPage";
import CustomerGuestsPage from "./features/customer-portal/pages/CustomerGuestsPage";
import CustomerMessagesPage from "./features/customer-portal/pages/CustomerMessagesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="create" element={<CreateInvitationPage />} />
              <Route path="edit/:id" element={<EditInvitationPage />} />
              <Route path="guests/:id" element={<GuestManagementPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="activity" element={<ActivityLogPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="templates-catalog" element={<TemplateCatalogPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="blocks/:id" element={<BlockEditorPage />} />
            </Route>
            <Route path="/invite/:slug" element={<InvitationViewPage />} />
            <Route path="/customer-admin" element={<CustomerAdminProvider><CustomerLoginPage /></CustomerAdminProvider>} />
            <Route path="/customer-admin/*" element={<CustomerAdminProvider><CustomerPortalLayout /></CustomerAdminProvider>}>
              <Route path="dashboard" element={<CustomerDashboardPage />} />
              <Route path="guests" element={<CustomerGuestsPage />} />
              <Route path="messages" element={<CustomerMessagesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
