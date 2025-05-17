// import { useSelector } from "react-redux"
// import { Navigate } from "react-router-dom";

// export const ProtectedRoute = ({children}) => {
//     const { user, isAuthenticated } = useSelector((store) => store.auth);

//     if(!isAuthenticated){
//         return <Navigate to="/login"/>
//     }

//     if (isAuthenticated && user?.role === "admin" && location.pathname === "/") {
//     return <Navigate to="/admin/dashboard" />;
//   }

//     return children;
// }
// export const AuthenticatedUser = ({children}) => {
//     const {user, isAuthenticated} = useSelector(store=>store.auth);

//     if(isAuthenticated && user?.role !== "admin"){
//         return <Navigate to="/"/>
//     }

//     return children;
// }

// export const TeacherRoute = ({children}) => {
//     const {user, isAuthenticated} = useSelector(store=>store.auth);

//     if(!isAuthenticated){
//         return <Navigate to="/login"/>
//     }

//     if(user?.role !== "instructor"){
//         return <Navigate to="/"/>
//     }

//     return children;
// }

// export const AdminRoute = ({ children }) => {
//   const { user, isAuthenticated } = useSelector((store) => store.auth);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   if (user?.role !== "admin") {
//     return <Navigate to="/" />;
//   }

//   return children;
// };


import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in, go to login
    return <Navigate to="/login" />;
  }

  // If admin visits "/", redirect to admin dashboard
  if (isAuthenticated && user?.role === "admin" && location.pathname === "/") {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const location = useLocation();

  if (isAuthenticated) {
    if (user?.role === "admin" && location.pathname === "/") {
      // Admin redirected to dashboard
      return <Navigate to="/admin/dashboard" />;
    } 
    // Other authenticated users redirected to home page
    return <Navigate to="/" />;
  }

  return children;
};

export const TeacherRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const AdminRedirect = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);

//   if (isAuthenticated && user?.role === "admin") {
//     return <Navigate to="/admin/dashboard" />;
//   }

  //   Only allow admin to access specific admin pages
  const allowedAdminPaths = [
    "/admin/dashboard",
    "/admin/users",
    "/admin/courses",
    "/admin/live-meetings",
    "/admin" //  allow /admin as well
  ];

  // If not on an allowed admin path, redirect to dashboard
  if (user?.role === "admin" && !allowedAdminPaths.includes(location.pathname)) {
    return <Navigate to="/admin/dashboard" />;
  }
  return children;
};

export default AdminRedirect;