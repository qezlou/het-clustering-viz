// Galaxy Clustering Visualization JavaScript - One Parameter at a Time
class ClusteringVisualizerOne {
    constructor() {
        this.data = null;
        this.currentParameter = 1; // Start with Ω_m
        this.currentValue = 5;
    }

    async loadData() {
        try {
            const response = await fetch('data_one.json');
            this.data = await response.json();
            console.log('Data loaded successfully:', this.data.metadata);
            this.initializeApp();
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('loading-message').textContent = 
                'Error loading data. Please ensure data_one.json is available.';
        }
    }

    initializeApp() {
        document.getElementById('loading-message').style.display = 'none';
        
        // Set up event listeners
        const parameterSelect = document.getElementById('parameter-select');
        const valueSlider = document.getElementById('value-slider');
        const showFiducial = document.getElementById('show-fiducial');
        const showRange = document.getElementById('show-range');
        
        parameterSelect.addEventListener('change', (e) => {
            this.currentParameter = parseInt(e.target.value);
            this.updatePlot();
        });
        
        valueSlider.addEventListener('input', (e) => {
            this.currentValue = parseInt(e.target.value);
            document.getElementById('value-display').textContent = `${e.target.value} / 9`;
            this.updatePlot();
        });
        
        showFiducial.addEventListener('change', () => {
            this.updatePlot();
        });
        
        showRange.addEventListener('change', () => {
            this.updatePlot();
        });

        // Set initial parameter to Ω_m
        parameterSelect.value = "1";
        this.currentParameter = 1;
        
        // Initial plot
        this.updatePlot();
    }

    updatePlot() {
        if (!this.data) return;

        const rValues = this.data.r_values;
        const mValues = this.data.m_values;
        
        // Get current parameter data
        const currentXiData = this.data.xi_data[this.currentParameter][this.currentValue];
        const currentNmData = this.data.nm_data[this.currentParameter][this.currentValue];
        
        // Update clustering plot
        this.updateClusteringPlot(rValues, currentXiData);
        
        // Update mass function plot
        this.updateMassFunctionPlot(mValues, currentNmData);
        
        // Update statistics
        this.updateStatistics();
    }

    updateClusteringPlot(rValues, currentXiData) {
        const traces = [];
        const paramInfo = this.data.parameters[this.currentParameter];
        
        // Main trace - current parameter and value
        const mainTrace = {
            x: rValues,
            y: currentXiData,
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
            name: `${paramInfo.name} (${this.currentValue}/9)`,
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<extra></extra>'
        };
        traces.push(mainTrace);

        // Show fiducial model if requested
        if (document.getElementById('show-fiducial').checked && this.currentParameter !== 0) {
            const fiducialXiData = this.data.xi_data[0][0]; // Fiducial model
            const fiducialTrace = {
                x: rValues,
                y: fiducialXiData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#718096',
                    width: 2,
                    dash: 'dash'
                },
                name: 'Fiducial Model',
                hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<br>Fiducial<extra></extra>'
            };
            traces.push(fiducialTrace);
        }

        // Show parameter range if requested
        if (document.getElementById('show-range').checked && this.currentParameter !== 0) {
            // Show min and max values for current parameter
            const minXiData = this.data.xi_data[this.currentParameter][0];
            const maxXiData = this.data.xi_data[this.currentParameter][9];
            
            const minTrace = {
                x: rValues,
                y: minXiData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#e53e3e',
                    width: 1,
                    dash: 'dot'
                },
                name: `${paramInfo.name} Min`,
                opacity: 0.7,
                hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<br>Min Value<extra></extra>'
            };
            
            const maxTrace = {
                x: rValues,
                y: maxXiData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#48bb78',
                    width: 1,
                    dash: 'dot'
                },
                name: `${paramInfo.name} Max`,
                opacity: 0.7,
                hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<br>Max Value<extra></extra>'
            };
            
            traces.push(minTrace, maxTrace);
        }

        const layout = this.createLayout();
        const config = this.createConfig();

        Plotly.newPlot('clustering-plot', traces, layout, config);
    }

    updateMassFunctionPlot(mValues, currentNmData) {
        const traces = [];
        const paramInfo = this.data.parameters[this.currentParameter];
        
        // Main trace - current parameter and value
        const mainTrace = {
            x: mValues,
            y: currentNmData,
            type: 'scatter',
            mode: 'lines+markers',
            line: {
                color: '#48bb78',
                width: 3
            },
            marker: {
                color: '#38a169',
                size: 4
            },
            name: `${paramInfo.name} (${this.currentValue}/9)`,
            hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<extra></extra>'
        };
        traces.push(mainTrace);

        // Show fiducial model if requested
        if (document.getElementById('show-fiducial').checked && this.currentParameter !== 0) {
            const fiducialNmData = this.data.nm_data[0][0]; // Fiducial model
            const fiducialTrace = {
                x: mValues,
                y: fiducialNmData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#718096',
                    width: 2,
                    dash: 'dash'
                },
                name: 'Fiducial Model',
                hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<br>Fiducial<extra></extra>'
            };
            traces.push(fiducialTrace);
        }

        // Show parameter range if requested
        if (document.getElementById('show-range').checked && this.currentParameter !== 0) {
            const minNmData = this.data.nm_data[this.currentParameter][0];
            const maxNmData = this.data.nm_data[this.currentParameter][9];
            
            const minTrace = {
                x: mValues,
                y: minNmData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#e53e3e',
                    width: 1,
                    dash: 'dot'
                },
                name: `${paramInfo.name} Min`,
                opacity: 0.7,
                hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<br>Min Value<extra></extra>'
            };
            
            const maxTrace = {
                x: mValues,
                y: maxNmData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#48bb78',
                    width: 1,
                    dash: 'dot'
                },
                name: `${paramInfo.name} Max`,
                opacity: 0.7,
                hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<br>Max Value<extra></extra>'
            };
            
            traces.push(minTrace, maxTrace);
        }

        const massFunctionLayout = {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Halo Mass [M☉]',
                    font: { size: 12 }
                },
                tickfont: { size: 10 }
            },
            yaxis: {
                type: 'log',
                title: {
                    text: 'n(M) [Mpc⁻³ dex⁻¹]',
                    font: { size: 12 }
                },
                tickfont: { size: 10 }
            },
            margin: { l: 50, r: 20, t: 20, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { family: 'Georgia, serif', size: 12 },
            showlegend: true,
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)',
                bordercolor: '#E2E8F0',
                borderwidth: 1,
                font: { size: 10 }
            },
            hovermode: 'closest'
        };

        const config = this.createConfig();
        Plotly.newPlot('mass-function-plot', traces, massFunctionLayout, config);
    }

    updateStatistics() {
        if (!this.data) return;

        const xiData = this.data.xi_data[this.currentParameter][this.currentValue];
        const nmData = this.data.nm_data[this.currentParameter][this.currentValue];
        const rValues = this.data.r_values;
        const mValues = this.data.m_values;
        
        // Calculate ξ(r) statistics
        const maxXi = Math.max(...xiData);
        const maxXiIndex = xiData.indexOf(maxXi);
        const peakR = rValues[maxXiIndex];
        
        // Find zero crossing
        let zeroCrossing = 'N/A';
        for (let i = 1; i < xiData.length; i++) {
            if (xiData[i-1] > 0 && xiData[i] <= 0) {
                zeroCrossing = rValues[i].toFixed(2);
                break;
            }
        }
        
        // Calculate integral
        let integral = 0;
        for (let i = 1; i < xiData.length; i++) {
            integral += (xiData[i] + xiData[i-1]) * (rValues[i] - rValues[i-1]) / 2;
        }
        
        // Calculate n(M) statistics
        const maxNm = Math.max(...nmData);
        const maxNmIndex = nmData.indexOf(maxNm);
        const peakM = mValues[maxNmIndex];
        
        // Calculate total number density
        let totalNm = 0;
        for (let i = 1; i < nmData.length; i++) {
            totalNm += (nmData[i] + nmData[i-1]) * (Math.log10(mValues[i]) - Math.log10(mValues[i-1])) / 2;
        }
        
        // Calculate high-mass objects (> 10^14 M_sun)
        let highMassNm = 0;
        for (let i = 0; i < mValues.length; i++) {
            if (mValues[i] > 1e14) {
                if (i > 0) {
                    highMassNm += (nmData[i] + nmData[i-1]) * (Math.log10(mValues[i]) - Math.log10(mValues[i-1])) / 2;
                }
            }
        }
        
        // Update statistics display
        document.getElementById('xi-max').textContent = maxXi.toFixed(4);
        document.getElementById('xi-peak-r').textContent = peakR.toFixed(2);
        document.getElementById('xi-zero').textContent = zeroCrossing;
        document.getElementById('xi-integral').textContent = integral.toFixed(3);
        
        document.getElementById('nm-max').textContent = maxNm.toExponential(2);
        document.getElementById('nm-peak-m').textContent = peakM.toExponential(1);
        document.getElementById('nm-total').textContent = totalNm.toExponential(2);
        document.getElementById('nm-highmass').textContent = highMassNm.toExponential(2);
    }

    createLayout() {
        const isMobile = window.innerWidth < 768;
        
        return {
            xaxis: {
                type: 'log',
                title: {
                    text: 'Separation r [Mpc/h]',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            yaxis: {
                type: 'log',
                title: {
                    text: 'ξ(r)',
                    font: { size: isMobile ? 12 : 14, color: '#4a5568' }
                },
                gridcolor: '#e2e8f0',
                tickfont: { color: '#718096', size: isMobile ? 10 : 12 }
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: { 
                t: 20, 
                b: isMobile ? 50 : 60, 
                l: isMobile ? 60 : 80, 
                r: isMobile ? 15 : 20 
            },
            showlegend: true,
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)',
                bordercolor: '#e2e8f0',
                borderwidth: 1
            },
            hovermode: 'closest'
        };
    }

    createConfig() {
        return {
            responsive: true,
            displayModeBar: window.innerWidth >= 768,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d'],
            displaylogo: false,
            doubleClick: 'reset',
            scrollZoom: false,
            staticPlot: window.innerWidth < 480
        };
    }

    // Debounce function for resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the visualizer
const visualizerOne = new ClusteringVisualizerOne();

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    visualizerOne.loadData();
    
    // Add resize listener for responsive updates
    window.addEventListener('resize', visualizerOne.debounce(() => {
        if (document.getElementById('clustering-plot')) {
            visualizerOne.updatePlot();
        }
    }, 250));
});
