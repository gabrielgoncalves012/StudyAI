import { prisma } from "../config/db.js";
import { openai } from "../config/deepseek.js";
import fs from "fs";

export class CronogramaService {
  
    async generateJsonFromEdital(data) {
        const prompt = `
        Você é um assistente especializado em análise de editais de concursos públicos. Sua tarefa é extrair informações específicas sobre o conteúdo programático de um cargo ou área mencionado pelo usuário.

        **Instruções:**

        1. **Análise do PDF do Edital:**
           - Leia todo o conteúdo do edital fornecido.
           - Identifique seções relacionadas a "conteúdo programático", "matérias", "disciplinas", "programa" ou equivalentes.
           - Localize especificamente o cargo/área mencionado pelo usuário (ex: "agente comercial", "técnico administrativo", etc.).

        2. **Estrutura de Extração:**
           - Quando encontrar a área/cargo solicitado, extraia **APENAS** as disciplinas e seus respectivos tópicos/subtópicos.
           - Ignore informações sobre número de vagas, remuneração, datas, ou outras seções não relacionadas ao conteúdo programático.

        3. **Formato de Saída:**
           - Retorne **EXCLUSIVAMENTE** um objeto JSON válido, sem nenhum texto adicional, explicações ou markdown.
           - Use a seguinte estrutura:

        {
          "cargo_area": "nome exato do cargo/área conforme consta no edital",
          "disciplinas": [
            {
              "nome_disciplina": "nome da disciplina",
              "topicos": ["tópico 1", "tópico 2", "tópico 3", ...]
            }
          ]
        }

        Regras Importantes:

        Se o cargo/área não for encontrado, retorne: {"erro": "Cargo/área não encontrado no edital"}

        Se não houver tópicos detalhados, liste os assuntos principais como tópicos.

        Mantenha a formatação original do edital (negrito, itálico) apenas se for essencial para o entendimento.

        Não invente informações. Extraia apenas o que está explicitamente no documento.

        Exemplo de Entrada do Usuário:
        "Analise o edital e retorne o conteúdo programático para o cargo de Agente Comercial"

        Exemplo de Saída Esperada:
        {
          "cargo_area": "AGENTE COMERCIAL",
          "disciplinas": [
            {
              "nome_disciplina": "LÍNGUA PORTUGUESA",
              "topicos": ["Compreensão e interpretação de textos", "Ortografia oficial", "Acentuação gráfica"]
            },
            {
              "nome_disciplina": "MATEMÁTICA",
              "topicos": ["Razão e proporção", "Regra de três simples", "Porcentagem"]
            }
          ]
        }
        `;

        const pdfBuffer = fs.readFileSync(data.pdfPath);
        const pdfBase64 = pdfBuffer.toString('base64');

        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: prompt + `\n\nAqui está o conteúdo do edital em formato base64:\n\n${pdfBase64}`
                },
                {
                    type: "file",
                    file: {
                        data: pdfBase64,
                        filename: "edital.pdf",
                        mime_type: "application/pdf"
                    }
                }
            ]
        })

        return response.choices[0].message.content
    }

}