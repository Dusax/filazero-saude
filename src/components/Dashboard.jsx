import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { calcEspera, especialidades } from "../data";

const espColors = { Cardiologia:"#E24B4A", Ortopedia:"#BA7517", Oftalmologia:"#378ADD", Neurologia:"#A32D2D", Endocrinologia:"#1D9E75" };

const mapDots = [
  { x:35, y:40, level:"alta",  label:"Centro"      },
  { x:62, y:55, level:"media", label:"Vassoural"   },
  { x:25, y:65, level:"alta",  label:"Boa Vista"   },
  { x:75, y:35, level:"baixa", label:"Salgado"     },
  { x:50, y:75, level:"media", label:"Rendeiras"   },
  { x:85, y:65, level:"baixa", label:"Alto do Moura" },
];

export default function Dashboard({ setPage, dupCount, pacientes }) {
  const [tooltip, setTooltip] = useState(null);
  const [dataInicio, setDataInicio] = useState("2025-01-01");
  const [dataFim, setDataFim]       = useState("2025-05-31");

  const filtrados = useMemo(() => {
    return pacientes.filter(p => {
      const [d, m, y] = p.sol.split("/").map(Number);
      const data = new Date(y, m - 1, d);
      return data >= new Date(dataInicio) && data <= new Date(dataFim);
    });
  }, [pacientes, dataInicio, dataFim]);

  const espData = useMemo(() => {
    return especialidades.map(esp => ({
      name: esp,
      total: filtrados.filter(p => p.esp === esp).length,
    })).filter(e => e.total > 0);
  }, [filtrados]);

  const totalFila    = filtrados.length;
  const esperaMedia  = filtrados.length > 0 ? Math.round(filtrados.reduce((acc, p) => acc + calcEspera(p.sol), 0) / filtrados.length) : 0;
  const taxaFaltas   = filtrados.length > 0 ? Math.round(filtrados.filter(p => p.status === "Faltou").length / filtrados.length * 100) : 0;
  const vagasOciosas = filtrados.filter(p => p.status === "Faltou").length;

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Início</div>
        <h1>Painel Geral — Caruaru</h1>
        <p>Visão consolidada das filas de espera • Atualizado em: 03/06/2025</p>
      </div>

      {/* FILTRO DE DATA */}
      <div className="card" style={{ marginBottom:20, padding:"14px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, fontWeight:700, color:"var(--blue-800)" }}>📅 Período</span>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <label style={{ fontSize:11, color:"var(--gray-600)" }}>De</label>
            <input
              type="date" value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              style={{ fontFamily:"Sora,sans-serif", fontSize:12, padding:"6px 10px", border:"1.5px solid var(--gray-100)", borderRadius:7 }}
            />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <label style={{ fontSize:11, color:"var(--gray-600)" }}>Até</label>
            <input
              type="date" value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              style={{ fontFamily:"Sora,sans-serif", fontSize:12, padding:"6px 10px", border:"1.5px solid var(--gray-100)", borderRadius:7 }}
            />
          </div>
          <span style={{ fontSize:11, color:"var(--gray-400)" }}>{filtrados.length} paciente(s) no período</span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setDataInicio("2025-01-01"); setDataFim("2025-05-31"); }}
          >
            Limpar filtro
          </button>
        </div>
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
          { label:"Total na fila",  value:totalFila,          sub:"pacientes no período", cls:"blue"  },
          { label:"Espera média",   value:`${esperaMedia} dias`, sub:"por especialidade",  cls:"amber" },
          { label:"Taxa de faltas", value:`${taxaFaltas}%`,   sub:"no período",           cls:"red"   },
          { label:"Faltas",         value:vagasOciosas,       sub:"vagas perdidas",        cls:"teal"  },
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
          {espData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={espData} layout="vertical" margin={{ left:80, right:20 }}>
                <XAxis type="number" tick={{ fontSize:10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:11 }} width={80} />
                <Tooltip formatter={v => [`${v} pacientes`]} />
                <Bar dataKey="total" radius={[0,4,4,0]}>
                  {espData.map(e => <Cell key={e.name} fill={espColors[e.name] || "#378ADD"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign:"center", padding:32, color:"var(--gray-400)", fontSize:13 }}>Nenhum paciente no período selecionado.</div>
          )}
        </div>

        <div className="card">
          <div className="card-title"><div className="card-title-icon">🗺️</div>Distribuição por Bairro</div>
          <div className="mini-map" style={{ position:"relative" }}>
            {mapDots.map((d, i) => (
              <div
                key={i}
                className={`map-dot ${d.level}`}
                style={{ left:`${d.x}%`, top:`${d.y}%` }}
                onMouseEnter={() => setTooltip(d)}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
            {tooltip && (
              <div style={{ position:"absolute", left:`${tooltip.x}%`, top:`${tooltip.y - 14}%`, transform:"translate(-50%,-100%)", background:"rgba(0,0,0,0.8)", color:"white", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:4, whiteSpace:"nowrap", pointerEvents:"none" }}>
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
            <div><strong>{filtrados.filter(p => p.status === "Aguardando").length} pacientes</strong> aguardando lembrete no período.</div>
          </div>
          <div className="alert ok" style={{ marginBottom:0 }}>
            <span className="alert-icon">✅</span>
            <div><strong>{filtrados.filter(p => p.status === "Confirmado").length} pacientes</strong> com consulta confirmada.</div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setPage("duplicatas")}>Revisar duplicatas</button>
            <button className="btn btn-outline btn-sm" onClick={() => setPage("lembretes")}>Ver lembretes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
