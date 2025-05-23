import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
console.log('[DEBUG] OPENAI_API_KEY carregada?', !!process.env.OPENAI_API_KEY);
console.log('[DEBUG] OPENAI_MODEL:', process.env.OPENAI_MODEL);

const app = express();
app.use(cors());
app.use(express.json());

// Caminho absoluto do diretório atual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// População estimada de Maringá-PR (2024)
const POPULACAO_MARINGA = 425983;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL;

// Endpoint para processar dados de saúde
app.post('/analise', async (req, res) => {
    const { dados } = req.body;
    if (!Array.isArray(dados)) {
        return res.status(400).json({ error: 'Formato inválido. Envie um array de dados.' });
    }

    // Agrupa casos por doença e bairro
    const casos = {}; // casos[doenca][bairro] = contagem
    dados.forEach(({ endereco, diagnostico }) => {
        const parts = endereco.split(',');
        const bairro = parts[1]?.trim() || parts[0]?.trim() || 'Não informado';
        if (!casos[diagnostico]) casos[diagnostico] = {};
        casos[diagnostico][bairro] = (casos[diagnostico][bairro] || 0) + 1;
    });

    // Prepara resumo para o prompt
    const linhasResumo = [];
    Object.entries(casos).forEach(([doenca, bairros]) => {
        Object.entries(bairros).forEach(([bairro, contagem]) => {
            linhasResumo.push(`- ${doenca} | ${bairro}: ${contagem} caso(s)`);
        });
    });
    const resumoCasos = linhasResumo.join('\n');

    // Constrói prompt para a OpenAI
    const prompt = `Contexto: Maringá, Paraná, população estimada em ${POPULACAO_MARINGA} habitantes.
Você é um agente de saúde pública local. A seguir, dados de casos por doença e bairro em Maringá:

${resumoCasos}

Tarefa:
1. Identifique as 2 combinações (doença + bairro) com MAIOR incidência.
2. Para cada uma:
   - Indique a possível causa do aumento de casos e incidencia a cada cem mil habitantes.
   - Sugira uma ação de mitigação, com base na causa e na população do bairro.
   - Faça uma estimativa percentual de redução de futuros casos se a ação for implementada.
   - Calcule, com base na população do bairro (proporcional à população total de Maringá), quantos habitantes poderiam ser alcançados POR AÇÃO DE MITIGAÇÃO POR DOENÇA.
   - caso voce nao consiga calcular a população por bairro, estime. Maringá possui mais de 250 microregiões e bairros. Análise e faça uma estimativa com base no TAMANHO de cada bairro.
   - Não colocar estimações sem base ou mitigações sem base.
   - Não colocar mitigações que não sejam possíveis de serem implementadas.
   - Não colocar numero da população do bairro, apenas utilize para seu próprio calculo.
   - Caso seja enviado apenas uma pessoa vamos considerar que para cada pessoa enviada temos mais 10 em cada bairro.
   - Não colocar a população alcançada, apenas a estimativa de redução de casos com base na população do bairro (não cite a populaçao apenas a %).
   - Você é apenas uma IA de demonstração, então se só vier por exemplo 1 pessoa, vamos considerar que para cada pessoa enviada temos mais 15 infectadas em cada bairro.
   - explique o porque da causa e da mitigação e o porque da estimativa de redução de casos.
   - O porque da estimativa na redução de casos deve informar dados reais do porque do numero da redução.

Formate a resposta como um ARRAY JSON, com objetos contendo:
[
  {
    "doenca": string,
    "bairro": string,
    "causa_possivel": string,
    "mitigacao": string,
    "pq_mitiga": string,
    "estimativa_reducao_percentual": string,
    "pq_da_estimativa_reducao_percentual": string,
  },
  ...
]
`;

    try {
        const aiRes = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: OPENAI_MODEL,
                messages: [{ role: 'user', content: prompt }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );

        const text = aiRes.data.choices[0].message.content;
        let recomendacoes;
        try {
            recomendacoes = JSON.parse(text);
        } catch (e) {
            // Retorna texto cru se JSON inválido
            return res.json({ raw: text });
        }
        res.json({ recomendacoes });

    } catch (error) {
        console.error('💥 ERRO em /analise:', error.response?.status, error.response?.data || error.message);
        if (error.response && error.response.status === 429) {
            return res.json({
                recomendacoes: [
                    { doenca: 'Dengue', bairro: 'Centro', casos: 0, causa_possivel: '', mitigacao: '', estimativa_reducao_percentual: '0%', populacao_alcancada: 0 }
                ]
            });
        }
        res.status(500).json({ error: 'Erro ao consultar a API OpenAI', details: error.message });
    }
});

// Inicializa o servidor
app.listen(3001, () => {
    console.log('Agente de IA rodando em http://localhost:3001');
});
