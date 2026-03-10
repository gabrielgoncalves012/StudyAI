import { useEffect, useState } from "react";

export default function ProgressBar({ feito, total, color, mini }) {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const progresso = calcularProgresso(feito, total);
        setProgress(progresso);
    }, [progress, feito])

    function calcularProgresso(feito, total) {
        // Evita divisão por zero
        if (total === 0) return 0;
        
        const porcentagemFeito = (feito / total) * 100;
        
        return Number(porcentagemFeito.toFixed(1))
    }

    const progressBarStyle = {
        width: `100%`,
        backgroundColor: '#e0e0e0',
        height: mini? '10px' : '20px',
        'border-radius': '10px',
        'overflow': 'hidden'
    };

    const progressFillStyle = {
        width: `${progress}%`,
        height: '100%',
        backgroundColor: color,
        'border-radius': '10px',
        'transition': 'width 0.3s ease-in-out'
    };

    const spanProgressStyle = {
        'font-weight': 'bold',
        'margin-right': '10px',
        'margin-bottom': '10px',
        'color': color,
        'display': 'flex',
        'justify-content': 'flex-end'
    };

    return (
        <div>
            <span style={spanProgressStyle}>{progress}%</span>
            <div className="progress-bar" style={progressBarStyle}>
                <div
                    className="progress-bar-fill"
                    style={progressFillStyle}
                ></div>
            </div>
        </div>
    );
}