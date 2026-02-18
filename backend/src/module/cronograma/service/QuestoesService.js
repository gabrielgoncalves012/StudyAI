import { openai } from "../utils/deepseek.js";
import { prisma } from '../../../shared/config/db.js';

export class QuestoesService {

    async generateQuestion(topic) {

      //deixar strings em menusculo e sem acentos para facilitar busca
      topic.subject = topic.subject.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      topic.dicipline = topic.dicipline.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

      
      if (topic.repeat) {
        const questionsSaveds = await prisma.questoes.findMany({
          where: {
            disciplina: topic.dicipline,
            topico: topic.subject,
            dificuldade: (topic.dificuldade || undefined)
          }
        });
  
        if (questionsSaveds.length >= topic.number) {
          const shuffled = questionsSaveds.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, topic.number);
          return { atividades: selected };
        }
  
        topic.number = topic.number - questionsSaveds.length;

        if (!topic.dificuldade) {
          topic.dificuldade = "Variado";
        }
  
        const prompt = `
        Você é um especialista em criação de questões para concursos públicos. Com base em provas anteriores de concursos, crie um conjunto de atividades (questões) sobre a diciplina ${topic.dicipline} e o assunto ${topic.subject}, seguindo rigorosamente a estrutura abaixo:
  
        Instruções detalhadas:
  
        Fonte: As questões devem ser inspiradas em temas, estilo e nível de dificuldade de questões reais de concursos públicos brasileiros (ex.: FGV, CESPE, VUNESP, FCC etc.). Não copie questões exatas, mas recrie a essência.
  
        Diciplina: Foque na diciplina: ${topic.dicipline}.
  
        Assunto: Concentre-se no assunto específico: ${topic.subject}.
  
        Número de Questões: Gere exatamente ${topic.number} questões.
  
        Nível de Dificuldade: Gere questões com dificuldade ${topic.dificuldade}. ${topic.dificuldade == "Variado" ? "Varie o nível de dificuldade entre 'Fácil', 'Média' e 'Difícil', conforme apropriado para concursos públicos." : ""}.
  
        Formato de Saída: A saída deve ser EXCLUSIVAMENTE um objeto JSON válido, sem nenhum texto adicional antes ou depois.
  
        Estrutura JSON:
  
        O JSON deve ter uma chave chamada "atividades", que é um array de objetos.
  
        Cada objeto dentro do array representa uma questão e deve ter as seguintes chaves:
  
        "id": (número) identificador único sequencial, começando em 1.
  
        "enunciado": (string) texto da pergunta, claro e direto, no estilo de concurso.
  
        "alternativas": ((objeto) contendo quatro chaves: "A", "B", "C", "D". O valor de cada chave é o texto da alternativa).
  
        "correta": (string) a letra da alternativa correta (ex: "C").
  
        "banca": (string) a sigla da banca de concursos que inspirou a questão (ex: "FGV", "CESPE").
  
        "ano_aproximado": (número) o ano aproximado ou período da prova que serviu de referência (ex: 2019).
  
        "dificuldade": (string) nível de dificuldade: "Fácil", "Média" ou "Difícil".
  
        "topico_especifico": (string) um subtópico mais detalhado dentro do tema principal (ex: para "Improbidade Administrativa", pode ser "Atos de Improbidade - Enriquecimento Ilícito").
  
        "disciplina": ${topic.dicipline}.
  
        "topico": ${topic.subject}.
  
        Exemplo de Saída Esperada (JSON):
  
        {
          "atividades": [
            {
              "id": 1,
              "enunciado": "De acordo com a Lei de Improbidade Administrativa (Lei nº 8.429/1992), o ato de improbidade que importa enriquecimento ilícito:",
              "alternativas": {
            "A": "Prescreve em 5 anos, contados da prática do ato.",
            "B": "Sujeita o agente apenas à perda dos bens acrescidos ilicitamente.",
            "C": "Configura-se independentemente do dolo ou culpa do agente público.",
            "D": "Pode acarretar, além da reparação do dano, a perda da função pública e a suspensão dos direitos políticos."
              },
              "correta": "D",
              "banca": "CESPE",
              "ano_aproximado": 2020,
              "dificuldade": "Média",
              "topico_especifico": "Enriquecimento Ilícito - Efeitos da Condenação",
              "disciplina": "Direito Administrativo",
              "topico": "Improbidade Administrativa"
            }
          ]
        }
  
        Solicitação Final:
        Crie ${topic.number} questões no formato JSON exatamente como exemplificado acima, sobre o tema: ${topic}. Garanta que as três alternativas incorretas (distratores) sejam plausíveis e comuns em provas, refletindo erros típicos dos candidatos.
        `;
  
        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "deepseek-chat"
        });
  
        if (response.choices[0].message.content == null) {
          throw new Error('Deepseek response is null');
        }
  
        const cleanedContent = response.choices[0].message.content.replace(/```json|```/g, '').trim();
        const jsonResponse = JSON.parse(cleanedContent);
  
        await prisma.questoes.createMany({
          data: jsonResponse.atividades.map((atividade) => ({
            enunciado: atividade.enunciado,
            //alterbativas no banco é um array de strings
            alternativas: [
              "A - " + atividade.alternativas.A,
              "B - " + atividade.alternativas.B,
              "C - " + atividade.alternativas.C,
              "D - " + atividade.alternativas.D
            ],
            correta: atividade.correta,
            banca: atividade.banca,
            ano_aproximado: Number(atividade.ano_aproximado),
            dificuldade: atividade.dificuldade,
            topico_especifico: atividade.topico_especifico,
            disciplina: topic.dicipline,
            topico: topic.subject
          }))
        });
  
        if (questionsSaveds.length === 0) {
          return jsonResponse;
        }
  
        console.log('Questions saveds:');
        console.log(questionsSaveds);
        console.log('Json response before adding saveds:');
        console.log(jsonResponse);
  
        jsonResponse.atividades = [...questionsSaveds, ...jsonResponse.atividades];
  
        console.log('Json response after adding saveds:');
        console.log(jsonResponse);
  
        return jsonResponse;
      }

      
    }

    async findAllDiscpipline() {
      const disciplinas = await prisma.questoes.findMany({
        select: {
          id: true,
          disciplina: true
        }
      });

      // remover duplicatas
      const uniqueDisciplinasMap = new Map();
      disciplinas.forEach((disciplina) => {
        const key = disciplina.disciplina;
        if (!uniqueDisciplinasMap.has(key)) {
          uniqueDisciplinasMap.set(key, disciplina);
        }
      });
      const uniqueDisciplinas = Array.from(uniqueDisciplinasMap.values());

      return uniqueDisciplinas;
    }

    async findAllTopicsByDiscipline(partialQuestion) {

      const disciplinas = await prisma.questoes.findMany({
        where: {
          disciplina: partialQuestion.disciplina
        },
        // retornar apenas os anos das questões encontradas
        select: {
          id: true,
          disciplina: true,
          topico: true
        }
      });

      // remover duplicatas
      const uniqueDisciplinasMap = new Map();
      disciplinas.forEach((disciplina) => {
        const key = disciplina.topico;
        if (!uniqueDisciplinasMap.has(key)) {
          uniqueDisciplinasMap.set(key, disciplina);
        }
      });
      const uniqueDisciplinas = Array.from(uniqueDisciplinasMap.values());

      return uniqueDisciplinas;

    }

}