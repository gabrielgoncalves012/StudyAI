import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (email && senha) {
      login();
      navigate("/dashboard");
    } else {
      alert("Preencha todos os campos");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Bem-vindo de volta!</h2>
        <p className="subtitle">Entre na sua conta ou crie uma nova</p>

        <div className="toggle-buttons">
          <button className="toggle-button active">Entrar</button>
          <button className="toggle-button">Criar conta</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
