# FocusTag — Checklist da aplicação web (MVP de demonstração)

Documento de trabalho. Cada item vira `[x]` quando pronto e testado, e o trecho é colado no chat.

**O que este MVP prova:** identidade visual da marca + alarme funcionando (toca, volume
crescente, sem soneca) + tag NFC (só desliga encostando na tag certa) + **janela de foco
simulada** (mostra os apps bloqueados e liberados e o tempo até desbloquear).

**Fora do escopo:** bloqueio de aplicativos REAL, conta, nuvem, fiador, dinheiro, app Android nativo.

Legenda: 🎨 identidade · 🔴 crítico · ⚪ normal

---

## Marca (definida pelo João em 2026-09-10)

- **Nome:** FocusTag (logo lockup: `FOCUS` claro + `TAG` laranja)
- **Símbolo:** grade 3x3; centro laranja (o foco / o agora); baixo-direita só contorno (o próximo)
- **Cores travadas nos tokens:** laranja `#FF5A1F`, off-white `#F1EFEA` / `#E7E3DA`, card `#FBFAF7`, tinta `#1B1A17`
- [x] Versões SVG do símbolo e do ícone criadas em `assets/` (`mark.svg`, `icon.svg`)
- [ ] João dropar o arquivo original do logo (PNG/SVG) em `assets/` para usar nos slides

## Bloco 0 — Fundação visual  🎨

- [x] `app-web/index.html` criado do zero com a identidade FocusTag (protótipo antigo serviu de referência de lógica)
- [x] Tema claro da marca (off-white + laranja), sem nada de bloqueio de apps
- [x] Tipografia: Barlow Semi Condensed 900 para títulos/números, Barlow para leitura
- [x] Tokens de cor, espaçamento, raio, sombra
- [x] Componentes base: botão primário, botão fantasma, botão discreto, campo, seletor de horário, card, chip, toggle
- [x] Motivo da grade 3x3 reutilizável (carregando, pulsando, marca d'água)
- [x] Cabeçalho com o logo
- [x] Transições de entrada entre telas
- [x] Favicon e ícone de instalação a partir da grade (`assets/icon.svg`)
- [x] `manifest.webmanifest` (abre em tela cheia quando instalado)
- [x] Testado em largura de celular (402px) via captura

## Bloco 1 — Tela de abertura

- [x] Tela inicial: grade animada, logo, frase-manifesto, botão "Começar"
- [x] Primeira vez: 3 passos curtos explicando o mecanismo (some depois da primeira visita)
- [x] "Já viu a introdução" guardado no navegador

## Bloco 2 — Tela de configuração

- [x] **Seletor de horário de rolagem** (dois cilindros HH e MM com faixa central, snap; toca no número para centralizar)
- [x] **Repetição**: presets [Uma vez] [Todo dia] [Seg a sex] [Fim de semana] [Escolher dias]
- [x] **Escolher dias**: 7 botões D S T Q Q S S, alterna cada um; parte do preset selecionado
- [x] Frase de apoio muda conforme a escolha
- [x] Lógica do próximo disparo respeita os dias escolhidos (ou "uma vez" = próximo horário)
- [x] Campo "onde a tag está" (vira rótulo nas outras telas)
- [x] Botão "registrar tag" + chip de estado da tag
- [x] Interruptor "modo demonstração" (dispara em 20 s)
- [x] Botão "armar alarme" (bloqueado sem tag; avisa se escolheu "dias" sem marcar nenhum)
- [x] Link "ver histórico"
- [x] Configuração (horário + dias) salva e recarregada no navegador
- [x] Tela "armado" mostra o resumo dos dias e "toca amanhã / terça · em Xh"

## Bloco 3 — Tag NFC

- [x] Detecta Web NFC e contexto seguro
- [x] Mensagem por caso: iPhone / não é Chrome / sem HTTPS / NFC pronto
- [x] Fluxo de registro: lê o número de série, grava marca de texto se a tag permitir, salva com o ponto
- [x] Chip "tag registrada" na configuração
- [x] Fallback "registrar tag simulada" quando não há NFC
- [x] Na tela do alarme: lê e compara (número de série ou marca de texto)
- [x] Tag certa desliga; tag errada treme, mensagem, alarme continua
- [x] Botões "simular tag certa / errada" no modo sem NFC
- [ ] **Testar com tag NFC real no Android do João** (só dá depois de publicar em HTTPS — Bloco 6)

## Bloco 4 — Alarme (o momento principal)  🔴

- [x] Tela "armado": relógio grande, contagem regressiva, botão cancelar
- [x] Wake Lock (segura a tela ligada); re-adquire ao voltar o foco
- [x] Aviso honesto "mantenha esta tela aberta"
- [x] Disparo: tela cheia **100% laranja**, hora grande, grade pulsando
- [x] Som com volume crescente via Web Audio (sobe ao longo de ~42 s), bipe alternando 880/1245 Hz
- [x] Vibração em laço (quando o aparelho suporta)
- [x] Sem botão de soneca
- [x] Desliga só lendo a tag certa (ou botão simulado)
- [x] Saída de emergência com espera de 15 s e registro
- [x] Fecho "Bom dia" com a hora e o tempo que levou (juntou a micro-tela de "você levantou")

## Bloco 4.5 — Janela de foco simulada (a pedido do João, 2026-09-10)

- [x] Config: duração da janela (15 / 30 / 45 / 60 min) + escolha de quais apps bloquear
- [x] Fluxo: depois que a tag desliga o alarme, vai para a tela de foco (não direto pro fecho)
- [x] Tela: timer regressivo "REDES LIBERAM EM mm:ss" + barra de progresso
- [x] Lista "Bloqueado agora": apps escolhidos, tiles apagados com cadeado e nome riscado
- [x] Lista "Continua liberado": Telefone, Mensagens, Mapas, Música, Relógio
- [x] Aviso claro de que na versão web é só a visualização
- [x] Botão "Liberar as redes agora" com espera de 15 s (registra como cortada)
- [x] No fim do tempo: toast "Redes liberadas" e vai pro fecho
- [x] Emergência no alarme (não levantou) pula a janela de foco
- [x] No modo demonstração a janela dura 25 s

## Bloco 5 — Fecho e histórico

- [x] Tela de resumo da manhã: alarme, tocou, fora da cama, levou, como desligou, **janela de foco**
- [x] Histórico: lista das manhãs, guardado no navegador
- [x] Voltar ao início + apagar histórico

## Bloco 5.5 — Extras (a pedido do João, 2026-09-10)

Vale muito:
- [x] **Sequência de dias + comemoração**: streak calculada do histórico, chip na abertura,
      grade que "estoura" laranja no fecho + "X manhãs seguidas"
- [x] **Tela "Meus números"**: cumpridas/total, melhor sequência, atraso médio, gráfico de
      barras das últimas 7 manhãs
- [x] **Card "Próxima manhã"** no topo da config: dia + horário + foco até HH:MM + tag onde,
      atualiza sozinho ao mudar qualquer ajuste
- [x] **Compartilhar minha manhã**: gera uma imagem 1080x1350 da marca (horário, streak,
      "primeira hora protegida"), usa `navigator.share` no celular ou abre num overlay
- [x] **Seção "Em breve"** na tela Sobre: fiador, trato com valor, app nativo, modo casal
- [x] **Funciona sem internet**: service worker (`sw.js`) cacheia a casca do app

Vale, se sobrar tempo (feitos):
- [x] **Modo de rigidez** (Leve / Firme / À prova de mim): muda a espera da emergência
      (5 / 15 / 30 s) e exige confirmação pra cancelar o alarme no modo mais duro
- [x] **Som do alarme**: Clássico / Suave / Sirene, com botão "ouvir 3 segundos"
- [x] **Testar a tag agora**: botão na config que faz um scan rápido e diz se é a tag certa
- [x] **Contador de tag errada**: conta as tentativas e mostra no fecho e no histórico
- [x] **Tela "Sobre"** com a equipe Coquinha Black, a marca e a versão
- [x] **Lembrete via notificação**: pede permissão ao armar; avisa se o app for pro segundo
      plano com o alarme armado, e notifica quando o alarme dispara escondido

## Bloco 6 — Publicar e ensaiar

- [x] Repositório no GitHub: `github.com/Joaopedrolc25/focustag` (público)
- [x] Publicado em HTTPS: **https://joaopedrolc25.github.io/focustag/** (GitHub Pages) e **https://app-web-nine-wine.vercel.app** (Vercel) — as duas no ar e testadas
- [x] Modo simulado testado a partir da URL ao vivo (sem erros, service worker registrado)
- [x] Publicado na Vercel (conta do João, projeto `focustag`): **https://app-web-nine-wine.vercel.app**
- [ ] Testar o fluxo real: tag colada na parede, Chrome do Android do João
- [ ] Testar num segundo celular
- [ ] Roteiro da demonstração: o que mostrar, em que ordem, o que falar
- [ ] 2 ou 3 capturas de tela boas para os slides

---

## Decisões tomadas (João pode mandar mudar)

1. **Tela do alarme tocando:** ficou **100% laranja** (energia, alerta, fotografa bem no slide).
2. **Tipografia:** **Barlow Semi Condensed Black** nos títulos e números (parecido com o wordmark) + Barlow no corpo.
3. ~~**Dias da semana:** fora do MVP.~~ **Revertido em 2026-09-10 a pedido do João:** entra seletor de horário de rolagem + repetição com presets e escolha de dias.
4. **Nome nas telas:** **"FocusTag"** junto; o wordmark mostra FOCUS + TAG em duas cores.

---

## Registro

- 2026-09-10: checklist criado e validado pelo João.
- 2026-09-10: Blocos 0 a 5 construídos num arquivo único `app-web/index.html` + `assets/` + manifest.
  Fluxo completo funcionando: abertura → configuração → armado → alarme (laranja, som crescente,
  vibração, sem soneca) → tag desliga → "Bom dia" → histórico. Testado com Playwright em 402px.
  Falta: teste com tag real (depende de publicar) e o Bloco 6 inteiro.
