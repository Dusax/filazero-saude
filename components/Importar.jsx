import React, { useState, useRef } from "react";

export default function Importar({ setPage }) {
  const [stage, setStage] = useState("idle"); // idle | progress | done
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const fileRef = useRef();

  function runImport() {
    setStage("progress");
    const steps = [
      [200,  20, "Lendo arquivo CSV..."],
      [600,  45, "Validando colunas..."],
      [1000, 65, "Processando 24 registros..."],
      [1400, 85, "Detectando duplicatas..."],
      [1800, 100, "Concluído!"],
    ];
    steps.forEach(([delay, pct, label]) => {
      setTimeout(() => {
        setProgress(pct);
        setProgressLabel(label);
        if (pct === 100) setTimeout(() => setStage("done"), 400);
      }, delay);
    });
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Módulo 1</div>
        <h1>Importar Lista de Espera</h1>
        <p>Faça upload de planilha CSV ou XLS com os dados dos pacientes</p>
      </div>

      {stage === "idle" && (
        <div className="card">
          <div className="card-title"><div className="card-title-icon">📂</div>Selecionar Arquivo</div>
          <div className="upload-zone" onClick={() => fileRef.current.click()}>
            <div className="upload-icon">📋</div>
            <h3>Arraste ou clique para selecionar</h3>
            <p>Formatos aceitos: .CSV, .XLS, .XLSX · Máx. 10 MB</p>
          </div>
          <input
            type="file" ref={fileRef} style={{ display:"none" }}
            accept=".csv,.xls,.xlsx"
            onChange={() => runImport()}
          />
          <div style={{ marginTop:16 }}>
            <div className="alert info" style={{ marginBottom:0 }}>
              <span className="alert-icon">📄</span>
              <div>
                <strong>Colunas esperadas:</strong> Nome, CPF, Data de Nascimento, Especialidade, Data Solicitação, UBS de Origem, Telefone, Status
                <br />
                <button
                  onClick={runImport}
                  style={{ background:"none", border:"none", color:"var(--blue-700)", fontWeight:600, cursor:"pointer", fontSize:11, fontFamily:"Sora,sans-serif", marginTop:4 }}
                >
                  ← Simular importação com dados de exemplo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === "progress" && (
        <div className="card">
          <div className="card-title"><div className="card-title-icon">⚙️</div>Processando...</div>
          <div style={{ fontSize:13, color:"var(--gray-600)", marginBottom:10 }}>{progressLabel}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width:`${progress}%` }} />
          </div>
          <div style={{ fontSize:11, color:"var(--gray-400)", marginTop:6 }}>{progress}%</div>
        </div>
      )}

      {stage === "done" && (
        <div className="card">
          <div className="card-title"><div className="card-title-icon">✅</div>Importação Concluída</div>
          <div className="grid-4" style={{ marginBottom:16 }}>
            {[
              { label:"Total importado", value:"24",  sub:"registros",        cls:"teal"  },
              { label:"Válidos",         value:"21",  sub:"prontos p/ fila",  cls:"blue"  },
              { label:"Duplicatas",      value:"3",   sub:"para revisão",     cls:"red"   },
              { label:"Inconsistentes",  value:"0",   sub:"dados faltando",   cls:"amber" },
            ].map(s => (
              <div key={s.label} className={`stat-card ${s.cls}`}>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value ${s.cls}`}>{s.value}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <div className="alert ok" style={{ marginBottom:14 }}>
            <span className="alert-icon">✅</span>
            <div><strong>Lista importada com sucesso!</strong> Os dados já estão disponíveis no módulo de Fila de Espera.</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn btn-primary" onClick={() => setPage("fila")}>Ver fila de espera →</button>
            <button className="btn btn-outline" onClick={() => { setStage("idle"); setProgress(0); }}>Importar outra lista</button>
          </div>
        </div>
      )}
    </div>
  );
}
