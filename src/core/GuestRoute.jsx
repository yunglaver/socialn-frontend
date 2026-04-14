import { Navigate, Outlet, useLocation } from "react-router-dom";

export const GuestRoute = () => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (token) {
        const from = location.state?.from?.pathname || "/m/chats";
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
};