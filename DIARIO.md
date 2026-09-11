# FocusTag (app web) — diário de bordo

## 2026-09-10 — Blocos 0 a 5

Construída a aplicação web de demonstração do FocusApp, agora com a marca **FocusTag**.

**Arquivos:**
- `index.html` — app inteiro num arquivo (HTML + CSS + JS puro, sem build). Barlow via Google Fonts.
- `assets/mark.svg`, `assets/icon.svg` — símbolo da grade 3x3 (versão SVG feita aqui; o
  original do João entra depois em assets/).
- `manifest.webmanifest` — instala como app em tela cheia.
- `CHECKLIST.md` — estado item a item.

**Fluxo:** abertura (com 3 passos na 1ª visita) → configuração (horário, ponto da tag,
registrar tag, modo demonstração) → armado (contagem + wake lock) → alarme (tela 100% laranja,
relógio grande, grade pulsando, som crescente Web Audio ~42s, vibração, sem soneca) →
desliga só com a tag certa (ou simulada) → "Bom dia" com resumo → histórico.

**Decisões travadas:** alarme 100% laranja; fonte Barlow Semi Condensed Black; sem dias da
semana no MVP; nome "FocusTag" junto.

**Lógica portada do `../prototipo/index.html`:** Web NFC (NDEFReader), detecção de contexto
seguro, registro por número de série + fallback simulado, Web Audio com rampa de ganho,
Vibration, Wake Lock, localStorage com try/catch.

**Removido do protótipo:** tudo de bloqueio de apps, janela de foco com lista de bloqueados,
tema escuro.

**Pendente:** teste com tag NFC real (precisa publicar em HTTPS primeiro) e o Bloco 6
(publicar no Vercel, ensaiar, roteiro de pitch, capturas).

**Testado com:** Playwright headless a 402px de largura. Script em
`../Classroom/.scraper/shot-focustag.js`, capturas em /tmp/ftshots.

## 2026-09-10 (cont.) — Seletor de horário + repetição/dias

João não conseguiu mudar o horário (o truque de input nativo escondido + showPicker não pegou).
Substituído por:

- **Seletor de horário de rolagem** (wheel picker): dois cilindros HH (00-23) e MM (00-59)
  com `scroll-snap`, faixa central laranja, o número centralizado é o escolhido. Toca no
  número para centralizar. Sem biblioteca. `wireWheel()` lê o índice no fim da rolagem.
  Reaplica a posição toda vez que a tela de config aparece (senão o `scrollTop` não pega
  enquanto a tela está `hidden`).
- **Repetição**: presets Uma vez / Todo dia / Seg a sex / Fim de semana / Escolher dias.
  "Escolher dias" abre 7 botões (D S T Q Q S S). `state.dias` = null (uma vez) ou array de
  0-6. `customOpen` controla se a fileira de dias aparece.
- `nextAlarmTs(hora, dias)` acha a próxima ocorrência do horário num dos dias (ou o próximo
  horário futuro se "uma vez"). Trava se escolheu "dias" e não marcou nenhum.
- Tela "armado" agora mostra os dias (repShort) e "toca amanhã / terça · em Xh Ym".
- Corrigido o espaço duplo no countpill.

## 2026-09-10 (cont.) — Janela de foco simulada

João pediu a visualização do bloqueio de apps de volta (como simulação para o pitch).

- **Config**: card "Janela de foco" com duração (15/30/45/60 min) e chips para escolher quais
  dos 5 apps bloquear (Instagram, TikTok, YouTube, X, Facebook).
- **Nova tela `focus`** entre o alarme e o fecho: timer regressivo grande + barra de progresso,
  seção "Bloqueado agora" (tiles apagados com cadeado, nome riscado) e "Continua liberado"
  (Telefone, Mensagens, Mapas, Música, Relógio). Aviso de que na web é só a visualização.
- **Fluxo**: tag desliga o alarme -> tela de foco -> no fim do tempo (ou "liberar agora" com
  espera de 15s) -> fecho "Bom dia" que agora mostra "Janela de foco: completa / cortada".
  Emergência no alarme pula a janela.
- No modo demonstração a janela dura 25s.
- **Bug corrigido**: a classe `.app` dos tiles colidia com `.app` do shell (min-height:100dvh),
  esticava a página pra ~8000px. Renomeado para `.apptile`. Adicionado merge de `state` com
  `DEFAULT` no load pra não quebrar com estado antigo do localStorage.

## 2026-09-10 (cont.) — Bloco de extras (12 itens)

Adicionados de uma vez, a pedido do João:

**Vale muito:**
- Sequência de dias: `streakDias()` e `bestStreak()` calculadas do histórico (campo novo `dia`
  = data local). Chip "X manhãs seguidas" na abertura; no fecho, grade que estoura laranja
  (`.grid9.burst`) + chip da sequência quando cumpriu e streak >= 2.
- Tela "Meus números" (`#screen-stats`): 3 tiles (cumpridas/total, melhor sequência, atraso
  médio) + gráfico de barras das últimas 7 manhãs (segundos até levantar; barra cinza = emergência).
- Card "Próxima manhã" no topo da config (fundo escuro): dia + horário + "foco até HH:MM" +
  tag onde. `renderTomorrow()` é chamada por `saveState()`, então atualiza a cada mudança.
- Compartilhar: `makeShareImage()` desenha um card 1080x1350 no canvas (marca, horário,
  streak, "primeira hora protegida"). `navigator.share({files})` no celular; senão overlay
  `#imgov` com "toque e segure pra salvar".
- Seção "Em breve" na tela Sobre: fiador, trato com valor, app nativo, modo casal.
- PWA offline: `sw.js` (cache-first da casca + fontes), registrado no `load`.

**Vale se sobrar tempo:**
- Modo de rigidez (leve/firme/prova): `RIG_WAIT` = 5/15/30 s na emergência (alarme e foco);
  cancelar alarme no modo "prova" pede `confirm()`.
- Som do alarme (classico/suave/sirene): `startAudio()` ramificado; suave = 2 senoides + tremolo,
  sirene = sawtooth com sweep. Botão "ouvir 3 segundos".
- Testar a tag: `testarTag()` faz um scan de 6 s e compara com a registrada.
- Contador de tag errada: `wrongCount` no alarme -> `_manha.tentativas` -> aparece no fecho e
  no histórico.
- Tela Sobre com crédito da equipe e versão.
- Notificações: pede permissão ao armar; `notifyArmed()` se sair pro segundo plano armado;
  `notifyAlarm()` quando dispara com a aba escondida.

**Gotcha resolvido:** classe `.app` (shell) x tiles — já era `.apptile`. Merge de `state` com
`DEFAULT` no load cobre estado antigo do localStorage sem os campos novos.

Sem erros de console no fluxo completo (testado com Playwright). Falta o Bloco 6 (publicar).

## 2026-09-10 (cont.) — Publicado (Bloco 6, parcial)

- Repositório git inicializado em `app-web/`, com `.gitignore`, `README.md`, `vercel.json`.
- Criado `github.com/Joaopedrolc25/focustag` (público) e feito o push (`gh repo create`).
- GitHub Pages ligado: **https://joaopedrolc25.github.io/focustag/** — no ar, testado com
  Playwright (renderiza, sem erro de console, service worker registrado, sw.js/manifest/assets 200).
- Como o app usa caminhos relativos, funciona igual num subcaminho (`/focustag/`) ou na raiz.
- Vercel: o repo está pronto. Falta o João importar em vercel.com/new (framework "Other",
  sem build). Isso é no painel, com a conta dele.
- `vercel.json` já marca site estático e desliga o cache do `sw.js`.

Pendente do Bloco 6: importar na Vercel, testar a tag NFC real no Android, segundo celular,
roteiro do pitch, capturas pros slides.

## 2026-09-10 (cont.) — Deploy na Vercel

- A CLI da Vercel nesta máquina estava logada na conta do **Gustavo** (`pacheco-e-almeida-braga`,
  o site-institucional dele). Não era a do João. `vercel logout` + `vercel login jopedroleme@gmail.com`
  (fluxo de device code: o João aprovou em vercel.com/oauth/device).
- `vercel --prod` na conta do João (`utilitudocomerciodashboard`, a mesma do utilitudo).
- Projeto criado como `app-web` (nome da pasta) e renomeado pra `focustag` (`vercel project rename`).
  O domínio automático ficou `app-web-nine-wine.vercel.app` (foi gerado enquanto o projeto ainda
  se chamava app-web). Pra trocar pra um `focustag-*.vercel.app` é no painel (Settings > Domains).
- Aliases manuais (`focustag-coquinhablack.vercel.app`) caem numa tela de login da Vercel
  (Standard Protection nas URLs que não são o domínio automático do projeto). O domínio
  automático `app-web-nine-wine.vercel.app` funciona aberto (200).
- **URLs de produção no ar:**
  - Vercel: https://app-web-nine-wine.vercel.app
  - GitHub Pages: https://joaopedrolc25.github.io/focustag/
- `.vercel/` adicionado ao `.gitignore`.
- **Atenção:** a CLI da Vercel agora está logada como João. Pra mexer no site do Gustavo de
  novo, precisa deslogar e logar na conta dele.

## 2026-09-10 (cont.) — Domínio Vercel

- `focusapp.vercel.app` já estava em uso por outra pessoa (403). `focustag.vercel.app` idem.
- Adicionado **`focustag-app.vercel.app`** ao projeto (`vercel domains add`) + redeploy.
  Funciona aberto (200), diferente dos aliases via `vercel alias set` que caíam no login.
- URL de produção da Vercel agora: **https://focustag-app.vercel.app**
  (o `app-web-nine-wine.vercel.app` continua respondendo também).

## 2026-09-10 (cont.) — Roteiro do pitch + objeções

Deck de pitch (11 slides) revisado e considerado coerente com o app e o plano.
Gerado `pitch/Roteiro e Objecoes - FocusTag.pdf` (9 páginas):
- Roteiro de 5 min, fala por fala, com 3 vozes (problema / solução+demo / negócio), amarrado
  slide a slide do deck.
- Coreografia da demonstração ao vivo (10 passos, modo demonstração, tela laranja, tag desliga).
- Checklist pré-apresentação (Android+Chrome, tag já registrada, cache offline, plano B).
- 15 objeções da banca + resposta pronta (a nº1 é o preço R$59,90 da tag; a nº11 é ser honesto
  que o bloqueio é ilustrado no protótipo web).
- 3 regras pra Q&A.
Consertos recomendados no deck antes de imprimir: apagar as 2 "(Fonte:...)" do slide 4;
"todas as manhãs" -> "por manhã" no slide 2.
