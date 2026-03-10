import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CronogramaService } from "../services/CronogramaService/CronogramService";
import { IoBookOutline, IoTimeOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { GrBook } from "react-icons/gr";
import { GoTrophy, } from "react-icons/go";
import { FaRegCircleCheck, FaRegCircle } from "react-icons/fa6";
import { PiChartLineUp } from "react-icons/pi";
import '../styles/cronograma.css'
import ProgressBar from "../components/ProgressBar";
import { useState } from "react";
import WeeklyPlanner from "../components/WeeklyPlanner";

export default function Cronograma() {

    const cronogramaService = new CronogramaService();

    const {id} = useParams()
    const [openDisciplinas, setOpenDisciplinas] = useState({});
    const [disciplinas, setDisciplinas] = useState([]);
    const [topicFinished, setTopicFinished] = useState(0);

    const toggleDisciplina = (id) => {
        setOpenDisciplinas(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['cronograma'],
          queryFn: async () => {
            const data = await cronogramaService.findCronogramaById(id)
            setDisciplinas(data.disciplinas)
            setTopicFinished(data.topicFinished)
            return data
          }
      })

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>Error: {error.message}</h1>
    }

    const HeaderStyle = {
        'background-color': data.colorCode
    }

    async function checkTopic(id) {
        await cronogramaService.checkTopic(id)
        refetch()
    }
    function diasDesde(dataString) {
        // Data fornecida
        const dataPassada = new Date(dataString);
        
        // Data de hoje
        const hoje = new Date();
        
        // Zerar horas, minutos, segundos e milissegundos
        dataPassada.setUTCHours(0, 0, 0, 0);
        hoje.setUTCHours(0, 0, 0, 0);
        
        // Calcular diferença em milissegundos e converter para dias
        const diferencaMs = hoje - dataPassada;
        const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
        
        return dias;
    }

    return (
        <div className="cronograma">
            <header className="header-container" style={HeaderStyle}>
                <span className="icons">
                    <div className="icon"><IoBookOutline/></div>
                    <div className="icon"><FiTarget/></div>                    
                </span>
                <h1>{data.concurso}</h1>
                <span className="subtitle">{data.cargo}</span>

                <section className="disciplinas">
                    {/* no maximo 4 */}
                    {
                        data.disciplinas.length > 4 ? (
                            data.disciplinas.slice(0, 4).map((disciplina) => (
                                <p key={disciplina.id}>
                                    {disciplina.name}
                                </p>
                            ))
                        ) : (    
                            data.disciplinas.map((disciplina) => (
                                <p key={disciplina.id}>
                                    {disciplina.name}
                                </p>
                            ))
                        )
                     }
                </section>

            </header>

            <main>
                <article className="progresso-container">
                        <h2>Seu progresso</h2>
                        <div>
                            <ProgressBar feito={topicFinished} total={data.topicLength} color={data.colorCode}/>
                                
                        </div>
                        <section className="progresso-topicos">
                            <div className="item-progress">
                                <div className="icon">
                                    <GrBook color={"#"+data.colorCode}/>
                                </div>
                                <span className="value">{data.topicLength}</span>                                
                                <span className="label">Total de topicos</span>
                            </div>
                            <div className="item-progress">
                                <div className="icon">
                                    <GoTrophy color="#2eb867"/>
                                </div>
                                <span className="value">{data.topicFinished}</span>                                
                                <span className="label">Concluidos</span>
                            </div>
                            <div className="item-progress">
                                <div className="icon">
                                    <IoTimeOutline color="#65758b"/>
                                </div>
                                <span className="value">{Number(data.topicLength) - Number(data.topicFinished)}</span>                                
                                <span className="label">Restantes</span>
                            </div>
                            <div className="item-progress">
                                <div className="icon">
                                    <PiChartLineUp color="#f4c025"/>
                                </div>
                                <span className="value">{Number((data.topicFinished / data.topicLength) * 100).toFixed(1)}%</span>
                                <span className="label">Progresso</span>
                            </div>
                        </section>
                </article>

                <article className="cronograma-container">

                     <WeeklyPlanner planejamentos={data.planejamentos} days={() => diasDesde(data.dateCreated)} color={data.colorCode}/>

                </article>

                <article className="list-container">
                    <h2>Conteúdo programatico</h2>

                     <div className="disciplinas-container">

                        {disciplinas.map((disciplina) => {

                            return (
                                <div className="disciplina-container" key={disciplina.id}>
                                <div className="disciplina-header" key={disciplina.id} onClick={() => toggleDisciplina(disciplina.id)}>
                                    <div className="disciplina-info">
                                        <div className="disciplina-icon">
                                            <GrBook color={"#"+data.colorCode}/>
                                        </div>
                                        <div>
                                            <h3>{disciplina.name}</h3>
                                            <span>{disciplina.finished} de {disciplina.length} tópicos</span>
                                        </div>
                                    </div>
                                    <div className="disciplina-progress">
                                        <ProgressBar mini={true} color={data.colorCode} feito={disciplina.finished} total={disciplina.length} />
                                    </div>
                                </div>
                                <ol className="disciplina-content" style={{ display: openDisciplinas[disciplina.id] ? 'flex' : 'none' }}>
                                    {
                                        disciplina.topics.map((topic) => (
                                            <li className="topic-item" onClick={() => checkTopic(topic.id)} style={topic.finished ? { background: '#57ce892a' } : { background: '#edf0f380' }} key={topic.id}>
                                                <div>{topic.finished ? <FaRegCircleCheck color="#2eb867"/> : <FaRegCircle color="#65758b"/>}</div>
                                                <span>{topic.name}</span>
                                            </li>
                                        ))
                                    }
                                </ol>
                            </div>
                            )

                        })}

                     </div>

                </article>

            </main>

            <footer className="footer">
                <p>📖 Bons estudos! Mantenha a consistência e alcance sua aprovação no {data.concurso}.</p>
            </footer>
        </div>
    )
}