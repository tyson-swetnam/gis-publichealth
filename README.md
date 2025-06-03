# gis-publichealth

Repository for GIS and public health data analysis and mapping.

## Purpose
This exercise downloads the snow dataset from the GeoDa Center and unpacks it for GIS and public health analysis.

## Data Source
Data available from GeoDa Center (https://geodacenter.github.io/data-and-lab/snow/) [1]

[1] GeoDa Center Data & Lab – Snow. https://geodacenter.github.io/data-and-lab/snow/. Accessed June 3, 2025.

## Setup

1. Clone this repository  
   ```bash
   git clone https://github.com/tyson-swetnam/gis-publichealth.git
   ```
2. Navigate into the project directory  
   ```bash
   cd gis-publichealth
   ```
3. (Optional) Create and activate a Python virtual environment  
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
4. Install dependencies (if any)  
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Add GIS scripts, data, and analysis notebooks under relevant directories.

Scrollytelling Map:  
To view the interactive Broad Street Pump narrative map:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000/public/index.html in your browser.

## Contributing

Contributions are welcome. Please open issues or submit pull requests.

## License

This project is available under the [LICENSE](LICENSE) file once added.
