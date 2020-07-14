# Desafio Front-End

Sistema de Controle de Gastos

### Objetivo
Montar uma tela de Controle de Gastos

### Análise
Tratamento de Formulário, CRUD da aplicação web e uso do 
Framework: [Knockout.js](https://knockoutjs.com/) (obrigatório)

+ A aplicação deve ter um teto de gasto de R$1.500,00
+ Ao atingir o teto, proibir adição de gastos
+ **Adicionar** ​ um gasto à tabela
  + Preço - Apenas número
  + Categoria - Um select com categorias Pré-existentes
  + Nome - Campo aberto
  + Data - Validação para até o presente dia (não ter gasto futuro)
+ **Listar** ​ gastos e seu valor total das compras
  + Listas compras mostrando seus atributos (Preço, categoria, nome e data)
  + Valor total de todos os gastos
  + Valor total por categoria
+ **Atualizar** ​ gasto, podendo mudar nome, gasto, categoria e data
+ **Deletar**​ gasto
  + Deixar de exibir
  + Remover o valor da soma
+ **Enviar** ​ compras para o email (não precisa realmente enviar)
  + Digitar email para o qual será enviado
  + Campo de e-mail, deve conter:
    + auto-complemento com sugestão de domínio após @.
    + validador de email
  + Confirmar o email (outro campo. sem auto-complemento)
  + Retornar mensagem de enviado (não precisa realmente enviar)

**OBS**.: ​ Não é necessário armazenar em BD

![](https://github.com/sergiomachadosilva/desafio-front-end/css/print.png)