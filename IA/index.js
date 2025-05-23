import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL;

// Endpoint para processar dados de saúde
app.post('/analise', async (req, res) => {
    const { dados } = req.body; // dados: array de objetos { endereco, diagnostico, sintomas }
    if (!Array.isArray(dados)) {
        return res.status(400).json({ error: 'Formato inválido. Envie um array de dados.' });
    }

    // Monta prompt para o OpenAI
    const prompt = `Você é um agente de saúde. Analise os dados abaixo e responda:\n1. Quais doenças estão tendo mais casos?\n2. Quais regiões apresentam mais casos?\n\nDados:\n${JSON.stringify(dados, null, 2)}\n\nResponda de forma simples e objetiva.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: OPENAI_MODEL,
                messages: [
                    { role: 'user', content: prompt }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
        const result = response.data.choices?.[0]?.message?.content || 'Sem resposta.';
        res.json({ resultado: result });
    } catch (error) {
        // Se for erro 429, retorna resposta fake
        if (error.response && error.response.status === 429) {
            return res.json({
                resultado: 'FAKE: A doença mais frequente é Dengue, principalmente na região Centro. Gripe aparece em Bairro Novo. (resposta simulada)'
            });
        }
        res.status(500).json({ error: 'Erro ao consultar a API OpenAI', details: error.message });
    }
});

// Rota para teste rápido no navegador
app.get('/', (req, res) => {
    res.send('<h2>Agente de IA rodando!<br>Use o endpoint <code>/analise</code> via POST para análise de dados.</h2>');
});

app.listen(3001, () => {
    console.log('Agente de IA rodando em http://localhost:3001');
});
