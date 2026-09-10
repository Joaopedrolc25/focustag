# FocusTag

Protótipo web do FocusTag: o alarme que só desliga quando você levanta e encosta numa tag NFC
colada longe da cama. Depois, uma janela de foco protege a primeira hora do dia.

Feito pela equipe Coquinha Black — Empreendedorismo, UNIVASF, 2026.2.

## Rodar localmente

    python3 -m http.server 8000

Abrir http://localhost:8000

## Tag NFC de verdade

A leitura de tag NFC pelo navegador (Web NFC) só funciona no **Chrome do Android** e em
contexto seguro (HTTPS ou localhost). No computador e no iPhone, use a "tag simulada".

## Arquivos

- `index.html` — o app inteiro (HTML + CSS + JS, sem build)
- `assets/` — símbolo e ícone
- `manifest.webmanifest`, `sw.js` — instalável e funciona offline
