import { ROLE_KEY, STATE_KEY } from "@/context/AuthProvider";
import { Forbidden } from "@/pages";
import { Navigate } from "react-router";

const AuthGuard = ({ AllowedRoles, Component }) => {
  if (localStorage.getItem(STATE_KEY) === "true") {
    return AllowedRoles.find(() =>
      AllowedRoles.includes(localStorage.getItem(ROLE_KEY))
    ) ? (
      <Component />
    ) : (
      <Forbidden />
    );
  } else if (localStorage.getItem(STATE_KEY) !== "true") {
    return <Navigate to="/login" replace />;
  }
};

export default AuthGuard;
