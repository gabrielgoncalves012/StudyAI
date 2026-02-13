import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CronogramaService } from "../services/CronogramaService/CronogramService";
import { IoBookOutline, IoTimeOutline, IoCalendarClearOutline } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { GrBook } from "react-icons/gr";
import { GoTrophy, GoChevronLeft, GoChevronRight } from "react-icons/go";
import { PiChartLineUp } from "react-icons/pi";
import '../styles/cronograma.css'
import ProgressBar from "../components/ProgressBar";
import { useEffect, useState } from "react";
import WeeklyPlanner from "../components/WeeklyPlanner";

export default function Cronograma() {
    const {id} = useParams()

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['cronograma'],
          queryFn: async () => {
            const cronogramaService = new CronogramaService();
            return await cronogramaService.findCronogramaById(id)
          }
      })

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>Error: {error.message}</h1>
    }

    const HeaderStyle = {
        'background-color': "#"+data.colorCode
    }

    return (
        <div className="cronograma">
            <header className="header-container" style={HeaderStyle}>
                <span className="icons">
                    <div className="icon"><IoBookOutline/></div>
                    <div className="icon"><FiTarget/></div>                    
                </span>
                <h1>{data.concurso}</h1>
                <span className="subtitle">Cargo, esqueci de por no banco de dados</span>

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
                            <ProgressBar feito={data.topicFinished} total={data.topicLength} color={"#"+data.colorCode}/>
                                
                        </div>
                        <section className="progresso-topicos">
                            <div className="item-progress">
                                <div className="icon">
                                    <GrBook color={"#"+data.colorCode}/>
                                </div>
                                <span className="value">{data.topicLength}</span>                                
                                <span>Total de topicos</span>
                            </div>
                            <div className="item-progress">
                                <div className="icon">
                                    <GoTrophy color="#2eb867"/>
                                </div>
                                <span className="value">{data.topicFinished}</span>                                
                                <span>Concluidos</span>
                            </div>
                            <div className="item-progress">
                                <div className="icon">
                                    <IoTimeOutline color="#65758b"/>
                                </div>
                                <span className="value">{Number(data.topicLength) - Number(data.topicFinished)}</span>                                
                                <span>Restantes</span>
                            </div>
                            <div className="item-progress">
                                <div className="icon">
                                    <PiChartLineUp color="#f4c025"/>
                                </div>
                                <span className="value">10%</span>
                                <span>Progresso</span>
                            </div>
                        </section>
                </article>

                <article className="cronograma-container">
                    <div className="header-cronograma-container">
                        <div className="start-container">
                            <div className="icon">
                                <IoCalendarClearOutline/>
                            </div>
                            <div>
                                <h2 style={{'margin-bottom': '5px'}}>Cronograma semanal</h2>
                                <span>Planejamento de x semanas</span>
                            </div>
                        </div>
                        <div className="end-container">
                            <button>
                                <GoChevronLeft/>
                            </button>
                            <span>Samana x</span>
                            <button>
                                <GoChevronRight/>
                            </button>
                        </div>
                    </div>

                     <WeeklyPlanner planejamentos={data.planejamentos}/>

                </article>

            </main>
        </div>
    )
}