import Layout from '../components/Layout'

function Questoes() {
  return (
    <Layout>
      <h2>Questões</h2>

      <p>
        As questões serão geradas automaticamente com base
        no concurso e nas matérias estudadas.
      </p>

      <div className="questoes-vazio">
        <p>Nenhuma questão disponível no momento.</p>
        <p>Gere seu cronograma para liberar as questões.</p>
      </div>
    </Layout>
  )
}

export default Questoes
