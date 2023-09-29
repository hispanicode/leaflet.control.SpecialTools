/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsCatastro = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-catastro special-tools-controls special-tools-disable');
         controlDiv.innerText = 'Catast';

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var enable_catastro = false;
        
        var wms = null;

        L.DomEvent.addListener(controlDiv, 'click', function(e){
            
            if (L.DomUtil.hasClass(controlDiv, 'special-tools-disable')) {
                
                    L.DomUtil.addClass(controlDiv, 'special-tools-enable');
                    L.DomUtil.removeClass(controlDiv, 'special-tools-disable');

                    let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');

                    try {
                        special_tools.only_one_control_active(elements_controls, controlDiv);
                    } catch (e) {};

                    enable_catastro = true;

                    wms = L.tileLayer.wms('http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?', {opacity: 1});

                    component_geolocation.layer_control.addBaseLayer(wms, "Catastro");

                    leaflet_control_layers_base = document.querySelector('.leaflet-control-layers-base');

                    last_basemap_index = leaflet_control_layers_base.querySelectorAll('.leaflet-control-layers-selector').length-1;

                    catastro_html = leaflet_control_layers_base.querySelectorAll('.leaflet-control-layers-selector')[last_basemap_index];

                    catastro_html.click();

                }  else {

                    L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                    L.DomUtil.removeClass(controlDiv, 'special-tools-enable');

                    component_geolocation.layer_control.removeLayer(wms);
                    wms.removeFrom(map);
                    document.querySelectorAll('.leaflet-control-layers-selector')[0].click();
                    enable_catastro = false;
                }

                L.DomEvent.stop(e);
                
            });
            
            map_click = function(event){

                if (
                    !special_tools.geoman_edition_mode(map)
                    && enable_catastro) {

                    let bbox = map.getBounds().toBBoxString();

                    let point = map.latLngToContainerPoint(event.latlng, map.getZoom());

                    let size = map.getSize();

                    let url = route+'/ajax/catastro/catastro_wms_refcat.php?';

                    fetch(url + new URLSearchParams({
                        url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?request=getFeatureInfo&layers=Catastro&query_layers=Catastro&srs=EPSG:4326&bbox='+bbox+'&height='+size.y+'&width='+size.x+'&x='+point.x+'&y='+point.y
                    }))
                    .then(function(response) {
                        return response.text();
                    })
                    .then(function(data){
                        let content = L.DomUtil.create('div');
                        content.innerHTML = data;
                        let refcat = content.innerText.trim();
                        let refcat_url = content.querySelectorAll('a')[0].href;
                        if (typeof refcat_url !== 'undefined') {

                            url = route+'/ajax/catastro/catastro_wfs_getfeature.php?';

                            fetch(url + new URLSearchParams({
                                url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getneighbourparcel&refcat='+refcat,
                                getneighbourparcel: 1
                            }))
                            .then(function(response) {
                                return response.text();
                            })
                            .then(function(polygon_coord){
                                if (polygon_coord !== '') {

                                    let latlngs = JSON.parse(polygon_coord);

                                    let polygon = L.polygon(latlngs);

                                    polygon.feature = polygon.toGeoJSON();
                                    polygon.feature.special_tools = {};
                                    polygon.feature.special_tools.is_catastro = true;
                                    polygon.feature.special_tools.geoman_edition = false;
                                    polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                    //URL de la parcela catastral
                                    polygon.feature.properties.url = refcat_url;

                                    map.fire('pm:create', {layer: polygon});
                                    L.DomEvent.stop(event);

                                } else {

                                    url = route+'/ajax/catastro/catastro_wfs_getfeature.php?';
                                    fetch(url + new URLSearchParams({
                                        url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getparcel&refcat='+refcat,
                                        getparcel: 1
                                    }))
                                    .then(function(response){
                                        return response.text();
                                    })
                                    .then(function(polygon_coord){

                                        if (polygon_coord !== '') {

                                            let latlngs = JSON.parse(polygon_coord);
                                            let polygon = L.polygon(latlngs);

                                            polygon.feature = polygon.toGeoJSON();
                                            polygon.feature.special_tools = {};
                                            polygon.feature.special_tools.is_catastro = true;
                                            polygon.feature.special_tools.geoman_edition = false;
                                            polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                            //URL de la parcela catastral
                                            polygon.feature.properties.url = refcat_url;

                                            map.fire('pm:create', {layer: polygon});
                                            L.DomEvent.stop(event);

                                        }
                                    })
                                    .catch((error) => console.log(error));
                                }
                            })
                            .catch((error) => console.log(error));
                        }
                    })
                    .catch((error) => console.log(error));

                    map.off('click', map_click);

                    window.setTimeout(function(){
                        map.on('click', map_click);
                    }, 3000);

                }
            };

        var stop = false;
        
        layer_click = function(event){

            const _layer = this;

            if (
                !special_tools.geoman_edition_mode(map)
                && enable_catastro && !stop
                ) {

                let bbox = map.getBounds().toBBoxString();

                let point = map.latLngToContainerPoint(event.latlng, map.getZoom());

                let size = map.getSize();

                let url = route+'/ajax/catastro/catastro_wms_refcat.php?';

                fetch(url + new URLSearchParams({
                    url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?request=getFeatureInfo&layers=Catastro&query_layers=Catastro&srs=EPSG:4326&bbox='+bbox+'&height='+size.y+'&width='+size.x+'&x='+point.x+'&y='+point.y
                }))
                .then(function(response) {
                    return response.text();
                })
                .then(function(data){
                    let content = L.DomUtil.create('div');
                    content.innerHTML = data;
                    let refcat = content.innerText.trim();
                    let refcat_url = content.querySelectorAll('a')[0].href;
                    if (typeof refcat_url !== 'undefined') {

                        url = route+'/ajax/catastro/catastro_wfs_getfeature.php?';

                        fetch(url + new URLSearchParams({
                            url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getneighbourparcel&refcat='+refcat,
                            getneighbourparcel: 1
                        }))
                        .then(function(response) {
                            return response.text();
                        })
                        .then(function(polygon_coord){
                            if (polygon_coord !== '') {

                                let latlngs = JSON.parse(polygon_coord);

                                let polygon = L.polygon(latlngs);

                                polygon.feature = polygon.toGeoJSON();
                                polygon.feature.special_tools = {};
                                polygon.feature.special_tools.is_catastro = true;
                                polygon.feature.special_tools.geoman_edition = false;
                                polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                //URL de la parcela catastral
                                polygon.feature.properties.url = refcat_url;

                                if (_layer.hasOwnProperty('feature')) {
                                    if (_layer.feature.geometry.coordinates === polygon.feature.geometry.coordinates) {
                                        return;
                                    }
                                }

                                map.fire('pm:create', {layer: polygon});

                            } else {

                                url = route+'/ajax/catastro/catastro_wfs_getfeature.php?';
                                fetch(url + new URLSearchParams({
                                    url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getparcel&refcat='+refcat,
                                    getparcel: 1
                                }))
                                .then(function(response){
                                    return response.text();
                                })
                                .then(function(polygon_coord){

                                    if (polygon_coord !== '') {

                                        let latlngs = JSON.parse(polygon_coord);
                                        let polygon = L.polygon(latlngs);

                                        polygon.feature = polygon.toGeoJSON();

                                        polygon.feature.special_tools = {};
                                        polygon.feature.special_tools.is_catastro = true;
                                        polygon.feature.special_tools.geoman_edition = false;
                                        polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                        //URL de la parcela catastral
                                        polygon.feature.properties.url = refcat_url;

                                        map.fire('pm:create', {layer: polygon});

                                    }
                                })
                                .catch((error) => console.log(error));
                            }
                        })
                        .catch((error) => console.log(error));
                    }
                })
                .catch((error) => console.log(error));
        
                stop = true;
                
                _layer.off('click', map_click);
 
                window.setTimeout(function(){
                    _layer.on('click', map_click);
                    stop = false;
                }, 3000);
        
            }

        };     
         
        map.off('click', map_click);

        map.eachLayer(function(layer){

            if (!(layer instanceof L.TileLayer)) {
                layer.off('click', layer_click);
            }

        });

        window.setTimeout(function(){

            map.on('click', map_click);

            map.eachLayer(function(layer){

                if (!(layer instanceof L.TileLayer)) {
                    layer.on('click', layer_click);
                }

            });

        }, 1500);
                
               
        false_div = L.DomUtil.create('div');
        return false_div;
        
    }
});

L.control.specialToolsCatastro = function (options) {
    return new L.Control.SpecialToolsCatastro(options);
};