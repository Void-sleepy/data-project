#include <opencv2/opencv.hpp>
#include <iostream>
#include <fstream>
#include <vector>
#include <string>

struct RasterData {
    std::string file;
    int id;
    double left, top, right, bottom;
    int row_index, col_index;
    double raster_value;
};

void processRaster(const std::string &rasterFile, std::vector<RasterData> &allData) {
    cv::Mat img = cv::imread(rasterFile, cv::IMREAD_UNCHANGED);
    if(img.empty()) {
        std::cerr << "Failed to open: " << rasterFile << std::endl;
        return;
    }

    // Simulating geotransform (you'll need to adjust these values)
    double pixelSize = 1.0;
    double originX = 0.0;
    double originY = img.rows * pixelSize;

    for(int row = 0; row < img.rows; ++row) {
        for(int col = 0; col < img.cols; ++col) {
            double value = img.at<float>(row, col);
            double left = originX + col * pixelSize;
            double top = originY - row * pixelSize;
            
            allData.push_back({
                rasterFile,
                row * img.cols + col + 1,
                left, top, left + pixelSize, top - pixelSize,
                row, col,
                value
            });
        }
    }
}

void writeCSV(const std::string &outputFile, const std::vector<RasterData> &allData) {
    std::ofstream csvFile(outputFile);
    if(!csvFile.is_open()) {
        std::cerr << "Failed to open: " << outputFile << std::endl;
        return;
    }

    csvFile << "file,id,left,top,right,bottom,row_index,col_index,raster_value\n";
    for(const auto &data : allData) {
        csvFile << data.file << "," << data.id << ","
                << data.left << "," << data.top << ","
                << data.right << "," << data.bottom << ","
                << data.row_index << "," << data.col_index << ","
                << data.raster_value << "\n";
    }
}

int main() {
    std::vector<std::string> rasterFiles = {
        "California_Nighttime_Radiance_Q3_2023_to_Q3_2024.tif",
        "Egypt_Nighttime_Radiance_Q3_2023_to_Q3_2024.tif",
        "Iraq_Nighttime_Radiance_Q3_2023_to_Q3_2024.tif"
    };

    std::string outputCSV = "C:\\cod\\data_analysisss\\final_output.csv";
    std::vector<RasterData> allData;

    for(const auto &file : rasterFiles) {
        std::cout << "Processing: " << file << std::endl;
        processRaster(file, allData);
    }

    writeCSV(outputCSV, allData);
    std::cout << "Saved to: " << outputCSV << std::endl;
    return 0;
}