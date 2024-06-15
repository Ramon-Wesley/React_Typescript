# Use a imagem base Node.js oficial
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Atualize os pacotes do sistema
RUN apt-get update && apt-get install -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copie os arquivos de definição de dependências para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que o aplicativo será executado
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
