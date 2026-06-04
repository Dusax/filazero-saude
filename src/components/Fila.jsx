import React, { useState, useMemo } from "react";
import { especialidades, calcEspera } from "../data";

const prioOrder = { Alta: 0, Média: 1, Baixa: 2 };
const prioWidth = { Alta: 90, Média: 55, Baixa: 25 };
const prioClass = { Alta: "alta", Média: "media", Baixa: "baixa" };
const statusClass = { Aguardando: "aguardando", Confirmado: "confirmado", Faltou: "faltou" };

export default function Fila({ pacientes }) {
  const [filterEsp, setFilterEsp] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterOrd, setFilterOrd] = useState("espera");
  const [search, setSearch] = useState("");

  const lista = useMemo(() => {
    let l = pacientes
      .filter(p => !filterEsp    || p.esp    === filterEsp)
      .filter(p => !filterStatus || p.status === filterStatus)
      .filter(p => !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.esp.toLowerCase().includes(search.toLowerCase()));

    if (filterOrd === "espera")     l = [...l].sort((a, b) => calcEspera(b.sol) - calcEspera(a.sol));
    else if (filterOrd === "prio")  l = [...l].sort((a, b) => prioOrder[a.prioridade] - prioOrder[b.prioridade]);
    else                             l = [...l].sort((a, b) => a.nome.localeCompare(b.nome));

    return l;
  }, [pacientes, filterEsp, filterStatus, filterOrd, search]);

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Módulo 2</div>
        <h1>Fila de Espera</h1>
        <p>Pacientes ordenados por critérios configuráveis • Duplicatas excluídas da visualização</p>
      </div>

      <div className="card">
        <div className="filter-row">
          <select value={filterEsp} onChange={e => setFilterEsp(e.target.value)}>
            <option value="">Todas especialidades</option>
            {especialidades.map(e => <option key={e}>{e}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option>
            {["Aguardando","Confirmado","Faltou"].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterOrd} onChange={e => setFilterOrd(e.target.value)}>
            <option value="espera">Ordenar: Tempo de espera ↓</option>
            <option value="prio">Ordenar: Prioridade ↓</option>
            <option value="nome">Ordenar: Nome A–Z</option>
          </select>
          <input
            type="text"
            placeholder="🔍 Buscar paciente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <span className="filter-count">{lista.length} paciente(s)</span>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Paciente</th>
                <th>Especialidade</th>
                <th>Solicitado em</th>
                <th>Espera</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:"center", padding:32, color:"var(--gray-400)" }}>Nenhum paciente encontrado.</td></tr>
              ) : lista.map((p, i) => (
                <tr key={p.id}>
                  <td style={{ fontWeight:700, color:"var(--gray-400)" }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight:600, fontSize:13 }}>{p.nome}</div>
                    <div style={{ fontSize:11, color:"var(--gray-400)" }}>{p.ubs}</div>
                  </td>
                  <td>{p.esp}</td>
                  <td><span className="mono">{p.sol}</span></td>
                  <td style={{ fontWeight:700, color:"var(--blue-700)" }}>{calcEspera(p.sol)} dias</td>
                  <td>
                    <div className="priority-bar">
                      <div className="pbar">
                        <div className={`pbar-fill ${prioClass[p.prioridade]}`} style={{ width:`${prioWidth[p.prioridade]}%` }} />
                      </div>
                      <span style={{ fontSize:11, color:"var(--gray-600)" }}>{p.prioridade}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${statusClass[p.status]}`}>{p.status}</span></td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => alert(`Paciente: ${p.nome}\nEspecialidade: ${p.esp}\nUBS: ${p.ubs}\nTelefone: ${p.tel}\nSolicitado em: ${p.sol}\nEspera: ${calcEspera(p.sol)} dias`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
