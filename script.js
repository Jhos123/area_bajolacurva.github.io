// ============================================
// MÉTODOS NUMÉRICOS
// ============================================

class MetodosNumericos {
    
    // Método del Trapecio
    static trapecio(f, a, b, n) {
        const h = (b - a) / n;
        let suma = f(a) + f(b);
        
        for (let i = 1; i < n; i++) {
            suma += 2 * f(a + i * h);
        }
        
        return (h / 2) * suma;
    }
    
    // Método de Simpson 1/3
    static simpson13(f, a, b, n) {
        if (n % 2 !== 0) {
            throw new Error('Simpson 1/3 requiere un número PAR de subdivisiones');
        }
        
        const h = (b - a) / n;
        let suma = f(a) + f(b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            suma += (i % 2 === 0 ? 2 : 4) * f(x);
        }
        
        return (h / 3) * suma;
    }
    
    // Método de Simpson 3/8
    static simpson38(f, a, b, n) {
        if (n % 3 !== 0) {
            throw new Error('Simpson 3/8 requiere subdivisiones múltiplo de 3');
        }
        
        const h = (b - a) / n;
        let suma = f(a) + f(b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            suma += (i % 3 === 0 ? 2 : 3) * f(x);
        }
        
        return (3 * h / 8) * suma;
    }
}

// ============================================
// INFORMACIÓN DE MÉTODOS
// ============================================

const metodoInfo = {
    trapecio: {
        nombre: 'MÉTODO DEL TRAPECIO',
        formula: 'I ≈ (h/2) × [f(x₀) + 2f(x₁) + 2f(x₂) + ... + 2f(xₙ₋₁) + f(xₙ)]',
        descripcion: 'Aproxima el área bajo la curva usando trapecios. Es el método más simple y funciona con cualquier número de subdivisiones.',
        precision: 'Precisión: MEDIA | Error: O(h²)',
        recomendacion: 'Ideal para funciones lineales o suaves.'
    },
    simpson13: {
        nombre: 'MÉTODO DE SIMPSON 1/3',
        formula: 'I ≈ (h/3) × [f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + f(xₙ)]',
        descripcion: 'Aproxima usando parábolas de segundo grado. Requiere número PAR de subdivisiones.',
        precision: 'Precisión: ALTA | Error: O(h⁴)',
        recomendacion: 'Excelente para funciones con curvaturas suaves.'
    },
    simpson38: {
        nombre: 'MÉTODO DE SIMPSON 3/8',
        formula: 'I ≈ (3h/8) × [f(x₀) + 3f(x₁) + 3f(x₂) + 2f(x₃) + ... + f(xₙ)]',
        descripcion: 'Usa parábolas cúbicas. Requiere subdivisiones múltiplo de 3.',
        precision: 'Precisión: MUY ALTA | Error: O(h⁴)',
        recomendacion: 'Mejor para funciones complejas o con alta curvatura.'
    }
};

// ============================================
// INTERFAZ Y GRÁFICA
// ============================================

let chartInstance = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.getElementById('calcularBtn');
    calcularBtn.addEventListener('click', calcularIntegral);
    
    // Inicializar gráfica vacía
    inicializarGrafica();
});

function inicializarGrafica() {
    const ctx = document.getElementById('grafica').getContext('2d');
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#00ffff',
                        font: {
                            family: 'Orbitron',
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'GRÁFICA DE LA FUNCIÓN',
                    color: '#ff00ff',
                    font: {
                        family: 'Orbitron',
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    grid: {
                        color: 'rgba(0, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#00ffff',
                        font: {
                            family: 'Share Tech Mono'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 0, 255, 0.1)'
                    },
                    ticks: {
                        color: '#00ffff',
                        font: {
                            family: 'Share Tech Mono'
                        }
                    }
                }
            }
        }
    });
}

function calcularIntegral() {
    try {
        // Obtener datos de entrada
        const funcionStr = document.getElementById('funcion').value.trim();
        const a = parseFloat(document.getElementById('limiteA').value);
        const b = parseFloat(document.getElementById('limiteB').value);
        const n = parseInt(document.getElementById('subdivisiones').value);
        const metodo = document.getElementById('metodo').value;
        
        // Validaciones
        if (!funcionStr) throw new Error('Ingresa una función');
        if (isNaN(a) || isNaN(b)) throw new Error('Límites inválidos');
        if (isNaN(n) || n <= 0) throw new Error('Subdivisiones inválidas');
        if (a >= b) throw new Error('El límite inferior debe ser menor que el superior');
        
        // Compilar función con math.js
        const funcionCompilada = math.compile(funcionStr);
        const f = (x) => funcionCompilada.evaluate({ x: x });
        
        // Calcular integral según método
        let resultado;
        switch (metodo) {
            case 'trapecio':
                resultado = MetodosNumericos.trapecio(f, a, b, n);
                break;
            case 'simpson13':
                resultado = MetodosNumericos.simpson13(f, a, b, n);
                break;
            case 'simpson38':
                resultado = MetodosNumericos.simpson38(f, a, b, n);
                break;
        }
        
        // Mostrar resultado
        document.getElementById('resultadoValor').textContent = resultado.toFixed(8);
        document.getElementById('errorMsg').textContent = '';
        
        // Actualizar documentación
        actualizarDocumentacion(metodo);
        
        // Graficar
        graficarFuncion(f, a, b, n, metodo);
        
    } catch (error) {
        document.getElementById('resultadoValor').textContent = '---';
        document.getElementById('errorMsg').textContent = `⚠ ${error.message}`;
    }
}

function actualizarDocumentacion(metodo) {
    const info = metodoInfo[metodo];
    const contenedor = document.getElementById('metodoInfo');
    
    contenedor.innerHTML = `
        <p><strong>${info.nombre}</strong></p>
        <p><strong>Fórmula:</strong><br>${info.formula}</p>
        <p><strong>Descripción:</strong><br>${info.descripcion}</p>
        <p><strong>${info.precision}</strong></p>
        <p><strong>Recomendación:</strong> ${info.recomendacion}</p>
    `;
}

function graficarFuncion(f, a, b, n, metodo) {
    // Generar puntos de la función (curva suave)
    const puntosCurva = [];
    const pasos = 200;
    for (let i = 0; i <= pasos; i++) {
        const x = a + (b - a) * i / pasos;
        puntosCurva.push({ x: x, y: f(x) });
    }
    
    // Generar puntos de subdivisión
    const puntosSubdivision = [];
    const h = (b - a) / n;
    for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        puntosSubdivision.push({ x: x, y: f(x) });
    }
    
    // Generar área sombreada
    const areaPuntos = [];
    areaPuntos.push({ x: a, y: 0 });
    for (let i = 0; i <= pasos; i++) {
        const x = a + (b - a) * i / pasos;
        areaPuntos.push({ x: x, y: f(x) });
    }
    areaPuntos.push({ x: b, y: 0 });
    
    // Actualizar gráfica
    chartInstance.data.datasets = [
        {
            label: 'f(x)',
            data: puntosCurva,
            borderColor: '#00ffff',
            borderWidth: 3,
            fill: false,
            pointRadius: 0,
            tension: 0.4
        },
        {
            label: 'Área',
            data: areaPuntos,
            backgroundColor: 'rgba(255, 0, 255, 0.2)',
            borderColor: 'rgba(255, 0, 255, 0.5)',
            borderWidth: 1,
            fill: true,
            pointRadius: 0,
            tension: 0.4
        },
        {
            label: `Subdivisiones (n=${n})`,
            data: puntosSubdivision,
            borderColor: '#ff00ff',
            backgroundColor: '#ff00ff',
            pointRadius: 5,
            pointHoverRadius: 7,
            showLine: false
        }
    ];
    
    chartInstance.update();
}

// ============================================
// CARGAR EJEMPLOS
// ============================================

function cargarEjemplo(funcion, a, b, n, metodo) {
    document.getElementById('funcion').value = funcion;
    document.getElementById('limiteA').value = a;
    document.getElementById('limiteB').value = b;
    document.getElementById('subdivisiones').value = n;
    document.getElementById('metodo').value = metodo;
    
    // Calcular automáticamente
    calcularIntegral();
    
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ACTUALIZAR DOCUMENTACIÓN (MODIFICAR LA FUNCIÓN EXISTENTE)
// ============================================

function actualizarDocumentacion(metodo) {
    const info = metodoInfo[metodo];
    const contenedor = document.getElementById('metodoInfo');
    
    contenedor.innerHTML = `
        <div style="background: rgba(0,0,0,0.4); padding: 20px; border-radius: 8px;">
            <p style="font-size: 1.2em; margin-bottom: 15px;"><strong>${info.nombre}</strong></p>
            
            <div style="background: rgba(139,0,255,0.1); padding: 15px; border-left: 3px solid #8b00ff; margin: 15px 0;">
                <p style="color: #ff00ff;"><strong>Fórmula:</strong></p>
                <p style="font-size: 0.95em; margin-top: 8px;">${info.formula}</p>
            </div>
            
            <p style="margin: 15px 0;"><strong>Descripción:</strong><br>${info.descripcion}</p>
            
            <p style="color: #00ffff; margin: 15px 0;"><strong>${info.precision}</strong></p>
            
            <p style="background: rgba(0,255,255,0.1); padding: 12px; border-radius: 5px; margin-top: 15px;">
                <strong>💡 Recomendación:</strong> ${info.recomendacion}
            </p>
        </div>
    `;
}

// ============================================
// EXPLICAR GRÁFICO (NUEVA FUNCIÓN)
// ============================================

function explicarGrafico(metodo, n, a, b) {
    const detalleContainer = document.getElementById('graficoDetalle');
    
    let explicacion = `<strong>Interpretación del gráfico actual:</strong><br><br>`;
    
    switch(metodo) {
        case 'trapecio':
            explicacion += `
                El método del <strong>Trapecio</strong> divide el área en <strong>${n} trapecios</strong> entre x=${a} y x=${b}.<br><br>
                
                • Cada trapecio conecta dos puntos consecutivos con una línea recta<br>
                • Los puntos rosados indican donde se evalúa la función<br>
                • El área sombreada es la suma de todos los trapecios<br>
                • Entre más subdivisiones, mejor la aproximación<br><br>
                
                <strong>Paso de cálculo:</strong> h = (${b} - ${a})/${n} = ${((b-a)/n).toFixed(4)}
            `;
            break;
            
        case 'simpson13':
            explicacion += `
                El método de <strong>Simpson 1/3</strong> usa <strong>${n} subdivisiones</strong> (número par requerido).<br><br>
                
                • Agrupa los puntos en pares y ajusta parábolas<br>
                • Los puntos rosados son los nodos de evaluación<br>
                • Usa coeficientes alternados: 1, 4, 2, 4, 2, ..., 4, 1<br>
                • Mayor precisión que trapecio con menos subdivisiones<br><br>
                
                <strong>Paso de cálculo:</strong> h = (${b} - ${a})/${n} = ${((b-a)/n).toFixed(4)}
            `;
            break;
            
        case 'simpson38':
            explicacion += `
                El método de <strong>Simpson 3/8</strong> usa <strong>${n} subdivisiones</strong> (múltiplo de 3).<br><br>
                
                • Agrupa los puntos en tríos y ajusta cúbicas<br>
                • Los puntos rosados marcan las evaluaciones<br>
                • Usa coeficientes: 1, 3, 3, 2, 3, 3, 2, ..., 3, 3, 1<br>
                • Máxima precisión para funciones complejas<br><br>
                
                <strong>Paso de cálculo:</strong> h = (${b} - ${a})/${n} = ${((b-a)/n).toFixed(4)}
            `;
            break;
    }
    
    detalleContainer.innerHTML = explicacion;
}

// ============================================
// MODIFICAR calcularIntegral PARA INCLUIR EXPLICACIÓN
// ============================================

// Dentro de la función calcularIntegral, después de actualizar la documentación, agrega:
// explicarGrafico(metodo, n, a, b);