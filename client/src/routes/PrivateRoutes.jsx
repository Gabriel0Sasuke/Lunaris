import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = ({ AllowedRoles }) => {
    const { usuario, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!usuario) {
        return <Navigate to="/auth-required" replace />;
    }

    if (AllowedRoles && !AllowedRoles.includes(usuario.account_type)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
export default PrivateRoutes;
