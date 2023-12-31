/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsGeolocation = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsGeolocation/lang/lang.json')
        .then(function(response){
            
            return response.json();
            
        }).then(function(data){
            
            json_lang = data;
            
        });
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-geolocation special-tools-controls special-tools-disable');

        special_tools.special_tools_btns.appendChild(controlDiv);

        L.DomEvent.addListener(controlDiv, 'click', function(){
            
            L.DomUtil.addClass(controlDiv, 'special-tools-enable');
            L.DomUtil.removeClass(controlDiv, 'special-tools-disable');
            
            let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');

            try {
                special_tools.only_one_control_active(elements_controls, controlDiv);
            } catch (e) {};
            
            map.locate({
                
                setView: true, 
                maxZoom: 16,
                enableHighAccuracy: true,
                timeout: 14000
            
            });
            
            map.on('locationfound', function(e){
                
                if (L.DomUtil.hasClass(controlDiv, 'special-tools-disable')) {
                    
                    return;
                    
                }
                
                marker = L.marker(e.latlng);
                marker.feature = marker.toGeoJSON();
                marker.feature.special_tools = {};
                marker.feature.special_tools.tools_id = special_tools.make_id(20);

                if (server) {

                    map.fire('pm:create', {layer: marker});

                } else {

                    marker.addTo(map);
                    special_tools.set_info_console(marker);

                }
                
                map.setView(e.latlng, 16);
                
                map.stopLocate();
                
                L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                L.DomUtil.removeClass(controlDiv, 'special-tools-enable');

                L.DomEvent.preventDefault(e);
                
            });
            
            map.on('locationerror', function(e){
                
                alert(special_tools._T("No ha sido posible encontrar la localización", json_lang, lang));
                
                L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                L.DomUtil.removeClass(controlDiv, 'special-tools-enable');
                
                L.DomEvent.preventDefault(e);
                
            });
            
        });
               
        false_div = L.DomUtil.create('div');
        
        return false_div;
        
    }
});

L.control.specialToolsGeolocation = function (options) {
    
    return new L.Control.SpecialToolsGeolocation(options);
    
};
