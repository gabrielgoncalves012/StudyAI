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

    async generateCronograma(data) {
      const prompt = `Você é um assistente especializado em criação de cronogramas de estudo. Sua tarefa é gerar um arquivo JSON puro no seguinte formato padronizado:

FORMATO DE SAÍDA REQUISITADO (JSON):
{
  "cargo_area": "string (mesmo valor da entrada)",
  "horas_estudo_diario": "número (informado pelo usuário)",
  "cronograma": [
    {
      "dia": "número sequencial começando em 1",
      "disciplina": "nome exato da disciplina",
      "sessoes": [
        {
          "hora": "horário no formato HH:MM",
          "topico": "tópico específico da disciplina"
        }
      ]
    }
  ]
}

REGRAS DE ORGANIZAÇÃO:
1. Cada dia deve conter APENAS UMA disciplina
2. Cada tópico deve ocupar UMA sessão de 1 hora
3. A quantidade de sessões por dia deve corresponder exatamente ao número informado em "horas_estudo_diario"
4. As disciplinas devem ser distribuídas de forma cíclica para evitar muitos dias consecutivos na mesma matéria
5. Os horários devem começar às 08:00 e seguir sequencialmente (08:00, 09:00, 10:00, etc.)
6. Todos os tópicos de todas as disciplinas devem ser alocados
7. Se necessário, um tópico pode ser dividido em múltiplas sessões se for muito extenso

INSTRUÇÕES:
- Baseie-se no JSON de entrada fornecido pelo usuário
- Solicite ao usuário: "Quantas horas por dia você pode estudar?"
- Após receber o número de horas, processe os dados e gere o cronograma completo
- Mantenha a estrutura JSON válida e bem formatada
- Não inclua explicações ou texto adicional, apenas o JSON puro

EXEMPLO DE ENTRADA:
{
  "cargo_area": "Analista Judiciário - Área Administrativa",
  "disciplinas": [
    {
      "nome_disciplina": "Direito Administrativo",
      "topicos": ["Princípios administrativos", "Poderes administrativos"]
    },
    {
      "nome_disciplina": "Português",
      "topicos": ["Interpretação de texto", "Pontuação"]
    }
  ]
}

EXEMPLO DE SAÍDA (para 2 horas/dia):
{
  "cargo_area": "Analista Judiciário - Área Administrativa",
  "horas_estudo_diario": 2,
  "cronograma": [
    {
      "dia": 1,
      "disciplina": "Direito Administrativo",
      "sessoes": [
        {"hora": "08:00", "topico": "Princípios administrativos (parte 1)"},
        {"hora": "09:00", "topico": "Princípios administrativos (parte 2)"}
      ]
    },
    {
      "dia": 2,
      "disciplina": "Português",
      "sessoes": [
        {"hora": "08:00", "topico": "Interpretação de texto (parte 1)"},
        {"hora": "09:00", "topico": "Interpretação de texto (parte 2)"}
      ]
    },
    {
      "dia": 3,
      "disciplina": "Direito Administrativo",
      "sessoes": [
        {"hora": "08:00", "topico": "Poderes administrativos (parte 1)"},
        {"hora": "09:00", "topico": "Poderes administrativos (parte 2)"}
      ]
    },
    {
      "dia": 4,
      "disciplina": "Português",
      "sessoes": [
        {"hora": "08:00", "topico": "Pontuação (parte 1)"},
        {"hora": "09:00", "topico": "Pontuação (parte 2)"}
      ]
    }
  ]
}

      AGUARDE a entrada do usuário com o JSON e a informação sobre horas de estudo diário antes de gerar qualquer saída.`
      
      const response = await openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
              {
                  role: "user",
                  content: prompt + `\n\nAqui está o JSON de entrada:\n\n${data.jsonInput}\n\nE o número de horas diárias para estudo é: ${data.horasDiarias}`
              }
          ]
      })

      return response.choices[0].message.content
    }

}