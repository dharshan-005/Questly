import { useAuth } from "../context/AuthContext";
import HomePage from "./HomePage";
import LoggedInHome from "./LoggedInHome";

const Home = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <LoggedInHome /> : <HomePage />;
};

export default Home;
