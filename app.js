// Galaxy Clustering Visualization JavaScript
class ClusteringVisualizer {
    constructor() {
        this.data = null;
        this.currentPlotType = 'log';
        this.animationId = null;
        this.isAnimating = false;
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
            console.log('Data loaded successfully:', this.data.metadata);
            this.initializeApp();
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('loading-message').textContent = 
                'Error loading data. Please ensure data.json is available.';
        }
    }

    initializeApp() {
        document.getElementById('loading-message').style.display = 'none';
        
        // Set up event listeners for sliders
        const sliders = ['param1', 'param2', 'param3', 'param4'];
        sliders.forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const valueDisplay = document.getElementById(`${param}-value`);
            
            slider.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
                this.updatePlot();
                this.updateStatistics();
            });
        });

        // Set up plot type buttons
        this.setupPlotControls();
        
        // Initial plot and statistics
        this.updatePlot();
        this.updateStatistics();
    }

    setupPlotControls() {
        const plotContainer = document.querySelector('.plot-container');
        const controlsHtml = `
            <div class="plot-controls">
                <button class="plot-button active" onclick="visualizer.setPlotType('log')">Log-Log</button>
                <button class="plot-button" onclick="visualizer.setPlotType('linear')">Linear</button>
                <button class="plot-button" onclick="visualizer.setPlotType('residual')">Residual</button>
            </div>
        `;
        
        const plotTitle = plotContainer.querySelector('.plot-title');
        plotTitle.insertAdjacentHTML('afterend', controlsHtml);
    }

    setPlotType(type) {
        this.currentPlotType = type;
        
        // Update button states
        document.querySelectorAll('.plot-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.updatePlot();
    }

    getCurrentParameters() {
        return {
            param1: parseInt(document.getElementById('param1-slider').value),
            param2: parseInt(document.getElementById('param2-slider').value),
            param3: parseInt(document.getElementById('param3-slider').value),
            param4: parseInt(document.getElementById('param4-slider').value)
        };
    }

    updatePlot() {
        if (!this.data) return;

        const params = this.getCurrentParameters();
        const xiData = this.data.xi_data[params.param1][params.param2][params.param3][params.param4];
        const rValues = this.data.r_values;

        let trace, layout;

        switch (this.currentPlotType) {
            case 'log':
                trace = this.createLogTrace(rValues, xiData);
                layout = this.createLogLayout();
                break;
            case 'linear':
                trace = this.createLinearTrace(rValues, xiData);
                layout = this.createLinearLayout();
                break;
            case 'residual':
                trace = this.createResidualTrace(rValues, xiData);
                layout = this.createResidualLayout();
                break;
        }

        const config = {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
            displaylogo: false
        };

        Plotly.newPlot('clustering-plot', [trace], layout, config);
    }

    createLogTrace(rValues, xiData) {
        return {
            x: rValues,
            y: xiData,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#667eea',
                width: 3
            },
            marker: {
                color: '#764ba2',
                size: 6,
                line: {
                    color: '#667eea',
                    width: 1
                }
            },
            name: 'ξ(r)',
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<extra></extra>'
        };
    }

    createLinearTrace(rValues, xiData) {
        return {
            x: rValues,
            y: xiData,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#48bb78',
                width: 3
            },
            marker: {
                color: '#38a169',
                size: 6
            },
            name: 'ξ(r)',
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<extra></extra>'
        };
    }

    createResidualTrace(rValues, xiData) {
        // Calculate residuals from a power law fit (simplified)
        const powerLawFit = rValues.map(r => Math.pow(r, -1.8) * 100);
        const residuals = xiData.map((xi, i) => xi - powerLawFit[i]);
        
        return {
            x: rValues,
            y: residuals,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#ed8936',
                width: 3
            },
            marker: {
                color: '#dd6b20',
                size: 6
            },
            name: 'Residuals',
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>Residual: %{y:.4f}<extra></extra>'
        };
    }

    createLogLayout() {
        return {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096' }
            },
            yaxis: {
                type: 'log',
                title: {
                    text: 'ξ(r)',
                    font: { size: 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096' }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 20, b: 60, l: 80, r: 20 },
            showlegend: false,
            hovermode: 'closest'
        };
    }

    createLinearLayout() {
        return {
            xaxis: {
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096' }
            },
            yaxis: {
                title: {
                    text: 'ξ(r)',
                    font: { size: 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096' }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 20, b: 60, l: 80, r: 20 },
            showlegend: false,
            hovermode: 'closest'
        };
    }

    createResidualLayout() {
        return {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096' }
            },
            yaxis: {
                title: {
                    text: 'Residuals from Power Law',
                    font: { size: 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096' }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 20, b: 60, l: 80, r: 20 },
            showlegend: false,
            hovermode: 'closest'
        };
    }

    updateStatistics() {
        if (!this.data) return;

        const params = this.getCurrentParameters();
        const xiData = this.data.xi_data[params.param1][params.param2][params.param3][params.param4];
        
        // Calculate statistics
        const maxXi = Math.max(...xiData);
        const minXi = Math.min(...xiData);
        const avgXi = xiData.reduce((a, b) => a + b, 0) / xiData.length;
        
        // Find correlation length (approximate)
        const corrLength = this.data.r_values[xiData.findIndex(xi => xi < avgXi * 0.1)];
        
        // Update statistics display
        const statsHtml = `
            <div class="statistics-panel">
                <h3 style="margin-bottom: 10px; color: #4a5568;">Current Statistics</h3>
                <div class="stat-item">
                    <span class="stat-label">Maximum ξ(r):</span>
                    <span class="stat-value">${maxXi.toFixed(4)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Minimum ξ(r):</span>
                    <span class="stat-value">${minXi.toFixed(4)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average ξ(r):</span>
                    <span class="stat-value">${avgXi.toFixed(4)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Correlation Length:</span>
                    <span class="stat-value">${corrLength ? corrLength.toFixed(2) : 'N/A'} Mpc/h</span>
                </div>
                <div class="correlation-strength ${this.getCorrelationStrengthClass(maxXi)}">
                    ${this.getCorrelationStrengthText(maxXi)}
                </div>
            </div>
        `;
        
        // Remove existing statistics panel if it exists
        const existingStats = document.querySelector('.statistics-panel');
        if (existingStats) {
            existingStats.remove();
        }
        
        // Add new statistics panel
        const controlsPanel = document.querySelector('.controls-panel');
        controlsPanel.insertAdjacentHTML('beforeend', statsHtml);
    }

    getCorrelationStrengthClass(maxXi) {
        if (maxXi > 0.5) return 'correlation-strong';
        if (maxXi > 0.1) return 'correlation-moderate';
        return 'correlation-weak';
    }

    getCorrelationStrengthText(maxXi) {
        if (maxXi > 0.5) return 'Strong Clustering';
        if (maxXi > 0.1) return 'Moderate Clustering';
        return 'Weak Clustering';
    }

    // Animation feature for parameter exploration
    animateParameters() {
        if (this.isAnimating) {
            this.stopAnimation();
            return;
        }

        this.isAnimating = true;
        const button = document.querySelector('.animate-button');
        if (button) button.textContent = 'Stop Animation';

        let step = 0;
        const animate = () => {
            if (!this.isAnimating) return;

            // Animate through parameter values
            const param1Value = Math.floor((Math.sin(step * 0.1) + 1) * 4.5);
            const param2Value = Math.floor((Math.cos(step * 0.07) + 1) * 4.5);
            
            document.getElementById('param1-slider').value = param1Value;
            document.getElementById('param2-slider').value = param2Value;
            document.getElementById('param1-value').textContent = param1Value;
            document.getElementById('param2-value').textContent = param2Value;
            
            this.updatePlot();
            this.updateStatistics();
            
            step++;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        const button = document.querySelector('.animate-button');
        if (button) button.textContent = 'Animate Parameters';
    }
}

// Initialize the visualizer
const visualizer = new ClusteringVisualizer();

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    visualizer.loadData();
});
