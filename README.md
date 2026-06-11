EcoCiclo - Plataforma de Gestão de Descarte Sustentável

Integrantes da Equipe:
Arthur Vinícius

Cauã Oliveira

Edmundo Cariolano

Gabriel Soares

João Victor Varela

## Documentação da API (Endpoints)

### Usuários (`/api/usuarios`)

| Método | Rota | Descrição | Corpo da Requisição (JSON) | Resposta Esperada |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/usuarios` | Cria um novo usuário | `{"nome": "Arthur", "email": "a@gmail.com", "senha": "123"}` | `201 Created` (Retorna o objeto criado com ID) |
| **POST** | `/api/usuarios/login` | Autentica um usuário | `{"email": "a@gmail.com", "senha": "123"}` | `200 OK` (Retorna dados do usuário) |

### Agendamentos (`/api/agendamentos`)

| Método | Rota | Descrição | Corpo da Requisição / Params | Resposta Esperada |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/agendamentos` | Lista todas as coletas | Nenhum | `200 OK` (Array de agendamentos) |
| **POST** | `/api/agendamentos` | Cria um novo agendamento | `{"dataHora": "2026-06-10T09:30:00", "enderecoColeta": "Rua A", "user": {"id": 1}}` | `201 Created` |
| **DELETE**| `/api/agendamentos/{id}` | Remove uma coleta pelo ID | Passar o ID na URL (Ex: `/api/agendamentos/1`) | `204 No Content` ou `200 OK` |
