import h5py
import json
import numpy as np

def convert_h5_to_json():
    """Convert H5 data to JSON format for web visualization"""
    
    # Read the H5 data
    with h5py.File('data.h5', 'r') as f:
        xi_data = f['xi'][:]
        param1 = f['param1'][:]
        param2 = f['param2'][:]
        param3 = f['param3'][:]
        param4 = f['param4'][:]
    
    # Create r values (separation scales) - typically logarithmic spacing
    r_values = np.logspace(-1, 2, 40)  # 0.1 to 100 Mpc/h
    
    # Prepare data structure for JSON
    web_data = {
        'parameters': {
            'param1': param1.tolist(),
            'param2': param2.tolist(),
            'param3': param3.tolist(),
            'param4': param4.tolist()
        },
        'r_values': r_values.tolist(),
        'xi_data': xi_data.tolist(),
        'metadata': {
            'description': 'Galaxy clustering correlation function ξ(r)',
            'dimensions': list(xi_data.shape),
            'r_unit': 'Mpc/h',
            'xi_description': 'Two-point correlation function'
        }
    }
    
    # Save to JSON file
    with open('data.json', 'w') as f:
        json.dump(web_data, f, indent=2)
    
    print("Data converted successfully to data.json")
    print(f"Data shape: {xi_data.shape}")
    print(f"Parameter ranges:")
    print(f"  param1: {param1.min()} - {param1.max()}")
    print(f"  param2: {param2.min()} - {param2.max()}")
    print(f"  param3: {param3.min()} - {param3.max()}")
    print(f"  param4: {param4.min()} - {param4.max()}")

if __name__ == "__main__":
    convert_h5_to_json()
