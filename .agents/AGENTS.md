# Regras do Projeto

- Para criar efeitos de fade-out suaves em painéis com imagens, utilize a propriedade CSS `mask-image` (ex: `linear-gradient(to right, black, transparent)`) em vez de aplicar overlays de cores sólidas. Isso garante que qualquer elemento complexo ou animado no background continue visível através da transparência, evitando linhas de corte rígidas.
