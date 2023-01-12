# Sample Video Streaming App

Aplicação feita seguindo e adptando [este tutorial](https://www.codeproject.com/Articles/5350209/Build-Your-Own-Video-Streaming-Server-with-Node-js), para uso com Typescript.

## Stack

- Koa
- Typescript

## Como funciona

Streaming de vídeo atualmente é gerenciada, uma parte pelo Browser, outra parte pelo Server.

O Browser faz várias requisições em sequência, acompanhando em qual parte do vídeo o player está reproduzindo, e solicitando a próxima parte. O tamanho do chunk é definido pelo server, que envia o próximo chunk.

A parte do chunk em bytes que o server precisa enviar é definida pelo cabeçalho `Range`. Então, internamente, no server, é feito o seguinte cálculo para saber até qual byte deve ser enviado para o cliente:

`Range End = Range Start + Chunk`

Feito isso, programaticamente, é feita a leitura somente desses bytes do vídeo e encaminhado ao cliente, com o código 206 (partial content).

## Como rodar

É necessário que você tenha Node 16.17.0 ou superior para rodar essa aplicação:

```sh
$ pnpm install
$ pnpm start
```
