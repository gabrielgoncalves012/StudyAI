import { openai } from "../config/deepseek.js";

export class QuestoesService {

    async generateQuestion(topic) {

        const prompt = `
        Você é um especialista em criação de questões para concursos públicos. Com base em provas anteriores de concursos, crie um conjunto de atividades (questões) sobre a diciplina ${topic.dicipline} e o assunto ${topic.subject}, seguindo rigorosamente a estrutura abaixo:

        Instruções detalhadas:

        Fonte: As questões devem ser inspiradas em temas, estilo e nível de dificuldade de questões reais de concursos públicos brasileiros (ex.: FGV, CESPE, VUNESP, FCC etc.). Não copie questões exatas, mas recrie a essência.

        Diciplina: Foque na diciplina: ${topic.dicipline}.

        Assunto: Concentre-se no assunto específico: ${topic.subject}.

        Número de Questões: Gere exatamente ${topic.number} questões.

        Formato de Saída: A saída deve ser EXCLUSIVAMENTE um objeto JSON válido, sem nenhum texto adicional antes ou depois.

        Estrutura JSON:

        O JSON deve ter uma chave chamada "atividades", que é um array de objetos.

        Cada objeto dentro do array representa uma questão e deve ter as seguintes chaves:

        "id": (número) identificador único sequencial, começando em 1.

        "enunciado": (string) texto da pergunta, claro e direto, no estilo de concurso.

        "alternativas": (objeto) contendo quatro chaves: "A", "B", "C", "D". O valor de cada chave é o texto da alternativa.

        "correta": (string) a letra da alternativa correta (ex: "C").

        "banca": (string) a sigla da banca de concursos que inspirou a questão (ex: "FGV", "CESPE").

        "ano_aproximado": (número) o ano aproximado ou período da prova que serviu de referência (ex: 2019).

        "dificuldade": (string) nível de dificuldade: "Fácil", "Média" ou "Difícil".

        "topico_especifico": (string) um subtópico mais detalhado dentro do tema principal (ex: para "Improbidade Administrativa", pode ser "Atos de Improbidade - Enriquecimento Ilícito").

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
              "topico_especifico": "Enriquecimento Ilícito - Efeitos da Condenação"
            }
          ]
        }

        Solicitação Final:
        Crie 5 questões no formato JSON exatamente como exemplificado acima, sobre o tema: ${topic}. Garanta que as três alternativas incorretas (distratores) sejam plausíveis e comuns em provas, refletindo erros típicos dos candidatos.
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

        return jsonResponse;
    }

}