# Estágio de Construção (Build)
FROM node:22.12.0-alpine as build-stage

WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o Vite usa por padrão
EXPOSE 5173

# Comando para rodar em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]
