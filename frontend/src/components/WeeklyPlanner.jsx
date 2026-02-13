import React, { useState, useMemo } from 'react';
import '../styles/weeklyPlanner.css';

const WeeklyPlanner = ({ planejamentos }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  
  // Dias da semana em português
  const weekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  // Agrupa os planejamentos por dia
  const planejamentosPorDia = useMemo(() => {
    const porDia = {};
    
    planejamentos.forEach(item => {
      if (!porDia[item.day]) {
        porDia[item.day] = [];
      }
      porDia[item.day].push(item);
    });
    
    return porDia;
  }, [planejamentos]);

  // Obtém todos os dias que têm planejamentos
  const diasComPlanejamento = useMemo(() => {
    return Object.keys(planejamentosPorDia)
      .map(Number)
      .sort((a, b) => a - b);
  }, [planejamentosPorDia]);

  // Função para obter os dias da semana atual
  const diasDaSemanaAtual = useMemo(() => {
    if (diasComPlanejamento.length === 0) return [];
    
    const startIndex = currentWeek * 7;
    return diasComPlanejamento.slice(startIndex, startIndex + 7);
  }, [diasComPlanejamento, currentWeek]);

  // Verifica se tem próxima semana
  const temProximaSemana = useMemo(() => {
    const nextWeekStart = (currentWeek + 1) * 7;
    return nextWeekStart < diasComPlanejamento.length;
  }, [diasComPlanejamento, currentWeek]);

  // Verifica se tem semana anterior
  const temSemanaAnterior = currentWeek > 0;

  // Navegadores de semana
  const proximaSemana = () => {
    if (temProximaSemana) {
      setCurrentWeek(prev => prev + 1);
    }
  };

  const semanaAnterior = () => {
    if (temSemanaAnterior) {
      setCurrentWeek(prev => prev - 1);
    }
  };

  // Se não houver planejamentos
  if (diasComPlanejamento.length === 0) {
    return (
      <div className="weekly-planner-empty">
        <h2>Nenhum planejamento encontrado</h2>
      </div>
    );
  }

  return (
    <div className="weekly-planner">



      <div className="planner-header">
        <h1>📅 Planejamento Semanal</h1>
        <div className="week-navigation">
          <button 
            onClick={semanaAnterior} 
            disabled={!temSemanaAnterior}
            className="nav-button"
          >
            ← Semana Anterior
          </button>
          <span className="week-info">
            Semana {currentWeek + 1} de {Math.ceil(diasComPlanejamento.length / 7)}
          </span>
          <button 
            onClick={proximaSemana} 
            disabled={!temProximaSemana}
            className="nav-button"
          >
            Próxima Semana →
          </button>
        </div>
      </div>

      <div className="week-grid">
        {diasDaSemanaAtual.map((dia, index) => {
          const planejamentosDoDia = planejamentosPorDia[dia] || [];
          const nomeDiaSemana = weekDays[dia % 7] || weekDays[0]; // Fallback para domingo
          
          return (
            <div key={dia} className="day-card">
              <div className="day-header">
                <h2>{nomeDiaSemana}</h2>
                <span className="day-number">Dia {dia}</span>
              </div>
              
              <div className="day-content">
                {planejamentosDoDia.map(item => (
                  <div key={item.id} className="subject-item">
                    <h3>{item.diciplina}</h3>
                    <ul className="topics-list">
                      {item.topics.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                {planejamentosDoDia.length === 0 && (
                  <p className="no-content">📅 Nenhum conteúdo planejado</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyPlanner;