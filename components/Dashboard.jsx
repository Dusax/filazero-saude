import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const espData = [
  { name: "Cardiologia",    total: 58 },
  { name: "Ortopedia",      total: 49 },
  { name: "Oftalmologia",   total: 44 },
  { name: "Neurologia",     total: 37 },
  { name: "Endocrinologia", total: 29 },
];

const weekData = [
  { name: "Seg", total: 12 },
  { name: "Ter", total: 18 },
  { name: "Qua", total: 14 },
  { name: "Qui", total: 20 },
  { name: "Sex", total: 9  },
];

const mapDots = [
  { x: 35, y: 40, level: "alta",  label: "Centro (58)"      },
  { x: 62, y: 55, level: "media", label: "Vassoural (41)"   },
  { x: 25, y: 65, level: "alta",  label: "Boa Vista (37)"   },
  { x: 75, y: 35, level: "baixa", label: "Salgado (29)"     },
  { x: 50, y: 75, level: "media", label: "Rendeiras (33)"   },
  { x: 85, y: 65, level: "baixa", label: "Alto do Moura (18)" },
];

const espColors = { Cardiologia: "#E24B4A", Ortopedia: "#BA7517", Oftalmologia: "#378ADD", Neurologia: "#A32D2D", Endocrinologia: "#1D9E75" };

export default function Dashboard({ setPage, dupCount }) {
  const [tooltip, setTooltip] = React.useState(null);

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Início</div>
        <h1>Painel Geral — Caruaru</h1>
        <p>Visão consolidada das filas de espera • Atualizado em: 03/06/2025</p>
      </div>

      {dupCount > 0 && (
        <div className="alert info">
          <span className="alert-icon">ℹ️</span>
          <div>
            <strong>{dupCount} duplicata{dupCount > 1 ? "s" : ""} detectada{dupCount > 1 ? "s" : ""}</strong> aguardam revisão.{" "}
            <button onClick={() => setPage("duplicatas")} style={{ background:"none", border:"none", color:"var(--blue-700)", fontWeight:600, cursor:"pointer", fontSize:12, fontFamily:"Sora,sans-serif" }}>
              Revisar agora →
            </button>
          </div>
        </div>
      )}

      <div className="stats-grid">
        {[
          { label:"Total na fila",   value:"247",    sub:"pacientes aguardando", cls:"blue"  },
          { label:"Espera média",    value:"68 dias", sub:"por especialidade",   cls:"amber" },
          { label:"Taxa de faltas",  value:"22%",    sub:"último mês",           cls:"red"   },
          { label:"Vagas ociosas",   value:"18",     sub:"esta semana",          cls:"teal"  },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${s.cls}`}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><div className="card-title-icon">🏥</div>Pacientes por Especialidade</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={espData} layout="vertical" margin={{ left: 80, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => [`${v} pacientes`]} />
              <Bar dataKey="total" radius={[0,4,4,0]}>
                {espData.map(e => <Cell key={e.name} fill={espColors[e.name]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title"><div className="card-title-icon">📅</div>Consultas Esta Semana</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData} margin={{ left: 0, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [`${v} consultas`]} />
              <Bar dataKey="total" fill="var(--teal-400)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><div className="card-title-icon">🗺️</div>Distribuição por Bairro</div>
          <div className="mini-map" style={{ position:"relative" }}>
            {mapDots.map((d, i) => (
              <div
                key={i}
                className={`map-dot ${d.level}`}
                style={{ left:`${d.x}%`, top:`${d.y}%` }}
                onMouseEnter={() => setTooltip({ ...d })}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
            {tooltip && (
              <div style={{
                position:"absolute", left:`${tooltip.x}%`, top:`${tooltip.y - 14}%`,
                transform:"translate(-50%,-100%)",
                background:"rgba(0,0,0,0.8)", color:"white",
                fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4,
                whiteSpace:"nowrap", pointerEvents:"none"
              }}>
                {tooltip.label}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:14, marginTop:10, fontSize:11 }}>
            <span style={{ color:"var(--red-600)" }}>● Alta prioridade</span>
            <span style={{ color:"var(--amber-600)" }}>● Média</span>
            <span style={{ color:"var(--teal-600)" }}>● Baixa</span>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><div className="card-title-icon">⚡</div>Ações Pendentes</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {dupCount > 0 && (
              <div className="alert warn" style={{ marginBottom:0 }}>
                <span className="alert-icon">⚠️</span>
                <div><strong>{dupCount} duplicata{dupCount > 1 ? "s" : ""}</strong> precisam de revisão antes de enviar lembretes.</div>
              </div>
            )}
            <div className="alert warn" style={{ marginBottom:0 }}>
              <span className="alert-icon">📲</span>
              <div><strong>12 lembretes</strong> programados para amanhã — confirmar envio.</div>
            </div>
            <div className="alert ok" style={{ marginBottom:0 }}>
              <span className="alert-icon">✅</span>
              <div><strong>Lista de Cardiologia</strong> importada com sucesso ontem.</div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setPage("duplicatas")}>Revisar duplicatas</button>
              <button className="btn btn-outline btn-sm" onClick={() => setPage("lembretes")}>Ver lembretes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
