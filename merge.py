import rasterio
import pandas as pd


with rasterio.open(r'California_Nighttime_Radiance_July_2023.tif') as src:
    
    band = src.read(1)  

 
    rows, cols = band.shape
    x_coords, y_coords = [], []
    
    for i in range(rows):
        for j in range(cols):
           
            lon, lat = src.xy(i, j)
            x_coords.append(lon)
            y_coords.append(lat)

    radiance = band.flatten()

    if len(x_coords) == len(radiance) and len(y_coords) == len(radiance):
        # Create a pandas DataFrame from the data
        data = {
            'longitude': x_coords,
            'latitude': y_coords,
            'radiance': radiance
        }

        df = pd.DataFrame(data)

        # Save the DataFrame to a CSV file
        df.to_csv('CF1_output.csv', index=False)
        print("Data successfully saved to 'CF1_output.csv'")
    else:
        print("Error: The lengths of the coordinates and data do not match.")