import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthGuard from "./utils/AuthGuard";
import Roles from "./config/Roles";
import { AuthProvider } from "./context/AuthProvider";
import {
  Complaint,
  Login,
  Dashboard,
  NotFound,
  Forbidden,
  Error,
  ComplaintDetails,
  Users,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard
        AllowedRoles={[
          Roles.AUTHORIZER,
          Roles.SUPER_ADMIN,
          Roles.TECHNICAL_EXECUTOR,
        ]}
        Component={Dashboard}
      />
    ),
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard
        AllowedRoles={[
          Roles.AUTHORIZER,
          Roles.SUPER_ADMIN,
          Roles.TECHNICAL_EXECUTOR,
        ]}
        Component={Dashboard}
      />
    ),
    errorElement: <Error />,
  },
  {
    path: "/laporan",
    element: (
      <AuthGuard
        AllowedRoles={[
          Roles.AUTHORIZER,
          Roles.SUPER_ADMIN,
          Roles.TECHNICAL_EXECUTOR,
        ]}
        Component={Complaint}
      />
    ),
    errorElement: <Error />,
  },
  {
    path: "/laporan/:id",
    element: (
      <AuthGuard
        AllowedRoles={[
          Roles.AUTHORIZER,
          Roles.SUPER_ADMIN,
          Roles.TECHNICAL_EXECUTOR,
        ]}
        Component={ComplaintDetails}
      />
    ),
    // errorElement: <Error />,
  },
  {
    path: "/pengguna",
    element: (
      <AuthGuard
        AllowedRoles={[Roles.AUTHORIZER, Roles.SUPER_ADMIN]}
        Component={Users}
      />
    ),
    // errorElement: <Error />,
  },
  {
    path: "/pengguna",
    element: (
      <AuthGuard
        AllowedRoles={[Roles.AUTHORIZER, Roles.SUPER_ADMIN]}
        Component={Complaint}
      />
    ),
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
