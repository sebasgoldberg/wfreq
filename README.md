# Carregamento de Aprovadores

## Requisitos

Instalar node: https://nodejs.org/

## Instalação

```
git clone https://github.com/sebasgoldberg/wfreq.git
cd wfreq
npm i
cp env.template.js env.js
```

## Configuração

Modificar `env.js` com as informações necessarias para cada ambiente

## Formato do Arquivo de Entrada

O arquivo de entrada é um arquivo CSV com as seguintes colunas na primeira linha (é requerido o mesmo texto conforme segue):

```
TipoAgrupacao;ValorAgrupao;NivelAprovacao;Aprovador
```

Exemplo de registros:

```
01;YYYYYY;01;CB0000000000
01;ZZZZZZ;02;CB0000000000
02;AAA;01;CB0000000000
```

## Utilização

Exemplo para carregar/atualizar aprovadores no ambiente tst:

```
node index.js tst aprovadores.csv
```

Exemplo para carregar/atualizar aprovadores no ambiente prd:

```
node index.js prd aprovadores.csv
```
