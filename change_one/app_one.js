// Galaxy Clustering Visualization JavaScript - One Parameter at a Time (Real Data)
class ClusteringVisualizerOne {
    constructor() {
        this.data = null;
        this.currentParameter = 1; // Start with first real parameter (after fiducial)
        this.currentValue = 0; // Start with first value
    }

    async loadData() {
        try {
            const response = await fetch('data_one.json');
            this.data = await response.json();
            console.log('Data loaded successfully:', this.data.metadata);
            this.populateParameterSelects();
            this.initializeApp();
        } catch (error) {
            console.error('Error loading data:', error);
            document.getElementById('loading-message').textContent = 
                'Error loading data. Please ensure data_one.json is available.';
        }
    }

    populateParameterSelects() {
        // Get both mobile and desktop parameter selects
        const selects = [
            document.getElementById('parameter-select'),
            document.getElementById('parameter-select-desktop')
        ].filter(select => select !== null);

        selects.forEach(select => {
            // Clear existing options
            select.innerHTML = '';
            
            // Add options for each parameter
            this.data.parameters.forEach((param, index) => {
                const option = document.createElement('option');
                option.value = index;
                // For dropdowns, use text representation since HTML select doesn't render LaTeX
                const displayName = this.getParameterDisplayName(param.name);
                option.textContent = `${displayName} (${param.range_string})`;
                select.appendChild(option);
            });
        });
        
        // Create custom styled dropdowns with LaTeX after page loads
        setTimeout(() => this.createStyledParameterSelects(), 100);
    }

    getParameterDisplayName(name) {
        // Convert LaTeX parameter names to Unicode/text equivalents for dropdowns
        const displayMap = {
            'Fiducial Model': 'Fiducial Model',
            '\\Omega_m': 'Ωₘ',
            '\\Omega_b': 'Ωᵦ', 
            'h': 'h',
            'A_s': 'Aₛ',
            'n_s': 'nₛ',
            'w_0': 'w₀',
            'w_a': 'wₐ',
            'N_{ur}': 'Nᵤᵣ',
            '\\alpha_s': 'αₛ',
            'm_{\\nu}': 'mᵥ'
        };
        
        return displayMap[name] || name;
    }

    createStyledParameterSelects() {
        // This function can be extended later for custom dropdown styling
        // For now, we'll rely on the Unicode characters in the text
    }

    formatParameterName(name) {
        // Convert parameter names to LaTeX format for plot legends
        if (name === 'Fiducial Model') {
            return 'Fiducial Model';
        }
        
        // If the name already contains LaTeX commands (backslashes), wrap it
        if (name.includes('\\')) {
            return `\\(${name}\\)`;
        }
        
        // For simple names, just return as is
        return name;
    }

    renderMathJax() {
        // Re-render MathJax for dynamic content
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().catch((err) => console.log('MathJax error: ' + err.message));
        }
    }

    initializeApp() {
        document.getElementById('loading-message').style.display = 'none';
        
        // Set up event listeners for both mobile and desktop controls
        this.setupControlListeners('', ''); // Mobile controls
        this.setupControlListeners('-desktop', '-desktop'); // Desktop controls
        
        // Set initial parameter and sync both controls
        this.setParameter(1); // Start with first real parameter
        this.setValue(0); // Start with first value
        
        // Initial plot and statistics
        this.updatePlot();
        
        // Render MathJax for dynamic content
        setTimeout(() => this.renderMathJax(), 100);
    }

    setupControlListeners(suffix, displaySuffix) {
        const parameterSelect = document.getElementById(`parameter-select${suffix}`);
        const valueSlider = document.getElementById(`value-slider${suffix}`);
        const showFiducial = document.getElementById(`show-fiducial${suffix}`);
        
        if (parameterSelect) {
            parameterSelect.addEventListener('change', (e) => {
                this.currentParameter = parseInt(e.target.value);
                this.syncControls();
                this.updateValueSlider();
                this.updatePlot();
            });
        }
        
        if (valueSlider) {
            valueSlider.addEventListener('input', (e) => {
                this.currentValue = parseInt(e.target.value);
                this.syncValueDisplays();
                this.updatePlot();
            });
            
            // Improve mobile touch handling
            valueSlider.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });
            
            valueSlider.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            }, { passive: true });
        }
        
        if (showFiducial) {
            showFiducial.addEventListener('change', () => {
                // Sync fiducial checkboxes
                const otherFiducial = document.getElementById(`show-fiducial${suffix === '' ? '-desktop' : ''}`);
                if (otherFiducial) {
                    otherFiducial.checked = showFiducial.checked;
                }
                this.updatePlot();
            });
        }
    }

    setParameter(param) {
        this.currentParameter = param;
        this.currentValue = 0; // Reset to first value when changing parameter
        this.syncControls();
        this.updateValueSlider();
    }

    setValue(value) {
        this.currentValue = value;
        this.syncValueDisplays();
    }

    updateValueSlider() {
        const currentParam = this.data.parameters[this.currentParameter];
        const maxValue = currentParam.values.length - 1;
        
        // Update both mobile and desktop sliders
        const sliders = [
            document.getElementById('value-slider'),
            document.getElementById('value-slider-desktop')
        ].filter(slider => slider !== null);
        
        sliders.forEach(slider => {
            slider.min = 0;
            slider.max = maxValue;
            slider.value = Math.min(this.currentValue, maxValue);
        });
        
        this.currentValue = Math.min(this.currentValue, maxValue);
        this.syncValueDisplays();
    }

    syncControls() {
        // Sync parameter selects
        const mobileSelect = document.getElementById('parameter-select');
        const desktopSelect = document.getElementById('parameter-select-desktop');
        
        if (mobileSelect) mobileSelect.value = this.currentParameter;
        if (desktopSelect) desktopSelect.value = this.currentParameter;
        
        // Update value sliders
        this.updateValueSlider();
    }

    syncValueDisplays() {
        const currentParam = this.data.parameters[this.currentParameter];
        const currentValueLabel = currentParam.value_labels[this.currentValue];
        const displayText = `${currentValueLabel} (${this.currentValue + 1}/${currentParam.values.length})`;
        
        // Update both mobile and desktop displays
        const displays = [
            document.getElementById('value-display'),
            document.getElementById('value-display-desktop')
        ].filter(display => display !== null);
        
        displays.forEach(display => {
            display.textContent = displayText;
        });
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
        
        // Render MathJax for plot legends
        setTimeout(() => this.renderMathJax(), 50);
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
            name: `${this.formatParameterName(paramInfo.name)}: ${paramInfo.value_labels[this.currentValue]}`,
            hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<extra></extra>'
        };
        traces.push(mainTrace);

        // Show fiducial model if requested and we're not already showing fiducial
        const showFiducialMobile = document.getElementById('show-fiducial');
        const showFiducialDesktop = document.getElementById('show-fiducial-desktop');
        const showFiducial = (showFiducialMobile && showFiducialMobile.checked) || 
                           (showFiducialDesktop && showFiducialDesktop.checked);
        
        if (showFiducial && this.currentParameter !== 0) {
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

        // Show parameter range if there are multiple values
        if (this.currentParameter !== 0 && paramInfo.values.length > 1) {
            // Show min and max values for current parameter
            const minXiData = this.data.xi_data[this.currentParameter][0];
            const maxXiData = this.data.xi_data[this.currentParameter][paramInfo.values.length - 1];
            
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
                name: `${this.formatParameterName(paramInfo.name)} Min: ${paramInfo.value_labels[0]}`,
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
                name: `${this.formatParameterName(paramInfo.name)} Max: ${paramInfo.value_labels[paramInfo.values.length - 1]}`,
                opacity: 0.7,
                hovertemplate: 'r: %{x:.2f} Mpc/h<br>ξ(r): %{y:.4f}<br>Max Value<extra></extra>'
            };
            
            traces.push(minTrace, maxTrace);
        }

        const layout = this.createLayoutFixed();
        const config = this.createConfig();

        // Plot to both mobile and desktop containers
        if (document.getElementById('clustering-plot')) {
            Plotly.newPlot('clustering-plot', traces, layout, config);
        }
        if (document.getElementById('clustering-plot-desktop')) {
            Plotly.newPlot('clustering-plot-desktop', traces, layout, config);
        }
    }    updateMassFunctionPlot(mValues, currentNmData) {
        const traces = [];
        const paramInfo = this.data.parameters[this.currentParameter];
        
        // Convert log mass values to actual mass values (10^logM)
        const massValues = mValues.map(logM => Math.pow(10, logM));
        
        // Main trace - current parameter and value
        const mainTrace = {
            x: massValues,
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
            name: `${this.formatParameterName(paramInfo.name)}: ${paramInfo.value_labels[this.currentValue]}`,
            hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<extra></extra>'
        };
        traces.push(mainTrace);

        // Show fiducial model if requested and we're not already showing fiducial
        const showFiducialMobile = document.getElementById('show-fiducial');
        const showFiducialDesktop = document.getElementById('show-fiducial-desktop');
        const showFiducial = (showFiducialMobile && showFiducialMobile.checked) || 
                           (showFiducialDesktop && showFiducialDesktop.checked);
        
        if (showFiducial && this.currentParameter !== 0) {
            const fiducialNmData = this.data.nm_data[0][0]; // Fiducial model
            const fiducialTrace = {
                x: massValues,
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

        // Show parameter range if there are multiple values
        if (this.currentParameter !== 0 && paramInfo.values.length > 1) {
            // Show min and max values for current parameter
            const minNmData = this.data.nm_data[this.currentParameter][0];
            const maxNmData = this.data.nm_data[this.currentParameter][paramInfo.values.length - 1];
            
            const minTrace = {
                x: massValues,
                y: minNmData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#e53e3e',
                    width: 1,
                    dash: 'dot'
                },
                name: `${this.formatParameterName(paramInfo.name)} Min: ${paramInfo.value_labels[0]}`,
                opacity: 0.7,
                hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<br>Min Value<extra></extra>'
            };
            
            const maxTrace = {
                x: massValues,
                y: maxNmData,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#48bb78',
                    width: 1,
                    dash: 'dot'
                },
                name: `${this.formatParameterName(paramInfo.name)} Max: ${paramInfo.value_labels[paramInfo.values.length - 1]}`,
                opacity: 0.7,
                hovertemplate: 'M: %{x:.2e} M☉<br>n(M): %{y:.3e}<br>Max Value<extra></extra>'
            };
            
            traces.push(minTrace, maxTrace);
        }

        const massFunctionLayout = this.createMassFunctionLayoutFixed();
        const config = this.createConfig();

        // Plot to both mobile and desktop containers
        if (document.getElementById('mass-function-plot')) {
            Plotly.newPlot('mass-function-plot', traces, massFunctionLayout, config);
        }
        if (document.getElementById('mass-function-plot-desktop')) {
            Plotly.newPlot('mass-function-plot-desktop', traces, massFunctionLayout, config);
        }
    }

    createLayoutFixed() {
        return {
            title: {
                text: '',
                font: { size: 14 }
            },
            xaxis: {
                title: 'r [Mpc/h]',
                type: 'log',
                range: [-1, 2], // Fixed range: 0.1 to 100 Mpc/h
                showgrid: true,
                gridcolor: '#e5e5e5',
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                tickmode: 'array',
                tickvals: [0.1, 1, 10, 100],
                ticktext: ['10⁻¹', '10⁰', '10¹', '10²']
            },
            yaxis: {
                title: 'ξ(r)',
                type: 'log',
                range: [-3, 2], // Fixed range: 0.001 to 100
                showgrid: true,
                gridcolor: '#e5e5e5',
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                tickmode: 'array',
                tickvals: [0.001, 0.01, 0.1, 1, 10, 100],
                ticktext: ['10⁻³', '10⁻²', '10⁻¹', '10⁰', '10¹', '10²']
            },
            margin: { l: 60, r: 20, t: 30, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(255,255,255,0.8)',
            showlegend: true,
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)',
                font: { size: 10 }
            },
            font: { family: 'Arial, sans-serif' }
        };
    }

    createMassFunctionLayoutFixed() {
        return {
            title: {
                text: '',
                font: { size: 14 }
            },
            xaxis: {
                title: 'M [M☉]',
                type: 'log',
                range: [Math.log10(1e10), Math.log10(1e13)], // Log range: 10^10 to 10^13 solar masses
                showgrid: true,
                gridcolor: '#e5e5e5',
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                tickmode: 'array',
                tickvals: [3e10, 1e11, 3e11, 1e12, 3e12, 1e13],
                ticktext: ['3×10¹⁰', '10¹¹', '3×10¹¹', '10¹²', '3×10¹²', '10¹³']
            },
            yaxis: {
                title: 'n(M) [Mpc⁻³ dex⁻¹]',
                type: 'log',
                range: [-8, -1], // Fixed range for mass function
                showgrid: true,
                gridcolor: '#e5e5e5',
                titlefont: { size: 12 },
                tickfont: { size: 10 },
                tickmode: 'array',
                tickvals: [1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1],
                ticktext: ['10⁻⁸', '10⁻⁷', '10⁻⁶', '10⁻⁵', '10⁻⁴', '10⁻³', '10⁻²', '10⁻¹']
            },
            margin: { l: 60, r: 20, t: 30, b: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(255,255,255,0.8)',
            showlegend: true,
            legend: {
                x: 0.02,
                y: 0.98,
                bgcolor: 'rgba(255,255,255,0.8)',
                font: { size: 10 }
            },
            font: { family: 'Arial, sans-serif' }
        };
    }

    createConfig() {
        return {
            responsive: true,
            displayModeBar: false,
            showTips: false
        };
    }

    updateStatistics() {
        if (!this.data) return;

        const rValues = this.data.r_values;
        const mValues = this.data.m_values;
        const currentXiData = this.data.xi_data[this.currentParameter][this.currentValue];
        const currentNmData = this.data.nm_data[this.currentParameter][this.currentValue];

        // Calculate ξ(r) statistics
        const xiMax = Math.max(...currentXiData);
        const xiMaxIndex = currentXiData.indexOf(xiMax);
        const xiPeakR = rValues[xiMaxIndex];
        
        // Find zero crossing (approximate)
        let xiZero = 'N/A';
        for (let i = 0; i < currentXiData.length - 1; i++) {
            if (currentXiData[i] > 0 && currentXiData[i + 1] < 0) {
                xiZero = rValues[i].toFixed(2);
                break;
            }
        }

        // Calculate integral (trapezoidal rule)
        let xiIntegral = 0;
        for (let i = 0; i < currentXiData.length - 1; i++) {
            const dr = rValues[i + 1] - rValues[i];
            xiIntegral += 0.5 * (currentXiData[i] + currentXiData[i + 1]) * dr;
        }

        // Calculate n(M) statistics
        const nmMax = Math.max(...currentNmData);
        const nmMaxIndex = currentNmData.indexOf(nmMax);
        const nmPeakM = Math.pow(10, mValues[nmMaxIndex]); // Convert log to actual mass

        // Calculate total number density (integral)
        let nmTotal = 0;
        for (let i = 0; i < currentNmData.length - 1; i++) {
            const dlogM = mValues[i + 1] - mValues[i];
            nmTotal += 0.5 * (currentNmData[i] + currentNmData[i + 1]) * dlogM;
        }

        // Count high-mass halos (> 10^14 M_sun)
        const highMassThreshold = 14.0;
        let nmHighMass = 0;
        for (let i = 0; i < mValues.length; i++) {
            if (mValues[i] >= highMassThreshold) {
                const dlogM = i < mValues.length - 1 ? mValues[i + 1] - mValues[i] : 0.1;
                nmHighMass += currentNmData[i] * dlogM;
            }
        }

        // Update DOM elements
        this.updateStatElement('xi-max', xiMax.toExponential(2));
        this.updateStatElement('xi-peak-r', xiPeakR.toFixed(2));
        this.updateStatElement('xi-zero', xiZero);
        this.updateStatElement('xi-integral', xiIntegral.toExponential(2));

        this.updateStatElement('nm-max', nmMax.toExponential(2));
        this.updateStatElement('nm-peak-m', nmPeakM.toExponential(2));
        this.updateStatElement('nm-total', nmTotal.toExponential(2));
        this.updateStatElement('nm-highmass', nmHighMass.toExponential(2));
    }

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

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
        if (document.getElementById('clustering-plot') || document.getElementById('clustering-plot-desktop')) {
            visualizerOne.updatePlot();
        }
    }, 250));
});
