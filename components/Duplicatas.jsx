import React, { useState } from "react";
import { duplicatas as initialDuplicatas } from "../data";

export default function Duplicatas({ onResolve }) {
  const [resolvidas, setResolvidas] = useState([]);

  function resolver(id) {
    setResolvidas(prev => [...prev, id]);
    onResolve();
  }

  const pendentes = initialDuplicatas.filter(d => !resolvidas.includes(d.id));

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Módulo 3</div>
        <h1>Detecção de Duplicatas</h1>
        <p>Pacientes com registros múltiplos detectados automaticamente</p>
      </div>

      {pendentes.length > 0 ? (
        <div className="alert error">
          <span className="alert-icon">🔴</span>
          <div>
            <strong>{pendentes.length} duplicata{pendentes.length > 1 ? "s" : ""} encontrada{pendentes.length > 1 ? "s" : ""}</strong> aguardam revisão.
            Revise e confirme qual registro manter antes de enviar lembretes.
          </div>
        </div>
      ) : (
        <div className="alert ok">
          <span className="alert-icon">✅</span>
          <div><strong>Todas as duplicatas foram resolvidas!</strong> A fila está limpa.</div>
        </div>
      )}

      {initialDuplicatas.map(dup => {
        const resolvida = resolvidas.includes(dup.id);
        return (
          <div
            key={dup.id}
            className="card"
            style={{
              marginBottom: 16,
              borderLeft: `3px solid ${dup.tipo === "error" ? "var(--red-400)" : "var(--amber-400)"}`,
              opacity: resolvida ? 0.45 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <div className="card-title" style={{ marginBottom: 10 }}>
              <div className="card-title-icon">{dup.tipo === "error" ? "🔴" : "🟡"}</div>
              Grupo {dup.id + 1}: {dup.motivo}
              {resolvida && (
                <span className="badge confirmado" style={{ marginLeft:"auto" }}>✅ Resolvida</span>
              )}
              {!resolvida && (
                <span className={`badge ${dup.tipo === "error" ? "duplicata" : "aguardando"}`} style={{ marginLeft:"auto" }}>
                  {dup.tipo === "error" ? "Duplicata confirmada" : "Suspeita — revisão manual"}
                </span>
              )}
            </div>

            <div style={{ overflowX:"auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Nome</th><th>CPF</th>
                    <th>Especialidade</th><th>Solicitado</th>
                    <th>UBS</th><th>Situação</th><th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {dup.registros.map(r => (
                    <tr key={r.id} style={{ background: (r.situacao !== "Original") ? "var(--red-50)" : "white" }}>
                      <td className="mono">{r.id}</td>
                      <td style={{ fontWeight: 600 }}>{r.nome}</td>
                      <td className="mono">{r.cpf}</td>
                      <td>{r.esp}</td>
                      <td>{r.sol}</td>
                      <td>{r.ubs}</td>
                      <td>
                        <span className={`badge ${r.situacao === "Original" ? "original" : r.situacao === "Duplicata" ? "duplicata" : "suspeito"}`}>
                          {r.situacao}
                        </span>
                      </td>
                      <td>
                        {r.situacao !== "Original" && !resolvida ? (
                          <button className="btn btn-danger btn-sm" onClick={() => resolver(dup.id)}>
                            Remover
                          </button>
                        ) : (
                          <span style={{ fontSize:11, color:"var(--gray-400)" }}>Manter</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="card">
        <div className="card-title"><div className="card-title-icon">🔍</div>Como a detecção funciona</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {[
            { color:"var(--blue-50)",   border:"var(--blue-200)",  title:"1. CPF idêntico",         titleColor:"var(--blue-800)",  text:"Mesmo CPF com especialidades iguais = duplicata certa. Mesmo CPF em especialidades diferentes = verificação manual." },
            { color:"var(--amber-50)",  border:"var(--amber-100)", title:"2. Nome + data de nasc.", titleColor:"var(--amber-700)", text:"Nome similar (≥ 90% de similaridade) com mesma data de nascimento pode indicar erro de digitação no CPF." },
            { color:"var(--teal-50)",   border:"var(--teal-100)",  title:"3. Telefone coincidente", titleColor:"var(--teal-700)",  text:"Mesmo número com nomes diferentes pode indicar familiar cadastrado incorretamente na fila." },
          ].map(b => (
            <div key={b.title} style={{ padding:14, background:b.color, borderRadius:8, border:`1px solid ${b.border}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:b.titleColor, marginBottom:6 }}>{b.title}</div>
              <div style={{ fontSize:12, color:"var(--gray-600)" }}>{b.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
