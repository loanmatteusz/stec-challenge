# EpiManager

EpiManager é um sistema para gerenciar **EPIs (Equipamentos de Proteção Individual)**, com backend em **C# (.NET 8)**, frontend em **Vue.js 3** e banco de dados **PostgreSQL**.  
O projeto já inclui **Docker Compose** para rodar tudo de forma simples.

---

## Índice

- [EpiManager](#epimanager)
  - [Índice](#índice)
  - [Tecnologias](#tecnologias)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
    - [Rodando com Docker (Recomendado)](#rodando-com-docker-recomendado)
    - [Uso](#uso)

---

## Tecnologias

- **Backend:** C# .NET 8, Entity Framework Core  
- **Frontend:** Vue.js 3, Vite, TailwindCSS  
- **Banco de dados:** PostgreSQL 15  
- **Containerização:** Docker, Docker Compose  

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)  
- (Opcional) [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) para rodar localmente sem Docker  
- (Opcional) [Node.js](https://nodejs.org/) + npm/yarn para rodar o frontend localmente  

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/EpiManager.git
cd EpiManager
```

Se for rodar **sem Docker**, configure a string de conexão no backend (appsettings.json) e instale dependências:
```bash
cd EpiManager
dotnet restore
dotnet ef database update
```
No frontend:
```bash
cd epi-manager-app
npm install
# ou
yarn install
```
Configure a variável de ambiente `.env`:
```bash
VITE_API_URL=http://localhost:5000
```
---

### Rodando com Docker (Recomendado)

Na raiz do projeto (onde está o docker-compose.yml):
```bash
docker compose up --build
# ou
docker-compose up --build
```
- Backend: http://localhost:5000
- Frontend: http://localhost:8080
- PostgreSQL: localhost:5432 (usuário: docker, senha: 123, banco: EpiDb)

Rodar em background:
```bash
docker-compose up -d
```
---

### Uso

Acesse o frontend: http://localhost:8080
Acesse com a conta mockada:
```bash
  email: test@mail.com
  password: 123
```
Cadastre categorias de EPIs.
Cadastre EPIs associados a cada categoria.
Liste, edite e exclua EPIs e categorias.
