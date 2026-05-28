import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <Outlet />
      {!isAuthenticated && <Footer />}
      <MobileNav />
    </div>
  );
};

export default MainLayout;
