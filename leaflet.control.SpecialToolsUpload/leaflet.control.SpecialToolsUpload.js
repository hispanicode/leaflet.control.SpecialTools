
/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */

L.Control.SpecialToolsUpload = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-upload special-tools-controls special-tools-disable');

        this.modal = null;
        
        _this = this;

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsUpload/lang/lang.json')
        .then(function(response){
            
            return response.json();
            
        }).then(function(data){
            
            json_lang = data;
            
        });

        L.DomEvent.addListener(controlDiv, 'click', function(){
            
            L.DomUtil.addClass(controlDiv, 'special-tools-enable');
            L.DomUtil.removeClass(controlDiv, 'special-tools-disable');
            
            let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');

            try {
                special_tools.only_one_control_active(elements_controls, controlDiv);
            } catch (e) {};
            
            content = "<div class='special-tools-container'>";
            content = "<h3>" + special_tools._T("Capas Vectoriales", json_lang, lang) + "</h3>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + special_tools._T("Seleccione el tipo de archivo: ", json_lang, lang) + "<select id='file_type'>";
            content = content + "<option value='shape' selected>Shape (*.zip)</option>";
            content = content + "<option value='geojson'>(*.geojson)</option>";
            content = content + "<option value='kml'>(*.kml)</option>";
            content = content + "</select>";
            content = content + "<div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + special_tools._T(" Seleccione el archivo: ", json_lang, lang) + "<input type='file' name='vector_upload' id='vector_upload'>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<button type='button' id='btn_vector_upload' class='special-tools-btn-default'>" + special_tools._T("Subir archivo", json_lang, lang) + "</button>";
            content = content + " <button type='button' id='btn_list_projections' class='special-tools-btn-info' style='font-size: 9px'>" + special_tools._T("Proyecciones por defecto", json_lang, lang) + "</button>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + special_tools._T("Incluir proyección para UTM (Universal Transverse Mercator) en el caso de que no se encuentre entre las proyecciones por defecto (Asegúrese de que el archivo que va a subir viene proyectado. Ejemplo: ", json_lang, lang) + "<i>urn:ogc:def:crs:EPSG::32619</i>):";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "EPSG: <input type='text' style='width: 150px;' id='project_crs' placeholder='32619'>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "zone: <input type='text' style='width: 50px;' id='project_zone' placeholder='19'>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "band: <input type='text' style='width: 50px;' id='project_band' placeholder='N'>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<a href='https://epsg.io/' target='_blank' id='link_epsg_io'>https://epsg.io/</a>";
            content = content + "</div>";

            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='list_projections' class='special-tools-display-none'><p>" + special_tools._T("A continuación se listan las proyecciones por defecto: (Asegúrese de que el archivo que va a subir viene proyectado. Ejemplo: ", json_lang, lang) + "<i>urn:ogc:def:crs:EPSG::4326</i>)</p><p>EPSG:4230 EPSG:4326 EPSG:4258 EPSG:3857 EPSG:32628 EPSG:32629 EPSG:32630 EPSG:32631 EPSG:25828 EPSG:25829 EPSG:25830 EPSG:25831 EPSG:23028 EPSG:23029 EPSG:23030 EPSG:23031 EPSG:4082 EPSG:4083</p></div>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='vector_upload_msg'></div>";
            content = content + "</div>",
            
            content = content + "<hr>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<h3>" + special_tools._T("Imágenes", json_lang, lang) + "</h3>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<button type='button' id='btn_image_upload' class='special-tools-btn-default'>" + special_tools._T("Subir imagen", json_lang, lang) + "</button>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<button type='button' id='btn_get_image_upload' class='special-tools-btn-success special-tools-visibility-hide'>" + special_tools._T("Obtener la imagen", json_lang, lang) + "</button>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<button type='button' id='btn_add_image_to_map' class='special-tools-btn-success special-tools-visibility-hide'>" + special_tools._T("Añadir la imagen al mapa", json_lang, lang) + "</button>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='image_upload_msg'></div>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='box_image_config' class='special-tools-visibility-hide special-tools-text-info'>";
            content = content + "<div id='box_image_msg'></div>";
            content = content + "<div><img src='' id='image_preview' style='width:100%; padding: 8px;' class='special-tools-visibility-hide'></div>";
            content = content + "</div>";
            content = content + "</div>";
            
            map.fire('modal', {

                title: special_tools._T("Subir archivos", json_lang, lang),
                content: content,
                template: ['<div class="modal-header"><h2>{title}</h2></div>',
                  '<hr>',
                  '<div class="modal-body">{content}</div>',
                  '<div class="modal-footer">',
                  '</div>'
                ].join(''),

                width: 'auto',

                onShow: function(evt) {

                    
                    var modal = evt.modal;
                    
                    _this.modal = modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";

                    btn_list_projections = modal._container.querySelector('#btn_list_projections');
                    list_projections = modal._container.querySelector('#list_projections');

                    L.DomEvent.on(btn_list_projections, 'click', function(){
                        
                        if (L.DomUtil.hasClass(list_projections, 'special-tools-display-none')) {
                            
                            L.DomUtil.removeClass(list_projections, 'special-tools-display-none');
                            L.DomUtil.addClass(list_projections, 'special-tools-display-block');
                        
                        } else {
                            
                            L.DomUtil.removeClass(list_projections, 'special-tools-display-block');
                            L.DomUtil.addClass(list_projections, 'special-tools-display-none');
                        }
                        
                    });
                    
                    project_crs = modal._container.querySelector('#project_crs');
                    
                    link_epsg_io = modal._container.querySelector('#link_epsg_io');
                    
                    L.DomEvent.on(project_crs, 'keyup', function(){

                        link_epsg_io.href = 'https://epsg.io/' + this.value;
                        link_epsg_io.innerText = 'https://epsg.io/' + this.value;

                    });

                    L.DomEvent.on(modal._container.querySelector('#btn_vector_upload'), 'click', function() {
                        
                        EPSG = {
                            
                            "EPSG_4230": {crs: "urn:ogc:def:crs:EPSG::4230", zone: null, band: null},
                            "EPSG_4326": {crs: "urn:ogc:def:crs:EPSG::4326", zone: null, band: null},
                            "EPSG_4258": {crs: "urn:ogc:def:crs:EPSG::4258", zone: null, band: null},
                            "EPSG_3857": {crs: "urn:ogc:def:crs:EPSG::3857", zone: null, band: null},
                            "EPSG_32628": {crs: "urn:ogc:def:crs:EPSG::32628", zone: 28, band: "N"},
                            "EPSG_32629": {crs: "urn:ogc:def:crs:EPSG::32629", zone: 29, band: "N"},
                            "EPSG_32630": {crs: "urn:ogc:def:crs:EPSG::32630", zone: 30, band: "N"},
                            "EPSG_32631": {crs: "urn:ogc:def:crs:EPSG::32631", zone: 31, band: "N"},
                            "EPSG_25828": {crs: "urn:ogc:def:crs:EPSG::25828", zone: 28, band: "N"},
                            "EPSG_25829": {crs: "urn:ogc:def:crs:EPSG::25829", zone: 29, band: "N"},
                            "EPSG_25830": {crs: "urn:ogc:def:crs:EPSG::25830", zone: 30, band: "N"},
                            "EPSG_25831": {crs: "urn:ogc:def:crs:EPSG::25831", zone: 31, band: "N"},
                            "EPSG_23028": {crs: "urn:ogc:def:crs:EPSG::23028", zone: 28, band: "N"},
                            "EPSG_23029": {crs: "urn:ogc:def:crs:EPSG::23029", zone: 29, band: "N"},
                            "EPSG_23030": {crs: "urn:ogc:def:crs:EPSG::23030", zone: 30, band: "N"},
                            "EPSG_23031": {crs: "urn:ogc:def:crs:EPSG::23031", zone: 31, band: "N"},
                            "EPSG_4082": {crs: "urn:ogc:def:crs:EPSG::4082", zone: 27, band: "N"},
                            "EPSG_4083": {crs: "urn:ogc:def:crs:EPSG::4083", zone: 28, band: "N"}

                        };
                        
                        project_crs = modal._container.querySelector('#project_crs');
                        project_zone = modal._container.querySelector('#project_zone');
                        project_band = modal._container.querySelector('#project_band');

                        if (project_crs.value !== '' && project_zone.value !== '' && project_band.value !== '') {
  
                            EPSG['EPSG_NEW'] = {
                                
                                crs: 'urn:ogc:def:crs:EPSG::'+project_crs.value,
                                zone: parseInt(project_zone.value),
                                band: project_band.value
                                
                            };
                            
                        }

                        file_type = modal._container.querySelector('#file_type');
                        
                        selected_file = file_type.options[file_type.selectedIndex].value;
                        
                        vector_upload = modal._container.querySelector('#vector_upload');
                        
                        vector_upload_msg = modal._container.querySelector('#vector_upload_msg');
                        
                        if (typeof vector_upload.files[0] === 'undefined') {
                            
                            vector_upload_msg.innerHTML = "No se ha seleccionado ningún archivo";
                            L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                            
                            return;
                            
                        }
                        
                        if (selected_file === 'shape') {
                            
                            if (vector_upload.files[0].type !== 'application/zip') {
                                
                                vector_upload_msg.innerHTML = special_tools._T("El archivo shape tiene que ir comprimido en un archivo .zip", json_lang, lang);
                                L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                
                                return;
                                
                            }
                            
                        }
                        
                        if (selected_file === 'geojson') {
                            
                            if (vector_upload.files[0].type !== 'application/geo+json') {
                                
                                vector_upload_msg.innerHTML = special_tools._T("El archivo que estás intentando subir no es un archivo .geojson", json_lang, lang);
                                L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                
                                return;
                                
                            }
                            
                        }
                        
                        if (selected_file === 'kml') {
                            
                            if (vector_upload.files[0].type !== 'application/vnd.google-earth.kml+xml') {
                                
                                vector_upload_msg.innerHTML = special_tools._T("El archivo que estás intentando subir no es un archivo .kml", json_lang, lang);
                                L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                
                                return;
                                
                            }
                            
                        }
                        
                        if (vector_upload.files.length === 1) {
                            
                            formData = new FormData();
                            formData.append("file_type", selected_file);
                            formData.append("file_upload", vector_upload.files[0]);
                            formData.append("route", route);
                            
                        } else {
                            
                            vector_upload_msg.innerHTML = special_tools._T("Por favor, seleccione un archivo", json_lang, lang);
                            L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                            
                            return;
                            
                        }
                        
                        url = route+'/ajax/uploads/vector-upload.php';
                        
                        fetch(url, {
                          method: "POST", 
                          body: formData
                          
                        }).then(function(response) {
                            
                            return response.text();
                            
                        }).then(function(data){
                            
                            data = JSON.parse(data);
                            
                            if (data.hasOwnProperty('error')) {

                                vector_upload_msg.innerHTML = data.error;
                                L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                
                                return;
                                
                            }
                            
                            if (data.type === 'shape') {
                                
                                try {
                                
                                shpfile = new L.Shapefile(
                                    route+'/ajax/uploads/'+data.path, 
                                    {
                                        importUrl: route+'/external-js/leaflet.shapefile/shp.js'
                                    }
                                );
                            
                                } catch(e) {
                                    
                                    vector_upload_msg.innerHTML = special_tools._T("El archivo shape no es válido", json_lang, lang);
                                    L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                    
                                    return;
                                    
                                }
                            
                                is_valid_shape = false;
                                
                                shpfile.once("data:loaded", function() {
                                    
                                    is_valid_shape = true;

                                    GEOJSON = shpfile.toGeoJSON();

                                    OBJECTS_GEOJSON = new Array();

                                    if (GEOJSON.hasOwnProperty('features')) {

                                        for (let feature in GEOJSON.features) {

                                            if (GEOJSON.hasOwnProperty("crs")) {
                                                
                                                GEOJSON.features[feature].crs = GEOJSON.crs;
                                                
                                            }

                                            if (GEOJSON.features[feature].geometry.type === 'Polygon') {
                                                
                                                polygon = project_polygon(GEOJSON.features[feature], EPSG);
                                                
                                                OBJECTS_GEOJSON.push(polygon);
                                                
                                            } else if (GEOJSON.features[feature].geometry.type === 'MultiPolygon') {
                                                
                                                multipolygon = project_multipolygon(GEOJSON.features[feature], EPSG);
                                                
                                                OBJECTS_GEOJSON.push(multipolygon);
                                                
                                            } else if (GEOJSON.features[feature].geometry.type === 'LineString') {
                                                
                                                linestring = project_linestring(GEOJSON.features[feature], EPSG);
                                                
                                                OBJECTS_GEOJSON.push(linestring);
                                                
                                            } else if (GEOJSON.features[feature].geometry.type === 'MultiLineString') {
                                                
                                                multilinestring = project_multilinestring(GEOJSON.features[feature], EPSG);
                                                
                                                OBJECTS_GEOJSON.push(multilinestring);
                                                
                                            } else if (GEOJSON.features[feature].geometry.type === 'Point') {
                                                
                                                point = project_point(GEOJSON.features[feature], EPSG);
                                                
                                                OBJECTS_GEOJSON.push(point);
                                                
                                            } else if (GEOJSON.features[feature].geometry.type === 'MultiPoint') {
                                                
                                                multipoint = project_multipoint(GEOJSON.features[feature], EPSG);
                                                
                                                OBJECTS_GEOJSON.push(multipoint);
                                                
                                            }
                                        }
                                        
                                    } else if (GEOJSON.geometry.type === "Polygon") {
                                        
                                        polygon = project_polygon(GEOJSON, EPSG);
                                        
                                        OBJECTS_GEOJSON.push(polygon);
                                        
                                    } else if (GEOJSON.geometry.type === "MultiPolygon") {
                                        
                                        multipolygon = project_multipolygon(GEOJSON, EPSG);
                                        
                                        OBJECTS_GEOJSON.push(multipolygon);
                                        
                                    } else if (GEOJSON.geometry.type === "LineString") {
                                        
                                        linestring = project_linestring(GEOJSON, EPSG);
                                        
                                        OBJECTS_GEOJSON.push(linestring);
                                        
                                    } else if (GEOJSON.geometry.type === "MultiLineString") {
                                        
                                        multilinestring = project_multilinestring(GEOJSON, EPSG);
                                        
                                        OBJECTS_GEOJSON.push(multilinestring);
                                        
                                    } else if (GEOJSON.geometry.type === "Point") {
                                        
                                        point = project_point(GEOJSON, EPSG);
                                        OBJECTS_GEOJSON.push(point);
                                        
                                    } else if (GEOJSON.geometry.type === "MultiPoint") {
                                        
                                        multipoint = project_multipoint(GEOJSON, EPSG);
                                        OBJECTS_GEOJSON.push(multipoint);
                                        
                                    }

                                    for (let index in OBJECTS_GEOJSON) {
                                        
                                        max_fit = 1;
                                        
                                        for (let obj in OBJECTS_GEOJSON[index]) {

                                            window.setTimeout(function(){
                                                
                                                map.fire("pm:create", {layer: OBJECTS_GEOJSON[index][obj]});
                                                
                                            }, 100);

                                            if (max_fit === 1) {
                                            
                                                if (special_tools.is_point(OBJECTS_GEOJSON[index][obj])) {

                                                   map.panTo(OBJECTS_GEOJSON[index][obj].getLatLng()); 

                                                } else if (
                                                    special_tools.is_linestring(OBJECTS_GEOJSON[index][obj])
                                                    || special_tools.is_polygon(OBJECTS_GEOJSON[index][obj])
                                                    ) {

                                                    map.fitBounds(OBJECTS_GEOJSON[index][obj].getBounds());

                                                }
                                                max_fit = 0;
                                            }
                                        }
                                    }

                                    modal._container.querySelector('.close').click();
                                    
                                    return;

                                });
                                window.setTimeout(function(){
                                    
                                    if (!is_valid_shape) {
                                        
                                        vector_upload_msg.innerHTML = special_tools._T("El archivo .zip está dañado o no contiene los ficheros adecuados.", json_lang, lang);
                                        
                                        L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                    
                                    }
                                    
                                }, 1500);
                            } 
                            
                            else if (data.type === 'geojson') {
                                
                                GEOJSON = data.geojson;
                                
                                if (GEOJSON.hasOwnProperty('feature') && GEOJSON.hasOwnProperty('features')) {
                                    
                                    vector_upload_msg.innerHTML = special_tools._T("El archivo .geojson no es válido", json_lang, lang);
                                    
                                    L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                    
                                    return;
                                }

                                OBJECTS_GEOJSON = new Array();

                                if (GEOJSON.hasOwnProperty('features')) {
                                    
                                    for (let feature in GEOJSON.features) {
                                        
                                        if (GEOJSON.hasOwnProperty("crs")) {
                                            
                                            GEOJSON.features[feature].crs = GEOJSON.crs;
                                            
                                        }
                                        
                                        if (GEOJSON.features[feature].geometry.type === 'Polygon') {
                                            
                                            polygon = project_polygon(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(polygon);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'MultiPolygon') {
                                            
                                            multipolygon = project_multipolygon(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(multipolygon);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'LineString') {
                                            
                                            linestring = project_linestring(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(linestring);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'MultiLineString') {
                                            
                                            multilinestring = project_multilinestring(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(multilinestring);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'Point') {
                                            
                                            point = project_point(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(point);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'MultiPoint') {
                                            
                                            multipoint = project_multipoint(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(multipoint);
                                            
                                        }
                                    }
                                } else if (GEOJSON.geometry.type === "Polygon") {
                                    
                                    polygon = project_polygon(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(polygon);
                                    
                                } else if (GEOJSON.geometry.type === "MultiPolygon") {
                                    
                                    multipolygon = project_multipolygon(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(multipolygon);
                                    
                                } else if (GEOJSON.geometry.type === "LineString") {
                                    
                                    linestring = project_linestring(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(linestring);
                                    
                                } else if (GEOJSON.geometry.type === "MultiLineString") {
                                    
                                    multilinestring = project_multilinestring(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(multilinestring);
                                    
                                } else if (GEOJSON.geometry.type === "Point") {
                                    
                                    point = project_point(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(point);
                                    
                                } else if (GEOJSON.geometry.type === "MultiPoint") {
                                    
                                    multipoint = project_multipoint(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(multipoint);
                                    
                                }

                                for (let index in OBJECTS_GEOJSON) {

                                    max_fit = 1;

                                    for (let obj in OBJECTS_GEOJSON[index]) {

                                        window.setTimeout(function(){

                                            map.fire("pm:create", {layer: OBJECTS_GEOJSON[index][obj]});

                                        }, 100);

                                        if (max_fit === 1) {

                                            if (special_tools.is_point(OBJECTS_GEOJSON[index][obj])) {

                                               map.panTo(OBJECTS_GEOJSON[index][obj].getLatLng()); 

                                            } else if (
                                                special_tools.is_linestring(OBJECTS_GEOJSON[index][obj])
                                                || special_tools.is_polygon(OBJECTS_GEOJSON[index][obj])
                                                ) {

                                                map.fitBounds(OBJECTS_GEOJSON[index][obj].getBounds());

                                            }
                                            max_fit = 0;
                                        }
                                    }
                                }

                                modal._container.querySelector('.close').click();
                                
                                return;
                                
                            } else if (data.type === 'kml') {
                                
                                const parser = new DOMParser();

                                try {
                                    
                                    kml = parser.parseFromString(data.kml, 'text/xml');
                                    
                                } catch(e) {
                                    
                                    vector_upload_msg.innerHTML = special_tools._T("El archivo .kml no es válido", json_lang, lang);
                                    
                                    L.DomUtil.addClass(vector_upload_msg, 'special-tools-msg-error');
                                    
                                    return;
                                    
                                }

                                const track = new L.KML(kml);

                                GEOJSON = track.toGeoJSON();

                                OBJECTS_GEOJSON = new Array();

                                if (GEOJSON.hasOwnProperty('features')) {
                                    
                                    for (let feature in GEOJSON.features) {
                                        
                                        if (GEOJSON.hasOwnProperty("crs")) {
                                            
                                            GEOJSON.features[feature].crs = GEOJSON.crs;
                                            
                                        }
                                        
                                        if (GEOJSON.features[feature].geometry.type === 'Polygon') {
                                            
                                            polygon = project_polygon(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(polygon);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'MultiPolygon') {
                                            
                                            multipolygon = project_multipolygon(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(multipolygon);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'LineString') {
                                            
                                            linestring = project_linestring(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(linestring);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'MultiLineString') {
                                            
                                            multilinestring = project_multilinestring(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(multilinestring);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'Point') {
                                            
                                            point = project_point(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(point);
                                            
                                        } else if (GEOJSON.features[feature].geometry.type === 'MultiPoint') {
                                            
                                            multipoint = project_multipoint(GEOJSON.features[feature], EPSG);
                                            
                                            OBJECTS_GEOJSON.push(multipoint);
                                        }
                                    }
                                } else if (GEOJSON.geometry.type === "Polygon") {
                                    
                                    polygon = project_polygon(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(polygon);
                                    
                                } else if (GEOJSON.geometry.type === "MultiPolygon") {
                                    
                                    multipolygon = project_multipolygon(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(multipolygon);
                                    
                                } else if (GEOJSON.geometry.type === "LineString") {
                                    
                                    linestring = project_linestring(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(linestring);
                                    
                                } else if (GEOJSON.geometry.type === "MultiLineString") {
                                    
                                    multilinestring = project_multilinestring(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(multilinestring);
                                    
                                } else if (GEOJSON.geometry.type === "Point") {
                                    
                                    point = project_point(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(point);
                                    
                                } else if (GEOJSON.geometry.type === "MultiPoint") {
                                    
                                    multipoint = project_multipoint(GEOJSON, EPSG);
                                    
                                    OBJECTS_GEOJSON.push(multipoint);
                                    
                                }

                                for (let index in OBJECTS_GEOJSON) {

                                    max_fit = 1;

                                    for (let obj in OBJECTS_GEOJSON[index]) {

                                            window.setTimeout(function(){
                                                
                                                map.fire("pm:create", {layer: OBJECTS_GEOJSON[index][obj]});
                                                
                                            }, 100);

                                        if (max_fit === 1) {

                                            if (special_tools.is_point(OBJECTS_GEOJSON[index][obj])) {

                                               map.panTo(OBJECTS_GEOJSON[index][obj].getLatLng()); 

                                            } else if (
                                                special_tools.is_linestring(OBJECTS_GEOJSON[index][obj])
                                                || special_tools.is_polygon(OBJECTS_GEOJSON[index][obj])
                                                ) {

                                                map.fitBounds(OBJECTS_GEOJSON[index][obj].getBounds());

                                            }
                                            max_fit = 0;
                                        }
                                    }
                                }

                                modal._container.querySelector('.close').click();
                                
                                return;
                                
                            } 
                        });
                    });

                    L.DomEvent.on(modal._container.querySelector('#btn_image_upload'), 'click', function() {
                        
                        btn_get_image_upload = modal._container.querySelector("#btn_get_image_upload");
                        
                        window.setTimeout(function(){
                            
                            L.DomUtil.removeClass(btn_get_image_upload, 'special-tools-visibility-hide');
                            L.DomUtil.addClass(btn_get_image_upload, 'special-tools-visibility-visible');  
                        
                        }, 8000);

                        btn_add_image_to_map = modal._container.querySelector("#btn_add_image_to_map");
                        box_image_config = modal._container.querySelector('#box_image_config');
                        box_image_msg = modal._container.querySelector('#box_image_msg');
                        image_preview = modal._container.querySelector('#image_preview');
                        
                        image_upload_msg = modal._container.querySelector('#image_upload_msg');

                        L.DomUtil.removeClass(btn_get_image_upload, 'special-tools-visibility-visible');
                        L.DomUtil.addClass(btn_get_image_upload, 'special-tools-visibility-hide');
                        L.DomUtil.removeClass(btn_add_image_to_map, 'special-tools-visibility-visible');
                        L.DomUtil.addClass(btn_add_image_to_map, 'special-tools-visibility-hide');
                        L.DomUtil.removeClass(box_image_config, 'special-tools-visibility-visible');
                        L.DomUtil.addClass(box_image_config, 'special-tools-visibility-hide');
                        L.DomUtil.removeClass(image_preview, 'special-tools-visibility-visible');
                        L.DomUtil.addClass(image_preview, 'special-tools-visibility-hide');


                        if (server) {
                            
                            let to_stored_image_data = component_geolocation.get_upload_tool();

                            to_stored_image_data
                            .then(function(val){

                                stored_image_data_item = val;

                                L.DomEvent.on(btn_get_image_upload, 'click', function(){
                                    
                                    get_image_upload = component_geolocation.get_image_upload(stored_image_data_item);
                                    
                                    get_image_upload.then(function(url) {

                                        if (url === null) {

                                            image_upload_msg.innerHTML = special_tools._T("Previamente debes subir la imagen", json_lang, lang);
                                            L.DomUtil.addClass(image_upload_msg, 'special-tools-msg-error');
                                            
                                            L.DomUtil.removeClass(btn_get_image_upload, 'special-tools-visibility-visible');
                                            L.DomUtil.addClass(btn_get_image_upload, 'special-tools-visibility-hide');
                                            L.DomUtil.removeClass(btn_add_image_to_map, 'special-tools-visibility-visible');
                                            L.DomUtil.addClass(btn_add_image_to_map, 'special-tools-visibility-hide');
                                            L.DomUtil.removeClass(box_image_config, 'special-tools-visibility-visible');
                                            L.DomUtil.addClass(box_image_config, 'special-tools-visibility-hide');
                                            
                                        } else {


                                            L.DomUtil.removeClass(btn_add_image_to_map, 'special-tools-visibility-hide');
                                            L.DomUtil.addClass(btn_add_image_to_map, 'special-tools-visibility-visible');
                                            L.DomUtil.removeClass(box_image_config, 'special-tools-visibility-hide');
                                            L.DomUtil.addClass(box_image_config, 'special-tools-visibility-visible');

                                            image_preview.src = url;

                                            if (url.substr(url.length - 4) === '.tif') {
                                                
                                                box_image_msg.innerHTML = '<p>' + special_tools._T("La imagen: ", json_lang, lang) + url + special_tools._T(" tiene el formato ", json_lang, lang) + '<strong>.tif</strong></p><p>' + special_tools._T("Asegúrese de que la imagen está georrefenciada", json_lang, lang) + '</p>';
                                                image_preview.style.display = 'none';
                                                L.DomUtil.removeClass(image_preview, 'special-tools-visibility-visible');
                                                L.DomUtil.addClass(image_preview, 'special-tools-visibility-hide');

                                            } else {
                                                
                                                box_image_msg.innerHTML = special_tools._T("La imagen se ajustará al contexto actual del mapa", json_lang, lang);
                                                image_preview.style.display = 'block';
                                                L.DomUtil.addClass(image_preview, 'special-tools-visibility-visible');
                                                L.DomUtil.removeClass(image_preview, 'special-tools-visibility-hide');
                                            
                                            }

                                        } 

                                    });
                                });
                            });
                        } else { //client
                            
                        }
                        
                    });
                    
                    
                    L.DomEvent.on(modal._container.querySelector("#btn_add_image_to_map"), 'click', function(){
                        
                        
                        btn_get_image_upload = modal._container.querySelector("#btn_get_image_upload");
                        btn_add_image_to_map = modal._container.querySelector("#btn_add_image_to_map");
                        box_image_config = modal._container.querySelector('#box_image_config');
                        box_image_msg = modal._container.querySelector('#box_image_msg');

                        image_preview = modal._container.querySelector('#image_preview');
                        
                        url = image_preview.src;
                        
                        var chars_download = new Array('|', '\\', '_', '/');

                        var i_char = 0;

                        
                        function _while_download() {

                            if (i_char > chars_download.length-1) i_char = 0;

                            btn_add_image_to_map.innerHTML = special_tools._T("Cargando ... ", json_lang, lang) + chars_download[i_char];

                            i_char++;
                        }
                        

                        timer = window.setInterval(_while_download, 1000);
                        
                        
                        if (url.substr(url.length - 4) === '.tif') {
                            
                            fetch(url)
                            
                                .then(response => {
                                    
                                    return response.arrayBuffer();

                                })
                                .then(parseGeoraster)
                                .then(georaster => {
                                   
                                    var _layer = new GeoRasterLayer({
                                        georaster: georaster
                                    });
                                    
                                    try {
                                        
                                        point1 = _layer.getBounds().getNorthWest();
                                        point2 = _layer.getBounds().getNorthEast();
                                        point3 = _layer.getBounds().getSouthWest();
                                        
                                    } catch(e) {
                                        
                                        image_upload_msg.innerHTML = special_tools._T("La imagen .tif no es válida o no está georreferenciada", json_lang, lang);
                                        L.DomUtil.addClass(image_upload_msg, 'special-tools-msg-error');
                                        
                                        return;
                                        
                                    }

                                    formData = new FormData();
                                    formData.append("url", url);
                                    formData.append("route", route);
                                    
                                    _url = route+'/ajax/uploads/geotiff-to-png.php';
                                    
                                    fetch(_url, {
                                        
                                      method: "POST", 
                                      body: formData

                                    }).then(function(response) {
                                        
                                            return response.text();
                                            
                                    }).then(function(data) {
                                        
                                            url = data;
                                            
                                            http = new XMLHttpRequest();
                                            http.open('HEAD', url, false);
                                            http.send();
                                            
                                            if (http.status === 404) {
                                                
                                                url = null;
                                                
                                            }
                                            
                                    });

                            });

                            
                        } else {
                            
                            point1 = map.getBounds().getNorthWest();
                            point2 = map.getBounds().getNorthEast();
                            point3 = map.getBounds().getSouthWest();
                            
                        }
                        
                        window.setTimeout(function() {
                            
                        if (url === null) {
                            
                            image_upload_msg.innerHTML = special_tools._T("Ha ocurrido un error inesperado", json_lang, lang);
                            L.DomUtil.addClass(image_upload_msg, 'special-tools-msg-error');
                            
                            return;
                        }

                        const overlay = L.imageOverlay.rotated(url, point1, point2, point3, {
                                
                                opacity: 1,
                                interactive: true
                                
                        });

                        const image_id = special_tools.make_id(20);

                        overlay.addTo(map);

                        bounds_of_image = overlay.getBounds();

                        const clip_polygon = L.rectangle(bounds_of_image, {opacity: 0, color: 'none'});
                        
                        overlay.removeFrom(map);
                        
                        clip_polygon.feature = clip_polygon.toGeoJSON();
                        clip_polygon.feature.properties.images = stored_image_data_item;
                        clip_polygon.feature.special_tools = {};
                        clip_polygon.feature.special_tools.is_clipPolygon = true;
                        clip_polygon.feature.special_tools.clipPolygon_image = url;
                        clip_polygon.feature.special_tools.image_id = image_id;
                        clip_polygon.feature.special_tools.imageOpacity = 1;
                        clip_polygon.feature.special_tools.imageInteractive = true;
                        clip_polygon.feature.special_tools.image_zIndex = 200;
                        clip_polygon.feature.special_tools.point1 = point1;
                        clip_polygon.feature.special_tools.point2 = point2;
                        clip_polygon.feature.special_tools.point3 = point3;
                        clip_polygon.feature.special_tools.geoman_edition = false;

                        map.fire('pm:create', {layer: clip_polygon});

                        map.fitBounds(bounds_of_image);
                        
                        window.clearInterval(timer);
                        L.DomUtil.remove(btn_get_image_upload);
                        L.DomUtil.remove(btn_add_image_to_map);
                        L.DomUtil.remove(box_image_config);
                        L.DomUtil.remove(box_image_msg);
                        L.DomUtil.remove(image_preview);
                        modal._container.querySelector('.close').click();
                        
                        }, 5000);
                        
                    });
                },
                
                onHide: function(){
                    
                    L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                    L.DomUtil.removeClass(controlDiv, 'special-tools-enable');
                    
                    btn_get_image_upload = _this.modal._container.querySelector("#btn_get_image_upload");
                    btn_add_image_to_map = _this.modal._container.querySelector("#btn_add_image_to_map");
                    box_image_config = _this.modal._container.querySelector('#box_image_config');
                    box_image_msg = _this.modal._container.querySelector('#box_image_msg');
                    image_preview = _this.modal._container.querySelector('#image_preview');
                    
                    try {
                        L.DomUtil.remove(btn_get_image_upload);
                        L.DomUtil.remove(btn_add_image_to_map);
                        L.DomUtil.remove(box_image_config);
                        L.DomUtil.remove(box_image_msg);
                        L.DomUtil.remove(image_preview);
                    } catch (e) {/*Nothing*/}

                }
                
            });
        });
               
        false_div = L.DomUtil.create('div');
        
        return false_div;
        
    }
});

L.control.specialToolsUpload = function (options) {
    
    return new L.Control.SpecialToolsUpload(options);
    
};