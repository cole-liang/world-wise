import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-context";
import styles from "./Login.module.css";
import { type FormEvent, useState, useEffect } from "react";
import Button from "../../components/Button/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState<string>("jack@example.com");
  const [password, setPassword] = useState<string>("qwerty");

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  return (
    <main className={styles.login}>
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}
