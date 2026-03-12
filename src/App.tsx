import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "@/layout/dashboardLayout/DashboardLayout";
import LandingLayout from "@/layout/landingLayout/LandingLayout";

// Pages
const AdminDashboard = lazy(
  () => import("@/pages/dashboard/admin/AdminDashboard"),
);
const ClientDashboard = lazy(
  () => import("@/pages/dashboard/client/ClientDashboard"),
);
const UserDashboard = lazy(
  () => import("@/pages/dashboard/user/UserDashboard"),
);
const PhotoGallery = lazy(() => import("@/pages/landing/PhotoGalery"));
const AboutUs = lazy(() => import("@/pages/landing/AboutUs"));
const SharedVideo = lazy(() => import("@/pages/landing/SharedVideo"));
const SharedPhotos = lazy(() => import("@/pages/landing/SharedPhotos"));
const Login = lazy(() => import("@/pages/Login"));
const Landing = lazy(() => import("@/pages/landing/Landing"));
const ManageClientsIndex = lazy(() => import("@/pages/dashboard/user/ManageClients/Index"));
const ManageUsersIndex = lazy(() => import("@/pages/dashboard/admin/manageUsers/Index"));
const EventPlanner = lazy(() => import("@/pages/dashboard/user/EventPlanner"));
const PlansAndServices = lazy(() => import("@/pages/dashboard/user/PlansAndServices"));
const ManageTeams = lazy(() => import("@/pages/dashboard/user/ManageTeams/ManageTeams"));
const Storage = lazy(() => import("@/pages/dashboard/user/Storage/Storage"));
const CalculateWork = lazy(() => import("@/pages/dashboard/user/CalculateWork/CalculateWork"));
const CalculateWorkClient = lazy(() => import("@/pages/landing/CalculateWorkClient"));
const CalculateProducts = lazy(() => import("@/pages/landing/CalculateProducts"));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center text-muted-foreground animate-pulse">
    Loading...
  </div>
);

export function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/Gallery" element={<PhotoGallery />} />
            <Route path="/CalculateWorkClient" element={<CalculateWorkClient />} />
            <Route path="/CalculateProducts" element={<CalculateProducts />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/share/video/:videoId" element={<SharedVideo />} />
            <Route path="/share/photos" element={<SharedPhotos />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="user" replace />} />
            <Route path="user" element={<UserDashboard />} />
            <Route path="client" element={<ClientDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="manageUsers" element={<ManageUsersIndex />} />
            <Route path="manageClients" element={<ManageClientsIndex />} />
            <Route path="eventPlanner" element={<EventPlanner />} />
            <Route path="plansAndServices" element={<PlansAndServices />} />
            <Route path="manageTeams" element={<ManageTeams />} />
            <Route path="storage" element={<Storage />} />
            <Route path="calculateWork" element={<CalculateWork />} />

          </Route>
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
