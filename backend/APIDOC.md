
# Documentação da API

## BaseUrl
https://studyai.com.br

## Rotas de Usuário

### Criar Usuário
- **URL:** `/api/usuarios`
- **Método:** `POST`
- **Descrição:** Cria um novo usuário.
- **Body:**
```json
{
    "name": "pessoa2"
	"email": "pessoa2@pessoa",
	"password": "12345678"
}
```
- **Resposta esperada:** 
```json
{
	"message": "Usuário criado com sucesso"
}
```

### Login do Usuário
- **URL:** `/api/usuarios/signin`
- **Método:** `POST`
- **Descrição:** Autentica um usuário e gera um token de sessão.
- **Body:**
```json
{
	"email": "pessoa@pessoa",
	"password": "12345678"
}
```
- **Resposta esperada:** 
```json
{
      id: UUID,
      email: "pessoa@pessoa",
      name: "pessoa",
      nome: "12345678",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey ..."
    }
```

---

## Rotas de Questões

### Gerar Questão
- **URL:** `/api/generate-question`
- **Método:** `POST`
- **Descrição:** Gera uma nova questão.
- **Middleware:** `verify`
- **Cabeçario:** `Bearer ${token}`
- **Body:**
```json
{
    "dicipline": "matematica",
    "subject": "soma", //assunto
    "number": 10 //quantidade de questões
}
```
- **Resposta esperada:** 
```json
{
	"atividades": [
		{
			"id": 1,
			"enunciado": "Qunato é 10+10",
			"alternativas": {
				"A": "10",
				"B": "30",
				"C": "20",
				"D": "5"
			},
			"correta": "B",
			"banca": "CESPE",
			"ano_aproximado": 2021,
			"dificuldade": "Fácil",
			"topico_especifico": "Tradução de linguagem natural para linguagem simbólica"
		} {...} ] },
```

---

## Rotas de Cronograma

### Gerar Cronograma
- **URL:** `/api/cronograma`
- **Método:** `POST`
- **Descrição:** Gera um novo cronograma a partir de um arquivo enviado.
- **Middleware:** `upload.single('file')`
- **Cabeçario:** `Bearer ${token}`
- **Body:** **FORMDATA**
```json
    file -> file
    concurso -> text
    userId -> text
    cargo_area -> text
    horasDiarias -> text
    emojCode -> text
    colorCode -> text
```
- **Resposta esperada:**
```json
{
    "cargo_area": "Escrituario",
    "horas_estudo_diario": 2,
    "cronograma": [
        {
            "dia": 1,
            "disciplina": "LÍNGUA PORTUGUESA",
			"topicos": [
				"Compreensão de textos",
				"Ortografia oficial"
			]
        },
        {...}
    ],
    ""
}
```

### Obter Todos os Cronogramas
- **URL:** `/api/cronogramas`
- **Método:** `GET`
- **Descrição:** Recupera todos os cronogramas.
- **Middleware:** `verify`
- **Cabeçario:** `Bearer ${token}`
- **Resposta esperada:**
```json
[
	{
		"id": "346b35b5-8e01-43a3-b029-576ea26d6776",
		"concurso": "BB - Agente comercial",
		"emojCode": "U1F3E6",
		"colorCode": "F4B942",
		"accessDate": "2026-01-25T23:36:33.177Z",
		"dateCreated": "2026-01-25T18:47:10.691Z",
		"topicLength": 94,
		"topicFinished": 1,
		"userId": "5f2469ad-acb1-4a42-8943-1481f6d3ca8e"
	},
    {...}
]
```

### Obter Cronograma por ID
- **URL:** `/api/cronograma/:id`
- **Método:** `GET`
- **Descrição:** Recupera um cronograma específico pelo seu ID.
- **Cabeçario:** `Bearer ${token}`
- **Resposta esperada:** 
```json
{
    "id": "346b35b5-8e01-43a3-b029-576ea26d6776",
	"concurso": "BB - Agente comercial",
	"emojCode": "U1F3E6",
	"colorCode": "F4B942",
	"accessDate": "2026-01-25T23:36:33.177Z",
	"dateCreated": "2026-01-25T18:47:10.691Z",
	"topicLength": 94,
	"topicFinished": 1,
	"userId": "5f2469ad-acb1-4a42-8943-1481f6d3ca8e",
    "disciplinas": [
        {
            "id": "48b2b8da-83cc-4864-b9ea-979247d13209",
			"name": "LÍNGUA INGLESA",
			"length": 1,
			"finished": 0,
			"cronograma_id": "346b35b5-8e01-43a3-b029-576ea26d6776",
            "topics": [
                {
                    "id": "c8999d00-8628-444b-91d2-81a29991fc09",
					"name": "Conhecimento de um vocabulário fundamental e dos aspectos gramaticais básicos para a compreensão de textos",
					"finished": false,
					"disciplina_id": "48b2b8da-83cc-4864-b9ea-979247d13209",
					"cronograma_id": "346b35b5-8e01-43a3-b029-576ea26d6776"
                },
                {...}
            ]
        },
        {...}
    ],
    "planejamentos": [
        {
			"id": "50159b07-971e-48eb-96e9-97de2b1334d8",
			"day": 1,
			"diciplina": "LÍNGUA PORTUGUESA",
			"topics": [
				"Compreensão de textos",
				"Ortografia oficial"
			],
			"cronograma_id": "346b35b5-8e01-43a3-b029-576ea26d6776"
		}, {...}
    ]
}
```

### Verificar Conclusão de Tópico
- **URL:** `/api/cronograma/topico/:topicoId`
- **Método:** `GET`
- **Descrição:** Verifica o status de conclusão de um tópico específico em um cronograma.
- **Cabeçario:** `Bearer ${token}`,

### Editar Cronograma
- **URL:** `/api/cronograma/:id`
- **Método:** `GET`
- **Descrição:** Edita um cronograma específico pelo seu ID.
- **Cabeçario:** `Bearer ${token}`
- **Body:** 
```json
{
	"concurso": "BB - Agente comercial", //opicional
	"emojCode": "U1F3E6", //opicional
	"colorCode": "F4B942", //opicional
}
```
- **Resposta esperada:** 
```json
{
	"id": "346b35b5-8e01-43a3-b029-576ea26d6776",
	"concurso": "BB - Agente comercial",
	"emojCode": "U1F3E6",
	"colorCode": "F4B942",
	"accessDate": "2026-01-25T22:43:13.939Z",
	"dateCreated": "2026-01-25T18:47:10.691Z",
	"topicLength": 94,
	"topicFinished": 0,
	"userId": "5f2469ad-acb1-4a42-8943-1481f6d3ca8e"
}
```

### Deletar Cronograma
- **URL:** `/api/cronograma/:id`
- **Método:** `DELETE`
- **Descrição:** Deleta um cronograma específico pelo seu ID.
- **Cabeçario:** `Bearer ${token}`
