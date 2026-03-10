import { useNavigate } from 'react-router-dom';
import '../styles/userMenu.css'
import { useState, useRef, useEffect } from "react";

export default function UserMenuComponent({children, name}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOption = (option) => {
    console.log("Selecionado:", option);
    if (option === "minha-conta") {
      // Redirecionar para a página de minha conta
      navigate("/usuario")
    } else if(option === "planos"){
      // Redirecionar para a página de planos
      navigate("/usuario/planos")
    } else if(option === "logout"){
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        navigate("/")
    }
    setOpen(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <div
        className={`${open ? "active" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menu do usuário"
      >
        {children}
      </div>

      {open && (
        <div className="dropdown">
          <div className="dropdown-header">
            <div className="avatar">{String(name).slice(0, 1)}</div>
            <span className="dropdown-username">{name}</span>
          </div>
          <div className="dropdown-divider" />
          <button className="dropdown-item" onClick={() => handleOption("minha-conta")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            Minha Conta
          </button>
          <button className="dropdown-item" onClick={() => handleOption("planos")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Planos
          </button>
          <div className="dropdown-divider" />
          <button className="dropdown-item danger" onClick={() => handleOption("sair")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}