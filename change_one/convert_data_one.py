import h5py
import json
import numpy as np

def convert_h5_to_json_one():
    """Convert H5 data to JSON format for one-by-one parameter visualization"""
    
    # Read the H5 data
    with h5py.File('data_one.h5', 'r') as f:
        xi_data = f['xi'][:]
        nm_data = f['nm'][:]
        r_values = f['r_values'][:]
        m_values = f['m_values'][:]
        
        # Read parameter info
        param_info = {}
        for i in range(5):
            param_values = f[f'param{i}'][:]
            if f'param{i}_info' in f:
                grp = f[f'param{i}_info']
                param_info[i] = {
                    'name': grp.attrs['name'].decode('utf-8') if isinstance(grp.attrs['name'], bytes) else str(grp.attrs['name']),
                    'description': grp.attrs['description'].decode('utf-8') if isinstance(grp.attrs['description'], bytes) else str(grp.attrs['description']),
                    'range': [float(grp.attrs['range_min']), float(grp.attrs['range_max'])],
                    'values': param_values.tolist()
                }
    
    # Prepare data structure for JSON
    web_data = {
        'parameters': param_info,
        'r_values': r_values.tolist(),
        'm_values': m_values.tolist(),
        'xi_data': xi_data.tolist(),
        'nm_data': nm_data.tolist(),
        'metadata': {
            'description': 'Galaxy clustering and halo mass function - One parameter at a time',
            'xi_dimensions': list(xi_data.shape),
            'nm_dimensions': list(nm_data.shape),
            'r_unit': 'Mpc/h',
            'm_unit': 'M_sun',
            'xi_description': 'Two-point correlation function',
            'nm_description': 'Halo mass function',
            'data_type': 'one_by_one_parameters'
        }
    }
    
    # Save to JSON file
    with open('data_one.json', 'w') as f:
        json.dump(web_data, f, indent=2)
    
    print("Data converted successfully to data_one.json")
    print(f"ξ(r) data shape: {xi_data.shape}")
    print(f"n(M) data shape: {nm_data.shape}")
    print("Parameters:")
    for i, info in param_info.items():
        print(f"  {i}: {info['name']} - {info['description']}")

if __name__ == "__main__":
    convert_h5_to_json_one()
