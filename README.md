# Todo List React + TypeScript

Uma aplicação moderna de gerenciamento de tarefas (To-Do List) desenvolvida com React, TypeScript, Vite e Firebase. O projeto oferece uma interface elegante, com funcionalidades de autenticação de usuários, acompanhamento de histórico de atividades, arquivamento de tarefas e controle de acesso com perfil de administrador.

## 🎯 Propósito do Projeto
Este projeto tem como objetivo principal fornecer uma ferramenta eficiente e responsiva para que os usuários possam organizar suas tarefas diárias. Além de oferecer as operações básicas de CRUD (Criar, Ler, Atualizar, Deletar) para tarefas, a aplicação vai além ao implementar um sistema de autenticação seguro e um registro detalhado das atividades do usuário, permitindo rastrear o que foi feito.

## 🚀 Tecnologias Usadas

* **Frontend:** React 19, TypeScript, Vite (bundler ultrarrápido).
* **Roteamento:** React Router DOM (utilizando `HashRouter`).
* **Estilização e UI:** 
  * Tailwind CSS v4 para estilização utilitária.
  * Componentes baseados em Radix UI / shadcn/ui.
  * Lucide React para ícones.
  * Sonner para notificações (toasts).
* **Backend as a Service (BaaS):** Firebase.
  * **Firebase Authentication:** Gerenciamento de login e sessões de usuários.
  * **Cloud Firestore:** Banco de dados NoSQL em tempo real.
* **Qualidade de Código:** ESLint com regras estritas para TypeScript e React.
* **Deploy:** GitHub Pages (`gh-pages`).

## ⚙️ Regras e Lógica de Negócio

A aplicação é dividida em diferentes áreas com base no status de autenticação e no papel do usuário (role). 

### Rotas e Páginas
* **`/` (TodoPage):** Rota principal. Permite adicionar, editar, excluir e alternar o status (completa/incompleta) das tarefas. Possui filtros para visualizar todas as tarefas, apenas as ativas ou apenas as concluídas.
* **`/profile` (ProfilePage):** Página para o usuário gerenciar os dados do seu perfil.
* **`/activities` (ActivityPage):** Exibe o histórico de atividades (logs) de todas as interações do usuário na aplicação (criação, edição ou deleção de tarefas).
* **`/archive` (ArchivePage):** Local onde as tarefas concluídas (arquivadas) podem ser visualizadas separadamente.
* **`/admin` (AdminPage):** Painel administrativo. Acesso restrito apenas a usuários que possuem a role `admin` no banco de dados.
* **`/login` (LoginPage):** Página de autenticação para usuários não logados.

### Lógica de Banco de Dados (Firestore Rules)
A segurança e a lógica dos dados são garantidas pelas regras de segurança do Firestore (`firestore.rules`):

1. **Usuários (`/users/{userId}`):**
   * Um usuário só pode ler, criar, atualizar ou deletar seu próprio documento.
   * Administradores (`role == 'admin'`) têm acesso total a todos os documentos de usuários.
   * Ao criar uma conta, o papel do usuário é automaticamente definido como `'user'` (não é possível se auto-promover a administrador através do cliente).

2. **Tarefas (`/users/{userId}/tasks/{taskId}`):**
   * Cada usuário possui sua própria subcoleção de tarefas.
   * **Validação rigorosa na criação e edição:** 
     * O título da tarefa (`name`) deve ter entre 1 e 500 caracteres.
     * O status `completed` é estritamente booleano e deve iniciar como `false` ao criar.
     * É obrigatório registrar a data de criação (`createdAt`).
   * Apenas o próprio dono pode ler, atualizar ou deletar suas tarefas.

3. **Atividades (`/users/{userId}/activities/{activityId}`):**
   * Registra eventos na aplicação (ações, categorias e descrições).
   * **Append-only:** O usuário pode criar novos registros (ações realizadas) e deletar (limpar seu histórico), mas **não pode editar/alterar** um log de atividade existente.
   * Administradores podem visualizar o histórico de atividades dos usuários.

## 🛠️ Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   bun install
   ```
3. Configure as variáveis de ambiente do Firebase baseando-se no arquivo `.env.example`.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   bun run dev
   ```
5. Acesse no seu navegador através do endereço local fornecido pelo Vite (geralmente `http://localhost:5173`).
