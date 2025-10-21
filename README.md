# 🍣 Sushi House - Frontend

Sistema de e-commerce completo para restaurante japonês com funcionalidades de cardápio digital, carrinho de compras, sistema de pedidos e painel administrativo.

## 📋 Sobre o Projeto

O **Sushi House** é uma aplicação web moderna desenvolvida com React que permite aos clientes navegar pelo cardápio, fazer pedidos online e acompanhar seus pedidos. O sistema também oferece um painel administrativo completo para gerenciamento de produtos, categorias, pedidos e usuários.

### ✨ Funcionalidades Principais

#### Para Clientes:
- 🏠 **Página Inicial**: Apresentação do restaurante e destaques
- 📖 **Cardápio Digital**: Navegação por categorias de produtos
- 🛒 **Carrinho de Compras**: Adicionar, remover e atualizar quantidades
- 👤 **Sistema de Autenticação**: Registro e login de usuários
- 📍 **Perfil do Usuário**: Gerenciamento de dados pessoais e endereços
- 📦 **Histórico de Pedidos**: Visualização de pedidos anteriores
- 🔍 **Busca de CEP**: Preenchimento automático de endereço via API ViaCEP

#### Para Administradores:
- 🛠️ **Painel Administrativo**: Dashboard com métricas e estatísticas
- 📊 **Gerenciamento de Produtos**: CRUD completo de produtos
- 🏷️ **Gerenciamento de Categorias**: Organização do cardápio
- 📋 **Gerenciamento de Pedidos**: Visualização e atualização de status
- 👥 **Gerenciamento de Usuários**: Controle de acessos e permissões

## 🚀 Tecnologias Utilizadas

- **React 19.1.1** - Biblioteca para construção de interfaces
- **React Router DOM 7.9.3** - Roteamento e navegação
- **Axios 1.12.2** - Cliente HTTP para requisições à API
- **Tailwind CSS** - Framework CSS utilitário
- **Heroicons** - Biblioteca de ícones
- **Context API** - Gerenciamento de estado global (Auth e Cart)
- **React Hooks** - useState, useEffect, useContext, useCallback, etc.

## 📁 Estrutura do Projeto

```
sushi-app/
├── public/                 # Arquivos públicos estáticos
├── src/
│   ├── assets/            # Imagens e recursos estáticos
│   ├── components/        # Componentes reutilizáveis
│   │   ├── AdminRoute/    # Proteção de rotas administrativas
│   │   ├── NavMenu/       # Menu de navegação
│   │   ├── ProductCard/   # Card de produto
│   │   └── ProtectedRoute/# Proteção de rotas autenticadas
│   ├── contexts/          # Contextos globais
│   │   ├── AuthContext.js # Gerenciamento de autenticação
│   │   └── CartContext.js # Gerenciamento do carrinho
│   ├── pages/             # Páginas da aplicação
│   │   ├── admin/         # Páginas administrativas
│   │   ├── cart/          # Página do carrinho
│   │   ├── home/          # Página inicial
│   │   ├── login/         # Página de login
│   │   ├── menu/          # Cardápio
│   │   ├── orders/        # Pedidos do usuário
│   │   ├── profile/       # Perfil do usuário
│   │   └── register/      # Cadastro de usuário
│   ├── services/          # Serviços de API
│   │   ├── api.js         # Configuração do Axios
│   │   ├── auth.service.js
│   │   ├── cart.service.js
│   │   ├── category.service.js
│   │   ├── order.service.js
│   │   ├── product.service.js
│   │   └── user.service.js
│   ├── App.js             # Componente principal e rotas
│   └── index.js           # Ponto de entrada
├── package.json
└── README.md
```

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **Backend da aplicação** rodando (veja instruções no diretório `BackMarketPlace`)

## 📦 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd workspacepos/FrontMarketPlace/sushi-app
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Certifique-se de que o backend esteja configurado e rodando. A URL da API está configurada em `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm start
# ou
yarn start
```

A aplicação será aberta automaticamente em `http://localhost:4200`

## 🎯 Scripts Disponíveis

### `npm start`

Inicia o servidor de desenvolvimento na porta 4200.\
A página recarrega automaticamente quando você faz alterações.\
Erros de lint aparecem no console.

### `npm test`

Executa os testes em modo interativo.

### `npm run build`

Compila a aplicação para produção na pasta `build`.\
Otimiza o React para melhor performance.\
Os arquivos são minificados e incluem hashes nos nomes.

## 🔐 Sistema de Autenticação

A aplicação utiliza JWT (JSON Web Tokens) para autenticação:

1. **Registro**: Usuários podem se cadastrar fornecendo nome, email, senha e endereço
2. **Login**: Autenticação via email e senha
3. **Token**: Armazenado no localStorage e enviado em todas as requisições
4. **Roles**: Sistema de permissões (admin, manager, user)
5. **Rotas Protegidas**: Componentes `ProtectedRoute` e `AdminRoute`

## 🛒 Funcionalidades do Carrinho

O carrinho de compras utiliza Context API e oferece:

- ✅ Adicionar produtos ao carrinho
- ✅ Atualizar quantidades
- ✅ Remover produtos
- ✅ Calcular total automaticamente
- ✅ Sincronização com backend (para usuários autenticados)
- ✅ Persistência local (localStorage para visitantes)

## 📱 Páginas Principais

### Páginas Públicas
- `/` - Home
- `/cardapio` - Cardápio completo
- `/login` - Login
- `/register` - Cadastro

### Páginas Autenticadas
- `/perfil` - Perfil do usuário
- `/carrinho` - Carrinho de compras
- `/meus-pedidos` - Histórico de pedidos

### Páginas Administrativas
- `/admin` - Dashboard
- `/admin/produtos` - Gerenciar produtos
- `/admin/painel` - Painel de controle completo

## 🎨 Design e UX

- **Responsive Design**: Totalmente responsivo para mobile, tablet e desktop
- **Tailwind CSS**: Estilização moderna e consistente
- **Heroicons**: Ícones SVG otimizados
- **Loading States**: Indicadores de carregamento em operações assíncronas
- **Error Handling**: Mensagens de erro amigáveis ao usuário
- **Validações**: Validação de formulários em tempo real

## 🔄 Integração com Backend

A aplicação se comunica com o backend através de serviços organizados:

- **auth.service.js**: Login, registro, perfil
- **product.service.js**: Listagem e busca de produtos
- **category.service.js**: Categorias do cardápio
- **cart.service.js**: Operações do carrinho
- **order.service.js**: Criação e listagem de pedidos
- **user.service.js**: Gerenciamento de usuários

## 🚀 Deploy

Para fazer deploy da aplicação:

1. **Build de produção**:
```bash
npm run build
```

2. **Deploy no Vercel** (recomendado):
   - Consulte o arquivo `VERCEL_DEPLOY_GUIDE.md` na raiz do projeto

3. **Outras opções**:
   - Netlify
   - GitHub Pages
   - Servidor próprio (servir a pasta `build`)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Observações Importantes

- A porta padrão é **4200** (configurada em `package.json`)
- O backend deve estar rodando em **http://localhost:3000**
- Tokens JWT expiram após 24 horas (configurável no backend)
- Imagens de produtos são servidas pelo backend

## 🐛 Troubleshooting

### Porta 4200 já em uso
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4200
kill -9 <PID>
```

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requisições do frontend.

### Token inválido
Faça logout e login novamente para renovar o token.

## 📞 Suporte

Para questões e suporte, entre em contato através do repositório do projeto.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ para amantes de sushi**
