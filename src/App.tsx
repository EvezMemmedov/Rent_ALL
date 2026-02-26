import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import MyRentals from "./pages/MyRentals";
import MyItems from "./pages/MyItems";
import OwnerRequests from "./pages/OwnerRequests";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingUsers from "./pages/admin/PendingUsers";
import VerifyUser from "./pages/admin/VerifyUser";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/owner-requests/:itemId" element={<OwnerRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pending-users" element={<PendingUsers />} />
          <Route path="/admin/verify-user/:userId" element={<VerifyUser />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;