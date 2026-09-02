# Agentes de IA — CELEBRE Pizzaria

Este diretório contém os playbooks dos agentes responsáveis pelas funções de desenvolvimento do projeto `@workspace/celebre-pizzaria`. Cada arquivo descreve como um agente deve pensar, quais documentos precisa ler, o que pode alterar, o que deve entregar e como provar que terminou.

## Contexto obrigatório

Antes de agir, qualquer agente deve ler:

- [`docs/README.md`](../docs/README.md), para visão geral e fonte da verdade;
- [`docs/02-arquitetura.md`](../docs/02-arquitetura.md), para limites do monorepo;
- [`docs/10-manutencao-e-gotchas.md`](../docs/10-manutencao-e-gotchas.md), para riscos conhecidos;
- o documento específico indicado na tabela abaixo;
- [`docs/superpowers/`](../docs/superpowers/), seguindo o plano e os gates de verificação aplicáveis à tarefa.

Os agentes técnicos devem consultar a documentação oficial atualizada no Context7 quando forem tomar decisões sobre APIs ou comportamento de React, Vite, Tailwind, Express, Orval ou Drizzle. Preferir a documentação oficial da biblioteca e registrar no handoff quando uma decisão depender dessa consulta.

## Catálogo e momento de uso

| Agente | Função | Use quando | Entrega principal |
| --- | --- | --- | --- |
| [`00-tech-lead.md`](00-tech-lead.md) | Tech Lead | houver mais de um papel envolvido, mudança estrutural ou conflito de escopo | plano de trabalho, ordem dos agentes e decisões |
| [`01-product-manager.md`](01-product-manager.md) | Product Manager | a solicitação estiver vaga ou envolver regra/comportamento de produto | requisito, escopo e critérios de aceite |
| [`02-ux-ui-designer.md`](02-ux-ui-designer.md) | UX/UI Designer | houver nova seção, fluxo, CTA ou mudança visual | especificação de experiência e estados responsivos |
| [`03-frontend-engineer.md`](03-frontend-engineer.md) | Frontend Engineer | for necessário alterar React, TypeScript, CSS ou assets ligados à UI | implementação frontend validada |
| [`04-content-seo.md`](04-content-seo.md) | Content & SEO | houver alteração de copy, preço, contato, metadata ou asset | conteúdo aprovado e checklist editorial/SEO |
| [`05-api-backend-engineer.md`](05-api-backend-engineer.md) | API/Backend Engineer | surgir uma integração de servidor ou novo endpoint | contrato OpenAPI, API e integração |
| [`06-data-engineer.md`](06-data-engineer.md) | Data Engineer | houver necessidade real de persistência ou consulta ao PostgreSQL | schema, validação e mudança de banco |
| [`07-qa-test-engineer.md`](07-qa-test-engineer.md) | QA/Test Engineer | toda mudança que altera comportamento ou antes de release | matriz de testes e evidências |
| [`08-accessibility-engineer.md`](08-accessibility-engineer.md) | Accessibility Engineer | houver mudança de markup, foco, cor, movimento ou interação | auditoria e correções de acessibilidade |
| [`09-performance-engineer.md`](09-performance-engineer.md) | Performance Engineer | houver alteração de imagens, fontes, bundle, build ou carregamento | medição, diagnóstico e recomendações |
| [`10-security-engineer.md`](10-security-engineer.md) | Security Engineer | houver dependência, segredo, integração externa ou dado de usuário | avaliação de risco e controles |
| [`11-devops-replit.md`](11-devops-replit.md) | DevOps/Replit Engineer | houver mudança de execução, porta, build ou publicação | pipeline/deploy validado |
| [`12-code-reviewer.md`](12-code-reviewer.md) | Code Reviewer | antes de integrar qualquer mudança de código | achados priorizados e decisão de revisão |
| [`13-technical-writer.md`](13-technical-writer.md) | Technical Writer | comportamento, configuração ou decisão documentada mudar | documentação sincronizada |

## Fluxos recomendados

### Nova funcionalidade de frontend

`Product Manager → UX/UI Designer → Frontend Engineer → QA → Accessibility/Performance → Code Reviewer → Technical Writer → DevOps`

Acione `Content & SEO` em paralelo ao design quando a funcionalidade trouxer copy ou metadata. Só paralelize agentes que não editarão os mesmos arquivos.

### Correção de bug

`QA/Test Engineer → agente técnico responsável → Code Reviewer → QA/Test Engineer`

Use `Tech Lead` se a causa atravessar frontend, API, dados ou deploy. O agente de diagnóstico deve reproduzir o sintoma antes de propor a correção.

### Nova integração ou persistência

`Product Manager → Tech Lead → API/Backend Engineer → Data Engineer (se houver dados) → Frontend Engineer → Security → QA → DevOps → Technical Writer`

Não ligue a landing a `api-server` ou `db` somente porque esses pacotes existem. A documentação atual classifica ambos como scaffolds não consumidos pela página.

### Alteração de conteúdo

`Content & SEO → QA → Technical Writer`

Se a alteração mudar layout ou componentes, inclua `UX/UI Designer` e `Frontend Engineer`.

## Contrato comum de todo agente

1. Declare no início o objetivo, os arquivos no escopo e o que está fora dele.
2. Leia a documentação obrigatória e a fonte da verdade antes de editar.
3. Use os padrões existentes do projeto: pnpm, TypeScript estrito, tokens Tailwind, composição em `Home.tsx` e imports de assets coerentes.
4. Não invente dados comerciais. Marque preço, telefone, endereço, horário, capacidade, depoimento e link social não confirmados.
5. Não edite código gerado manualmente (`lib/*/src/generated`, `src/.generated` ou `dist`).
6. Execute verificações proporcionais ao risco e registre comando, resultado e limitações.
7. Faça handoff com arquivos alterados, decisões, riscos, validações e próximo agente recomendado.
8. Não declare “concluído” sem evidência recente; falhas devem ser reportadas com o status real.

## Escopo do produto

O produto principal é uma landing page web estática e responsiva. A reserva abre o WhatsApp com mensagem pré-preenchida; não existe formulário persistido, carrinho, CMS ou consumo da API no frontend. Qualquer agente que proponha sair desse modelo deve tratar a mudança como uma nova decisão arquitetural.

## Referência de planejamento

O plano desta equipe está em [`docs/superpowers/plans/2026-09-02-agentes-ia-time-software.md`](../docs/superpowers/plans/2026-09-02-agentes-ia-time-software.md). Para mudanças maiores, crie ou atualize um plano específico antes de editar arquivos.

### Plano ativo da landing

Para a mudança de animações, rota administrativa, conteúdo e contatos, o agente principal é o `00-tech-lead.md`, com execução coordenada pelos agentes de UX/UI, Frontend, API/Backend, Data, Segurança, QA, Acessibilidade, Performance, DevOps e Technical Writer. O plano executável está em [`plans/plan-001-admin-animacoes-e-contatos.md`](../plans/plan-001-admin-animacoes-e-contatos.md).
