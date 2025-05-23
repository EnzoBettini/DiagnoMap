# Agente de IA - Saúde

Backend simples para análise de dados de saúde usando a API OPEN AI.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor ficará disponível em http://localhost:3001

## Endpoint

POST `/analise`

**Body:**

```json
{
  "dados": [
    { "endereco": "Rua X, Bairro Y", "diagnostico": "Dengue", "sintomas": "febre, dor de cabeça" },
    ...
  ]
}
```

**Resposta:**

```json
{
  "resultado": "...resposta do Gemini..."
}
```

**Json para TESTES**

```json
{
  "dados": [
    {
      "endereco": "Rua das Flores, Centro",
      "diagnostico": "Dengue",
      "sintomas": "febre alta, dor de cabeça, dor atrás dos olhos"
    },
    {
      "endereco": "Avenida Brasil, Bairro Novo",
      "diagnostico": "Gripe",
      "sintomas": "tosse, febre, dor no corpo"
    },
    {
      "endereco": "Rua das Flores, Centro",
      "diagnostico": "Dengue",
      "sintomas": "febre, manchas vermelhas, dor muscular"
    },
    {
      "endereco": "Rua do Sol, Bairro Novo",
      "diagnostico": "Covid-19",
      "sintomas": "tosse seca, febre, perda de olfato"
    },
    {
      "endereco": "Travessa Alegre, Vila Feliz",
      "diagnostico": "Dengue",
      "sintomas": "febre alta, cansaço, dores articulares"
    },
    {
      "endereco": "Rua das Palmeiras, Centro",
      "diagnostico": "Chikungunya",
      "sintomas": "febre, dor nas articulações, fadiga"
    },
    {
      "endereco": "Alameda Santos, Bairro Alto",
      "diagnostico": "Gripe",
      "sintomas": "calafrios, febre, coriza"
    },
    {
      "endereco": "Avenida Central, Centro",
      "diagnostico": "Covid-19",
      "sintomas": "febre, tosse, dor de garganta"
    },
    {
      "endereco": "Rua Rio Branco, Jardim América",
      "diagnostico": "Dengue",
      "sintomas": "dor atrás dos olhos, náusea, febre alta"
    },
    {
      "endereco": "Rua das Margaridas, Vila Nova",
      "diagnostico": "Influenza",
      "sintomas": "febre, dor muscular, fraqueza"
    },
    {
      "endereco": "Rua Verdejante, Campo Alegre",
      "diagnostico": "Covid-19",
      "sintomas": "falta de ar, tosse seca, febre"
    },
    {
      "endereco": "Rua do Comércio, Centro",
      "diagnostico": "Gripe",
      "sintomas": "espirros, dor de cabeça, febre"
    },
    {
      "endereco": "Estrada Velha, Bairro Rural",
      "diagnostico": "Leptospirose",
      "sintomas": "febre, dor nas panturrilhas, calafrios"
    },
    {
      "endereco": "Rua do Contorno, Bairro Novo",
      "diagnostico": "Covid-19",
      "sintomas": "dor de cabeça, febre, perda de paladar"
    },
    {
      "endereco": "Rua das Rosas, Centro",
      "diagnostico": "Dengue",
      "sintomas": "manchas na pele, febre, dor muscular"
    },
    {
      "endereco": "Avenida das Nações, Setor Sul",
      "diagnostico": "Chikungunya",
      "sintomas": "inchaço nas articulações, febre, fadiga"
    },
    {
      "endereco": "Rua Padre Anchieta, Bairro Velho",
      "diagnostico": "Gripe",
      "sintomas": "dor no corpo, febre, espirros"
    },
    {
      "endereco": "Rua do Porto, Vila Marinha",
      "diagnostico": "Dengue",
      "sintomas": "febre alta, dor nas costas, cansaço extremo"
    },
    {
      "endereco": "Rua Azul, Bairro Leste",
      "diagnostico": "Covid-19",
      "sintomas": "febre persistente, tosse seca, falta de ar"
    },
    {
      "endereco": "Travessa do Norte, Jardim Tropical",
      "diagnostico": "Influenza",
      "sintomas": "dor no corpo, calafrios, febre"
    },
    {
      "endereco": "Rua do Mercado, Centro",
      "diagnostico": "Dengue",
      "sintomas": "dor abdominal, febre, vômito"
    },
    {
      "endereco": "Rua das Laranjeiras, Bairro Antigo",
      "diagnostico": "Leptospirose",
      "sintomas": "dor muscular, olhos avermelhados, febre"
    },
    {
      "endereco": "Rua Projetada, Bairro Novo",
      "diagnostico": "Covid-19",
      "sintomas": "febre, dor de garganta, cansaço"
    },
    {
      "endereco": "Rua 7 de Setembro, Vila União",
      "diagnostico": "Gripe",
      "sintomas": "espirros, febre, tosse leve"
    },
    {
      "endereco": "Rua do Lago, Jardim Primavera",
      "diagnostico": "Chikungunya",
      "sintomas": "febre alta, dor intensa nas articulações, fadiga crônica"
    }
  ]
}
```
