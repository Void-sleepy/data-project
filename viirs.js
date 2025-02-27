// Define precise regions of interest using Earth Engine's boundary dataset
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017'); // Load simplified international boundaries dataset

// Extract boundaries for Egypt and Iraq
var egypt = countries.filter(ee.Filter.eq('country_na', 'Egypt')).geometry(); 
var iraq = countries.filter(ee.Filter.eq('country_na', 'Iraq')).geometry();

// Load a dataset for US states to extract California's boundary
var usStates = ee.FeatureCollection('TIGER/2018/States'); 
var california = usStates.filter(ee.Filter.eq('NAME', 'California')).geometry(); 

// Load the VIIRS dataset and filter for July 2023
var dataset = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG')
                  .filter(ee.Filter.date('2023-07-01', '2023-07-31'));


// Select the correct band for nighttime radiance
var nighttime = dataset.select('avg_rad').mean(); // Calculate the mean radiance from the 'avg_rad' band

// visualization parameters for the nighttime 
var nighttimeVis = {
  min: 0.0, 
  max: 60.0, 
  palette: ['black', 'blue', 'cyan', 'green', 'yellow', 'red'] // Color palette for visualization
};

// Set map center to visualization
Map.setCenter(30, 20, 3); 

// Clip nighttime radiance to the regions of interest
var egyptRadiance = nighttime.clip(egypt); 
var iraqRadiance = nighttime.clip(iraq); 
var californiaRadiance = nighttime.clip(california); 

// Add layers to the map for visualization 
Map.addLayer(egyptRadiance, nighttimeVis, 'Egypt Nighttime Radiance'); // Add Egypt radiance to the map same to Iraq & California
Map.addLayer(iraqRadiance, nighttimeVis, 'Iraq Nighttime Radiance'); 
Map.addLayer(californiaRadiance, nighttimeVis, 'California Nighttime Radiance'); 

// Export the data for each region to Google Drive
Export.image.toDrive({
  image: egyptRadiance, 
  description: 'Egypt_Nighttime_Radiance_Aug_Sep_2021', 
  scale: 500, 
  region: egypt, 
  fileFormat: 'GeoTIFF' 
});

Export.image.toDrive({
  image: iraqRadiance, 
  description: 'Iraq_Nighttime_Radiance_Aug_Sep_2021', 
  scale: 500, 
  region: iraq, 
  fileFormat: 'GeoTIFF' 
});

Export.image.toDrive({
  image: californiaRadiance, 
  description: 'California_Nighttime_Radiance_Aug_Sep_2021', 
  scale: 500, 
  region: california, 
  fileFormat: 'GeoTIFF' 
});
