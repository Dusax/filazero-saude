import React, { useState } from "react";
import "./styles.css";
import Dashboard   from "./components/Dashboard";
import Importar    from "./components/Importar";
import Fila        from "./components/Fila";
import Duplicatas  from "./components/Duplicatas";
import Lembretes   from "./components/Lembretes";
import Indicadores from "./components/Indicadores";
import { gerarPacientes, gerarDuplicatas, gerarHistorico } from "./data";

const pages = [
  { id:"dashboard",   label:"Dashboard",      icon:"📊", section:"Painel"  },
  { id:"importar",    label:"Importar Lista", icon:"📂", section:"Módulos" },
  { id:"fila",        label:"Fila de Espera", icon:"🗂️", section:"Módulos" },
  { id:"duplicatas",  label:"Duplicatas",     icon:"⚠️", section:"Módulos" },
  { id:"lembretes",   label:"Lembretes",      icon:"📲", section:"Módulos" },
  { id:"indicadores", label:"Indicadores",    icon:"📈", section:"Análise" },
];

const initialPacientes  = gerarPacientes();
const initialDuplicatas = gerarDuplicatas(initialPacientes);
const initialHistorico  = gerarHistorico(initialPacientes);

export default function App() {
  const [page, setPage]           = useState("dashboard");
  const [pacientes, setPacientes] = useState(initialPacientes);
  const [dups, setDups]           = useState(initialDuplicatas);
  const [historico, setHistorico] = useState(initialHistorico);
  const [dupCount, setDupCount]   = useState(initialDuplicatas.length);

  function handleNovaImportacao() {
    const novos = gerarPacientes();
    const novasDups = gerarDuplicatas(novos);
    setPacientes(novos);
    setDups(novasDups);
    setHistorico(gerarHistorico(novos));
    setDupCount(novasDups.length);
  }

  function handleDupResolve() {
    setDupCount(prev => Math.max(0, prev - 1));
  }

  const sections = [...new Set(pages.map(p => p.section))];

  return (
    <>
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

      <div className="layout">
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
                  {p.id === "duplicatas" && dupCount > 0 && <span className="nav-badge">{dupCount}</span>}
                  {p.id === "duplicatas" && dupCount === 0 && <span className="nav-badge ok">✓</span>}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <main className="main">
          {page === "dashboard"   && <Dashboard   setPage={setPage} dupCount={dupCount} pacientes={pacientes} />}
          {page === "importar"    && <Importar    setPage={setPage} onImportar={handleNovaImportacao} total={pacientes.length} dupTotal={dups.length} />}
          {page === "fila"        && <Fila        pacientes={pacientes} />}
          {page === "duplicatas"  && <Duplicatas  duplicatas={dups} onResolve={handleDupResolve} />}
          {page === "lembretes"   && <Lembretes   historico={historico} />}
          {page === "indicadores" && <Indicadores pacientes={pacientes} />}
        </main>
      </div>
    </>
  );
}
