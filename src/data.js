export const especialidades = ["Cardiologia","Ortopedia","Neurologia","Oftalmologia","Endocrinologia"];
export const ubsList = ["UBS Centro","UBS Vassoural","UBS Boa Vista","UBS Salgado","UBS Rendeiras"];
export const HOJE = new Date(2025, 5, 3);

const prenomes = ["Maria","José","Ana","Francisco","Raimunda","Antônio","Lúcia","Paulo","Francisca","Manoel","Conceição","Josefa","Severino","Benedita","Geraldo","Terezinha","Cícero","Marlene","Socorro","Dalva","Inácio","Idalva","Raimundo","Edilson","Valdenira","Genivaldo","Zuleide","Erivaldo","Ednalva","Cicinho"];
const sobrenomes = ["Silva","Santos","Oliveira","Lima","Ferreira","Pereira","Mendes","Nascimento","Costa","Dantas","Barros","Rodrigues","Albuquerque","Cavalcanti","Moura","Gomes","Vieira","Teixeira","Cruz","Figueiredo","Araújo","Magalhães","Barbosa","Batista","Ribeiro","Alves","Souza","Menezes","Carmo","Fernandes"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pad(n) { return String(n).padStart(2, "0"); }

function gerarData(anoMin, anoMax) {
  const y = rnd(anoMin, anoMax);
  const m = rnd(1, 12);
  const d = rnd(1, 28);
  return `${pad(d)}/${pad(m)}/${y}`;
}

function gerarCPF(prefixo) {
  const p = prefixo || rnd(100, 999);
  return `${p}.xxx.xxx-${pad(rnd(10, 99))}`;
}

function gerarTel() {
  return `(81) 9${rnd(7,9)}${rnd(100,999)}-${rnd(1000,9999)}`;
}

function gerarStatus() {
  const r = Math.random();
  if (r < 0.60) return "Aguardando";
  if (r < 0.85) return "Confirmado";
  return "Faltou";
}

function gerarPrioridade() {
  const r = Math.random();
  if (r < 0.30) return "Alta";
  if (r < 0.75) return "Média";
  return "Baixa";
}

export function gerarPacientes() {
  const total = rnd(22, 30);
  return Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    nome: `${pick(prenomes)} ${pick(sobrenomes)} ${pick(sobrenomes)}`,
    cpf: gerarCPF(rnd(100, 999)),
    nasc: gerarData(1940, 2000),
    esp: pick(especialidades),
    ubs: pick(ubsList),
    tel: gerarTel(),
    status: gerarStatus(),
    sol: gerarData(2025, 2025).replace(/\/2025/, `/${rnd(1,4) < 3 ? "2025" : "2025"}`),
    prioridade: gerarPrioridade(),
  }));
}

export function gerarDuplicatas(pacientes) {
  const total = rnd(2, 4);
  const resultado = [];
  const usados = new Set();
  const tipos = [
    (p, idx) => ({
      id: idx,
      motivo: "CPF idêntico — mesma especialidade",
      tipo: "error",
      registros: [
        { id:`D-${pad(idx*2+1)}`, nome:p.nome, cpf:p.cpf, esp:p.esp, sol:p.sol, ubs:p.ubs, situacao:"Original" },
        { id:`D-${pad(idx*2+2)}`, nome:p.nome.split(" ").slice(0,2).join(" "), cpf:p.cpf, esp:p.esp, sol:gerarData(2025,2025), ubs:pick(ubsList), situacao:"Duplicata" },
      ],
    }),
    (p, idx) => ({
      id: idx,
      motivo: "Nome similar + mesma data de nascimento",
      tipo: "warn",
      registros: [
        { id:`D-${pad(idx*2+1)}`, nome:p.nome, cpf:p.cpf, esp:p.esp, sol:p.sol, ubs:p.ubs, situacao:"Original" },
        { id:`D-${pad(idx*2+2)}`, nome:p.nome.slice(0,-1)+"s", cpf:gerarCPF(), esp:p.esp, sol:gerarData(2025,2025), ubs:pick(ubsList), situacao:"Suspeito" },
      ],
    }),
    (p, idx) => ({
      id: idx,
      motivo: "Mesmo telefone — nomes diferentes",
      tipo: "warn",
      registros: [
        { id:`D-${pad(idx*2+1)}`, nome:p.nome, cpf:p.cpf, esp:p.esp, sol:p.sol, ubs:p.ubs, situacao:"Original" },
        { id:`D-${pad(idx*2+2)}`, nome:`${pick(prenomes)} ${pick(sobrenomes)}`, cpf:gerarCPF(), esp:p.esp, sol:gerarData(2025,2025), ubs:pick(ubsList), situacao:"Suspeito" },
      ],
    }),
  ];

  for (let i = 0; i < total; i++) {
    let p;
    do { p = pacientes[rnd(0, pacientes.length - 1)]; } while (usados.has(p.id));
    usados.add(p.id);
    resultado.push(tipos[i % tipos.length](p, i));
  }
  return resultado;
}

export function gerarHistorico(pacientes) {
  return pacientes.slice(0, 5).map(p => ({
    nome: p.nome,
    canal: Math.random() > 0.5 ? "WhatsApp" : "SMS",
    enviado: `${pad(rnd(25,31))}/05/2025 0${rnd(8,9)}:${pad(rnd(0,59))}`,
    consulta: `0${rnd(3,9)}/06/2025`,
    status: Math.random() > 0.25 ? "Confirmado" : "Faltou",
  }));
}

export function calcEspera(sol) {
  const [d, m, y] = sol.split("/").map(Number);
  return Math.round((HOJE - new Date(y, m - 1, d)) / 86400000);
}
