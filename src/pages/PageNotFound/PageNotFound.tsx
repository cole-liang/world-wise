import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./PageNotFound.module.css";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.pageNotFound}>
      <h1>Page not found 404</h1>
      <Button type="primary" onClick={() => navigate("/")}>
        Back to homepage
      </Button>
    </div>
  );
}
