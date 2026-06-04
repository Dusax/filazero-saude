import React, { useState } from "react";
import "./styles.css";
import Dashboard    from "./components/Dashboard";
import Importar     from "./components/Importar";
import Fila         from "./components/Fila";
import Duplicatas   from "./components/Duplicatas";
import Lembretes    from "./components/Lembretes";
import Indicadores  from "./components/Indicadores";

const pages = [
  { id:"dashboard",   label:"Dashboard",      icon:"📊", section:"Painel"   },
  { id:"importar",    label:"Importar Lista", icon:"📂", section:"Módulos"  },
  { id:"fila",        label:"Fila de Espera", icon:"🗂️", section:"Módulos"  },
  { id:"duplicatas",  label:"Duplicatas",     icon:"⚠️", section:"Módulos"  },
  { id:"lembretes",   label:"Lembretes",      icon:"📲", section:"Módulos"  },
  { id:"indicadores", label:"Indicadores",    icon:"📈", section:"Análise"  },
];

export default function App() {
  const [page, setPage]     = useState("dashboard");
  const [dupCount, setDupCount] = useState(3);

  function handleDupResolve() {
    setDupCount(prev => Math.max(0, prev - 1));
  }

  const sections = [...new Set(pages.map(p => p.section))];

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-logo">FilaZero<span>Saúde</span></div>
        <div className="topbar-tag">MVP</div>
        <div className="topbar-right">
          <span>Município:</span>
          <span className="mun">Caruaru — PE</span>
          <span>|</span>
          <span>Secretaria de Saúde</span>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="layout">
        {/* SIDEBAR */}
        <nav className="sidebar">
          {sections.map(section => (
            <React.Fragment key={section}>
              <div className="sidebar-section">{section}</div>
              {pages.filter(p => p.section === section).map(p => (
                <button
                  key={p.id}
                  className={`nav-item ${page === p.id ? "active" : ""}`}
                  onClick={() => setPage(p.id)}
                >
                  <span className="nav-icon">{p.icon}</span>
                  {p.label}
                  {p.id === "duplicatas" && dupCount > 0 && (
                    <span className="nav-badge">{dupCount}</span>
                  )}
                  {p.id === "duplicatas" && dupCount === 0 && (
                    <span className="nav-badge ok">✓</span>
                  )}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        {/* MAIN */}
        <main className="main">
          {page === "dashboard"   && <Dashboard   setPage={setPage} dupCount={dupCount} />}
          {page === "importar"    && <Importar    setPage={setPage} />}
          {page === "fila"        && <Fila />}
          {page === "duplicatas"  && <Duplicatas  onResolve={handleDupResolve} />}
          {page === "lembretes"   && <Lembretes />}
          {page === "indicadores" && <Indicadores />}
        </main>
      </div>
    </>
  );
}
