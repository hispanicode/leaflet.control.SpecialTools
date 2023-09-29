from osgeo import gdal

inp = "http://localhost/dedalo/media/image/1.5MB/0/rsc29_rsc170_103.jpg"
gt = gdal.Translate(inp, 'tif_out.tif')
#ds = gdal.Open(inp)
#gt = gdal.Translate(ds, '/var/www/html/dedalo/core/component_geolocation/leaflet.control.SpecialTools/external-php/output.tif', outputBounds = [-180, 90, 180, -90], outputSRS="EPSG:4326")
gt = None