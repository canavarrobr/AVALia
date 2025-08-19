// api/chat.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // pegando a chave do Vercel
});

export default async function handler(req, res) {
  // Configurações de CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Faz parse do body (necessário no Vercel)
    let body;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return res.status(400).json({ error: "Body inválido" });
    }

    const { message, dadosAvaliacao } = body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem não fornecida" });
    }

    // Monta contexto com dados
    let dadosFormatados = "DADOS DA AVALIAÇÃO FÍSICA:\n\n";

    if (dadosAvaliacao?.dadosGerais) {
      dadosFormatados += `Nome: ${dadosAvaliacao.dadosGerais.nome || "Não informado"}\n`;
      dadosFormatados += `Idade: ${dadosAvaliacao.dadosGerais.idade || "Não informado"}\n`;
      dadosFormatados += `Sexo: ${dadosAvaliacao.dadosGerais.sexo || "Não informado"}\n\n`;
    }

    if (dadosAvaliacao?.medidas) {
      dadosFormatados += "MEDIDAS:\n";
      for (const [medida, valor] of Object.entries(dadosAvaliacao.medidas)) {
        if (valor && valor !== "N/A") {
          dadosFormatados += `${medida}: ${valor}\n`;
        }
      }
      dadosFormatados += "\n";
    }

    // Chamada para a OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é um avaliador físico virtual. Analise os dados fornecidos e responda de forma clara e profissional.

          DADOS DO USUÁRIO:
          ${dadosFormatados}

          Diretrizes:
          - Use apenas os dados fornecidos
          - Seja específico e evite generalidades
          - Dê orientações personalizadas
          - Faça recomendações seguras e realistas`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const aiResponse = completion.choices[0].message.content;

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Erro detalhado:", error);

    res.status(500).json({
      error: "Erro ao processar a requisição",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
