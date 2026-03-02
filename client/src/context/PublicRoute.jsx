import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoutes = () => {
    const { usuario, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (usuario) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
export default PublicRoutes;