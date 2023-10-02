/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsUA = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;
        
        this.special_tools_msg = null;

        const controlDiv = L.DomUtil.create('div');
        
        const controlDivButton = L.DomUtil.create('div', 'special-tools-button-UA special-tools-controls special-tools-disable', controlDiv);
        controlDivButton.innerText = 'U.A';
        
        const leaflet_control_select_UA = L.DomUtil.create('select', 'special-tools-menu-UA', controlDiv);
        leaflet_control_select_UA.style.display = 'none';
        
        const leaflet_control_munic_UA = L.DomUtil.create('option', 'special-tools-option-UA', leaflet_control_select_UA);
        leaflet_control_munic_UA.selected = true;
        leaflet_control_munic_UA.value = 'Municipio';
        
        const leaflet_control_prov_UA = L.DomUtil.create('option', 'special-tools-option-UA', leaflet_control_select_UA);
        leaflet_control_prov_UA.selected = false;
        leaflet_control_prov_UA.value = 'Provincia';
        
        const leaflet_control_CCAA_UA = L.DomUtil.create('option', 'special-tools-option-UA', leaflet_control_select_UA);
        leaflet_control_CCAA_UA.selected = false;
        leaflet_control_CCAA_UA.value = 'CCAA';

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsUA/lang/lang.json')
        .then(function(response){
            
            return response.json();
            
        }).then(function(data){
            
            json_lang = data;

            leaflet_control_munic_UA.innerText = special_tools._T("Municipio", json_lang, lang);
            leaflet_control_munic_UA.title = special_tools._T("Municipio", json_lang, lang);
            
            
            leaflet_control_prov_UA.innerText = special_tools._T("Provincia", json_lang, lang);
            leaflet_control_prov_UA.title = special_tools._T("Provincia", json_lang, lang);

            leaflet_control_CCAA_UA.innerText = special_tools._T("CCAA", json_lang, lang);
            leaflet_control_CCAA_UA.title = special_tools._T("CCAA", json_lang, lang);
            
        });

        var enable_UA = false;
        
        var wms = null;
        
        var UA_selected = 'Municipio';
        
        var hover_select_UA = false;

        L.DomEvent.addListener(leaflet_control_select_UA, 'click change', function(){
            
            hover_select_UA = true;
            UA_selected = this.value;
            
            window.setTimeout(function(){hover_select_UA = false;}, 1000);

        });

        L.DomEvent.addListener(controlDivButton, 'click', function(e) {

            if (L.DomUtil.hasClass(controlDivButton, 'special-tools-disable')) {
                
                    L.DomUtil.addClass(controlDivButton, 'special-tools-enable');
                    
                    L.DomUtil.removeClass(controlDivButton, 'special-tools-disable');
                    
                    leaflet_control_select_UA.style.display = 'block';
                
                    enable_UA = true;
                    
                    let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');
                    
                    try {
                        
                        special_tools.only_one_control_active(elements_controls, controlDivButton);
                    
                    } catch (e) {};

                    wms = L.tileLayer.wms('http://www.ign.es/wms-inspire/unidades-administrativas?', {layers: 'AU.AdministrativeUnit'});

                    component_geolocation.layer_control.addBaseLayer(wms, "Unidades Administrativas (ES)");

                    let leaflet_control_layers_base = document.querySelector('.leaflet-control-layers-base');

                    let last_basemap_index = leaflet_control_layers_base.querySelectorAll('.leaflet-control-layers-selector').length-1;

                    let UA_html = leaflet_control_layers_base.querySelectorAll('.leaflet-control-layers-selector')[last_basemap_index];

                    UA_html.click();

                }  else {

                    L.DomUtil.addClass(controlDivButton, 'special-tools-disable');
                    
                    L.DomUtil.removeClass(controlDivButton, 'special-tools-enable');
                    
                    leaflet_control_select_UA.style.display = 'none';

                    component_geolocation.layer_control.removeLayer(wms);
                    
                    wms.removeFrom(map);
                    
                    document.querySelectorAll('.leaflet-control-layers-selector')[0].click();
                    
                    enable_UA = false;
                    
                }

                if (enable_UA) {

                    map.off('click');

                    window.setTimeout(function(){
                        
                        map.on('click', function(event){

                            if (
                                !special_tools.geoman_edition_mode(map)
                                && enable_UA && !hover_select_UA
                                ) {
                            
                                content = "<div id='special_tools_msg'></div>";

                                map.fire('modal', {

                                    title: special_tools._T("Unidades Administrativas", json_lang, lang),
                                    content: content,
                                    template: ['<div class="modal-header"><h2>{title}</h2></div>',
                                      '<hr>',
                                      '<div class="modal-body">{content}</div>',
                                      '<div class="modal-footer">',
                                      '</div>'
                                    ].join(''),

                                    width: 'auto',

                                    onShow: function(evt) {

                                        modal = evt.modal;

                                        self.special_tools_msg = modal._container.querySelector('#special_tools_msg');

                                        self.special_tools_msg.innerHTML = special_tools._T("Obteniendo Unidad Administrativa ...", json_lang, lang);

                                    }

                                });
                                
                                let bbox = this.getBounds().toBBoxString();
                                
                                let point = this.latLngToContainerPoint(event.latlng, this.getZoom());
                                
                                let size = this.getSize();

                                let url = route+'/ajax/unidades-administrativas/unidades-administrativas.php?';                             
                                
                                fetch(url + new URLSearchParams({
                                    
                                    url: 'https://www.ign.es/wms-inspire/unidades-administrativas?service=WMS&version=1.3.0&request=GetFeatureInfo&layers=AU.AdministrativeUnit&feature_count=3&info_format=application/json&query_layers=AU.AdministrativeUnit&bbox='+bbox+'&height='+size.y+'&width='+size.x+'&i='+parseInt(point.x)+'&j='+parseInt(point.y)
                                
                                }))
                                .then(function(response) {
                                    
                                        return response.json();
                                
                                })
                                .then(function(data){
                                    
                                    console.log(data);
                                    
                                    if (data.numberReturned === 0) {
                                        
                                        self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener resultados", json_lang, lang);
                                        
                                        window.setTimeout(function(){

                                            modal._container.querySelector('.close').click();

                                        }, 2500);
                                        
                                        return;
                                        
                                    }
                                    
                                    if (typeof data !== 'undefined')
                            
                                        {

                                            COLLECTION = L.geoJSON(data);
                                            COLLECTION = COLLECTION.toGeoJSON();
                                            GEOJSON = null;
                                            
                                            for (let index in COLLECTION.features) {

                                                nationallevel = COLLECTION.features[index].properties.nationallevel;
                                                
                                                OBJECTS_GEOJSON = new Array();
                                                
                                                if (UA_selected === 'Municipio' && nationallevel === 'https://inspire.ec.europa.eu/codelist/AdministrativeHierarchyLevel/4thOrder') {
                                                
                                                    GEOJSON = COLLECTION.features[index];
                                                
                                                }
                                                
                                                else if (UA_selected === 'Provincia' && nationallevel === 'https://inspire.ec.europa.eu/codelist/AdministrativeHierarchyLevel/3rdOrder') {
                                                
                                                    GEOJSON = COLLECTION.features[index];
                                                
                                                }
                                                
                                                else if (UA_selected === 'CCAA' && nationallevel === 'https://inspire.ec.europa.eu/codelist/AdministrativeHierarchyLevel/2ndOrder') {
 
                                                    GEOJSON = COLLECTION.features[index];
                                                
                                                }

                                                if (GEOJSON !== null) {
                                                  
                                                    if (GEOJSON.geometry.type === "Polygon") {

                                                        polygon = project_polygon(GEOJSON);

                                                        OBJECTS_GEOJSON.push(polygon);

                                                    } else if (GEOJSON.geometry.type === "MultiPolygon") {
                                                        
                                                        multipolygon = project_multipolygon(GEOJSON);

                                                        OBJECTS_GEOJSON.push(multipolygon);

                                                    } else if (GEOJSON.geometry.type === "LineString") {

                                                        linestring = project_linestring(GEOJSON);

                                                        OBJECTS_GEOJSON.push(linestring);

                                                    } else if (GEOJSON.geometry.type === "MultiLineString") {

                                                        multilinestring = project_multilinestring(GEOJSON);

                                                        OBJECTS_GEOJSON.push(multilinestring);

                                                    } else if (GEOJSON.geometry.type === "Point") {

                                                        point = project_point(GEOJSON);

                                                        OBJECTS_GEOJSON.push(point);

                                                    } else if (GEOJSON.geometry.type === "MultiPoint") {

                                                        multipoint = project_multipoint(GEOJSON);

                                                        OBJECTS_GEOJSON.push(multipoint);

                                                    }
                                                    
                                                    for (let index in OBJECTS_GEOJSON) {

                                                        max_fit = 1;
                                                        
                                                        for (let obj in OBJECTS_GEOJSON[index]) {

                                                            window.setTimeout(function(){

                                                                self.special_tools_msg.innerHTML = special_tools._T("Puede tomar unos segundos, por favor espere ...", json_lang, lang);
                                                                
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
                                                    
                                                    self.special_tools_msg.innerHTML = special_tools._T("Unidad Administrativa cargada en el mapa con éxito", json_lang, lang);
                                                    
                                                    window.setTimeout(function(){
                                                        
                                                        modal._container.querySelector('.close').click();
                                                        
                                                    }, 2500);
                                                    
                                                    break;
                                                    
                                                }
                                            }
                                            
                                            if (GEOJSON === null) {
                                                
                                                self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la Unidad Administrativa", json_lang, lang);

                                                window.setTimeout(function(){

                                                    modal._container.querySelector('.close').click();

                                                }, 2500);
                                                
                                            }
                                            
                                        }
                                })
                                
                                .catch((error) => {

                                    self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la Unidad Administrativa", json_lang, lang);
                                                    
                                    window.setTimeout(function(){
                                                        
                                        modal._container.querySelector('.close').click();
                                                        
                                    }, 2500);


                                });
                            }

                            L.DomEvent.preventDefault(event);
                            
                        });
                        
                    }, 1000);   
                }
                
                e.preventDefault();
                
            });
             
        false_div = L.DomUtil.create('div');
        
        return false_div;
        
    }
});

L.control.specialToolsUA = function (options) {
    return new L.Control.SpecialToolsUA(options);
};


