/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsRomanEmpire = L.Control.extend({
    
    onAdd: function (map) {
        
        self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;
        
        const controlDiv = L.DomUtil.create('div', 'special-tools-roman-empire special-tools-controls special-tools-disable');

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsRomanEmpire/lang/lang.json')
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
            
            /* PLEIADES */
            pleiades = "<div class='special-tools-h2'>Pleiades (pleiades.stoa.org)</div>";
            
            pleiades = pleiades + "<div class='pleiades-div'>";
            
            pleiades = pleiades + "<div class='special-tools-container special-tools-div-50'>";
            pleiades = pleiades + "<input type='text' id='search_pleiades' class='special-tools-input-150'> ";
            pleiades = pleiades + "<button type='button' id='btn_pleiades' class='special-tools-btn-default'>" + special_tools._T("Buscar", json_lang, lang) + "</button>";
            pleiades = pleiades + "</div>";
            
            pleiades = pleiades + "<div class='special-tools-container special-tools-div-33'>";
            pleiades = pleiades + special_tools._T("Filtrar por:", json_lang, lang);
            pleiades = pleiades + special_tools._T("Nombre: ", json_lang, lang) + "<input type='radio' name='radio_pleiades' class='radio_pleiades' value='name' checked>";
            pleiades = pleiades + " ID: <input type='radio' name='radio_pleiades' class='radio_pleiades' value='id'>";
            pleiades = pleiades + "</div>";
            
            pleiades = pleiades + "<div style='clear: left;'></div>";

            pleiades = pleiades + "<div id='pleiades_items_founds'>";
            
            for (let n=1; n<=10; n++) {
                
                pleiades = pleiades + "<p class='p-get-pleiades' style='display: none'><button type='button' style='margin-top: 4px; margin-bottom: 4px;' class='get-pleiades special-tools-btn-success' pleiades-id=''></button></p>";
            
            }
            
            pleiades = pleiades + "</div>";
            
            pleiades = pleiades + "</div>";
            /* PLEIADES */
            
            /* PELAGIOS DARE */
            pelagios = "<div class='special-tools-h2'>Pelagios D.A.R.E</div>";
            
            pelagios = pelagios + "<div class='pelagios-div'>";
            
            pelagios = pelagios + "<div class='special-tools-container special-tools-div-50'>";
            pelagios = pelagios + "<input type='text' id='search_pelagios' class='special-tools-input-150'> ";
            pelagios = pelagios + "<button type='button' id='btn_pelagios' class='special-tools-btn-default'>" + special_tools._T("Buscar", json_lang, lang) + "</button>";
            pelagios = pelagios + "</div>";
            
            pelagios = pelagios + "<div class='special-tools-container special-tools-div-33'>";
            pelagios = pelagios + "<input type='checkbox' id='check_uncheck_all' checked>" + special_tools._T(" Marcar/Desmarcar todo", json_lang, lang);
            pelagios = pelagios + "</div>";

            pelagios = pelagios + "<div style='clear: left;'></div>";
            
            pelagios = pelagios + "<div class='special-tools-container'>";
            pelagios = pelagios + special_tools._T("Filtrar por:", json_lang, lang);
            pelagios = pelagios + "</div>";
            
            pelagios = pelagios + "<div class='special-tools-container'>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='10m_lakes' checked> 10m_lakes</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='10m_lakes_label' checked> 10m_lakes_label</div>";
            pelagios = pelagios + "<div class='w-col-6'><input type='checkbox' name='10m_rivers_lake_centerlines' checked> 10m_rivers_lake_centerlines</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='fortifications' checked> fortifications</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='places_high' checked> places_high</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='places_low' checked> places_low</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='places_medium' checked> places_medium</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='places_subsites' checked> places_subsites</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='provinces' checked> provinces</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='provinces_label' checked> provinces_label</div>";
            pelagios = pelagios + "<div class='w-col-3'><input type='checkbox' name='roads_high' checked> roads_high</div>";
            pelagios = pelagios + "<div class='w-col-12'><input type='checkbox' name='roads_low' checked> roads_low</div>";
            pelagios = pelagios + "</div>";
            
            pelagios = pelagios + "<div id='pelagios_items_founds'>";
            
            for (let n=1; n<=10; n++) {
                
                pelagios = pelagios + "<p class='p-get-pelagios' style='display: none'><button type='button' style='margin-top: 4px; margin-bottom: 4px;' class='get-pelagios special-tools-btn-success' pelagios-geojson=''></button></p>";
            
            }
            
            pelagios = pelagios + "</div>";
            
            pelagios = pelagios + "</div>";
            /* PELAGIOS DARE */
            
            /*
             * imperium.ahlfeldt.se
             */
            imperium = "<div class='special-tools-h2'>imperium.ahlfeldt.se (Lund University)</div>";
            
            imperium = imperium + "<div class='imperium-div'>";
            
            imperium = imperium + "<div class='special-tools-container'>";
            imperium = imperium + "<input type='text' id='search_imperium' class='special-tools-input-150'> ";
            imperium = imperium + "<button type='button' id='btn_imperium' class='special-tools-btn-default'>" + special_tools._T("Buscar", json_lang, lang) + "</button>";
            imperium = imperium + "</div>";
            
            imperium = imperium + "<div class='special-tools-container special-tools-div-33'>";
            imperium = imperium + "<select class='special-tools-select' id='select_imperium_type'>";
            imperium = imperium + "<option value=''>All types</option>";
            imperium = imperium + "<option value='11'>City</option>";
            imperium = imperium + "<option value='13'>Civitas</option>";
            imperium = imperium + "<option value='12'>Town</option>";
            imperium = imperium + "<option value='14'>Villa</option>";
            imperium = imperium + "<option value='16'>Station</option>";
            imperium = imperium + "<option value='56'>Port</option>";
            imperium = imperium + "<option value='57'>Mine</option>";
            imperium = imperium + "<option value='58'>Production</option>";
            imperium = imperium + "<option value='17'>Fortress</option>";
            imperium = imperium + "<option value='18'>Fort</option>";
            imperium = imperium + "<option value='53'>Fortlet/tower</option>";
            imperium = imperium + "<option value='15'>Camp</option>";
            imperium = imperium + "<option value='41'>River</option>";
            imperium = imperium + "<option value='43'>Rapid</option>";
            imperium = imperium + "<option value='46'>Mountain</option>";
            imperium = imperium + "<option value='47'>Island</option>";
            imperium = imperium + "<option value='50'>Cape</option>";
            imperium = imperium + "<option value='76'>Lighthouse</option>";
            imperium = imperium + "<option value='49'>Pass</option>";
            imperium = imperium + "<option value='51'>Bridge</option>";
            imperium = imperium + "<option value='55'>Road/milestone</option>";
            imperium = imperium + "<option value='52'>Aqueduct</option>";
            imperium = imperium + "<option value='77'>Canal</option>";
            imperium = imperium + "<option value='20'>Well</option>";
            imperium = imperium + "</select>";
            imperium = imperium + "</div>";
            
            imperium = imperium + "<div class='special-tools-container special-tools-div-33'>";
            imperium = imperium + "<select class='special-tools-select' id='select_imperium_name'>";
            imperium = imperium + "<option value='mss'>Modern placename</option>";
            imperium = imperium + "<option value='ass'>Ancient placename</option>";
            imperium = imperium + "</select>";
            imperium = imperium + "</div>";
            
            imperium = imperium + "<div class='special-tools-container special-tools-div-33'>";
            imperium = imperium + '<select class="special-tools-select" id="select_imperium_country">';
            imperium = imperium + '<option value="">All countries</option>';
            imperium = imperium + '<option value="AL">Albania</option>';
            imperium = imperium + '<option value="DZ">Algeria</option>';
            imperium = imperium + '<option value="AM">Armenia</option>';
            imperium = imperium + '<option value="AT">Austria</option>';
            imperium = imperium + '<option value="AZ">Azerbaijan</option>';
            imperium = imperium + '<option value="BH">Bahrain</option>';
            imperium = imperium + '<option value="BE">Belgium</option>';
            imperium = imperium + '<option value="BA">Bosnia and Herzegovina</option>';
            imperium = imperium + '<option value="BG">Bulgaria</option>';
            imperium = imperium + '<option value="HR">Croatia</option>';
            imperium = imperium + '<option value="CZ">Czech Republic</option>';
            imperium = imperium + '<option value="DK">Denmark</option>';
            imperium = imperium + '<option value="DJ">Djibouti</option>';
            imperium = imperium + '<option value="EG">Egypt</option>';
            imperium = imperium + '<option value="ER">Eritrea</option>';
            imperium = imperium + '<option value="ET">Ethiopia</option>';
            imperium = imperium + '<option value="FR">France</option>';
            imperium = imperium + '<option value="GE">Georgia</option>';
            imperium = imperium + '<option value="DE">Germany</option>';
            imperium = imperium + '<option value="GB">Great Britain</option>';
            imperium = imperium + '<option value="GR">Greece</option>';
            imperium = imperium + '<option value="HU">Hungary</option>';
            imperium = imperium + '<option value="IR">Iran</option>';
            imperium = imperium + '<option value="IQ">Iraq</option>';
            imperium = imperium + '<option value="IE">Ireland</option>';
            imperium = imperium + '<option value="IL">Israel</option>';
            imperium = imperium + '<option value="IT">Italy</option>';
            imperium = imperium + '<option value="JO">Jordania</option>';
            imperium = imperium + '<option value="XK">Kosovo</option>';
            imperium = imperium + '<option value="KW">Kuwait</option>';
            imperium = imperium + '<option value="LB">Lebanon</option>';
            imperium = imperium + '<option value="LU">Luxembourg</option>';
            imperium = imperium + '<option value="LY">Libya</option>';
            imperium = imperium + '<option value="MK">Macedonia</option>';
            imperium = imperium + '<option value="MA">Morocco</option>';
            imperium = imperium + '<option value="ME">Montenegro</option>';
            imperium = imperium + '<option value="NL">Netherlands</option>';
            imperium = imperium + '<option value="OM">Oman</option>';
            imperium = imperium + '<option value="PS">Palestine</option>';
            imperium = imperium + '<option value="PL">Poland</option>';
            imperium = imperium + '<option value="PT">Portugal</option>';
            imperium = imperium + '<option value="QA">Qatar</option>';
            imperium = imperium + '<option value="RO">Romania</option>';
            imperium = imperium + '<option value="SA">Saudi Arabia</option>';
            imperium = imperium + '<option value="RS">Serbia</option>';
            imperium = imperium + '<option value="SK">Slovakia</option>';
            imperium = imperium + '<option value="SI">Slovenia</option>';
            imperium = imperium + '<option value="ES">Spain</option>';
            imperium = imperium + '<option value="SO">Somalia</option>';
            imperium = imperium + '<option value="SD">Sudan</option>';
            imperium = imperium + '<option value="SE">Sweden</option>';
            imperium = imperium + '<option value="CH">Switzerland</option>';
            imperium = imperium + '<option value="SY">Syria</option>';
            imperium = imperium + '<option value="TN">Tunisia</option>';
            imperium = imperium + '<option value="TR">Turkey</option>';
            imperium = imperium + '<option value="AE">United Arab Emirates</option>';
            imperium = imperium + '<option value="YE">Yemen</option>';
            imperium = imperium + '</select>';
            imperium = imperium + "</div>";
            
            inperium = imperium + "<div style='clear: left;'></div>";
            
            imperium = imperium + "<div id='imperium_items_founds'>";
            
            for (let n=1; n<=10; n++) {
                
                imperium = imperium + "<p class='p-get-imperium' style='display: none;'><button type='button' style='margin-top: 4px; margin-bottom: 4px;' class='get-imperium special-tools-btn-success' imperium-geojson=''></button></p>";
            
            }
            
            imperium = imperium + "</div>";
            
            imperium = imperium + "</div><br><br><br><br><br><br><br><br>";
            /*
             * imperium.ahlfeldt.se
             */
            
            content = pleiades + '<hr>' + pelagios + '<hr>' + imperium;
            
            map.fire('modal', {
                
              title: special_tools._T("Consulta a servicios relacionados con el Imperio Romano", json_lang, lang),
              content: content,
              template: ['<div class="special-tools-h1">{title}</div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '</div>'
              ].join(''),

              width: 'auto',

              onShow: function(evt) {
                  
                var modal = evt.modal;
                
                modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                /* PLEIADES */
                L.DomEvent.on(modal._container.querySelector('#search_pleiades'), 'keyup', function() {
                    
                    modal._container.querySelector('#btn_pleiades').click();
                
                });

                L.DomEvent.on(modal._container.querySelector('#btn_pleiades'), 'click', function() {
                    
                    radio_option_checked = modal._container.querySelector('input[name="radio_pleiades"]:checked').value;
                    input_value = modal._container.querySelector('#search_pleiades').value;
                    
                    if (input_value === '') return;
                    
                    let url = route + '/leaflet.control.SpecialToolsRomanEmpire/ajax/pleiades/pleiades.php?';
             
                    fetch(url + new URLSearchParams({
                        type: radio_option_checked,
                        value: input_value
                    }))
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data){

                        pleiades_array = modal._container.querySelectorAll('.get-pleiades');
                        p_pleiades_array = modal._container.querySelectorAll('.p-get-pleiades');
                        
                        for (let index = 0; index < pleiades_array.length; index++) {
                            
                            pleiades_array[index].setAttribute('pleiades-id', '');
                            pleiades_array[index].innerText = '';
                            p_pleiades_array[index].style.display = 'none';
                            
                        }
                        
                        get_pleiades = '';
                        
                        for (let index in data) {
                            
                            get_pleiades = modal._container.querySelectorAll('.get-pleiades')[index];
                            p_pleiades = modal._container.querySelectorAll('.p-get-pleiades')[index];
                            L.DomEvent.off(get_pleiades);
                            get_pleiades.setAttribute('pleiades-id', data[index].id);
                            get_pleiades.innerText = data[index].name + ' - ' + data[index].id;
                            p_pleiades.style.display = 'block';
                            
                            L.DomEvent.on(get_pleiades, 'click', function(){
                                
                                id = this.getAttribute('pleiades-id');
                                
                                let url = route + '/leaflet.control.SpecialToolsRomanEmpire/ajax/pleiades/pleiades-service.php?';

                                fetch(url + new URLSearchParams({
                                    id: id
                                }))
                                .then(function(response) {
                                    
                                    return response.json();
                            
                                })
                                .then(function(data){
                                    
                                    if (data !== '') {
                                        
                                        data = JSON.parse(data);
                                        
                                        if (data.hasOwnProperty('features')) {
                                            
                                            first_feature = data.features[0];
                                            first_feature_type = data.features[0].geometry.type;
                                            
                                            if (first_feature_type === 'Point') {
                                                
                                                coordinates = data.features[0].geometry.coordinates;
                                                
                                                lng = coordinates[0];
                                                lat = coordinates[1];    
                                                
                                                marker = L.marker([lat, lng]);

                                                marker.feature = marker.toGeoJSON();
                                                marker.feature.special_tools = {};
                                                marker.feature.special_tools.is_pleiades = true;
                                                marker.feature.special_tools.geoman_edition = false;
                                                marker.feature.properties = {};
                                                
                                                if (data.hasOwnProperty('id')) {
                                                    
                                                    marker.feature.properties.id = "https://pleiades.stoa.org/places/"+data.id;
                                                
                                                }
                                                if (data.hasOwnProperty('title')) {
                                                    
                                                    marker.feature.properties.title = data.title;
                                                
                                                }
                                                if (data.hasOwnProperty('description')) {
                                                    
                                                    marker.feature.properties.description = data.description;
                                                
                                                }
                                                if (data.hasOwnProperty('names')) {
                                                    
                                                    marker.feature.properties.names = data.names.toString();
                                                
                                                }
                                                
                                                if (data.features.length === 1) {
                                                    
                                                    if (data.features[0].properties.hasOwnProperty('description')) {
                                                        
                                                        marker.feature.properties.info = data.features[0].properties.description;
                                                    
                                                    }
                                                }
                                                
                                                else if (data.features.length > 1) {
                                                    
                                                    if (data.features[1].properties.hasOwnProperty('description')) {
                                                        
                                                        marker.feature.properties.info = data.features[1].properties.description;
                                                    
                                                    }
                                                }
                                                
                                                if (server) {
                                                
                                                    map.fire("pm:create", {layer: marker});
                                                
                                                } else {
                                                    
                                                    marker.addTo(map);
                                                    special_tools.set_info_console(marker);
                                                    
                                                }
                                                
                                                map.setView([lat, lng], 11);
                                                
                                            }
                                            
                                            
                                            if (data.features.length === 1) return;
                                            
                                            second_feature = data.features[1];
                                            second_feature_type = data.features[1].geometry.type;
                                            
                                            for (let index = 1; index < data.features.length; index++) {
                                                
                                                feature = data.features[index];
                                                feature_type = feature.geometry.type;

                                                if (feature_type === 'LineString') {

                                                    coordinates = feature.geometry.coordinates;

                                                    linestring = turf.lineString(coordinates);

                                                    var linestring_coord = L.GeoJSON.coordsToLatLngs(coordinates);

                                                    linestring = L.polyline(linestring_coord);

                                                    linestring.feature = linestring.toGeoJSON();
                                                    linestring.feature.special_tools = {};
                                                    linestring.feature.special_tools.is_pleiades = true;
                                                    linestring.feature.special_tools.geoman_edition = false;
                                                    linestring.feature.properties = {};

                                                    if (data.hasOwnProperty('id')) {
                                                        
                                                        linestring.feature.properties.id = "https://pleiades.stoa.org/places/"+data.id;
                                                    
                                                    }
                                                    
                                                    if (data.hasOwnProperty('title')) {
                                                        
                                                        linestring.feature.properties.title = data.title;
                                                    
                                                    }
                                                    
                                                    if (data.hasOwnProperty('description')) {
                                                        linestring.feature.properties.description = data.description;
                                                    }
                                                    
                                                    if (data.hasOwnProperty('names')) {
                                                        
                                                        linestring.feature.properties.names = data.names.toString();
                                                    
                                                    }
                                                    
                                                    if (feature.properties.hasOwnProperty('description')) {
                                                        
                                                        linestring.feature.properties.info = feature.properties.description;
                                                    
                                                    }
                                                    
                                                    if (server) {
   
                                                        map.fire("pm:create", {layer: linestring});
                                                    
                                                    } else {
                                                        
                                                        linestring.addTo(map);
                                                        special_tools.set_info_console(linestring);
                                                        
                                                    }

                                                } else if (feature_type === 'MultiLineString') {
                                                    

                                                    coordinates = feature.geometry.coordinates;

                                                    multi_id = self.make_id(20);

                                                    for (let index in coordinates) {

                                                        multilinestring_coord = L.GeoJSON.coordsToLatLngs(coordinates[index]);

                                                        multilinestring = L.polyline(multilinestring_coord);

                                                        multilinestring.feature = multilinestring.toGeoJSON();
                                                        multilinestring.feature.special_tools = {};

                                                        tools_id = self.make_id(20);

                                                        multilinestring.feature.special_tools.tools_id = tools_id;
                                                        multilinestring.feature.special_tools.is_pleiades = true;
                                                        multilinestring.feature.special_tools.geoman_edition = false;
                                                        multilinestring.feature.special_tools.multi_id = multi_id;
                                                        multilinestring.feature.properties = {};

                                                        if (data.hasOwnProperty('id')) {
                                                            
                                                            multilinestring.feature.properties.id = "https://pleiades.stoa.org/places/"+data.id;
                                                        
                                                        }
                                                        
                                                        if (data.hasOwnProperty('title')) {
                                                            
                                                            multilinestring.feature.properties.title = data.title;
                                                        
                                                        }
                                                        
                                                        if (data.hasOwnProperty('description')) {
                                                            
                                                            multilinestring.feature.properties.description = data.description;
                                                        
                                                        }
                                                        
                                                        if (data.hasOwnProperty('names')) {
                                                            
                                                            multilinestring.feature.properties.names = data.names.toString();
                                                        
                                                        }
                                                        
                                                        if (feature.properties.hasOwnProperty('description')) {
                                                            
                                                            multilinestring.feature.properties.info = feature.properties.description;
                                                        
                                                        }

                                                        if (server) {
                                                            
                                                            map.fire('pm:create', {layer: multilinestring});
                                                            
                                                        } else {
                                                            
                                                            multilinestring.addTo(map);
                                                            special_tools.set_info_console(multilinestring);
                                                            
                                                        }

                                                    }
                                                    
                                                    map.getBounds(multilinestring.getBounds());
                                                    
                                                } else if (feature_type === 'MultiPoint') {
                                                    

                                                    coordinates = feature.geometry.coordinates;

                                                    multi_id = self.make_id(20);

                                                    for (let index in coordinates) {

                                                        multipoint_coord = L.GeoJSON.coordsToLatLngs(coordinates[index]);

                                                        multipoint = L.marker(multipoint_coord);

                                                        multipoint.feature = multipoint.toGeoJSON();
                                                        multipoint.feature.special_tools = {};

                                                        tools_id = self.make_id(20);

                                                        multipoint.feature.special_tools.tools_id = tools_id;
                                                        multipoint.feature.special_tools.is_pleiades = true;
                                                        multipoint.feature.special_tools.geoman_edition = false;
                                                        multipoint.feature.special_tools.multi_id = multi_id;
                                                        multipoint.feature.properties = {};

                                                        if (data.hasOwnProperty('id')) {
                                                            
                                                            multipoint.feature.properties.id = "https://pleiades.stoa.org/places/"+data.id;
                                                        
                                                        }
                                                        
                                                        if (data.hasOwnProperty('title')) {
                                                            
                                                            multipoint.feature.properties.title = data.title;
                                                        
                                                        }
                                                        
                                                        if (data.hasOwnProperty('description')) {
                                                            
                                                            multipoint.feature.properties.description = data.description;
                                                        
                                                        }
                                                        
                                                        if (data.hasOwnProperty('names')) {
                                                            
                                                            multipoint.feature.properties.names = data.names.toString();
                                                        
                                                        }
                                                        
                                                        if (feature.properties.hasOwnProperty('description')) {
                                                            
                                                            multipoint.feature.properties.info = feature.properties.description;
                                                        
                                                        }

                                                        if (server) {
                                                            
                                                            map.fire('pm:create', {layer: multipoint});
                                                            
                                                        } else {
                                                            
                                                            multipoint.addTo(map);
                                                            special_tools.set_info_console(multipoint);
                                                            
                                                        }

                                                    }

                                                    map.setView(multipoint.getLatLng(), 11);
                                                    
                                                } else if (feature_type === 'Polygon') {

                                                    coordinates = feature.geometry.coordinates;

                                                    polygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[0]);

                                                    polygon = L.polygon(polygon_coord);

                                                    polygon.feature = polygon.toGeoJSON();
                                                    polygon.feature.special_tools = {};
                                                    polygon.feature.special_tools.is_pleiades = true;
                                                    polygon.feature.special_tools.geoman_edition = false;
                                                    polygon.feature.properties = {};
                                                    
                                                    if (data.hasOwnProperty('id')) {
                                                        
                                                        polygon.feature.properties.id = "https://pleiades.stoa.org/places/"+data.id;
                                                    
                                                    }
                                                    
                                                    if (data.hasOwnProperty('title')) {
                                                        
                                                        polygon.feature.properties.title = data.title;
                                                    
                                                    }
                                                    
                                                    if (data.hasOwnProperty('description')) {
                                                        
                                                        polygon.feature.properties.description = data.description;
                                                    
                                                    }
                                                    
                                                    if (data.hasOwnProperty('names')) {
                                                        
                                                        polygon.feature.properties.names = data.names.toString();
                                                    
                                                    }
                                                    
                                                    if (feature.properties.hasOwnProperty('description')) {
                                                        
                                                        polygon.feature.properties.info = feature.properties.description;
                                                    
                                                    }
                                                    
                                                    if (server) {
                                                    
                                                        map.fire("pm:create", {layer: polygon});
                                                    
                                                    } else {
                                                        
                                                        polygon.addTo(map);
                                                        special_tools.set_info_console(polygon);
                                                        
                                                    }
                                                    
                                                    map.fitBounds(polygon.getBounds());

                                                } else if (feature_type === 'MultiPolygon') {

                                                    coordinates = feature.geometry.coordinates;

                                                    multi_id = self.make_id(20);

                                                    for (let index_1 in coordinates) {

                                                        for(let index_2 in coordinates[index_1]) {

                                                            multipolygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[index_1][index_2]);

                                                            multipolygon = L.polygon(multipolygon_coord);

                                                            multipolygon.feature = multipolygon.toGeoJSON();
                                                            multipolygon.feature.special_tools = {};

                                                            tools_id = self.make_id(20);

                                                            multipolygon.feature.special_tools.tools_id = tools_id;
                                                            
                                                            multipolygon.feature.special_tools.is_pleiades = true;
                                                            
                                                            multipolygon.feature.special_tools.geoman_edition = false;
                                                            
                                                            multipolygon.feature.special_tools.multi_id = multi_id;
                                                            
                                                            multipolygon.feature.properties = {};

                                                            if (data.hasOwnProperty('id')) {

                                                                multipolygon.feature.properties.id = "https://pleiades.stoa.org/places/"+data.id;

                                                            }

                                                            if (data.hasOwnProperty('title')) {

                                                                multipolygon.feature.properties.title = data.title;

                                                            }

                                                            if (data.hasOwnProperty('description')) {

                                                                multipolygon.feature.properties.description = data.description;

                                                            }

                                                            if (data.hasOwnProperty('names')) {

                                                                multipolygon.feature.properties.names = data.names.toString();

                                                            }

                                                            if (feature.properties.hasOwnProperty('description')) {

                                                                multipolygon.feature.properties.info = feature.properties.description;

                                                            }
                                                            
                                                            if (server) {

                                                                map.fire('pm:create', {layer: multipolygon});
                                                            
                                                            } else {
                                                                
                                                                multipolygon.addTo(map);
                                                                special_tools.set_info_console(multipolygon);
                                                                
                                                            }
                                                        }
                                                        
                                                        map.fitBounds(multipolygon.getBounds());
                                                        
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                                
                            });
                        }                 
                        
                    });
   
                });
                /* PLEIADES */
               
                /* PELAGIOS */ 
                L.DomEvent.on(modal._container.querySelector('#check_uncheck_all'), 'click', function() {
                    
                    if (this.checked) {
                        
                        modal._container.querySelector('input[name="10m_lakes"]').checked = true;
                        modal._container.querySelector('input[name="10m_lakes_label"]').checked = true;
                        modal._container.querySelector('input[name="10m_rivers_lake_centerlines"]').checked = true;
                        modal._container.querySelector('input[name="fortifications"]').checked = true;
                        modal._container.querySelector('input[name="places_high"]').checked = true;
                        modal._container.querySelector('input[name="places_low"]').checked = true;
                        modal._container.querySelector('input[name="places_medium"]').checked = true;
                        modal._container.querySelector('input[name="places_subsites"]').checked = true;
                        modal._container.querySelector('input[name="provinces"]').checked = true;
                        modal._container.querySelector('input[name="provinces_label"]').checked = true;
                        modal._container.querySelector('input[name="roads_high"]').checked = true;
                        modal._container.querySelector('input[name="roads_low"]').checked = true;
                    
                    } else {
                        
                        modal._container.querySelector('input[name="10m_lakes"]').checked = false;
                        modal._container.querySelector('input[name="10m_lakes_label"]').checked = false;
                        modal._container.querySelector('input[name="10m_rivers_lake_centerlines"]').checked = false;
                        modal._container.querySelector('input[name="fortifications"]').checked = false;
                        modal._container.querySelector('input[name="places_high"]').checked = false;
                        modal._container.querySelector('input[name="places_low"]').checked = false;
                        modal._container.querySelector('input[name="places_medium"]').checked = false;
                        modal._container.querySelector('input[name="places_subsites"]').checked = false;
                        modal._container.querySelector('input[name="provinces"]').checked = false;
                        modal._container.querySelector('input[name="provinces_label"]').checked = false;
                        modal._container.querySelector('input[name="roads_high"]').checked = false;
                        modal._container.querySelector('input[name="roads_low"]').checked = false;
                    
                    }
                
                });
                
                L.DomEvent.on(modal._container.querySelector('#search_pelagios'), 'keyup', function() {
                    
                    modal._container.querySelector('#btn_pelagios').click();
                
                });

                L.DomEvent.on(modal._container.querySelector('#btn_pelagios'), 'click', function() {
                    
                    filter = new Array();
                    
                    if (modal._container.querySelector('input[name="10m_lakes"]:checked')) {
                        
                        filter.push("10m_lakes");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="10m_lakes_label"]:checked')) {
                        
                        filter.push("10m_lakes_label");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="10m_rivers_lake_centerlines"]:checked')) {
                        
                        filter.push("10m_rivers_lake_centerlines");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="fortifications"]:checked')) {
                        
                        filter.push("fortifications");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="places_high"]:checked')) {
                        
                        filter.push("places_high");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="places_low"]:checked')) {
                        
                        filter.push("places_low");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="places_medium"]:checked')) {
                        
                        filter.push("places_medium");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="places_subsites"]:checked')) {
                        
                        filter.push("places_subsites");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="provinces"]:checked')) {
                        
                        filter.push("provinces");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="provinces_label"]:checked')) {
                        
                        filter.push("provinces_label");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="roads_high"]:checked')) {
                        
                        filter.push("roads_high");
                    
                    }
                    
                    if (modal._container.querySelector('input[name="roads_low"]:checked')) {
                        
                        filter.push("roads_low");
                    
                    }
                    
                    query = modal._container.querySelector('#search_pelagios').value;
                    
                    if (query === '') return;
                    
                    let url = route + '/leaflet.control.SpecialToolsRomanEmpire/ajax/pelagios/pelagios.php?';
             
                    fetch(url + new URLSearchParams({
                        
                        query: query,
                        filter: filter
                        
                    }))
                    .then(function(response) {
                        
                        return response.json();
                
                    })
                    .then(function(data){
                        
                        if (data.hasOwnProperty('empty') || data.hasOwnProperty('error')) {

                            return;
                            
                        }
 
                        pelagios_array = modal._container.querySelectorAll('.get-pelagios');
                        
                        p_pelagios_array = modal._container.querySelectorAll('.p-get-pelagios');
                        
                        for (let index = 0; index < pelagios_array.length; index++) {
                            
                            pelagios_array[index].setAttribute('pelagios-geojson', '');
                            pelagios_array[index].innerHTML = '';
                            p_pelagios_array[index].style.display = 'none';
                            
                        }
                        
                        get_pelagios = '';
                        
                        for (let index in data) {
                            
                            get_pelagios = modal._container.querySelectorAll('.get-pelagios')[index];
                            p_pelagios = modal._container.querySelectorAll('.p-get-pelagios')[index];
                            L.DomEvent.off(get_pelagios);
                            get_pelagios.setAttribute('pelagios-geojson', data[index].geojson);
                            get_pelagios.innerHTML = data[index].value + ' - Tipo: ' + data[index].geometry_type + " &nbsp;<small> - Colección: " + data[index].file + "</small>";
                            p_pelagios.style.display = 'block';
                            
                            L.DomEvent.addListener(get_pelagios, 'click', function(e){
                      
                                geojson = JSON.parse(this.getAttribute('pelagios-geojson'));
                                
                                if (geojson.geometry.type === 'Point') {
                                    
                                    tools_id = self.make_id(20);
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    lng = coordinates[0];
                                    lat = coordinates[1];
                                    
                                    marker = L.marker([lat, lng]);

                                    marker.feature = marker.toGeoJSON();
                                    marker.feature.special_tools = {};
                                    marker.feature.special_tools.tools_id = tools_id;
                                    marker.feature.special_tools.is_pelagios = true;
                                    marker.feature.special_tools.geoman_edition = false;
                                    marker.feature.properties = geojson.properties;
                                    
                                    if (server) {
                                    
                                    map.fire('pm:create', {layer: marker});
                                    
                                    } else {
                                        
                                        marker.addTo(map);
                                        special_tools.set_info_console(marker);
                                        
                                    }
                                    
                                    map.setView([lat, lng], 11);
                                    
                                }
                                
                                else if (geojson.geometry.type === 'Polygon') {
                                    
                                    tools_id = self.make_id(20);
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    polygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[0]);
                                    
                                    polygon = L.polygon(polygon_coord);
                                    
                                    polygon.feature = polygon.toGeoJSON();
                                    polygon.feature.special_tools = {};
                                    polygon.feature.special_tools.tools_id = tools_id;
                                    polygon.feature.special_tools.is_pelagios = true;
                                    polygon.feature.special_tools.geoman_edition = false;
                                    polygon.feature.properties = geojson.properties;
                                    
                                    if (server) {
                                    
                                    map.fire('pm:create', {layer: polygon});
                                    
                                    } else {
                                        
                                        polygon.addTo(map);
                                        special_tools.set_info_console(polygon);
                                        
                                    }
                                    
                                    map.fitBounds(polygon.getBounds());
                                    
                                }
                                
                                else if (geojson.geometry.type === 'MultiPolygon') {

                                    coordinates = geojson.geometry.coordinates;
                                    
                                    multi_id = self.make_id(20);
                                    
                                    for (let index_1 in coordinates) {
                                        
                                        for(let index_2 in coordinates[index_1]) {
                                            
                                            multipolygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[index_1][index_2]);
                                            
                                            multipolygon = L.polygon(multipolygon_coord);

                                            multipolygon.feature = multipolygon.toGeoJSON();
                                            multipolygon.feature.special_tools = {};
                                            tools_id = self.make_id(20);
                                            multipolygon.feature.special_tools.tools_id = tools_id;
                                            multipolygon.feature.special_tools.is_pelagios = true;
                                            multipolygon.feature.special_tools.geoman_edition = false;
                                            multipolygon.feature.special_tools.multi_id = multi_id;
                                            multipolygon.feature.properties = geojson.properties;

                                            if (server) {
                                            
                                                map.fire('pm:create', {layer: multipolygon});
                                        
                                            } else {
                                                
                                                multipolygon.addTo(map);
                                                special_tools.set_info_console(multipolygon);
                                                
                                            }
                                        
                                        }

                                        map.fitBounds(multipolygon.getBounds());
                                    
                                    }

                                }
                                
                                else if (geojson.geometry.type === 'LineString') {
                                    
                                    tools_id = self.make_id(20);
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    linestring_coord = L.GeoJSON.coordsToLatLngs(coordinates);
                                    
                                    linestring = L.polyline(linestring_coord);
                                    
                                    linestring.feature = linestring.toGeoJSON();
                                    linestring.feature.special_tools = {};
                                    linestring.feature.special_tools.tools_id = tools_id;
                                    linestring.feature.special_tools.is_pelagios = true;
                                    linestring.feature.special_tools.geoman_edition = false;
                                    linestring.feature.properties = geojson.properties;
                                    
                                    if (server) {
                                        
                                        map.fire('pm:create', {layer: linestring});
                                    
                                    } else {
                                        
                                        linestring.addTo(map);
                                        special_tools.set_info_console(linestring);
                                        
                                    }
                                    
                                    map.fitBounds(linestring.getBounds());

                                }
                                
                                else if (geojson.geometry.type === 'MultiLineString') {
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    multi_id = self.make_id(20);
                                    
                                    for (let index in coordinates) {

                                        multilinestring_coord = L.GeoJSON.coordsToLatLngs(coordinates[index]);

                                        multilinestring = L.polyline(multilinestring_coord);

                                        multilinestring.feature = multilinestring.toGeoJSON();
                                        multilinestring.feature.special_tools = {};

                                        tools_id = self.make_id(20);

                                        multilinestring.feature.special_tools.tools_id = tools_id;
                                        multilinestring.feature.special_tools.is_pelagios = true;
                                        multilinestring.feature.special_tools.geoman_edition = false;
                                        multilinestring.feature.special_tools.multi_id = multi_id;
                                        multilinestring.feature.properties = geojson.properties;

                                        if (server) {
                                        
                                            map.fire('pm:create', {layer: multilinestring});
 
                                        } else {
                                            
                                            multilinestring.addTo(map);
                                            special_tools.set_info_console(multilinestring);
                                            
                                        }

                                    }
                                    
                                    map.fitBounds(multilinestring.getBounds());
                                    
                                }
                               
                            });
                        }
                       
                    });
                    
                });
                /* PELAGIOS */
                
                /* https://imperium.ahlfeldt.se/ */ 

                L.DomEvent.on(modal._container.querySelector('#search_imperium'), 'keyup', function() {
                    
                    modal._container.querySelector('#btn_imperium').click();
                
                });

                L.DomEvent.on(modal._container.querySelector('#btn_imperium'), 'click', function() {

                    select_imperium_type = modal._container.querySelector('#select_imperium_type');
                    type_site = select_imperium_type.options[select_imperium_type.selectedIndex].value;
                    select_imperium_name = modal._container.querySelector('#select_imperium_name');
                    type_name = select_imperium_name.options[select_imperium_name.selectedIndex].value;
                    select_imperium_country = modal._container.querySelector('#select_imperium_country');
                    type_country = select_imperium_country.options[select_imperium_country.selectedIndex].value;
                    
                    
                    query = modal._container.querySelector('#search_imperium').value;
                    
                    if (query === '') return;
                    
                    let url = route + '/leaflet.control.SpecialToolsRomanEmpire/ajax/imperium.ahlfeldt/imperium.ahlfeldt.php?';
             
                    fetch(url + new URLSearchParams({
                        
                        query: query,
                        type_site: type_site,
                        type_name: type_name,
                        type_country: type_country
                        
                    }))
                    .then(function(response) {
                        
                        return response.json();
                
                    })
                    .then(function(data){

                        imperium_array = modal._container.querySelectorAll('.get-imperium');
                        p_imperium_array = modal._container.querySelectorAll('.p-get-imperium');
                        
                        for (let index = 0; index < imperium_array.length; index++) {
                            
                            imperium_array[index].setAttribute('imperium-geojson', '');
                            imperium_array[index].innerHTML = '';
                            p_imperium_array[index].style.display = 'none';
                            
                        }
                        
                        get_imperium = '';
                        
                        for (let index in data) {
                            
                            get_imperium = modal._container.querySelectorAll('.get-imperium')[index];
                            p_imperium = modal._container.querySelectorAll('.p-get-imperium')[index];
                            
                            L.DomEvent.off(get_imperium);
                            
                            get_imperium.setAttribute('imperium-geojson', data[index].geojson);
                            get_imperium.innerHTML = data[index].value + ' - Tipo: ' + data[index].geometry_type;
                            
                            p_imperium.style.display = 'block';

                            L.DomEvent.addListener(get_imperium, 'click', function(e){
                     
                                geojson = JSON.parse(this.getAttribute('imperium-geojson'));
                                
                                if (geojson.geometry.type === 'Point') {
                                    
                                    tools_id = self.make_id(20);
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    lng = coordinates[0];
                                    lat = coordinates[1];
                                    
                                    marker = L.marker([lat, lng]);

                                    marker.feature = marker.toGeoJSON();
                                    marker.feature.special_tools = {};
                                    marker.feature.special_tools.tools_id = tools_id;
                                    marker.feature.special_tools.is_imperium = true;
                                    marker.feature.special_tools.geoman_edition = false;
                                    marker.feature.properties = geojson.properties;
                                    
                                    if (server) {

                                        map.fire('pm:create', {layer: marker});
                                        
                                    } else {
                                        
                                        marker.addTo(map);
                                        special_tools.set_info_console(marker);
                                        
                                    }
                                    
                                    map.setView([lat, lng], 11);
                                    
                                }
                                
                                else if (geojson.geometry.type === 'Polygon') {
                                    
                                    tools_id = self.make_id(20);
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    polygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[0]);
                                    
                                    polygon = L.polygon(polygon_coord);
                                    
                                    polygon.feature = polygon.toGeoJSON();
                                    polygon.feature.special_tools = {};
                                    polygon.feature.special_tools.tools_id = tools_id;
                                    polygon.feature.special_tools.is_imperium = true;
                                    polygon.feature.special_tools.geoman_edition = false;
                                    polygon.feature.properties = geojson.properties;
                                    
                                    if (server) {
                                        
                                        map.fire('pm:create', {layer: polygon});
                                    
                                    } else {
                                        
                                        polygon.addTo(map);
                                        special_tools.set_info_console(polygon);
                                        
                                    }
                                    
                                    map.fitBounds(polygon.getBounds());
                                    
                                }
                                
                                else if (geojson.geometry.type === 'MultiPolygon') {

                                    coordinates = geojson.geometry.coordinates;
                                    multi_id = self.make_id(20);
                                    
                                    for (let index_1 in coordinates) {
                                        
                                        for(let index_2 in coordinates[index_1]) {
                                            
                                            multipolygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[index_1][index_2]);
                                        
                                            multipolygon = L.polygon(multipolygon_coord);

                                            multipolygon.feature = multipolygon.toGeoJSON();
                                            multipolygon.feature.special_tools = {};
                                            tools_id = self.make_id(20);
                                            multipolygon.feature.special_tools.tools_id = tools_id;
                                            multipolygon.feature.special_tools.is_imperium = true;
                                            multipolygon.feature.special_tools.geoman_edition = false;
                                            multipolygon.feature.special_tools.multi_id = multi_id;
                                            multipolygon.feature.properties = geojson.properties;

                                            if (server) {
                                                
                                                map.fire('pm:create', {layer: multipolygon});
                                            
                                            } else {
                                                
                                                multipolygon.addTo(map);
                                                special_tools.set_info_console(multipolygon);
                                                
                                            }
                                        
                                        }

                                        map.fitBounds(multipolygon.getBounds());
                                    
                                    }

                                }
                                
                                else if (geojson.geometry.type === 'LineString') {
                                    
                                    tools_id = self.make_id(20);
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    linestring_coord = L.GeoJSON.coordsToLatLngs(coordinates);
                                    
                                    linestring = L.polyline(linestring_coord);
                                    
                                    linestring.feature = linestring.toGeoJSON();
                                    linestring.feature.special_tools = {};
                                    linestring.feature.special_tools.tools_id = tools_id;
                                    linestring.feature.special_tools.is_imperium = true;
                                    linestring.feature.special_tools.geoman_edition = false;
                                    linestring.feature.properties = geojson.properties;
                                    
                                    if (server) {
                                    
                                        map.fire('pm:create', {layer: linestring});
                                    
                                    } else {
                                        
                                        linestring.addTo(map);
                                        special_tools.set_info_console(linestring);
                                        
                                    }

                                    map.fitBounds(linestring.getBounds());

                                }
                                
                                else if (geojson.geometry.type === 'MultiLineString') {
                                    
                                    coordinates = geojson.geometry.coordinates;
                                    
                                    multi_id = self.make_id(20);
                                    
                                    for (let index in coordinates) {

                                        multilinestring_coord = L.GeoJSON.coordsToLatLngs(coordinates[index]);

                                        multilinestring = L.polyline(multilinestring_coord);

                                        multilinestring.feature = multilinestring.toGeoJSON();
                                        multilinestring.feature.special_tools = {};
                                        tools_id = self.make_id(20);
                                        multilinestring.feature.special_tools.tools_id = tools_id;
                                        multilinestring.feature.special_tools.is_imperium = true;
                                        multilinestring.feature.special_tools.geoman_edition = false;
                                        multilinestring.feature.special_tools.multi_id = multi_id;
                                        multilinestring.feature.properties = geojson.properties;

                                        if (server) {
                                        
                                            map.fire('pm:create', {layer: multilinestring});
                                        
                                        } else {
                                            
                                            multilinestring.addTo(map);
                                            special_tools.set_info_console(multilinestring);
                                            
                                        }
                                    
                                    }
                                    
                                    map.fitBounds(multilinestring.getBounds());
                                    
                                }
                            });
                        }
                    });
                });
                /* https://imperium.ahlfeldt.se/ */  
                },
              
                onHide: function(){
                    
                    L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                    L.DomUtil.removeClass(controlDiv, 'special-tools-enable');
                    
                }
                
            });
        });
        
        false_div = L.DomUtil.create('div');
        return false_div;
    }
});

L.control.specialToolsRomanEmpire = function (options) {
    
    return new L.Control.SpecialToolsRomanEmpire(options);
    
};


