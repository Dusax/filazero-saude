# FilaZero Saúde

Plataforma de gestão de filas para consultas, exames e procedimentos no SUS. Desenvolvido como projeto da disciplina de Empreendedorismo no Departamento de Computação da UFRPE.

## Sobre o projeto

O FilaZero Saúde é um MVP que aborda um dos maiores problemas operacionais do sistema público de saúde: a gestão manual e fragmentada de filas de espera. Secretarias municipais dependem de planilhas, WhatsApp e ligações telefônicas para controlar centenas de pacientes por especialidade, sem rastreabilidade e com alto índice de faltas.

## Módulos

- **Dashboard** — KPIs, distribuição por especialidade e mapa por bairro
- **Importar Lista** — upload de planilha CSV/XLS com validação automática
- **Fila de Espera** — tabela filtrável com priorização configurável
- **Duplicatas** — detecção automática por CPF, nome e telefone
- **Lembretes** — simulação de notificações via SMS e WhatsApp
- **Indicadores** — métricas mensais de espera, absenteísmo e aproveitamento de vagas

## Stack

React · Recharts · CSS puro

## Como rodar localmente

```bash
npm install
npm start
```
