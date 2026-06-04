import React, { useState } from "react";
import { historicoLembretes } from "../data";

const timelineItems = [
  { dot:"sent",    label:"7 dias antes", sub:"Lembrete inicial — 03/06/2025 09:00", badge:"Enviado ✓"  },
  { dot:"sent",    label:"3 dias antes", sub:"Confirmação de presença — 07/06/2025 09:00", badge:"Enviado ✓" },
  { dot:"pending", label:"1 dia antes",  sub:"Lembrete final — 09/06/2025 08:00",   badge:"Pendente"   },
  { dot:"future",  label:"No dia",       sub:"Mensagem cedo — 10/06/2025 07:00",    badge:"Futuro"     },
];

const dotSymbol = { sent:"✓", pending:"!", future:"○" };

function buildMsg(canal, dias) {
  const prazo = dias === "0" ? "hoje" : `em ${dias} dia${+dias > 1 ? "s" : ""}`;
  const emoji = canal === "whatsapp" ? "🏥 " : "";
  return `${emoji}Olá, [NOME DO PACIENTE]!\n\nVocê tem consulta de [ESPECIALIDADE] marcada ${prazo} (10/06/2025) no(a) [UNIDADE DE SAÚDE].\n\nConfirme presença respondendo SIM ou ligue (87) XXXX-XXXX.\n\nSecretaria Municipal de Saúde — Caruaru/PE`;
}

export default function Lembretes() {
  const [canal, setCanal] = useState("whatsapp");
  const [dias, setDias]   = useState("7");
  const [sending, setSending] = useState(false);
  const [sent, setSent]   = useState(false);

  function simularEnvio() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  }

  return (
    <div>
      <div className="page-header">
        <div className="breadcrumb">Módulo 4</div>
        <h1>Lembretes Automáticos</h1>
        <p>Simulação do fluxo de notificações via SMS e WhatsApp</p>
      </div>

      <div className="alert info">
        <span className="alert-icon">📲</span>
        <div><strong>Modo simulação ativo</strong> — nenhuma mensagem real será enviada. Os envios abaixo são apenas demonstrativos do MVP.</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><div className="card-title-icon">📅</div>Fluxo de Notificações</div>
          <div className="lembrete-timeline">
            {timelineItems.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className={`timeline-dot ${item.dot}`}>{dotSymbol[item.dot]}</div>
                <div className="timeline-label">
                  {item.label}{" "}
                  <span style={{ fontSize:11, fontWeight:400, color:"var(--gray-400)" }}>— {item.badge}</span>
                </div>
                <div className="timeline-sub">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title"><div className="card-title-icon">💬</div>Modelo de Mensagem</div>

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--gray-600)", display:"block", marginBottom:4 }}>Canal</label>
            <select value={canal} onChange={e => setCanal(e.target.value)} style={{ width:"100%", fontFamily:"Sora,sans-serif", fontSize:12, padding:"7px 12px", border:"1.5px solid var(--gray-100)", borderRadius:7 }}>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"var(--gray-600)", display:"block", marginBottom:4 }}>Antecedência</label>
            <select value={dias} onChange={e => setDias(e.target.value)} style={{ width:"100%", fontFamily:"Sora,sans-serif", fontSize:12, padding:"7px 12px", border:"1.5px solid var(--gray-100)", borderRadius:7 }}>
              <option value="7">7 dias antes</option>
              <option value="3">3 dias antes</option>
              <option value="1">1 dia antes</option>
              <option value="0">No dia (manhã)</option>
            </select>
          </div>

          <div style={{ fontSize:11, fontWeight:700, color:"var(--gray-600)", marginBottom:6 }}>Prévia da mensagem</div>
          <div className="msg-preview">{buildMsg(canal, dias)}</div>

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop:14 }}
            onClick={simularEnvio}
            disabled={sending}
          >
            {sending ? "⏳ Enviando..." : "▶ Simular envio para 12 pacientes"}
          </button>

          {sent && !sending && (
            <div className="alert ok" style={{ marginTop:10, marginBottom:0 }}>
              <span className="alert-icon">✅</span>
              <div><strong>12 mensagens simuladas!</strong> Em produção, os pacientes receberiam a notificação agora.</div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><div className="card-title-icon">📊</div>Histórico de Envios (Simulado)</div>
        <table className="data-table">
          <thead>
            <tr><th>Paciente</th><th>Canal</th><th>Enviado em</th><th>Consulta em</th><th>Status</th></tr>
          </thead>
          <tbody>
            {historicoLembretes.map((h, i) => (
              <tr key={i}>
                <td style={{ fontWeight:600 }}>{h.nome}</td>
                <td>{h.canal}</td>
                <td><span className="mono">{h.enviado}</span></td>
                <td>{h.consulta}</td>
                <td><span className={`badge ${h.status === "Confirmado" ? "confirmado" : "faltou"}`}>{h.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
