import Map from "../../components/Map/Map";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./AppLayout.module.css";
import { useAuth } from "../../store/auth-context";
import User from "../../components/User/User";

function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      {isAuthenticated && <User />}
    </div>
  );
}

export default AppLayout;
