# Photomap
A Leaflet map that reads data from Google Sheets.  

Created as an example for [GEOG 4046](https://geog4046.github.io).  

Each row in the sheet will appear as a marker on the map. When the marker is clicked, a popup will appear showing information about the location, taken from the columns of the spreadsheet.  

This script assumes the Google Sheet has the following columns. These match the attribute names used for the [Story Map Tour](https://www.arcgis.com/home/item.html?id=91d75e9b375e4e9b9b3a4004544bfadf) template in ArcGIS Online.  

Column name | Description
:-----------|--------------------------------------------------------------
name        | A short name for the location, to appear as the popup title |
description | A sentence or two describing the location in more detail    |
lat         | Latitude in decimal degrees                                 |
long        | Longitude in decimal degrees                                |
pic_url     | The URL to an image that will be displayed in the popup     |
