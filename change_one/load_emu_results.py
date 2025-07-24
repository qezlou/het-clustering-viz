import json
import numpy as np
import os

class CosmologyDataLoader:
    """
    Flexible data loader for cosmology sensitivity data.
    Handles current single-value format and future multi-value updates.
    """
    
    def __init__(self, data_dir="data"):
        self.data_dir = data_dir
        self.xi_data = None
        self.hmf_data = None
        self.parameters = {}
        self.parameter_labels = []
        self.parameter_ranges = {}
        
    def load_data(self):
        """Load both xi and HMF data from JSON files"""
        # File paths
        xi_file = os.path.join(self.data_dir, "xi_gg_cosmo_sensitivity_data.json")
        hmf_file = os.path.join(self.data_dir, "hmf_cosmo_sensitivity_data.json")
        
        # Load xi data
        if os.path.exists(xi_file):
            with open(xi_file, 'r') as f:
                self.xi_data = json.load(f)
            print(f"Loaded xi data from {xi_file}")
        else:
            raise FileNotFoundError(f"Xi data file not found: {xi_file}")
            
        # Load HMF data
        if os.path.exists(hmf_file):
            with open(hmf_file, 'r') as f:
                self.hmf_data = json.load(f)
            print(f"Loaded HMF data from {hmf_file}")
        else:
            raise FileNotFoundError(f"HMF data file not found: {hmf_file}")
            
        # Parse parameters
        self._parse_parameters()
        
    def _parse_parameters(self):
        """Parse parameter information from loaded data"""
        # Get parameter names from xi data (excluding special keys)
        special_keys = {'rvals', 'xi_ref_vals'}
        param_keys = [key for key in self.xi_data.keys() if key not in special_keys]
        
        print(f"Found parameters: {param_keys}")
        
        # Store parameter information
        for param_key in param_keys:
            param_data = self.xi_data[param_key]
            
            # Get parameter values (could be single value or list)
            param_vals = param_data['param_vals']
            if not isinstance(param_vals, list):
                param_vals = [param_vals]
                
            # Store parameter info
            self.parameters[param_key] = {
                'values': param_vals,
                'min': min(param_vals),
                'max': max(param_vals),
                'count': len(param_vals)
            }
            
        self.parameter_labels = list(self.parameters.keys())
        print(f"Processed {len(self.parameter_labels)} parameters")
        
    def get_parameter_display_name(self, param_latex):
        """Convert latex parameter name to display format"""
        # Handle common latex formats
        if param_latex.startswith('$') and param_latex.endswith('$'):
            param_latex = param_latex[1:-1]  # Remove $ signs
            
        return param_latex
        
    def get_parameter_value_formatted(self, param_key, value):
        """Format parameter value for display (1 decimal, scientific if needed)"""
        if abs(value) >= 1000 or (abs(value) < 0.01 and value != 0):
            return f"{value:.1e}"
        else:
            return f"{value:.1f}"
            
    def get_parameter_range_string(self, param_key):
        """Get formatted parameter range string"""
        param_info = self.parameters[param_key]
        min_val = self.get_parameter_value_formatted(param_key, param_info['min'])
        max_val = self.get_parameter_value_formatted(param_key, param_info['max'])
        
        # Clean parameter name for display
        clean_name = self.get_parameter_display_name(param_key)
        
        if param_info['count'] == 1:
            return f"{clean_name} = {min_val}"
        else:
            return f"{clean_name}: {min_val} - {max_val}"
            
    def get_xi_data(self, param_key, value_index=0):
        """Get xi correlation function data for a parameter and value index"""
        if self.xi_data is None:
            raise ValueError("Data not loaded. Call load_data() first.")
            
        param_data = self.xi_data[param_key]
        
        # Handle both single curve and multiple curves
        xi_vals = param_data['xi_vals']
        if isinstance(xi_vals[0], list):
            # Multiple curves - use value_index
            curve_index = min(value_index, len(xi_vals) - 1)
            return np.array(xi_vals[curve_index])
        else:
            # Single curve
            return np.array(xi_vals)
            
    def get_hmf_data(self, param_key, value_index=0):
        """Get HMF data for a parameter and value index"""
        if self.hmf_data is None:
            raise ValueError("Data not loaded. Call load_data() first.")
            
        param_data = self.hmf_data[param_key]
        
        # Handle both single curve and multiple curves
        hmf_vals = param_data['hmf_vals']
        if isinstance(hmf_vals[0], list):
            # Multiple curves - use value_index
            curve_index = min(value_index, len(hmf_vals) - 1)
            return np.array(hmf_vals[curve_index])
        else:
            # Single curve
            return np.array(hmf_vals)
            
    def get_reference_data(self):
        """Get reference/fiducial model data"""
        xi_ref = np.array(self.xi_data['xi_ref_vals'])
        hmf_ref = np.array(self.hmf_data['hmf_ref_vals'])
        r_vals = np.array(self.xi_data['rvals'])
        m_vals = np.array(self.hmf_data['logMh'])
        
        return {
            'xi_ref': xi_ref,
            'hmf_ref': hmf_ref,
            'r_vals': r_vals,
            'log_m_vals': m_vals
        }
        
    def convert_to_web_format(self, output_file="data_one.json"):
        """Convert loaded data to web-compatible format"""
        if self.xi_data is None or self.hmf_data is None:
            raise ValueError("Data not loaded. Call load_data() first.")
            
        # Get reference data
        ref_data = self.get_reference_data()
        
        # Create web format structure
        web_data = {
            'metadata': {
                'description': 'Cosmology sensitivity data for web visualization',
                'parameters': len(self.parameter_labels),
                'r_bins': len(ref_data['r_vals']),
                'm_bins': len(ref_data['log_m_vals'])
            },
            'r_values': ref_data['r_vals'].tolist(),
            'm_values': ref_data['log_m_vals'].tolist(),
            'parameters': []
        }
        
        # Add fiducial model as parameter 0
        web_data['parameters'].append({
            'name': 'Fiducial Model',
            'latex': 'Reference',
            'values': [0],
            'value_labels': ['Reference'],
            'range_string': 'Reference Model'
        })
        
        # Process each parameter
        xi_data_array = []
        nm_data_array = []
        
        # Add fiducial data first
        xi_data_array.append([ref_data['xi_ref'].tolist()])
        nm_data_array.append([ref_data['hmf_ref'].tolist()])
        
        # Add each parameter's data
        for param_key in self.parameter_labels:
            param_info = self.parameters[param_key]
            
            # Create parameter info for web
            param_web_info = {
                'name': self.get_parameter_display_name(param_key),
                'latex': param_key,
                'values': param_info['values'],
                'value_labels': [self.get_parameter_value_formatted(param_key, val) 
                               for val in param_info['values']],
                'range_string': self.get_parameter_range_string(param_key)
            }
            web_data['parameters'].append(param_web_info)
            
            # Get data for all values of this parameter
            xi_param_data = []
            nm_param_data = []
            
            for i in range(param_info['count']):
                xi_curve = self.get_xi_data(param_key, i)
                hmf_curve = self.get_hmf_data(param_key, i)
                
                xi_param_data.append(xi_curve.tolist())
                nm_param_data.append(hmf_curve.tolist())
                
            xi_data_array.append(xi_param_data)
            nm_data_array.append(nm_param_data)
            
        # Add data arrays to web format
        web_data['xi_data'] = xi_data_array
        web_data['nm_data'] = nm_data_array
        
        # Save to file
        with open(output_file, 'w') as f:
            json.dump(web_data, f, indent=2)
            
        print(f"Converted data saved to {output_file}")
        print(f"Parameters: {len(self.parameter_labels)}")
        print(f"R bins: {len(ref_data['r_vals'])}")
        print(f"M bins: {len(ref_data['log_m_vals'])}")
        
        return web_data

# Main execution
if __name__ == "__main__":
    # Initialize loader
    loader = CosmologyDataLoader()
    
    # Load data
    try:
        loader.load_data()
        
        # Print parameter information
        print("\n=== Parameter Information ===")
        for param_key in loader.parameter_labels:
            param_info = loader.parameters[param_key]
            range_str = loader.get_parameter_range_string(param_key)
            print(f"{range_str} ({param_info['count']} values)")
            
        # Convert to web format
        print("\n=== Converting to web format ===")
        web_data = loader.convert_to_web_format()
        
        print("\n=== Conversion complete ===")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
