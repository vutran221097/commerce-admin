import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
    children,
}) => {
    const isLogged = useSelector((state) => state.auth.isLogged)
    if (!isLogged) {
        return <Navigate to='/login' replace />;
    }

    return children;
};

export default ProtectedRoute