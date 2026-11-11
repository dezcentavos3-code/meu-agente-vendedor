const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Função auxiliar para analisar textos e extrair métricas de SEO e leitura
function analisarTexto(texto) {
  const limpo = texto.trim();
  const palavras = limpo ? limpo.split(/\s+/) : [];
  const totalPalavras = palavras.length;
  const totalCaracteres = limpo.length;
  const totalCaracteresSemEspaco = limpo.replace(/\s+/g, '').length;
  const frases = limpo ? limpo.split(/[.!?]+/).filter(f => f.trim().length > 0) : [];
  
  // Tempo médio de leitura (200 palavras por minuto)
  const segundosLeitura = Math.max(1, Math.ceil((totalPalavras / 200) * 60));

  // Extração das 5 palavras-chave mais relevantes (ignorando palavras muito curtas)
  const frequencia = {};
  palavras.forEach(p => {
    const palavraNormalizada = p.toLowerCase().replace(/[^a-záéíóúâêôãõç0-9]/gi, '');
    if (palavraNormalizada.length > 3) {
      frequencia[palavraNormalizada] = (frequencia[palavraNormalizada] || 0) + 1;
    }
  });

  const palavrasChave = Object.entries(frequencia)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([palavra, contagem]) => ({ palavra, contagem }));

  return {
    status: 'sucesso',
    metricas: {
      palavras: totalPalavras,
      caracteres: totalCaracteres,
      caracteres_sem_espaco: totalCaracteresSemEspaco,
      frases: frases.length,
      tempo_leitura_segundos: segundosLeitura
    },
    palavras_chave_principais: palavrasChave,
    resumo_rapido: frases.length > 0 ? frases[0].trim() + '.' : ''
  };
}

// Rota principal (Status do servidor)
app.get('/', (req, res) => {
  res.json({
    servico: 'AI Text & SEO Analyzer API',
    status: 'online',
    como_usar: 'Envie ?texto=Seu+texto+aqui na rota /produtos ou /analisar'
  });
});

// Rota /produtos (Mantida para compatibilidade com o link já registrado no Gateway)
app.get('/produtos', (req, res) => {
  const textoRecebido = req.query.texto || 
    'Bitcoin Lightning Network enables instant, low-fee micropayments for autonomous AI agents worldwide without intermediaries.';
  
  const resultado = analisarTexto(textoRecebido);
  res.json({
    ferramenta: 'Text & SEO Analyzer',
    texto_analisado: textoRecebido,
    ...resultado
  });
});

// Rota dedicada /analisar (Aceita tanto GET ?texto=... quanto POST com JSON)
app.all('/analisar', (req, res) => {
  const texto = (req.body && req.body.texto) || req.query.texto;

  if (!texto || typeof texto !== 'string') {
    return res.status(400).json({
      erro: 'Envie um texto válido no parâmetro ?texto=... ou no corpo JSON { "texto": "..." }'
    });
  }

  res.json(analisarTexto(texto));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
