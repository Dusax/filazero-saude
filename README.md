# FilaZero Saúde — MVP

Protótipo navegável de gestão de filas de saúde pública.  
Desenvolvido para a Disciplina de Empreendedorismo — Departamento de Computação, UFRPE.

## Como fazer deploy na Vercel

### Opção 1 — Interface web (mais fácil)

1. Crie uma conta gratuita em [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Faça upload desta pasta ou conecte ao GitHub (veja abaixo)
4. A Vercel detecta automaticamente que é Create React App
5. Clique **Deploy** — pronto, URL gerada em ~1 minuto

### Opção 2 — Via GitHub (recomendado)

1. Crie um repositório no GitHub e suba esta pasta:
   ```bash
   git init
   git add .
   git commit -m "FilaZero Saúde MVP"
   git remote add origin https://github.com/SEU_USUARIO/filazero.git
   git push -u origin main
   ```
2. Acesse [vercel.com](https://vercel.com) → **Import Git Repository**
3. Selecione o repositório → **Deploy**

### Opção 3 — CLI da Vercel

```bash
npm install -g vercel
cd filazero-saude
vercel
```

## Rodar localmente

```bash
npm install
npm start
```

Acessa em: http://localhost:3000

## Estrutura do projeto

```
src/
  App.js              # Roteamento principal + sidebar
  styles.css          # Design system completo
  data.js             # Dados mock (pacientes, duplicatas, histórico)
  components/
    Dashboard.jsx     # Painel com KPIs, gráficos e mapa
    Importar.jsx      # Upload CSV com progresso animado
    Fila.jsx          # Tabela com filtros e ordenação
    Duplicatas.jsx    # Detecção e remoção de duplicatas
    Lembretes.jsx     # Simulação de notificações SMS/WhatsApp
    Indicadores.jsx   # Gráficos e tabela de métricas
```

## Módulos do MVP

| Módulo | Função |
|--------|--------|
| Dashboard | KPIs, gráfico por especialidade, mapa por bairro |
| Importar Lista | Upload CSV/XLS com validação e progresso |
| Fila de Espera | Tabela filtrável com priorização configurável |
| Duplicatas | Detecção automática com 3 critérios de identificação |
| Lembretes | Simulação de envio SMS/WhatsApp com prévia da mensagem |
| Indicadores | Métricas mensais: espera, absenteísmo, aproveitamento |
