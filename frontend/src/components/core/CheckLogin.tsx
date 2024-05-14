import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function CheckLogin() {
  const { isLoggedIn, loadingAuth } = useAuth();

  console.log("CheckLogin: ", {
    isLoggedIn: isLoggedIn,
    loadingAuth: loadingAuth
  });

  if (!loadingAuth) {
    if (isLoggedIn) return <Navigate to="/" replace />;
    return <Outlet />;
  }
};