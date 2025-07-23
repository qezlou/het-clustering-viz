import h5py
import json
import numpy as np

def convert_h5_to_json():
    """Convert H5 data to JSON format for web visualization"""
    
    # Read the H5 data
    with h5py.File('data.h5', 'r') as f:
        xi_data = f['xi'][:]
        nm_data = f['nm'][:]
        r_values = f['r_values'][:]
        m_values = f['m_values'][:]
        param1 = f['param1'][:]
        param2 = f['param2'][:]
        param3 = f['param3'][:]
        param4 = f['param4'][:]
    
    # Prepare data structure for JSON
    web_data = {
        'parameters': {
            'param1': param1.tolist(),
            'param2': param2.tolist(),
            'param3': param3.tolist(),
            'param4': param4.tolist()
        },
        'r_values': r_values.tolist(),
        'm_values': m_values.tolist(),
        'xi_data': xi_data.tolist(),
        'nm_data': nm_data.tolist(),
        'metadata': {
            'description': 'Galaxy clustering and halo mass function data',
            'xi_dimensions': list(xi_data.shape),
            'nm_dimensions': list(nm_data.shape),
            'r_unit': 'Mpc/h',
            'm_unit': 'M_sun',
            'xi_description': 'Two-point correlation function',
            'nm_description': 'Halo mass function'
        }
    }
    
    # Save to JSON file
    with open('data.json', 'w') as f:
        json.dump(web_data, f, indent=2)
    
    print("Data converted successfully to data.json")
    print(f"ξ(r) data shape: {xi_data.shape}")
    print(f"n(M) data shape: {nm_data.shape}")
    print(f"Parameter ranges:")
    print(f"  param1: {param1.min()} - {param1.max()}")
    print(f"  param2: {param2.min()} - {param2.max()}")
    print(f"  param3: {param3.min()} - {param3.max()}")
    print(f"  param4: {param4.min()} - {param4.max()}")
    print(f"r values: {len(r_values)} points from {r_values[0]:.2f} to {r_values[-1]:.1f} Mpc/h")
    print(f"M values: {len(m_values)} points from {m_values[0]:.1e} to {m_values[-1]:.1e} M_sun")

if __name__ == "__main__":
    convert_h5_to_json()
