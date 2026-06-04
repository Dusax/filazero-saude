import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const esperaData = [
  { name: "Neurologia",    dias: 81 },
  { name: "Cardiologia",   dias: 74 },
  { name: "Endocrinologia",dias: 70 },
  { name: "Ortopedia",     dias: 62 },
  { name: "Oftalmologia",  dias: 55 },
];

const faltaData = [
  { name: "Cardiologia",    pct: 25 },
  { name: "Neurologia",     pct: 22 },
  { name: "Endocrinologia", pct: 21 },
  { name: "Ortopedia",      pct: 18 },
  { name: "Oftalmologia",   pct: 16 },
];

const resumo = [
  { esp:"Cardiologia",    fila:58, atendidos:32, faltas:8,  taxaFalta:25, espera:74, dup:2 },
  { esp:"Ortopedia",      fila:49, atendidos:28, faltas:5,  taxaFalta:18, espera:62, dup:1 },
  { esp:"Neurologia",     fila:37, atendidos:18, faltas:4,  taxaFalta:22, espera:81, dup:0 },
  { esp:"Oftalmologia",   fila:44, atendidos:25, faltas:4,  taxaFalta:16, espera:55, dup:1 },
  { esp:"Endocrinologia", fila:29, atendidos:14, faltas:3,  taxaFalta:21, espera:70, dup:0 },
];

function taxaBadge(v) {
  if (v >= 23) return "faltou";
  if (v >= 18) return "aguardando";
  return "confirmado";
}

function esperaColor(v) {
  if (v > 75) return "#E24B4A";
  if (v > 60) return "#BA7517";
  return "#1D9E75";
}
function faltaColor(v) {
  if (v > 22) return "#E24B4A";
  if (v > 18) return "#BA7517";
  return "#1D9E75";
}

export default function Indicadores() {
  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Análise</div>
        <h1>Indicadores</h1>
        <p>Métricas consolidadas do mês atual • Junho 2025</p>
      </div>

      <div className="stats-grid">
        {[
          { label:"Tempo médio de espera", value:"68 dias", sub:"▼ 12 dias vs. mês passado", cls:"blue"  },
          { label:"Taxa de absenteísmo",   value:"22%",     sub:"▼ 6pp após lembretes",      cls:"red"   },
          { label:"Aproveitamento vagas",  value:"78%",     sub:"▲ vs. 64% anterior",         cls:"teal"  },
          { label:"Duplicatas removidas",  value:"11",      sub:"este mês",                   cls:"amber" },
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
          <div className="card-title"><div className="card-title-icon">⏱️</div>Tempo Médio de Espera (dias)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={esperaData} layout="vertical" margin={{ left: 90, right: 20 }}>
              <XAxis type="number" tick={{ fontSize:10 }} unit=" d" />
              <YAxis type="category" dataKey="name" tick={{ fontSize:11 }} width={90} />
              <Tooltip formatter={v => [`${v} dias`]} />
              <Bar dataKey="dias" radius={[0,4,4,0]}>
                {esperaData.map(d => <Cell key={d.name} fill={esperaColor(d.dias)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title"><div className="card-title-icon">📉</div>Taxa de Falta por Especialidade (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={faltaData} layout="vertical" margin={{ left: 90, right: 20 }}>
              <XAxis type="number" tick={{ fontSize:10 }} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize:11 }} width={90} />
              <Tooltip formatter={v => [`${v}%`]} />
              <Bar dataKey="pct" radius={[0,4,4,0]}>
                {faltaData.map(d => <Cell key={d.name} fill={faltaColor(d.pct)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><div className="card-title-icon">📋</div>Resumo Mensal</div>
        <div style={{ overflowX:"auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Especialidade</th><th>Na Fila</th><th>Atendidos</th>
                <th>Faltas</th><th>Taxa Falta</th><th>Espera Média</th><th>Duplicatas</th>
              </tr>
            </thead>
            <tbody>
              {resumo.map(r => (
                <tr key={r.esp}>
                  <td style={{ fontWeight:600 }}>{r.esp}</td>
                  <td>{r.fila}</td>
                  <td>{r.atendidos}</td>
                  <td>{r.faltas}</td>
                  <td><span className={`badge ${taxaBadge(r.taxaFalta)}`}>{r.taxaFalta}%</span></td>
                  <td style={{ fontWeight:600, color: esperaColor(r.espera) }}>{r.espera} dias</td>
                  <td>{r.dup > 0 ? <span className="badge duplicata">{r.dup}</span> : <span style={{ color:"var(--gray-400)", fontSize:11 }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <button className="btn btn-outline btn-sm">⬇ Exportar CSV</button>
          <button className="btn btn-outline btn-sm">🖨️ Gerar PDF</button>
        </div>
      </div>
    </div>
  );
}
