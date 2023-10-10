/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsOneXOne = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-oneXone special-tools-controls special-tools-disable');
        controlDiv.innerText = '1x1';

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var enable_oneXone = false;
        
        map.on("pm:create", function(){
                L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                L.DomUtil.removeClass(controlDiv, 'special-tools-enable');
                enable_oneXone = false;
        });

        L.DomEvent.addListener(controlDiv, 'click', function(e){

            if (L.DomUtil.hasClass(controlDiv, 'special-tools-disable')) {
                
                L.DomUtil.addClass(controlDiv, 'special-tools-enable');
                L.DomUtil.removeClass(controlDiv, 'special-tools-disable');
                
                let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');

                try {
                    special_tools.only_one_control_active(elements_controls, controlDiv);
                } catch (e) {};
                
                enable_oneXone = true;
                
            }  else {
                
                L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                L.DomUtil.removeClass(controlDiv, 'special-tools-enable');
                enable_oneXone = false;
                
            }
                          
            map.eachLayer(function(layer){

                if (!(layer instanceof L.TileLayer)) {

                    if (special_tools.is_point(layer) && !special_tools.is_centroid(layer)) {

                        L.DomEvent.addListener(layer, 'click', function(){

                            if (!enable_oneXone) return;

                            if  (!special_tools.geoman_edition_mode(map) && !special_tools.is_oneXone(this)) {

                                multi_id = special_tools.make_id(20);

                                if (!special_tools.is_special_tools(this)) {

                                    this.feature.special_tools = {};
                                }

                                this.feature.special_tools.is_oneXone = true;
                                this.feature.special_tools.oneXone_type = 'Marker';
                                this.feature.special_tools.geoman_edition = false;
                                this.feature.special_tools.tools_id = special_tools.make_id(20);
                                this.feature.special_tools.multi_id = multi_id;

                                radiusMts = 1;

                                bounds = L.latLng(this._latlng).toBounds(radiusMts);

                                rectangle = L.rectangle(bounds);

                                rectangle.feature = rectangle.toGeoJSON();
                                rectangle.feature.special_tools = this.feature.special_tools;
                                rectangle.feature.special_tools.oneXone_type = 'Rectangle';
                                rectangle.feature.special_tools.tools_id = special_tools.make_id(20);

                                if (server) {
                                    
                                    map.fire('pm:create', {layer: rectangle});
                                    
                                } else {
                                    
                                    rectangle.addTo(map);
                                    special_tools.set_info_console(rectangle);
                                    
                                }

                                rectangle.fireEvent('click');

                                L.DomUtil.addClass(controlDiv, 'special-tools-enable');
                                L.DomUtil.removeClass(controlDiv, 'special-tools-disable');
                                enable_oneXone = true;

                                L.DomEvent.off(layer);
                                
                            }
                        });
                    }
                }
            });
            
            L.DomEvent.preventDefault(e);
            
        });
               
        false_div = L.DomUtil.create('div');
        return false_div;
        
    }
});

L.control.specialToolsOneXOne = function (options) {
    
    return new L.Control.SpecialToolsOneXOne(options);
    
};