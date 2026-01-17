# Photo Gallery 

Aplicação web para gerenciamento de álbuns e fotos.
O sistema permite que usuários autenticados criem álbuns, façam upload de imagens e visualizem suas fotos em diferentes formatos.

---

## Tecnologias Utilizadas

### Backend
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- JWT (Autenticação)
- Multer (upload de imagens)
- Docker

### Frontend
- React
- Vite
- TypeScript
- React Router
- Axios

---

## Funcionalidades

### Autenticação
- Cadastro de usuário
- Login
- Autenticação via JWT
- Rotas protegidas

###  Álbuns
- Criar álbum com nome e descrição
- Listar álbuns do usuário
- Visualizar álbum
- Excluir álbum (somente se não houver fotos)

###  Fotos
- Upload de imagens (jpg / png)
- Armazenamento local
- Associação da foto a um álbum
- Campos salvos:
  - Título
  - Tamanho
  - Data de aquisição
  - Cor predominante
- Exclusão de fotos (somente dono do álbum)

### Visualização
- Visualização em tabela
- Visualização em miniaturas
- Alternância entre modos

---

## Navegação
- Login / Cadastro
- Lista de álbuns
- Criação de novo álbum
- Visualização das fotos do álbum
- Botão para voltar à lista de álbuns

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### Backend

```bash
cd photo-gallery-api
docker-compose up -d
npm install
npx prisma migrate dev
npm run start:dev
```

API disponível em:
http://localhost:3000

### Frontend

```bash
cd photo-gallery-frontend
npm install
npm run dev
```

Frontend disponível em:
http://localhost:5173

---

## Upload de Imagens

As imagens são armazenadas localmente em:

```
/uploads/photos
```

E servidas pela API via:

```
/uploads/photos/{nome-do-arquivo}
```

---

## Segurança
- Autenticação via JWT
- Validação de dono do recurso
- Rotas protegidas

---

## Autor

Desenvolvido por **Rafael Jovito** 
