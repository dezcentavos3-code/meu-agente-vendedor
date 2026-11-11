const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Agente Vendedor está online!', status: 'ok' });
});

// Rota de status/saúde
app.get('/health', (req, res) => {
  res.json({ status: 'online', porta: PORT, timestamp: new Date().toISOString() });
});

// Rota de exemplo: lista de produtos
app.get('/produtos', (req, res) => {
  res.json([
    { id: 1, nome: 'Produto A', preco: 99.90 },
    { id: 2, nome: 'Produto B', preco: 149.50 },
    { id: 3, nome: 'Produto C', preco: 299.00 }
  ]);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;