/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsUA = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div');
        
        const controlDivButton = L.DomUtil.create('div', 'special-tools-button-UA special-tools-controls special-tools-disable', controlDiv);
        controlDivButton.innerText = 'U.A';
        
        const leaflet_control_select_UA = L.DomUtil.create('select', 'special-tools-menu-UA', controlDiv);
        leaflet_control_select_UA.style.display = 'none';
        
        const leaflet_control_munic_UA = L.DomUtil.create('option', 'special-tools-option-UA', leaflet_control_select_UA);
        leaflet_control_munic_UA.selected = true;
        leaflet_control_munic_UA.value = 'Municipio';
        leaflet_control_munic_UA.innerText = 'Municipio';
        leaflet_control_munic_UA.title = 'Municipio';
        
        const leaflet_control_prov_UA = L.DomUtil.create('option', 'special-tools-option-UA', leaflet_control_select_UA);
        leaflet_control_prov_UA.selected = false;
        leaflet_control_prov_UA.value = 'Provincia';
        leaflet_control_prov_UA.innerText = 'Provincia';
        leaflet_control_prov_UA.title = 'Provincia';
        
        const leaflet_control_CCAA_UA = L.DomUtil.create('option', 'special-tools-option-UA', leaflet_control_select_UA);
        leaflet_control_CCAA_UA.selected = false;
        leaflet_control_CCAA_UA.value = 'CCAA';
        leaflet_control_CCAA_UA.innerText = 'CCAA';
        leaflet_control_CCAA_UA.title = 'CCAA';

        special_tools.special_tools_btns.appendChild(controlDiv);


        var enable_UA = false;
        var wms = null;
        var UA_selected = 'Municipio';
        
        var hover_select_UA = false;

        L.DomEvent.addListener(leaflet_control_select_UA, 'change', function(){
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
                                    if (typeof data !== 'undefined')
                                        {
                                            if (data.hasOwnProperty('features')) {
                                                
                                                for (let feature in data.features) {
                                                    const data_feature = data.features[feature];
                                                    const nationallevel = data_feature.properties.nationallevel;
                                                    multi_id = special_tools.make_id(20);
                                                    
                                                    if (UA_selected === 'Municipio') {
                                                            if (nationallevel === 'https://inspire.ec.europa.eu/codelist/AdministrativeHierarchyLevel/4thOrder') {
                                    
                                                                geojson = data_feature;
                                                                coordinates = geojson.geometry.coordinates;

                                                                for (let coords in coordinates) {
                                                                    for(let coord in coordinates[coords]) {
                                                                        multipolygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[coords][coord]);
                                                                    }
                                                                    
                                                                multipolygon = L.polygon(multipolygon_coord);

                                                                multipolygon.feature = multipolygon.toGeoJSON();
                                                                tools_id = special_tools.make_id(20);
                                                                multipolygon.feature.special_tools = {};
                                                                multipolygon.feature.special_tools.tools_id = tools_id;
                                                                multipolygon.feature.special_tools.is_UA = true;
                                                                multipolygon.feature.special_tools.geoman_edition = false;
                                                                multipolygon.feature.special_tools.multi_id = multi_id;
                                                                multipolygon.feature.properties = geojson.properties;

                                                                map.fire('pm:create', {layer: multipolygon});

                                                                map.setView(multipolygon.getBounds().getCenter(), 10);

                                                                }
                                                                
                                                                break;
                                                                
                                                        }
                                                    }
                                                    else if (UA_selected === 'Provincia') {
                                                        if (nationallevel === 'https://inspire.ec.europa.eu/codelist/AdministrativeHierarchyLevel/3rdOrder') {
                                    
                                                                geojson = data_feature;
                                                                coordinates = geojson.geometry.coordinates;

                                                                for (let coords in coordinates) {
                                                                    for(let coord in coordinates[coords]) {
                                                                        multipolygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[coords][coord]);
                                                                    }
                                                                    
                                                                multipolygon = L.polygon(multipolygon_coord);

                                                                multipolygon.feature = multipolygon.toGeoJSON();
                                                                tools_id = special_tools.make_id(20);
                                                                multipolygon.feature.special_tools = {};
                                                                multipolygon.feature.special_tools.tools_id = tools_id;
                                                                multipolygon.feature.special_tools.is_UA = true;
                                                                multipolygon.feature.special_tools.geoman_edition = false;
                                                                multipolygon.feature.special_tools.multi_id = multi_id;
                                                                multipolygon.feature.properties = geojson.properties;

                                                                map.fire('pm:create', {layer: multipolygon});

                                                                map.setView(multipolygon.getBounds().getCenter(), 8);

                                                                }
                                                                
                                                                break;
                                                                
                                                        }
                                                    }
                                                    else if (UA_selected === 'CCAA') {
                                                        if (nationallevel === 'https://inspire.ec.europa.eu/codelist/AdministrativeHierarchyLevel/2ndOrder') {
                                    
                                                                geojson = data_feature;
                                                                coordinates = geojson.geometry.coordinates;

                                                                for (let coords in coordinates) {
                                                                    for(let coord in coordinates[coords]) {
                                                                        multipolygon_coord = L.GeoJSON.coordsToLatLngs(coordinates[coords][coord]);
                                                                    }
                                                                    
                                                                multipolygon = L.polygon(multipolygon_coord);

                                                                multipolygon.feature = multipolygon.toGeoJSON();
                                                                tools_id = special_tools.make_id(20);
                                                                multipolygon.feature.special_tools = {};
                                                                multipolygon.feature.special_tools.tools_id = tools_id;
                                                                multipolygon.feature.special_tools.is_UA = true;
                                                                multipolygon.feature.special_tools.geoman_edition = false;
                                                                multipolygon.feature.special_tools.multi_id = multi_id;
                                                                multipolygon.feature.properties = geojson.properties;

                                                                map.fire('pm:create', {layer: multipolygon});

                                                                map.setView(multipolygon.getBounds().getCenter(), 6);

                                                                }
                                                                
                                                                break;
                                                                
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                })
                                .catch((error) => console.log(error));
                                }
                        });
                    }, 3000);   
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


