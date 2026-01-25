import console from "console";
import { prisma } from "../config/db.js";
import { openai } from "../config/deepseek.js";
import { extractTextFromPDF } from "../config/pdfparse.js";
import fs from "fs";
// pdfFile, cargo_area, horasDiarias, concurso, emojCode, colorCode

export class CronogramaService {

  async findAllCronogramasByUserId(userId) {
    try {
      const cronogramas = await prisma.cronograma.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          dateCreated: 'desc'
        }
      });
      return cronogramas;
    } catch (error) {
      console.log(error);
    }
  }

  
  
  async editCronograma(cronogramaId, body) {
    try {
      const updatedCronograma = await prisma.cronograma.update({
        where: {
          id: cronogramaId
        },
        data: {
          emojCode: body.emojCode,
          colorCode: body.colorCode,
          concurso: body.concurso
        }
      });
      return updatedCronograma;
    } catch (error) {
      console.log(error);
    }
  }

  async createCronograma(body, file) {
    try {

      const date = new Date();
      const accessDate = date.toISOString();

      const jsonEdital = await this.generateJsonFromEdital(body, file);

      const dataCronograma = {
        horasDiarias: body.horasDiarias,
        jsonEdital: jsonEdital
      }

      const planejamentoGenerated = await this.generateCronograma(dataCronograma);

      const topicsAmount = jsonEdital.disciplinas.reduce((acc, diciplina) => acc + diciplina.topicos.length, 0);
      
      const cronograma = await prisma.cronograma.create({
        data: {
          userId: body.userId,
          concurso: body.concurso,
          emojCode: body.emojCode,
          accessDate: accessDate,
          colorCode: body.colorCode,
          dateCreated: accessDate,
          topicLength: topicsAmount,
          topicFinished: 0
        }
      });

      for(const diciplinaData of jsonEdital.disciplinas) {

        console.log('Diciplina:', diciplinaData.nome_disciplina);

        const diciplina = await prisma.disciplina.create({
          data: {
            cronograma_id: cronograma.id,
            name: diciplinaData.nome_disciplina,
            length: diciplinaData.topicos.length,
            finished: 0
          }
        })          

        const topicsMap = diciplinaData.topicos.map(topic => ({
          name: topic,
          finished: false,
          disciplina_id: diciplina.id
        }))

        await prisma.topico.createMany({
          data: topicsMap
        })
      }

      for(const day of planejamentoGenerated.cronograma) {
        await prisma.planejamento.create({
          data: {
            cronograma_id: cronograma.id,
            day: day.dia,
            diciplina: day.disciplina,
            topics: day.topicos
          }
        })
      }

      return planejamentoGenerated;

    } catch (error) {
      console.log(error);
    }
  }

  async deleteCronograma(cronogramaId) {
    
    try {
      // Delete all related "planejamento" records
      await prisma.topico.deleteMany({
        where: {
          cronograma_id: cronogramaId
        }
      })

      await prisma.disciplina.deleteMany({
        where: {
          cronograma_id: cronogramaId
        }
      })

      await prisma.planejamento.deleteMany({
        where: {
          cronograma_id: cronogramaId
        }
      });

      await prisma.cronograma.delete({
        where: {
          id: cronogramaId
        }
      });

      return { message: "Cronograma deletado"}

      return { message: "Concurso and related data deleted successfully." };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete concurso and related data.");
    }

  }
  
  async generateJsonFromEdital(data, file) {
        const prompt = `
        Você é um assistente especializado em análise de editais de concursos públicos. Sua tarefa é extrair informações específicas sobre o conteúdo programático de um cargo ou área mencionado pelo usuário.

        **Instruções:**

        1. **Análise do Texto Seguinte do edital:**
           - Leia todo o conteúdo do edital fornecido.
           - Identifique seções relacionadas a "conteúdo programático", "matérias", "disciplinas", "programa" ou equivalentes.
           - Localize especificamente o cargo de ${data.cargo_area} conforme solicitado pelo usuário.

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

        Entrada do usuario:
        Analise o edital e retorne o conteúdo programático para o cargo de ${data.cargo_area}.
        `;

        const textEdital = await extractTextFromPDF(file.buffer);

        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
              {role: "system", content: prompt},
              {role: "user", content: "Edital: " + textEdital},
            ]
        })

        const cleanedContent = response.choices[0].message.content.replace(/```json|```/g, '').trim();
        const jsonResponse = JSON.parse(cleanedContent);

        return jsonResponse;
    }

    async generateCronograma(data) {

      const prompt = `Você é um assistente especializado em criação de cronogramas de estudo. Sua tarefa é gerar um arquivo JSON puro no seguinte formato padronizado:

FORMATO DE SAÍDA REQUISITADO (JSON):
{
  "cargo_area": "string (mesmo valor da entrada)",
  "horas_estudo_diario": "${data.horasDiarias}",
  "cronograma": [
    {
      "dia": "número sequencial começando em 1",
      "disciplina": "nome exato da disciplina",
      "topicos": ["topico 1", "topico 2"]
    }
  ]
}

REGRAS DE ORGANIZAÇÃO:
1. Cada dia deve conter APENAS UMA disciplina
2. Cada tópico deve ocupar UMA sessão de 1 hora
3. A quantidade de sessões por dia deve corresponder exatamente ao número informado em "horas_estudo_diario"
4. As disciplinas devem ser distribuídas de forma cíclica para evitar muitos dias consecutivos na mesma matéria
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
      "topicos": ["Princípios administrativos", "Poderes administrativos"]
    },
    {
      "dia": 2,
      "disciplina": "Português",
      "topicos": ["Interpretação de texto", "Pontuação"]
    }
  ]
}

      `;
      
      const response = await openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
              {
                  role: "system",
                  content: prompt
              },
              {
                  role: "user",
                  content: `Aqui está o conteúdo programático extraído do edital: ${JSON.stringify(data.jsonEdital)}. Por favor, gere o cronograma de estudo considerando que o usuário pode estudar ${data.horasDiarias} horas por dia.`
              }
          ]
      })

      const cleanedContent = response.choices[0].message.content.replace(/```json|```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedContent);

      return jsonResponse
    }

}