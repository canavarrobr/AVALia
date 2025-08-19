// api/chat.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // chave só no backend
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { message, dadosAvaliacao } = req.body;
  if (!message) return res.status(400).json({ error: "Mensagem não fornecida" });

  // Formata os dados de forma simples para enviar ao modelo
  const dadosFormatados = dadosAvaliacao
    ? JSON.stringify(dadosAvaliacao, null, 2)
    : "Nenhum dado fornecido";

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Você é um avaliador físico virtual especializado em interpretar avaliações físicas e dar orientações personalizadas.
          
DADOS DO USUÁRIO:
${dadosFormatados}

Diretrizes:
- Use apenas os dados fornecidos
- Seja específico e evite generalidades
- Dê orientações personalizadas
- Faça recomendações seguras e realistas`
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar requisição" });
  }
}
