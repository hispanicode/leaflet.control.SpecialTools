# leaflet.control.SpecialTools

<h3>Requisitos para su correcto funcionamiento:</h3>

<p><strong>Instalar Python3 y GDAL.</strong></p>

<pre>
    sudo apt install python3
    sudo apt install pip
    sudo apt install gdal-bin python3-gdal
    pip install GDAL
</pre>

<p><strong>Instalación de Imagick</strong></p>

<pre>

Ubuntu: Run apt-get install php-imagick and restart your webserver.

Debian: Run apt-get install php-imagick and restart your webserver.

Centos: Run yum install php-imagick and restart your webserver.

</pre>

<p>
El archivo <strong>component_geolocation.js</strong> se adjunta entre los archivos para que se pueda ver las partes modificadas. Se puede buscar a través del archivo con el siguiente texto <i>/* SPECIALTOOLS</i>
</p>

<p>
La carpeta leaflet.control.SpecialTools la he incluido en la raíz de la carpeta "component_geolocation", aunque se podría incluir en otro lugar, siempre y cuando se indique en la opción "route" la raíz de "leaflet.control.SpecialTools".
</p>


<img src='https://raw.githubusercontent.com/hispanicode/leaflet.control.SpecialTools/main/ruta.png'>

<p>leaflet.control.SpecialToolsLegend: de momento se encuentra detenido. Por si véis que no hace nada :)</p>

<p style='color: red'>* Punto importante. Las urls de los mapas base deben incluir https o es posible que al realizar la petición a determinados servidores para imprimir el mapa, caso de Arcgis, por ejemplo, devuelva un error CORS. http es inseguro.</p>







