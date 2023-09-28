/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialTools = L.Control.extend({

    onAdd: function (map) {

        const self = this;
        
        this.map = map;
        
        this.component_geolocation = this.options.component_geolocation;
        
        this.route = this.options.route;
        
        this.server = this.options.server;

        this.controlDiv = L.DomUtil.create('div', 'special-tools');

        this.special_tools_btns = L.DomUtil.create('div', 'special-tools-btns', this.controlDiv);
        
        this.special_tools_panel_show_hide = L.DomUtil.create('div', 'special-tools-panel-show-hide', this.special_tools_btns);
        this.special_tools_panel_show_hide.setAttribute('show', '1');
        
        this.special_tools_console = L.DomUtil.create('div', 'special-tools-console', this.controlDiv);
        
        this.special_tools_info_console = L.DomUtil.create('div', 'special-tools-info-console', this.special_tools_console);
        
        window.setTimeout(function(){
            
            map.eachLayer(function(layer){
                
                self.set_info_console(layer);
                
            });
            
        }, 500);

        /*
         * Mensaje inicial de la consola
         */
        
        self.special_tools_info_console.innerHTML = 'Haga clic sobre algún objeto del mapa.';

        map.on('pm:remove', function(e){

            if (self.has_centroid(e.layer)) {
                
                centroid_id = e.layer.feature.special_tools.centroid_tools_id;
                centroid = self.get_layer_by_tools_id(map, centroid_id);
                centroid.pm.remove();
                
            }
            
            if (self.is_multi(e.layer)) {
                
                multi_id = self.get_multi_id(e.layer);
                self.remove_by_multi_id(map, multi_id);
                
            }
            
            if (!self.is_centroid(e.layer)) {
                self.special_tools_info_console.innerHTML = 'Haga clic sobre algún objeto del mapa.';
            }
            
        });

        map.on('pm:create', function(e){

            if (!e.layer.hasOwnProperty('feature')) {
                
                e.layer.feature = e.layer.toGeoJSON();
                e.layer.feature.special_tools = {};
                e.layer.feature.special_tools.tools_id = self.make_id(20);
                e.layer.feature.special_tools.geoman_edition = false;
                
            } else {
                
                if (!self.is_special_tools(e.layer)) {
                    
                    e.layer.feature.special_tools = {};
                    e.layer.feature.special_tools.tools_id = self.make_id(20);
                    e.layer.feature.special_tools.geoman_edition = false;
                    
                }
                
            }
            
            self.set_info_console(e.layer);

        });

        var last_position = null;
        
        map.on('move', function(e){
            
            map_bounds = map.getBounds();

                map.eachLayer(function(layer){
                    
                    if (!(layer instanceof L.TileLayer)) {
                        
                        if (layer instanceof L.Polygon || layer instanceof L.Rectangle)
                        {
                            
                            if (self.has_centroid(layer) && self.is_incertidumbre(layer)) {

                            centroid_id = layer.feature.special_tools.centroid_tools_id;
                            centroid = self.get_layer_by_tools_id(self.map, centroid_id);
                            centroid_latlng = centroid._latlng;

                            new_polygon = new Array();
                            
                                poly_1 = turf.bboxPolygon(
                                    [
                                        map_bounds.getWest(),
                                        map_bounds.getSouth(),
                                        map_bounds.getEast(),
                                        map_bounds.getNorth()
                                    ] 
                                );
                                poly_2 = turf.bboxPolygon(
                                    [
                                        layer.getBounds().getWest(),
                                        layer.getBounds().getSouth(),
                                        layer.getBounds().getEast(),
                                        layer.getBounds().getNorth()
                                    ]
                                );
                                area_poly_1 = turf.area(poly_1);
                                area_poly_2 = turf.area(poly_2);
                            
                                if (!map_bounds.contains(layer.getBounds().getCenter()) && area_poly_1 > area_poly_2) {

                                 midpoint = turf.midpoint(
                                        [layer.getBounds().getCenter().lat, layer.getBounds().getCenter().lng], 
                                        [
                                            layer.getBounds().getSouthWest().lat, 
                                            layer.getBounds().getSouthWest().lng]
                                        );
                                
                                new_coordinates = L.latLng(midpoint.geometry.coordinates);
                                if (map_bounds.contains(new_coordinates) && self.point_in_polygon(new_coordinates, layer)) {
                                    centroid.setLatLng(new_coordinates);
                                    return;
                                } else {
                                    
                                }
                                
                                 midpoint = turf.midpoint(
                                        [layer.getBounds().getCenter().lat, layer.getBounds().getCenter().lng], 
                                        [
                                            layer.getBounds().getNorthEast().lat, 
                                            layer.getBounds().getNorthEast().lng]
                                        );
                                
                                new_coordinates = L.latLng(midpoint.geometry.coordinates);
                                if (map_bounds.contains(new_coordinates) && self.point_in_polygon(new_coordinates, layer)) {
                                    centroid.setLatLng(new_coordinates);
                                    return;
                                }
                                
                               
                                 midpoint = turf.midpoint(
                                        [layer.getBounds().getCenter().lat, layer.getBounds().getCenter().lng], 
                                        [
                                            layer.getBounds().getNorthWest().lat, 
                                            layer.getBounds().getNorthWest().lng]
                                        );
                                
                                new_coordinates = L.latLng(midpoint.geometry.coordinates);
                                if (map_bounds.contains(new_coordinates) && self.point_in_polygon(new_coordinates, layer)) {
                                    centroid.setLatLng(new_coordinates);
                                    return;
                                }
                                
                                 midpoint = turf.midpoint(
                                        [layer.getBounds().getCenter().lat, layer.getBounds().getCenter().lng], 
                                        [
                                            layer.getBounds().getSouthEast().lat, 
                                            layer.getBounds().getSouthEast().lng]
                                        );
                                
                                new_coordinates = L.latLng(midpoint.geometry.coordinates);
                                if (map_bounds.contains(new_coordinates) && self.point_in_polygon(new_coordinates, layer)) {
                                    centroid.setLatLng(new_coordinates);
                                    return;
                                }
                                
                                if (map_bounds.contains(layer.getBounds().getSouthWest())) {
                                    new_coordinates = layer.getBounds().getSouthWest();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    } 
                                }
                                
                                if (map_bounds.contains(layer.getBounds().getNorthEast())) {
                                    new_coordinates = layer.getBounds().getNorthEast();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                }
                                
                                if (map_bounds.contains(layer.getBounds().getNorthWest())) {
                                    new_coordinates = layer.getBounds().getNorthWest();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                }
                                
                                if (map_bounds.contains(layer.getBounds().getSouthEast())) {
                                    new_coordinates = layer.getBounds().getSouthEast();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                } 
                                

                            } else if (area_poly_1 < area_poly_2 && layer.getBounds().contains(map_bounds.getCenter())){
                                
                            if (self.point_in_polygon(map_bounds.getCenter(), layer)) {
                                last_position = map_bounds.getCenter();
                                centroid.setLatLng(map_bounds.getCenter());
                                return;
                            }
                                
                            } else if (map_bounds.contains(layer.getBounds().getCenter()) && area_poly_1 > area_poly_2) {
                                
                                if (self.point_in_polygon(layer.getBounds().getCenter(), layer)) {
                                    centroid.setLatLng(layer.getBounds().getCenter());
                                    return;
                                } else {
                                    if (last_position !== null) {
                                        centroid.setLatLng(last_position);
                                    }
                                }
                                
                            } else if(area_poly_1 < area_poly_2 && !layer.getBounds().contains(map_bounds.getCenter())) {
                                
                                if(
                                    last_position !== null 
                                    && layer.getBounds().contains(last_position)
                                    && self.point_in_polygon(last_position, layer)
                                ) {
                                    centroid.setLatLng(last_position);
                                    return;
                                }

                                else if (map_bounds.contains(layer.getBounds().getSouthWest())) {
                                    new_coordinates = layer.getBounds().getSouthWest();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                }
                                
                                else if (map_bounds.contains(layer.getBounds().getNorthEast())) {
                                    new_coordinates = layer.getBounds().getNorthEast();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                }
                                
                                else if (map_bounds.contains(layer.getBounds().getNorthWest())) {
                                    new_coordinates = layer.getBounds().getNorthWest();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                }
                                
                                else if (map_bounds.contains(layer.getBounds().getSouthEast())) {
                                    new_coordinates = layer.getBounds().getSouthEast();
                                    if (self.point_in_polygon(new_coordinates, layer)) {
                                        centroid.setLatLng(new_coordinates);
                                        return;
                                    }
                                }
                                
                            }
                        }
                    }
                }
            });
        });
        
        /* Mostrar-Ocultar consola */
        L.DomEvent.addListener(this.special_tools_panel_show_hide, 'click', function() {
            
           if (this.getAttribute('show') === '1') {
               
               this.setAttribute('show', '0');
               
               self.special_tools_console.style.display = 'none';
               
           } else if (this.getAttribute('show') === '0') {
               
               this.setAttribute('show', '1');
               
               self.special_tools_console.style.display = 'block';
               
           }
        });
        /* Mostrar-Ocultar consola */

        return this.controlDiv;

    },
    
    set_info_console: function(layer) {
        
        self = this;

        let geometry_type = null;
  
        if (!(layer instanceof L.TileLayer)) {

            if (!self.is_special_tools(layer)) {

                if (layer.hasOwnProperty('feature')) {

                    layer.feature.special_tools = {};
                    layer.feature.special_tools.tools_id = self.make_id(20);
                    layer.feature.special_tools.geoman_edition = false;

                }
            }

            if (self.is_point(layer) && !self.is_circle(layer)) {
                
                if (layer instanceof L.Marker) {

                    icon = L.icon({
                        
                        iconUrl: self.route + '/img/pin.svg',
                        iconSize: [36, 36],
                        iconAnchor: [18, 34]
                        
                    });

                    layer.setIcon(icon);

                    if (layer.feature.properties.hasOwnProperty('color')) {
                        
                        default_color = layer.feature.properties.color;
                        
                    } else {
                        
                        default_color = '#3388ff';
                        
                    }
                    
                    if (!layer.feature.special_tools.hasOwnProperty('marker_filter')) {
                    
                        _compute = compute(default_color);
                        
                        layer._icon.style.filter = _compute.result.filterRaw;

                    
                    } else {
                        
                        layer._icon.style.filter = layer.feature.special_tools.marker_filter;
                        
                    }

                }


                if (!self.is_geoman_edition_mode(layer)) {
                    
                    self.pm_disable(layer);

                } else {
                    
                    self.pm_enable(layer);

                }

                layer.on('click pm:edit', function(){
                    
                    geometry_type = this.feature.geometry.type;

                    let content = "<p>Tipo: " + geometry_type + "</p>";

                    if (!self.is_geoman_edition_mode(this)) {

                        self.pm_disable(this);

                    } else {

                        self.pm_enable(this);

                    }

                    if (self.is_oneXone(this)) {

                        content = content + "<p>Punto de referencia de polígono de 1 m²</p>";

                    }

                    content = content + "<p>Coordenadas:</p>";
                    content = content + "<p>" + this._latlng.lat + " " + this._latlng.lng + "</p>";

                    let properties = this.feature.properties;

                    for (let prop in properties) {

                        if (
                            properties[prop] !== null 
                            && prop !== 'color' 
                            && prop !== 'layer_id'
                            && typeof properties[prop] !== 'object'
                        ){
                            if (self.is_url(properties[prop])) {

                                content = content + "<p><a href='" + properties[prop] + "' target='_blank'>Más información</a></p>";

                            } else {

                                content = content + "<p>" + prop + ": " + properties[prop] + "</p>";

                            }
                        }

                    }
                    
                    let tools_id = self.get_tools_id_by_layer(this);
                    
                    let checked_geoman = '';
                    if (self.is_geoman_edition_mode(this)) {

                        checked_geoman = 'checked';

                    }

                    content = content + '<div class="leaflet-control-geoman-edition"><input type="checkbox" id="leaflet_control_geoman_edition" tools_id="'+tools_id+'" '+checked_geoman+'><span> Edición Geoman activa</span></div>';
                    
                    content = content + "<p><button id='btn_marker_style' class='special-tools-btn-default' style='font-size: 9px;'>Editar estilos</button>";
                    
                    content = content + "<button id='btn_show_modal_vector_download' class='special-tools-btn-default' style='font-size: 9px;'>Descargar</button></p>";

                    self.special_tools_info_console.innerHTML = content;
                    
                    const _this = this; //layer
                    
                    leaflet_control_geoman_edition = self.special_tools_info_console.querySelector("#leaflet_control_geoman_edition");

                    L.DomEvent.on(leaflet_control_geoman_edition, "click", function(){

                        if (this.checked) {
                            
                            self.pm_enable(_this);

                            _this.feature.special_tools.geoman_edition = true;

                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            
                            }


                        } else {
                            
                            self.pm_disable(_this);

                            _this.feature.special_tools.geoman_edition = false;

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        }
                        
                    });
                    
                    btn_show_modal_vector_download = self.special_tools_info_console.querySelector('#btn_show_modal_vector_download');  
                    self.show_modal_vector_download(btn_show_modal_vector_download, this, self, L);
                    
                    btn_marker_style = self.special_tools_info_console.querySelector('#btn_marker_style');
                    
                    self.marker_style(btn_marker_style, self.map, layer);
                    
                });
            }

            else if (self.is_circle(layer)) {
                
                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {

                    layer.setStyle({color: layer.feature.special_tools.obj_stroke_color});
                    layer.setStyle({fillColor: layer.feature.special_tools.obj_stroke_color});

                } else if (layer.feature.properties.hasOwnProperty('color')) {
                        
                    default_color = layer.feature.properties.color;
                    layer.setStyle({color: default_color});
                    layer.setStyle({fillColor: default_color});
                        
                } else {

                    default_color = '#3388ff';
                    layer.setStyle({color: default_color});
                    layer.setStyle({fillColor: default_color});

                }


                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {

                    layer.setStyle({weight: layer.feature.special_tools.obj_stroke_width});

                }

                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {

                    layer.setStyle({opacity: layer.feature.special_tools.obj_stroke_opacity});

                }

                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_dasharray')) {

                    layer.setStyle({
                        
                        dashArray: layer.feature.special_tools.obj_stroke_dasharray,
                        dashOffset: 0
                    
                    });

                }

                if (layer.feature.special_tools.hasOwnProperty('obj_fill_opacity')) {

                    layer.setStyle({fillOpacity: layer.feature.special_tools.obj_fill_opacity});

                }
                
                if (!self.is_geoman_edition_mode(layer)) {
                    
                    self.pm_disable(layer);

                } else {
                    
                    self.pm_enable(layer);

                }
                
                if (layer.feature.special_tools.hasOwnProperty('bringToBack')) {
                    if (layer.feature.special_tools.bringToBack) {
                        layer.bringToBack();
                    }
                }

                if (layer.feature.special_tools.hasOwnProperty('bringToFront')) {
                    if (layer.feature.special_tools.bringToFront) {
                        layer.bringToFront();
                    }
                }
   
                layer.on('click pm:edit', function() {

                    geometry_type = this.feature.geometry.type;

                    let content = "<p>Tipo: " + geometry_type + "</p>";

                    if (!self.is_geoman_edition_mode(this)) {
                        
                        self.pm_disable(this);

                    } else {
                        
                        self.pm_enable(this);
                    }
                    
                    let checked_bringtoback = '';
                    let checked_bringtofront = '';

                    if (layer.feature.special_tools.hasOwnProperty('bringToBack')) {
                        if (layer.feature.special_tools.bringToBack) {
                            layer.bringToBack();
                            checked_bringtoback = 'checked';
                            checked_bringtofront = '';
                        }
                    }

                    if (layer.feature.special_tools.hasOwnProperty('bringToFront')) {
                        if (layer.feature.special_tools.bringToFront) {
                            layer.bringToFront();
                            checked_bringtoback = '';
                            checked_bringtofront = 'checked';
                        }
                    }

                    content = content + "<p>Coordenadas del eje:</p>";
                    content = content + "<p>" + this._latlng.lat + " " + this._latlng.lng + "</p>";

                    let radius = this.getRadius().toFixed(2);
                    content = content + "<p>Radio: " + radius + " m.</p>";

                    let area = (2 * Math.PI * radius).toFixed(2);
                    content = content + "<p>Área: " + area + " m.</p>";

                    let properties = this.feature.properties;

                    for (let prop in properties) {

                        if (
                            properties[prop] !== null 
                            && prop !== 'color' 
                            && prop !== 'layer_id'
                            && typeof properties[prop] !== 'object'
                        ){
                            if (self.is_url(properties[prop])) {

                                content = content + "<p><a href='" + properties[prop] + "' target='_blank'>Más información</a></p>";

                            } else {

                                content = content + "<p>" + prop + ": " + properties[prop] + "</p>";

                            }
                        }

                    }
                     
                    let tools_id = self.get_tools_id_by_layer(this);

                    let checked_centroid = '';
                    if (self.has_centroid(this)) {

                        checked_centroid = 'checked';

                    }

                    let checked_geoman = '';
                    if (self.is_geoman_edition_mode(this)) {

                        checked_geoman = 'checked';

                    }
                    
                    content = content + '<div class="leaflet-control-centroide"><input type="checkbox" id="leaflet_control_centroide" tools_id="'+tools_id+'" '+checked_centroid+'><span> Centroide</span></div>';
                    content = content + '<div class="leaflet-control-geoman-edition"><input type="checkbox" id="leaflet_control_geoman_edition" tools_id="'+tools_id+'" '+checked_geoman+'><span> Edición Geoman activa</span></div>';
                     
                    //bringToFront - bringToBack
                    content = content + "<h4>Jerarquía del objeto:</h4>"
                    content = content + "<div><input type='checkbox' id='leaflet_control_bringtofront' tools-id='" + tools_id + "' " + checked_bringtofront + "><span> Delante</span></div>";
                    content = content + "<div><input type='checkbox' id='leaflet_control_bringtoback' tools-id='" + tools_id + "' " + checked_bringtoback + "><span> Detrás</span></div>"; 
                    content = content + "<p><button id='btn_circle_style' class='special-tools-btn-default' style='font-size: 9px;'>Editar estilos</button>";
                    content = content + "<button id='btn_show_modal_vector_download' class='special-tools-btn-default' style='font-size: 9px;'>Descargar</button></p>";
                     
                    self.special_tools_info_console.innerHTML = content;
                    
                    const _this = this; //layer
                    
                    leaflet_control_centroide = self.special_tools_info_console.querySelector("#leaflet_control_centroide");

                    L.DomEvent.on(leaflet_control_centroide, "click", function(){

                        if (this.checked) {

                            centroid = layer.getBounds().getCenter();
                            
                            const circle = L.marker(centroid);

                            circle.feature = circle.toGeoJSON();
                            circle.feature.special_tools = {};
                            circle.feature.special_tools.is_centroid = true;

                            const new_tools_id = self.make_id(20);

                            circle.feature.special_tools.tools_id = new_tools_id;

                            _this.feature.special_tools.has_centroid = true;
                            _this.feature.special_tools.centroid_tools_id = new_tools_id;

                            self.map.fire('pm:create', {layer: circle});

                        } else {

                            if (self.has_centroid(_this)) {

                                let centroid_tools_id = _this.feature.special_tools.centroid_tools_id;

                                let centroid = self.get_layer_by_tools_id(self.map, centroid_tools_id);

                                _this.feature.special_tools.has_centroid = false;
                                _this.feature.special_tools.centroid_tools_id = null;

                                centroid.pm.remove();
                            }
                        }

                    });

                    leaflet_control_geoman_edition = self.special_tools_info_console.querySelector("#leaflet_control_geoman_edition");

                    L.DomEvent.on(leaflet_control_geoman_edition, "click", function(){

                        if (this.checked) {
                            
                            self.pm_enable(_this);

                            _this.feature.special_tools.geoman_edition = true;

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }


                        } else {
                            
                            self.pm_disable(_this);

                            _this.feature.special_tools.geoman_edition = false;

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        }
                    });
                    
                    leaflet_control_bringtoback = self.special_tools_info_console.querySelector("#leaflet_control_bringtoback");
                    leaflet_control_bringtofront = self.special_tools_info_console.querySelector("#leaflet_control_bringtofront");
                    
                    L.DomEvent.on(leaflet_control_bringtoback, "click", function(){
                        
                        if (this.checked) {
                            
                            _this.feature.special_tools.bringToBack = true;
                            _this.feature.special_tools.bringToFront = false;
                            leaflet_control_bringtofront.checked = false;
                            _this.bringToBack();
                            
                        } else {
                            _this.feature.special_tools.bringToBack = false;
                            _this.bringToFront();
                        }
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }
                        
                    });
                    
                    

                    L.DomEvent.on(leaflet_control_bringtofront, "click", function(){

                        if (this.checked) {
                            
                            _this.feature.special_tools.bringToFront = true;
                            _this.feature.special_tools.bringToBack = false;
                            leaflet_control_bringtoback.checked = false;
                            _this.bringToFront();
                            
                        } else {
                            _this.feature.special_tools.bringToFront = false;
                            _this.bringToBack();
                        }
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }

                    });
                    
                    btn_show_modal_vector_download = self.special_tools_info_console.querySelector('#btn_show_modal_vector_download');            
                    self.show_modal_vector_download(btn_show_modal_vector_download, this, self, L);
                    
                    btn_circle_style = self.special_tools_info_console.querySelector('#btn_circle_style');                     
                    self.polygon_circle_style(btn_circle_style, self.map, layer);
                
                });
            }

            else if (self.is_linestring(layer)) {
                
                
                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {
                            
                    layer.setStyle({color: layer.feature.special_tools.obj_stroke_color});
                
                } else if (layer.feature.properties.hasOwnProperty('color')) {
                        
                    default_color = layer.feature.properties.color;
                    layer.setStyle({color: default_color});
                        
                } else {

                    default_color = '#3388ff';
                    layer.setStyle({color: default_color});

                }
                
                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {
                            
                    layer.setStyle({weight: layer.feature.special_tools.obj_stroke_width});
                
                }
                
                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {
                            
                    layer.setStyle({opacity: layer.feature.special_tools.obj_stroke_opacity});
                
                }
                
                if (layer.feature.special_tools.hasOwnProperty('obj_stroke_dasharray')) {
                            
                    layer.setStyle({
                        
                        dashArray: layer.feature.special_tools.obj_stroke_dasharray,
                        dashOffset: 0
                        
                    });
                
                }
                
                if (!self.is_geoman_edition_mode(layer)) {

                    self.pm_disable(layer); 

                } else {

                    self.pm_enable(layer);

                }
                
                if (layer.feature.special_tools.hasOwnProperty('bringToBack')) {
                    if (layer.feature.special_tools.bringToBack) {
                        layer.bringToBack();
                    }
                }

                if (layer.feature.special_tools.hasOwnProperty('bringToFront')) {
                    if (layer.feature.special_tools.bringToFront) {
                        layer.bringToFront();
                    }
                }
                
                layer.on('click pm:edit', function(){

                    geometry_type = this.feature.geometry.type;

                    let content = "<p>Tipo: " + geometry_type + "</p>";

                    if (!self.is_geoman_edition_mode(this)) {
                        
                        self.pm_disable(this);

                    } else {
                        
                        self.pm_enable(this);

                    }
                    
                    checked_bringtoback = '';
                    checked_bringtofront = '';

                    if (layer.feature.special_tools.hasOwnProperty('bringToBack')) {
                        if (layer.feature.special_tools.bringToBack) {
                            layer.bringToBack();
                            checked_bringtoback = 'checked';
                            checked_bringtofront = '';
                        }
                    }

                    if (layer.feature.special_tools.hasOwnProperty('bringToFront')) {
                        if (layer.feature.special_tools.bringToFront) {
                            layer.bringToFront();
                            checked_bringtoback = '';
                            checked_bringtofront = 'checked';
                        }
                    }

                    let length = turf.length(layer.toGeoJSON());

                    content = content + "<p>Distancia: " + length.toFixed(2) + " km</p>";

                    let properties = this.feature.properties;

                    for (let prop in properties) {

                        if (
                            properties[prop] !== null 
                            && prop !== 'color' 
                            && prop !== 'layer_id'
                            && typeof properties[prop] !== 'object'
                        ){
                            if (self.is_url(properties[prop])) {

                                content = content + "<p><a href='" + properties[prop] + "' target='_blank'>Más información</a></p>";

                            } else {

                                content = content + "<p>" + prop + ": " + properties[prop] + "</p>";

                            }
                        }

                    }
                    
                    let tools_id = self.get_tools_id_by_layer(this);
                    
                    let checked_geoman = '';
                    
                    if (self.is_geoman_edition_mode(this)) {

                        checked_geoman = 'checked';

                    }
                    
                    content = content + '<div class="leaflet-control-geoman-edition"><input type="checkbox" id="leaflet_control_geoman_edition" tools_id="'+tools_id+'" '+checked_geoman+'><span> Edición Geoman activa</span></div>';

                    //bringToFront - bringToBack
                    content = content + "<h4>Jerarquía del objeto:</h4>"
                    content = content + "<div><input type='checkbox' id='leaflet_control_bringtofront' tools-id='" + tools_id + "' " + checked_bringtofront + "><span> Delante</span></div>";
                    content = content + "<div><input type='checkbox' id='leaflet_control_bringtoback' tools-id='" + tools_id + "' " + checked_bringtoback + "><span> Detrás</span></div>";
                    content = content + "<p><button id='btn_linestring_style' class='special-tools-btn-default' style='font-size: 9px;'>Editar estilos</button>";
                    content = content + "<button id='btn_show_modal_vector_download' class='special-tools-btn-default' style='font-size: 9px;'>Descargar</button></p>";

                    self.special_tools_info_console.innerHTML = content;
                    
                    leaflet_control_geoman_edition = self.special_tools_info_console.querySelector("#leaflet_control_geoman_edition");

                    const _this = this;

                    L.DomEvent.on(leaflet_control_geoman_edition, "click", function(){

                        if (this.checked) {
                            
                            self.pm_enable(_this);

                            _this.feature.special_tools.geoman_edition = true;

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }


                        } else {
                            
                            self.pm_disable(_this);

                            _this.feature.special_tools.geoman_edition = false;

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        }
                    });
                    
                    leaflet_control_bringtoback = self.special_tools_info_console.querySelector("#leaflet_control_bringtoback");
                    leaflet_control_bringtofront = self.special_tools_info_console.querySelector("#leaflet_control_bringtofront");
                    
                    L.DomEvent.on(leaflet_control_bringtoback, "click", function(){
                        
                        if (this.checked) {
                            
                            _this.feature.special_tools.bringToBack = true;
                            _this.feature.special_tools.bringToFront = false;
                            leaflet_control_bringtofront.checked = false;
                            _this.bringToBack();
                            
                        } else {
                            _this.feature.special_tools.bringToBack = false;
                            _this.bringToFront();
                        }
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }
                        
                    });
                    
                    

                    L.DomEvent.on(leaflet_control_bringtofront, "click", function(){

                        if (this.checked) {
                            
                            _this.feature.special_tools.bringToFront = true;
                            _this.feature.special_tools.bringToBack = false;
                            leaflet_control_bringtoback.checked = false;
                            _this.bringToFront();
                            
                        } else {
                            _this.feature.special_tools.bringToFront = false;
                            _this.bringToBack();
                        }
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }

                    });
                    
                    btn_show_modal_vector_download = self.special_tools_info_console.querySelector('#btn_show_modal_vector_download');            
                    self.show_modal_vector_download(btn_show_modal_vector_download, this, self, L);
                    
                    btn_linestring_style = self.special_tools_info_console.querySelector('#btn_linestring_style');                     
                    self.linestring_style(btn_linestring_style, self.map, layer);
                    
                });
            }

            else if (self.is_polygon(layer)) {
                
                if (!self.is_geoman_edition_mode(layer)) {

                    self.pm_disable(layer); 

                } else {

                    self.pm_enable(layer);

                }
                
                if (layer.feature.special_tools.hasOwnProperty('bringToBack')) {
                    if (layer.feature.special_tools.bringToBack) {
                        layer.bringToBack();
                    }
                }

                if (layer.feature.special_tools.hasOwnProperty('bringToFront')) {
                    if (layer.feature.special_tools.bringToFront) {
                        layer.bringToFront();
                    }
                }

                if (self.is_clipPolygon(layer)) {

                    //sudo apt install gdal-bin python3-gdal

                    image_id = layer.feature.special_tools.image_id;
                    image_opacity = layer.feature.special_tools.imageOpacity;
                    image_interactive = layer.feature.special_tools.imageInteractive;
                    image_zIndex = layer.feature.special_tools.image_zIndex;
                    stored_image_data_item = layer.feature.properties.images;

                    point1 = layer.feature.special_tools.point1;
                    point2 = layer.feature.special_tools.point2;
                    point3 = layer.feature.special_tools.point3;

                    const marker1 = L.marker(point1, {draggable: true, pmIgnore: true, snapIgnore: true} );
                    const marker2 = L.marker(point2, {draggable: true, pmIgnore: true, snapIgnore: true} );
                    const marker3 = L.marker(point3, {draggable: true, pmIgnore: true, snapIgnore: true} );

                    marker1.addTo(self.map);
                    marker2.addTo(self.map);
                    marker3.addTo(self.map);
                    
                    marker1.special_tools = {};
                    marker1.special_tools.image_id = image_id;
                    marker2.special_tools = {};
                    marker2.special_tools.image_id = image_id;
                    marker3.special_tools = {};
                    marker3.special_tools.image_id = image_id;

                    if (!image_interactive) {

                        marker1._icon.style.display = 'none';
                        marker2._icon.style.display = 'none';
                        marker3._icon.style.display = 'none';
                        marker1._shadow.style.display = 'none';
                        marker2._shadow.style.display = 'none';
                        marker3._shadow.style.display = 'none';
                        is_interactive = '';

                    } else {

                        marker1._icon.style.display = 'block';
                        marker2._icon.style.display = 'block';
                        marker3._icon.style.display = 'block';
                        marker1._shadow.style.display = 'block';
                        marker2._shadow.style.display = 'block';
                        marker3._shadow.style.display = 'block';
                        is_interactive = 'checked';

                    }

                    const image_src = layer.feature.special_tools.clipPolygon_image;

                    const overlay = L.imageOverlay.rotated(image_src, point1, point2, point3, {
                        opacity: image_opacity,
                        interactive: true
                    });
                    
                    //199 backToFront
                    overlay.setZIndex(image_zIndex);

                    overlay.special_tools = {};
                    overlay.special_tools.image_id = image_id;

                    overlay.addTo(self.map);

                    marker1.on('drag dragend', function(){

                        overlay.reposition(this.getLatLng(), marker2.getLatLng(), marker3.getLatLng());

                        p1 = overlay.getBounds().getSouthWest();
                        p2 = overlay.getBounds().getNorthEast();
                        p3 = overlay.getBounds().getNorthWest();
                        p4 = overlay.getBounds().getSouthEast();

                        layer.setLatLngs([
                            [p1.lat, p1.lng],
                            [p3.lat, p3.lng],
                            [p2.lat, p2.lng],
                            [p4.lat, p4.lng]
                        ]);

                        layer.feature.special_tools.point1 = this.getLatLng();
                        layer.feature.special_tools.point2 = marker2.getLatLng();
                        layer.feature.special_tools.point3 = marker3.getLatLng();
                    });

                    marker2.on('drag dragend', function(){

                        overlay.reposition(marker1.getLatLng(), this.getLatLng(), marker3.getLatLng());

                        p1 = overlay.getBounds().getSouthWest();
                        p2 = overlay.getBounds().getNorthEast();
                        p3 = overlay.getBounds().getNorthWest();
                        p4 = overlay.getBounds().getSouthEast();

                        layer.setLatLngs([
                            [p1.lat, p1.lng],
                            [p3.lat, p3.lng],
                            [p2.lat, p2.lng],
                            [p4.lat, p4.lng]
                        ]);

                        layer.feature.special_tools.point1 = marker1.getLatLng();
                        layer.feature.special_tools.point2 = this.getLatLng();
                        layer.feature.special_tools.point3 = marker3.getLatLng();

                    });

                    marker3.on('drag dragend', function(){

                        overlay.reposition(marker1.getLatLng(), marker2.getLatLng(), this.getLatLng());

                        p1 = overlay.getBounds().getSouthWest();
                        p2 = overlay.getBounds().getNorthEast();
                        p3 = overlay.getBounds().getNorthWest();
                        p4 = overlay.getBounds().getSouthEast();

                        layer.setLatLngs([
                            [p1.lat, p1.lng],
                            [p3.lat, p3.lng],
                            [p2.lat, p2.lng],
                            [p4.lat, p4.lng]
                        ]);

                        layer.feature.special_tools.point1 = marker1.getLatLng();
                        layer.feature.special_tools.point2 = marker2.getLatLng();
                        layer.feature.special_tools.point3 = this.getLatLng();

                    });


                    marker1.on('dragend', function(){
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }
                    });

                    marker2.on('dragend', function(){
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }

                    });

                    marker3.on('dragend', function(){
                        
                        if (self.server) {
                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);
                        }

                    });

                    overlay.on('pm:remove', function(){
                        marker1.removeFrom(self.map);
                        marker2.removeFrom(self.map);
                        marker3.removeFrom(self.map);
                        layer.pm.remove();
                    });

                    overlay.on('click', function () {
                        
                        image_interactive = layer.feature.special_tools.imageInteractive;
                        
                        if (!image_interactive) {
                            
                            is_interactive = '';
                            
                        } else {
                            
                            is_interactive = 'checked';
                            
                        }

                        content = "<p>Tipo: Imagen</p>";
                        content = content + "<p>url: <a href='?t="+stored_image_data_item.section_tipo+"&section_id=" +stored_image_data_item.section_id  + "&component_tipo="+stored_image_data_item.component_tipo+"' target='_blank'>Ver imagen</a></p>";
                        content = content + "<p><input type='checkbox' id='special_tools_image_edition' image-id='"+image_id+"' "+is_interactive+"> Activar edición</p>";
                        content = content + "<p>Opacidad: <input id='special_tools_image_opacity' image-id='"+image_id+"' type='number' min='0' max='1' step='0.1' value='"+layer.feature.special_tools.imageOpacity+"'></p>";
                        content = content + "<p>zIndex: <input id='special_tools_image_zIndex' image-id='"+image_id+"' type='number' min='0' max='1000' step='1' value='"+layer.feature.special_tools.image_zIndex+"'></p>";
                        content = content + "<br><p><button id='btn_show_modal_raster_download' class='special-tools-btn-default' style='font-size: 9px;'>Descargar</button></p>";

                        self.special_tools_info_console.innerHTML = content;

                        special_tools_image_opacity = self.special_tools_info_console.querySelector('#special_tools_image_opacity');

                        special_tools_image_opacity.setAttribute("value", layer.feature.special_tools.imageOpacity);

                        L.DomEvent.on(special_tools_image_opacity, 'change', function() {

                            overlay.setOpacity(this.value);
                            
                            layer.feature.special_tools.imageOpacity = this.value;
                            
                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        });

                        special_tools_image_zIndex = self.special_tools_info_console.querySelector('#special_tools_image_zIndex');

                        special_tools_image_zIndex.setAttribute("value", layer.feature.special_tools.image_zIndex);
                        
                        L.DomEvent.on(special_tools_image_zIndex, 'change', function() {

                            overlay.setZIndex(this.value);
                            layer.feature.special_tools.image_zIndex = this.value;
                            
                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        });
                            
                        special_tools_image_edition = self.special_tools_info_console.querySelector('#special_tools_image_edition');

                        L.DomEvent.on(special_tools_image_edition, 'click', function() {

                            if (!this.checked) {

                                layer.feature.special_tools.imageInteractive = false;

                                marker1._icon.style.display = 'none';
                                marker2._icon.style.display = 'none';
                                marker3._icon.style.display = 'none';
                                marker1._shadow.style.display = 'none';
                                marker2._shadow.style.display = 'none';
                                marker3._shadow.style.display = 'none';

                                if (self.server) {
                                    active_layer_id = self.component_geolocation.active_layer_id;
                                    self.component_geolocation.update_draw_data(active_layer_id);
                                }


                            } else {

                                layer.feature.special_tools.imageInteractive = true;

                                marker1._icon.style.display = 'block';
                                marker2._icon.style.display = 'block';
                                marker3._icon.style.display = 'block';
                                marker1._shadow.style.display = 'block';
                                marker2._shadow.style.display = 'block';
                                marker3._shadow.style.display = 'block';

                                if (self.server) {
                                    active_layer_id = self.component_geolocation.active_layer_id;
                                    self.component_geolocation.update_draw_data(active_layer_id);
                                }

                            }

                        });
                        
                        btn_show_modal_raster_download = self.special_tools_info_console.querySelector('#btn_show_modal_raster_download');
                        self.show_modal_raster_download(btn_show_modal_raster_download, layer, this, self, L)

                    });

                } 
                
                else {
                    
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {

                        layer.setStyle({color: layer.feature.special_tools.obj_stroke_color});
                        layer.setStyle({fillColor: layer.feature.special_tools.obj_stroke_color});
                    
                    } else if (layer.feature.properties.hasOwnProperty('color')) {
                        
                        default_color = layer.feature.properties.color;
                        layer.setStyle({color: default_color});
                        layer.setStyle({fillColor: default_color});
                        
                    } else {

                        default_color = '#3388ff';
                        layer.setStyle({color: default_color});
                        layer.setStyle({fillColor: default_color});

                    }

                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {

                        layer.setStyle({weight: layer.feature.special_tools.obj_stroke_width});

                    }

                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {

                        layer.setStyle({opacity: layer.feature.special_tools.obj_stroke_opacity});

                    }

                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_dasharray')) {

                        layer.setStyle({
                            dashArray: layer.feature.special_tools.obj_stroke_dasharray,
                            dashOffset: 0
                        });

                    }

                    if (layer.feature.special_tools.hasOwnProperty('obj_fill_opacity')) {

                        layer.setStyle({fillOpacity: layer.feature.special_tools.obj_fill_opacity});

                    }

                    layer.on('click pm:edit', function(){

                        geometry_type = this.feature.geometry.type;

                        let content = "<p>Tipo: " + geometry_type + "</p>";

                        if (!self.is_geoman_edition_mode(this)) {
                            
                            self.pm_disable(this);

                        } else {

                            self.pm_enable(this);

                        }
                        
                        checked_bringtoback = '';
                        checked_bringtofront = '';

                        if (layer.feature.special_tools.hasOwnProperty('bringToBack')) {
                            if (layer.feature.special_tools.bringToBack) {
                                layer.bringToBack();
                                checked_bringtoback = 'checked';
                                checked_bringtofront = '';
                            }
                        }

                        if (layer.feature.special_tools.hasOwnProperty('bringToFront')) {
                            if (layer.feature.special_tools.bringToFront) {
                                layer.bringToFront();
                                checked_bringtoback = '';
                                checked_bringtofront = 'checked';
                            }
                        }

                        if (self.is_oneXone(this)) {

                            content = content + "<p>Área: 1 m²</p>";

                        } else {

                            let area_meters = turf.area(this.toGeoJSON());
                            area = self.get_area_square_meters(area_meters);
                            content = content + "<p>Área: " + area + "</p>";

                        }

                        let properties = this.feature.properties;

                        for (let prop in properties) {

                            if (
                                properties[prop] !== null 
                                && prop !== 'color' 
                                && prop !== 'layer_id'
                                && typeof properties[prop] !== 'object'
                            ){
                                if (self.is_url(properties[prop])) {

                                    content = content + "<p><a href='" + properties[prop] + "' target='_blank'>Más información</a></p>";

                                } else {

                                    content = content + "<p>" + prop + ": " + properties[prop] + "</p>";

                                }
                            }

                        }
                        
                        let tools_id = self.get_tools_id_by_layer(this);
                        
                        let checked_centroid = '';
                        if (self.has_centroid(this)) {

                            checked_centroid = 'checked';

                        }
                        
                        let incertidumbre = '';
                        let checked_incertidumbre = '';
                        if (self.is_incertidumbre(this) && self.on_incertidumbre(this)) {
                            
                            area = turf.area(this.toGeoJSON());
                            incertidumbre = self.get_incertidumbre(area);
                            checked_incertidumbre = 'checked';   

                        }
                        
                        let checked_geoman = '';
                        if (self.is_geoman_edition_mode(this)) {

                            checked_geoman = 'checked';

                        }
                        
                        if (!self.is_oneXone(this)) content = content + '<div class="leaflet-control-centroide"><input type="checkbox" id="leaflet_control_centroide" tools_id="'+tools_id+'" '+checked_centroid+'><span> Centroide</span></div>';
                        if (!self.is_oneXone(this)) content = content + '<div class="leaflet-control-incertidumbre"><input type="checkbox" id="leaflet_control_incertidumbre" tools_id="'+tools_id+'" '+checked_incertidumbre+'><span> Incertidumbre</span><div id="leaflet_msg_incertidumbre" style="color: yellow;">'+incertidumbre+'</div></div>';
                        if (!self.is_oneXone(this)) content = content + '<div class="leaflet-control-geoman-edition"><input type="checkbox" id="leaflet_control_geoman_edition" tools_id="'+tools_id+'" '+checked_geoman+'><span> Edición Geoman activa</span></div>';

                        //bringToFront - bringToBack
                        content = content + "<h4>Jerarquía del objeto:</h4>"
                        content = content + "<div><input type='checkbox' id='leaflet_control_bringtofront' tools-id='" + tools_id + "' " + checked_bringtofront + "><span> Delante</span></div>";
                        content = content + "<div><input type='checkbox' id='leaflet_control_bringtoback' tools-id='" + tools_id + "' " + checked_bringtoback + "><span> Detrás</span></div>"; 
                        content = content + "<p><button id='btn_polygon_style' class='special-tools-btn-default' style='font-size: 9px;'>Editar estilos</button>";
                        content = content + " <button id='btn_show_modal_vector_download' class='special-tools-btn-default' style='font-size: 9px;'>Descargar</button></p>";
                        
                        self.special_tools_info_console.innerHTML = content;
                        
                        const _this = this;
                        
                        if (!self.is_oneXone(this)) {

                            leaflet_control_centroide = self.special_tools_info_console.querySelector("#leaflet_control_centroide");

                            L.DomEvent.on(leaflet_control_centroide, "click", function(){

                                if (this.checked) {

                                    const polygon = turf.polygon(_this.feature.geometry.coordinates);

                                    //Centro de la masa
                                    let centroid_latlng = turf.centerOfMass(polygon);

                                    const coordinates = {'lng': centroid_latlng.geometry.coordinates[1], 'lat': centroid_latlng.geometry.coordinates[0]};

                                    if (!self.point_in_polygon(coordinates, _this)) {
                                        //Centro de la masa para polígonos donde su centro queda fuera de la misma
                                        centroid_latlng = turf.pointOnFeature(polygon);
                                    }

                                    const circle = L.marker([centroid_latlng.geometry.coordinates[1], centroid_latlng.geometry.coordinates[0]]);

                                    circle.feature = circle.toGeoJSON();
                                    circle.feature.special_tools = {};
                                    circle.feature.special_tools.is_centroid = true;

                                    const new_tools_id = self.make_id(20);

                                    circle.feature.special_tools.tools_id = new_tools_id;

                                    _this.feature.special_tools.has_centroid = true;
                                    _this.feature.special_tools.centroid_tools_id = new_tools_id;

                                    self.map.fire('pm:create', {layer: circle});

                                } else {

                                    if (self.has_centroid(_this)) {

                                        let centroid_tools_id = _this.feature.special_tools.centroid_tools_id;

                                        let centroid = self.get_layer_by_tools_id(self.map, centroid_tools_id);

                                        _this.feature.special_tools.has_centroid = false;
                                        _this.feature.special_tools.centroid_tools_id = null;

                                        centroid.pm.remove();
                                    }
                                }

                            });
                        
                            leaflet_control_incertidumbre = self.special_tools_info_console.querySelector("#leaflet_control_incertidumbre");
                            leaflet_msg_incertidumbre = self.special_tools_info_console.querySelector("#leaflet_msg_incertidumbre");

                            L.DomEvent.on(leaflet_control_incertidumbre, "click", function(){

                                if (this.checked) {

                                    _this.feature.special_tools.is_incertidumbre = true;
                                    _this.feature.special_tools.on_incertidumbre = true;

                                    if (self.server) {
                                        active_layer_id = self.component_geolocation.active_layer_id;
                                        self.component_geolocation.update_draw_data(active_layer_id);
                                    }

                                    let area = turf.area(_this.toGeoJSON());

                                    let incertidumbre = self.get_incertidumbre(area);

                                    leaflet_msg_incertidumbre.innerHTML = incertidumbre;

                                } else {

                                    _this.feature.special_tools.is_incertidumbre = false;
                                    _this.feature.special_tools.on_incertidumbre = false;

                                    if (self.server) {
                                        active_layer_id = self.component_geolocation.active_layer_id;
                                        self.component_geolocation.update_draw_data(active_layer_id);
                                    }
                                    
                                    leaflet_msg_incertidumbre.innerHTML = '';

                                }

                            });
                        
                            leaflet_control_geoman_edition = self.special_tools_info_console.querySelector("#leaflet_control_geoman_edition");

                            L.DomEvent.on(leaflet_control_geoman_edition, "click", function(){

                                if (this.checked) {
                                    
                                    self.pm_enable(_this);

                                    _this.feature.special_tools.geoman_edition = true;

                                    if (self.server) {
                                        active_layer_id = self.component_geolocation.active_layer_id;
                                        self.component_geolocation.update_draw_data(active_layer_id);
                                    }

                                } else {
                                    
                                    self.pm_disable(_this);

                                    _this.feature.special_tools.geoman_edition = false;

                                    if (self.server) {
                                        active_layer_id = self.component_geolocation.active_layer_id;
                                        self.component_geolocation.update_draw_data(active_layer_id);
                                    }
                                }
                            });
                        }
                        
                        leaflet_control_bringtoback = self.special_tools_info_console.querySelector("#leaflet_control_bringtoback");
                        leaflet_control_bringtofront = self.special_tools_info_console.querySelector("#leaflet_control_bringtofront");

                        L.DomEvent.on(leaflet_control_bringtoback, "click", function(){

                            if (this.checked) {

                                _this.feature.special_tools.bringToBack = true;
                                _this.feature.special_tools.bringToFront = false;
                                leaflet_control_bringtofront.checked = false;
                                _this.bringToBack();

                            } else {
                                _this.feature.special_tools.bringToBack = false;
                                _this.bringToFront();
                            }

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        });



                        L.DomEvent.on(leaflet_control_bringtofront, "click", function(){

                            if (this.checked) {

                                _this.feature.special_tools.bringToFront = true;
                                _this.feature.special_tools.bringToBack = false;
                                leaflet_control_bringtoback.checked = false;
                                _this.bringToFront();

                            } else {
                                _this.feature.special_tools.bringToFront = false;
                                _this.bringToBack();
                            }

                            if (self.server) {
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                            }

                        });
                        
                        btn_show_modal_vector_download = self.special_tools_info_console.querySelector('#btn_show_modal_vector_download');
                        self.show_modal_vector_download(btn_show_modal_vector_download, this, self, L);
                        
                        btn_polygon_style = self.special_tools_info_console.querySelector('#btn_polygon_style');                     
                        self.polygon_circle_style(btn_polygon_style, self.map, layer);
                        
                    });

                }
            }
        }
    },
    
    get_incertidumbre: function(area) {
        return (1 / area).toFixed(20) + ' m²';
    },
    
    is_special_tools: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                return true;  
            }
        }
        return false;
    },
     
    is_oneXone: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_oneXone')) {
                    if (layer.feature.special_tools.is_oneXone) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    get_oneXone_type: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_oneXone')) {
                    if (layer.feature.special_tools.is_oneXone) {
                        return layer.feature.special_tools.oneXone_type;
                    }
                }
            }
        }
        return null;
    },
    
    is_catastro: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_catastro')) {
                    if (layer.feature.special_tools.is_catastro) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    is_UA: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_UA')) {
                    if (layer.feature.special_tools.is_UA) {
                        return true;
                    }
                }            
            }
        }
        return false;
    },
    
    is_pleiades: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_pleiades')) {
                    if (layer.feature.special_tools.is_pleiades) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    is_pelagios: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_pelagios')) {
                    if (layer.feature.special_tools.is_pelagios) {
                        return true;
                    }
                }               
            }
        }
        return false;
    },
    
    is_imperium: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_imperium')) {
                    if (layer.feature.special_tools.is_imperium) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    is_clipPolygon: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_clipPolygon')) {
                    if (layer.feature.special_tools.is_clipPolygon) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    is_shape: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_shape')) {
                    if (layer.feature.special_tools.is_shape) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    is_point: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('geometry')) {
                if (layer.feature.geometry.hasOwnProperty('type')) {
                    if (layer.feature.geometry.type === 'Point') {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    is_linestring: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('geometry')) {
                if (layer.feature.geometry.hasOwnProperty('type')) {
                    if (layer.feature.geometry.type === 'LineString') {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    
    is_polygon: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('geometry')) {
                if (layer.feature.geometry.hasOwnProperty('type')) {
                    if (layer.feature.geometry.type === 'Polygon') {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    is_circle: function(layer) {
        if (layer.hasOwnProperty('pm')) {
            if (layer.hasOwnProperty('_radius')) {
                    return true;
            }
        }
        return false;
    },
      
    get_layer_by_tools_id: function(map, tools_id) {
        self = this;
        let _layer = null;
        map.eachLayer(function(layer) {
            if (!(layer instanceof L.TileLayer)) {
                
                _tools_id = self.get_tools_id_by_layer(layer);
                if (_tools_id === tools_id) {
                    _layer = layer;
                }
                
            }
        });
        return _layer;
    },

    create_tools_id: function(map, _layer, tools_id) {
        self = this;
        map.eachLayer(function(layer) {
            if (!(layer instanceof L.TileLayer)) {
                if (layer === _layer) {
                    let data = {tools_id: tools_id};
                    layer.feature.special_tools = {};
                    Object.assign(layer.feature.special_tools, data);
                }
            }
        });
    },
    
    get_tools_id_by_layer: function(layer) {
        self = this;
        if (self.is_special_tools(layer)) {
            return layer.feature.special_tools.tools_id;
        }
        return null;
    },
    
    has_centroid: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('has_centroid')) {
                    if (layer.feature.special_tools.has_centroid) {
                        return true;
                    }
                }
            }
        }  else {
            return false;
        }
        
    },
    
    is_centroid: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_centroid')) {
                    if (layer.feature.special_tools.is_centroid) {
                        return true;
                    }
                }
                
            }
        } else {
            return false;
        }
        
    },
    
    is_multi: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('multi_id')) {
                    return true;
                }
            }
        } else {
            return false;
        }
    },
    
    get_multi_id: function(layer) {
        return layer.feature.special_tools.multi_id;
    },
    
    remove_by_multi_id: function(map, multi_id) {
        self = this;
        map.eachLayer(function(layer) {
            if (self.is_multi(layer)) {
                if (self.get_multi_id(layer) === multi_id) {
                    layer.pm.remove();
                }
            }
        });
    },
    
    is_incertidumbre: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('is_incertidumbre')) {
                    if (layer.feature.special_tools.is_incertidumbre) {
                        return true;
                    }
                }               
            }
        } else {
            return false;
        }
        
    },
    
    on_incertidumbre: function(layer) {
        if (layer.hasOwnProperty('feature')) {
            if (layer.feature.hasOwnProperty('special_tools')) {
                if (layer.feature.special_tools.hasOwnProperty('on_incertidumbre')) {
                    if (layer.feature.special_tools.on_incertidumbre) {
                        return true;
                    }
                } 
            }
        } else {
            return false;
        }
        
    },
    
    get_area_square_meters: function(area_meters) {
            if (area_meters < 10000) {
                area = area_meters.toFixed(2) + ' m²';
            } else if (area_meters >= 10000) {
                area = turf.round(turf.convertArea(area_meters, 'meters', 'kilometers'), 2) + ' km²';
            }
            return area;
    },
    
    make_id: function(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    },

    geoman_edition_mode: function(map) {
        if (
            !map.pm.globalEditModeEnabled()
            && !map.pm.globalDrawModeEnabled()
            && !map.pm.globalDragModeEnabled()
            && !map.pm.globalRemovalModeEnabled()
            && !map.pm.globalCutModeEnabled()
            && !map.pm.globalRotateModeEnabled()
        ) {
            return false;
        }
        return true;
    },
    
    is_geoman_edition_mode: function(layer) {
        self = this;
        if (self.is_special_tools(layer)) {
            if (layer.feature.special_tools.hasOwnProperty('geoman_edition')) {
                return layer.feature.special_tools.geoman_edition;
            } else {
                return false;
            }
        }
        return false;
    },
    
    pm_enable: function(layer) {
        
        layer.pm.enable({

            allowSelfIntersection: true,
            allowEditing: true,
            draggable: true,
            snappable: true

        });  
        
    },
    
    pm_disable: function(layer) {
        
        layer.pm.enable({

            allowSelfIntersection: false,
            allowEditing: false,
            draggable: false,
            snappable: false

        });  
        
    },
    
    point_in_polygon: function(coordinate, layer) {
        
        let point = turf.point(
            [coordinate.lng, coordinate.lat]
         );

        return turf.booleanPointInPolygon(point, layer.toGeoJSON().geometry);
    },
    
    is_url: function(string) {
      try { return Boolean(new URL(string)); }
      catch(e){ return false; }
    },
    
    only_one_control_active: function(elements, element_except) {
        
        for (let index in elements) {
            
            if (elements[index] !== element_except) {
                if (L.DomUtil.hasClass(elements[index], 'special-tools-enable')) {
                    elements[index].click();
                }
            }
        }
        
    },
    
    show_modal_vector_download: function(btn_show_modal_vector_download, layer, self, L) {
        
        L.DomEvent.on(btn_show_modal_vector_download, 'click', function() {

            content = "<p>Exportar como: ";
            content = content + "<select id='vector_export'>";
            content = content + "<option value='geojson'>GeoJSON</option>";
            content = content + "<option value='shp'>ESRI Shapefile</option>";
            content = content + "<option value='kml'>KML</option>";
            content = content + "</select>";
            content = content + " Nombre: <input type='text' id='vector_name' value='archivo' style='width: 110px;'>";
            content = content + " <img id='vector_export_button' src='"+self.route+"/img/download.png' style='cursor: pointer; width: 24px; height; 24px; position: relative; top: 8px;' title='Download'>";
            content = content + "<br><div id='while_download' style='line-height: 36px; background-color: #fff; font-weight: bold; padding-left: 3px; padding-right: 3px; margin-top: 5px;'></div>";


            self.map.fire('modal', {

                title: 'Descargar objeto vectorial',
                content: content,
                template: ['<div class="modal-header"><h2>{title}</h2></div>',
                  '<hr>',
                  '<div class="modal-body">{content}</div>',
                  '<div class="modal-footer">',
                  '</div>'
                ].join(''),

                cancelText: 'Cerrar',
                CANCEL_CLS: 'modal-cancel',

                width: 'auto',

                onShow: function(evt) {

                    var modal = evt.modal;

                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";

                    vector_export_button = modal._container.querySelector('#vector_export_button');

                    L.DomEvent.on(vector_export_button, 'click', function() {

                        var while_download = modal._container.querySelector('#while_download');

                        vector_name =  modal._container.querySelector('#vector_name');

                        if (vector_name.value === '') {
                            while_download.innerHTML = 'Por favor, indique el nombre del archivo';
                            L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                            return;
                        }

                        while_download.innerHTML = '';
                        L.DomUtil.addClass(while_download, 'special-tools-msg-ok');

                        var chars_download = new Array('|', '\\', '_', '/');

                        var i_char = 0;

                        function _while_download() {

                            if (i_char > chars_download.length-1) i_char = 0;

                            while_download.innerHTML = "Descargando ... " + chars_download[i_char];

                            i_char++;
                        }

                        timer = window.setInterval(_while_download, 1000);

                        vector_export = modal._container.querySelector('#vector_export');
                        vector_type = vector_export.options[vector_export.selectedIndex].value;

                        if (!layer.feature.special_tools.hasOwnProperty('multi_id')) {

                            geojson = layer.feature;

                        } else if (layer.feature.special_tools.hasOwnProperty('multi_id') && layer.feature.geometry.type === 'Point') {

                            geojson = layer.feature;

                        } else if (layer.feature.special_tools.hasOwnProperty('multi_id') && layer.feature.geometry.type !== 'Point') {

                            coordinates = new Array();

                            self.map.eachLayer(function(_layer){

                                if (self.is_special_tools(_layer)) {

                                    if (_layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_layer.feature.special_tools.multi_id === layer.feature.special_tools.multi_id) {

                                            if (layer.feature.geometry.type === 'Polygon' || layer.feature.geometry.type === 'LineString') {

                                                coordinates.push(_layer.getLatLngs());

                                            }

                                        }

                                    }

                                }

                                if (layer.feature.geometry.type === 'Polygon') {

                                    multipolygon = L.polygon(coordinates);
                                    geojson = multipolygon.toGeoJSON();

                                } else if (layer.feature.geometry.type === 'LineString') {

                                    multipolyline = L.polyline(coordinates);
                                    geojson = multipolyline.toGeoJSON();

                                }

                                geojson.properties = layer.feature.properties;
                                geojson.special_tools = layer.feature.special_tools;

                            });
                        }

                        crs = {"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3857" } }};

                        geojson.crs = crs;

                        formData = new FormData();

                        formData.append('route', self.route);
                        formData.append('vector_type', vector_type);
                        formData.append('vector_name', vector_name.value);
                        formData.append('content', JSON.stringify(geojson));

                        url = self.route+'/ajax/vector-download/download.php';

                        fetch(url, {
                            
                          method: "POST", 
                          body: formData

                        }).then(function(response) {

                                return response.text();

                        }).then(function(data){

                            data = JSON.parse(data);

                            if (data.success) {

                                window.open(self.route + '/ajax/vector-download/' + data.zip, '_blank');

                                window.clearInterval(timer);
                                L.DomUtil.addClass(while_download, 'special-tools-msg-ok');
                                while_download.innerHTML = 'Archivo descargado correctamente';

                            } else {

                                window.clearInterval(timer);
                                L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                                while_download.innerHTML = 'Ha ocurrido un error al descargar el archivo';

                            }

                        });

                    });
                }
            });

        });
    },
    
    show_modal_raster_download: function(btn_show_modal_raster_download, layer, overlay, self) {
        
        L.DomEvent.on(btn_show_modal_raster_download, 'click', function() {
        
            content = "<p>Exportar como: ";
            content = content + "<select id='raster_export'>";
            content = content + "<option value='geotiff'>Raster GeoTiff</option>";
            content = content + "<option value='png'>png</option>";
            content = content + "<option value='jpg'>jpg</option>";
            content = content + "<option value='gif'>gif</option>";
            content = content + "<option value='webp'>webp</option>";
            content = content + "</select>"; 
            content = content + " Nombre: <input type='text' id='raster_name' value='archivo' style='width: 110px;'>";
            content = content + "<img id='raster_export_button' src='"+self.route+"/img/download.png' style='cursor: pointer; width: 24px; height; 24px; position: relative; top: 8px;' title='Download'></p>";
            content = content + "<br><div id='while_download' style='line-height: 36px; background-color: #fff; font-weight: bold; padding-left: 3px; padding-right: 3px; margin-top: 5px;'></div>";
        
            self.map.fire('modal', {
                
                title: 'Descargar imagen',
                content: content,
                template: ['<div class="modal-header"><h2>{title}</h2></div>',
                  '<hr>',
                  '<div class="modal-body">{content}</div>',
                  '<div class="modal-footer">',
                  '</div>'
                ].join(''),

                cancelText: 'Cerrar',
                CANCEL_CLS: 'modal-cancel',

                width: 'auto',
                
                onShow: function(evt) {
                    
                    var modal = evt.modal;

                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    
                    raster_export_button = modal._container.querySelector('#raster_export_button');
                    
                    L.DomEvent.on(raster_export_button, 'click', function() {
                        
                        var while_download = modal._container.querySelector('#while_download');
                        
                        raster_name =  modal._container.querySelector('#raster_name');

                        if (raster_name.value === '') {
                            while_download.innerHTML = 'Por favor, indique el nombre del archivo';
                            L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                            return;
                        }

                        while_download.innerHTML = '';
                        L.DomUtil.addClass(while_download, 'special-tools-msg-ok');

                        var chars_download = new Array('|', '\\', '_', '/');

                        var i_char = 0;

                        function _while_download() {

                            if (i_char > chars_download.length-1) i_char = 0;

                            while_download.innerHTML = "Descargando ... " + chars_download[i_char];

                            i_char++;
                        }

                        timer = window.setInterval(_while_download, 1000);

                        raster_export = modal._container.querySelector('#raster_export');
                        image_type = raster_export.options[raster_export.selectedIndex].value;

                        if (image_type === 'geotiff') {
                            
                            volatil_image = document.createElement('img');
                            volatil_image.src = overlay._rawImage.src;
                            volatil_image.setAttribute('style', overlay._rawImage.getAttribute('style'));

                            current_width = overlay._rawImage.getBoundingClientRect().width;
                            current_height = overlay._rawImage.getBoundingClientRect().height;
                            current_quality = current_width * current_height;
                            quality_image_full_hd = 1920 * 1080;
                            scale = 1;
                            max_scale = 100;

                            for (let sca = 1; sca < max_scale; sca++) {
                                if (((current_width * sca) * (current_height * sca)) >= quality_image_full_hd) {
                                    scale = sca;
                                    break;
                                }
                            }

                            volatil_image.style.width = overlay._rawImage.getBoundingClientRect().width*scale + 'px';
                            volatil_image.style.height = overlay._rawImage.getBoundingClientRect().height*scale + 'px';

                            volatil_image.width = overlay._rawImage.getBoundingClientRect().width*scale;
                            volatil_image.height = overlay._rawImage.getBoundingClientRect().height*scale;

                            canvas = L.DomUtil.create('canvas');
                            ctx = canvas.getContext("2d");
                            ctx.globalAlpha = layer.feature.special_tools.imageOpacity;

                            transform = volatil_image.style.transform;
                            transform = transform.replace('matrix(', '');
                            transform = transform.replace(')');
                            transform = transform.split(", ");


                            trans_a = parseFloat(transform[0]);
                            trans_b = parseFloat(transform[1]);
                            trans_c = parseFloat(transform[2]);
                            trans_d = parseFloat(transform[3]);
                            trans_e = parseFloat(transform[4]);
                            trans_f = parseFloat(transform[5]);

                            canvas.width = volatil_image.width;
                            canvas.height = volatil_image.height;

                            ctx.setTransform(trans_a*scale, trans_b*scale, trans_c*scale, trans_d*scale, trans_e*scale, trans_f*scale);

                            ctx.drawImage(volatil_image, 0, 0);

                            dataURL = canvas.toDataURL();

                            overlay_bounds_str = overlay.getBounds().getNorthWest().lng;
                            overlay_bounds_str = overlay_bounds_str + ' ' + overlay.getBounds().getNorthWest().lat;
                            overlay_bounds_str = overlay_bounds_str + ' ' + overlay.getBounds().getSouthEast().lng;
                            overlay_bounds_str = overlay_bounds_str + ' ' + overlay.getBounds().getSouthEast().lat;

                            route = self.route;

                            formData = new FormData();
                            formData.append("bounds", overlay_bounds_str);
                            formData.append("url", dataURL);
                            formData.append("route", route);
                            formData.append('raster_name', raster_name.value);

                            url = route+'/ajax/image-overlay-download/gdal.php';

                            fetch(url, {
                              method: "POST", 
                              body: formData

                            }).then(function(response) {

                                    return response.text();

                            }).then(function(data){

                                data = JSON.parse(data);

                                    if (data.success) {

                                        window.open(route + '/ajax/image-overlay-download/'+data.zip, '_blank');

                                        window.clearInterval(timer);
                                        
                                        L.DomUtil.addClass(while_download, 'special-tools-msg-ok');
                                        while_download.innerHTML = 'Archivo descargado correctamente';

                                    } else {

                                        window.clearInterval(timer);
                                        
                                        L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                                        while_download.innerHTML = 'Ha ocurrido un error al crear el archivo GeoTiff';
                                    }

                            });

                        } else {

                            volatil_image = document.createElement('img');
                            volatil_image.src = overlay._rawImage.src;
                            volatil_image.setAttribute('style', overlay._rawImage.getAttribute('style'));

                            current_width = overlay._rawImage.getBoundingClientRect().width;
                            current_height = overlay._rawImage.getBoundingClientRect().height;
                            current_quality = current_width * current_height;
                            quality_image_full_hd = 1920 * 1080;
                            scale = 1;
                            max_scale = 100;

                            for (let sca = 1; sca < max_scale; sca++) {
                                if (((current_width * sca) * (current_height * sca)) >= quality_image_full_hd) {
                                    scale = sca;
                                    break;
                                }
                            }

                            volatil_image.style.width = overlay._rawImage.getBoundingClientRect().width*scale + 'px';
                            volatil_image.style.height = overlay._rawImage.getBoundingClientRect().height*scale + 'px';

                            volatil_image.width = overlay._rawImage.getBoundingClientRect().width*scale;
                            volatil_image.height = overlay._rawImage.getBoundingClientRect().height*scale;

                            //Imagen canvas para exportar a geotiff
                            canvas = L.DomUtil.create('canvas');
                            ctx = canvas.getContext("2d");
                            ctx.globalAlpha = layer.feature.special_tools.imageOpacity;

                            transform = volatil_image.style.transform;
                            transform = transform.replace('matrix(', '');
                            transform = transform.replace(')');
                            transform = transform.split(", ");


                            trans_a = parseFloat(transform[0]);
                            trans_b = parseFloat(transform[1]);
                            trans_c = parseFloat(transform[2]);
                            trans_d = parseFloat(transform[3]);
                            trans_e = parseFloat(transform[4]);
                            trans_f = parseFloat(transform[5]);

                            canvas.width = volatil_image.width;
                            canvas.height = volatil_image.height;

                            ctx.setTransform(trans_a*scale, trans_b*scale, trans_c*scale, trans_d*scale, trans_e*scale, trans_f*scale);

                            ctx.drawImage(volatil_image, 0, 0);

                            dataURL = canvas.toDataURL();

                            route = self.route;

                            formData = new FormData();
                            formData.append("image_src", dataURL);
                            formData.append("image_type", image_type);
                            formData.append("route", route);
                            formData.append("raster_name", raster_name.value);

                            url = route+'/ajax/image-overlay-download/download-image.php';

                            fetch(url, {

                              method: "POST", 
                              body: formData

                            }).then(function(response) {

                                    return response.text();

                            }).then(function(data){

                                data = JSON.parse(data);

                                if (data.success) {

                                    window.open(route + '/ajax/image-overlay-download/' + data.zip, '_blank');

                                    window.clearInterval(timer);
                                    
                                    L.DomUtil.addClass(while_download, 'special-tools-msg-ok');
                                    while_download.innerHTML = 'Archivo descargado correctamente';

                                } else {

                                    window.clearInterval(timer);
                                    
                                    L.DomUtil.addClass(while_download, 'special-tools-msg-ok');
                                    while_download.innerHTML = 'Ha ocurrido un error al descargar la imagen';
                                }

                            });

                        }

                    });
                    
                }
                
            });
        
        });
        
    },
    
    marker_style: function(btn_marker_style, map, layer) {
        
        L.DomEvent.on(btn_marker_style, 'click', function(){

            if (!layer.feature.special_tools.hasOwnProperty('marker_color')) {

                if (layer.feature.properties.hasOwnProperty('color')) {
                    
                    color = layer.feature.properties.color;
                    
                } else {
                    
                    color = '#3388ff';
                    
                }
            
            } else {
                
                color = layer.feature.special_tools.marker_color;
                
            }
            
            content = "Color: " + "<input type='color' id='marker_color' value='"+color+"'><input type='text' id='readonly_color' readonly='true' value='"+color+"' style='width: 130px; margin-left: 10px; position: relative; top: -5px;'>";

            content = content + " <img id='marker_preview' style='width: 36px; height: 36px;' src='"+ self.route + "/img/pin.svg'>";
            
            map.fire('modal', {

              title: 'Editar estilos',
              content: content,
              template: ['<div class="modal-header"><h2>{title}</h2></div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '</div>'
              ].join(''),
              width: 'auto',
                
                onShow: function(evt){
                    
                    modal = evt.modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    
                    marker_color = modal._container.querySelector('#marker_color');
                    
                    readonly_color = modal._container.querySelector('#readonly_color');
                    
                    marker_preview = modal._container.querySelector('#marker_preview');
                    
                    if (layer.feature.special_tools.hasOwnProperty('marker_filter')) {
                        
                        marker_preview.style.filter = layer.feature.special_tools.marker_filter;
                        
                    } else {
                        
                        default_color = '#3388ff';

                        _compute = compute(default_color);
                        
                        marker_preview.style.filter = _compute.result.filterRaw;

                        
                    }
                    
                    L.DomEvent.on(marker_color, 'change input', function(){
                        
                        if (validateColor(this.value)) {

                            _compute = compute(this.value);

                            layer._icon.style.filter = _compute.result.filterRaw;
                            
                            layer.feature.special_tools.marker_filter = _compute.result.filterRaw;
                            layer.feature.special_tools.marker_color = this.value;
                            
                            readonly_color.value = this.value;
                            
                            marker_preview.style.filter = _compute.result.filterRaw;
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                }
                
            });
            
        });
        
    },
    
    linestring_style: function(btn_linestring_style, map, layer) {
        
        L.DomEvent.on(btn_linestring_style, 'click', function(){
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {
                
                if (layer.feature.properties.hasOwnProperty('color')) {
                    
                    stroke_color = layer.feature.properties.color.substr(0, 7);
                    
                } else {
                    
                    stroke_color = '#3388ff';
                    
                }
            
            } else {
                
                stroke_color = layer.feature.special_tools.obj_stroke_color;
                
            }
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {
                
                stroke_width = 3;
                
            } else {
                
                stroke_width = layer.feature.special_tools.obj_stroke_width;
                
            }
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {
                
            stroke_opacity = 1;
            
            } else {
                
                stroke_opacity = layer.feature.special_tools.obj_stroke_opacity;
                
            }
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_dasharray')) {
                
            stroke_dasharray = 0;
            
            } else {
                
                stroke_dasharray = layer.feature.special_tools.obj_stroke_dasharray;
                
            }
            

            content = "<p>Color: " + "<input type='color' id='stroke_color' value='"+stroke_color+"'><input type='text' id='readonly_color' readonly='true' value='"+stroke_color+"' style='width: 130px; margin-left: 10px; position: relative; top: -5px;'></p>";
            
            content = content + "<p>Ancho del borde: " + "<input type='range' id='stroke_width' min='1' max='100' step='1' value='"+stroke_width+"'></p>";

            content = content + "<p>Opacidad: " + "<input type='range' id='stroke_opacity' min='0' max='1' step='0.1' value='"+stroke_opacity+"'></p>"; 

            content = content + "<p>Borde discontinuo: " + "<input type='range' id='stroke_dasharray' min='0' max='100' step='2' value='"+stroke_dasharray+"'></p>"; 

            content = content + "<svg viewBox='0 0 300 100' xmlns='http://www.w3.org/2000/svg'><path id='linestring_preview' stroke-linecap='round' stroke-linejoin='round' fill='none' d='M 75 50 l 150 0' stroke='"+stroke_color+"' stroke-width='"+stroke_width+"' stroke-opacity='"+stroke_opacity+"' stroke-dasharray='"+stroke_dasharray+"' stroke-dashoffset='0'></path></svg>";
            
            map.fire('modal', {

              title: 'Editar estilos',
              content: content,
              template: ['<div class="modal-header"><h2>{title}</h2></div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '</div>'
              ].join(''),
              width: 'auto',
                
                onShow: function(evt){
                    
                    modal = evt.modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    
                    
                    stroke_color = modal._container.querySelector('#stroke_color');
                    
                    readonly_color = modal._container.querySelector('#readonly_color');
                    
                    stroke_width = modal._container.querySelector('#stroke_width');
                    
                    stroke_opacity = modal._container.querySelector('#stroke_opacity');
                    
                    stroke_dasharray = modal._container.querySelector('#stroke_dasharray');
                    
                    linestring_preview = modal._container.querySelector('#linestring_preview');
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {
                        
                        linestring_preview.setAttribute('stroke', layer.feature.special_tools.obj_stroke_color);
                        
                    } else {
                        
                        if (layer.feature.properties.hasOwnProperty('color')) {

                            default_stroke_color = layer.feature.properties.color.substr(0, 7);


                        } else {

                            default_stroke_color = '#3388ff';

                        }

                        linestring_preview.setAttribute('stroke', default_stroke_color);

                        
                    }
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {
                        
                        linestring_preview.setAttribute('stroke-width', layer.feature.special_tools.obj_stroke_width);
                        
                    } else {
                        
                        default_stroke_width = 3;

                        linestring_preview.setAttribute('stroke-width', default_stroke_width);

                        
                    }
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {
                        
                        linestring_preview.setAttribute('stroke-opacity', layer.feature.special_tools.obj_stroke_opacity);
                        
                    } else {
                        
                        default_stroke_opacity = 1;

                        linestring_preview.setAttribute('stroke-opacity', default_stroke_opacity);

                        
                    }
                    
                    L.DomEvent.on(stroke_color, 'change input', function(){
                        
                        if (validateColor(this.value)) {
                            
                           if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_color = _this.value;
                            
                                            _layer_.setStyle({color: _this.value});
                                            
                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_color = this.value;
                            
                                layer.setStyle({color: this.value});
                            
                            }
                            
                            linestring_preview.setAttribute('stroke', this.value);
                            readonly_color.value = this.value;
                            
                            
                            layer.feature.properties.color = this.value;
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(stroke_width, 'change input', function(){
                        
                        if (this.value >= 1 && this.value <= 100) {
                            
                           if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_width = _this.value;

                                            _layer_.setStyle({weight: _this.value});
                                            
                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_width = this.value;
                            
                                layer.setStyle({weight: this.value});
                            
                            }
                            
                            linestring_preview.setAttribute('stroke-width', this.value);
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(stroke_opacity, 'change input', function(){
                        
                        if (this.value >= 0 && this.value <= 1) {
                            
                           if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_opacity = _this.value;
                                            _layer_.setStyle({opacity: _this.value});
                                            
                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_opacity = this.value;
                                layer.setStyle({opacity: this.value});
                            
                            }
                            
                            linestring_preview.setAttribute('stroke-opacity', this.value);
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(stroke_dasharray, 'change input', function(){
                        
                        if (this.value >= 0 && this.value <= 100) {

                           if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_dasharray = _this.value;

                                            _layer_.setStyle({
                                                dashArray: _this.value,
                                                dashOffset: 0
                                            });
                                            
                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_dasharray = this.value;

                                layer.setStyle({
                                    dashArray: this.value,
                                    dashOffset: 0
                                });
                            
                            }
                            
                            linestring_preview.setAttribute('stroke-dasharray', this.value);
                            linestring_preview.setAttribute('stroke-dashoffset', 0);
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                }
                
            });
            
        });
        
    },
    
    polygon_circle_style: function(btn_obj_style, map, layer) {
        
        L.DomEvent.on(btn_obj_style, 'click', function(){
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {
                
                if (layer.feature.properties.hasOwnProperty('color')) {
                    
                    stroke_color = layer.feature.properties.color.substr(0, 7);


                } else {
                    
                    stroke_color = '#3388ff';
                    
                }
                
            
            } else {
                
                stroke_color = layer.feature.special_tools.obj_stroke_color;
                
            }
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {
                
                stroke_width = 3;
                
            } else {
                
                stroke_width = layer.feature.special_tools.obj_stroke_width;
                
            }
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {
                
            stroke_opacity = 1;
            
            } else {
                
                stroke_opacity = layer.feature.special_tools.obj_stroke_opacity;
                
            }
            
            if (!layer.feature.special_tools.hasOwnProperty('obj_stroke_dasharray')) {
                
            stroke_dasharray = 0;
            
            } else {
                
                stroke_dasharray = layer.feature.special_tools.obj_stroke_dasharray;
                
            }

            if (!layer.feature.special_tools.hasOwnProperty('obj_fill_opacity')) {
                
            fill_opacity = 0.2;
            
            } else {
                
                fill_opacity = layer.feature.special_tools.obj_fill_opacity;
                
            }
            
            content = "<p>Color: " + "<input type='color' id='stroke_color' value='"+stroke_color+"'><input type='text' id='readonly_color' readonly='true' value='"+stroke_color+"' style='width: 130px; margin-left: 10px; position: relative; top: -5px;'></p>";
            
            content = content + "<p>Ancho del borde: " + "<input type='range' id='stroke_width' min='1' max='100' step='1' value='"+stroke_width+"'></p>";

            content = content + "<p>Opacidad del borde: " + "<input type='range' id='stroke_opacity' min='0' max='1' step='0.1' value='"+stroke_opacity+"'></p>"; 

            content = content + "<p>Borde discontinuo: " + "<input type='range' id='stroke_dasharray' min='0' max='100' step='2' value='"+stroke_dasharray+"'></p>"; 

            content = content + "<p>Opacidad de relleno: " + "<input type='range' id='fill_opacity' min='0' max='1' step='0.1' value='"+fill_opacity+"'></p>";

            content = content + "<br><br><svg viewBox='0 0 300 100' xmlns='http://www.w3.org/2000/svg'><rect id='obj_preview' rect width='300' height='100' stroke-linecap='round' stroke-linejoin='round' stroke='"+stroke_color+"' stroke-width='"+stroke_width+"' stroke-opacity='"+stroke_opacity+"' fill-opacity='"+fill_opacity+"' stroke-dasharray='"+stroke_dasharray+"' stroke-dashoffset='0' fill='"+stroke_color+"'></rect></svg>";
            
            map.fire('modal', {

              title: 'Editar estilos',
              content: content,
              template: ['<div class="modal-header"><h2>{title}</h2></div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '</div>'
              ].join(''),
              width: 'auto',
                
                onShow: function(evt){
                    
                    modal = evt.modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    
                    
                    stroke_color = modal._container.querySelector('#stroke_color');
                    
                    readonly_color = modal._container.querySelector('#readonly_color');
                    
                    stroke_width = modal._container.querySelector('#stroke_width');
                    
                    stroke_opacity = modal._container.querySelector('#stroke_opacity');
                    
                    stroke_dasharray = modal._container.querySelector('#stroke_dasharray');

                    fill_opacity = modal._container.querySelector('#fill_opacity');
                    
                    obj_preview = modal._container.querySelector('#obj_preview');
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_color')) {
                        
                        obj_preview.setAttribute('stroke', layer.feature.special_tools.obj_stroke_color);
                        obj_preview.setAttribute('fill', layer.feature.special_tools.obj_stroke_color);
                        
                    } else {
                        
                        if (layer.feature.properties.hasOwnProperty('color')) {

                            default_stroke_color = layer.feature.properties.color.substr(0, 7);


                        } else {

                            default_stroke_color = '#3388ff';

                        }

                        obj_preview.setAttribute('stroke', default_stroke_color);
                        obj_preview.setAttribute('fill', default_stroke_color);

                        
                    }
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_width')) {
                        
                        obj_preview.setAttribute('stroke-width', layer.feature.special_tools.obj_stroke_width);
                        
                    } else {
                        
                        default_stroke_width = 3;

                        obj_preview.setAttribute('stroke-width', default_stroke_width);

                        
                    }
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_opacity')) {
                        
                        obj_preview.setAttribute('stroke-opacity', layer.feature.special_tools.obj_stroke_opacity);
                        
                    } else {
                        
                        default_stroke_opacity = 1;

                        obj_preview.setAttribute('stroke-opacity', default_stroke_opacity);

                        
                    }
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_stroke_dasharray')) {
                        
                        obj_preview.setAttribute('stroke-dasharray', layer.feature.special_tools.obj_stroke_dasharray);
                        obj_preview.setAttribute('stroke-dashoffset', 0);
                        
                    } else {
                        
                        default_stroke_dasharray = 0;

                        obj_preview.setAttribute('stroke-dasharray', default_stroke_dasharray);
                        obj_preview.setAttribute('stroke-dashoffset', 0);
                        
                    }
                    
                    if (layer.feature.special_tools.hasOwnProperty('obj_fill_opacity')) {
                        
                        obj_preview.setAttribute('fill-opacity', layer.feature.special_tools.obj_fill_opacity);
                        
                    } else {
                        
                        default_fill_opacity = 0.2;

                        obj_preview.setAttribute('fill-opacity', default_fill_opacity);

                        
                    }
                    
                    L.DomEvent.on(stroke_color, 'change input', function(){
                        
                        if (validateColor(this.value)) {
                            
                           if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_color = _this.value;

                                            _layer_.setStyle({color: _this.value});
                                            _layer_.setStyle({fillColor: _this.value});
                                            
                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_color = this.value;

                                layer.setStyle({color: this.value});
                                layer.setStyle({fillColor: this.value});
                            
                            }
                            
                            obj_preview.setAttribute('stroke', this.value);
                            obj_preview.setAttribute('fill', this.value);
                            readonly_color.value = this.value;
                            layer.feature.properties.color = this.value;
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(stroke_width, 'change input', function(){
                        
                        if (this.value >= 1 && this.value <= 100) {
                            
                            if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_width = _this.value;
                            
                                            _layer_.setStyle({weight: _this.value});
                                            
                                        }

                                    }

                                });

                            } else {
                            
                                layer.feature.special_tools.obj_stroke_width = this.value;
                            
                                layer.setStyle({weight: this.value});
                            
                            }
                            
                            obj_preview.setAttribute('stroke-width', this.value);
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(stroke_opacity, 'change input', function(){
                        
                        if (this.value >= 0 && this.value <= 1) {
                            
                            if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_opacity = _this.value;
                                            
                                            _layer_.setStyle({opacity: _this.value});
                                            
                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_opacity = this.value;

                                layer.setStyle({opacity: this.value});
                            
                            }
                            
                            obj_preview.setAttribute('stroke-opacity', this.value);
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(stroke_dasharray, 'change input', function(){
                        
                        if (this.value >= 0 && this.value <= 100) {
                            
                            
                            if (layer.feature.special_tools.hasOwnProperty('multi_id')) {

                                _multi_id_ = layer.feature.special_tools.multi_id;

                                _this = this;

                                self.map.eachLayer(function(_layer_){
                                    
                                    if (!_layer_.hasOwnProperty('feature')) return;

                                    if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {

                                        if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {

                                            _layer_.feature.special_tools.obj_stroke_dasharray = _this.value;
                                            
                                            _layer_.setStyle({
                                                
                                                dashArray: _this.value,
                                                dashOffset: 0
                                            
                                            });

                                        }

                                    }

                                });

                            } else {

                                layer.feature.special_tools.obj_stroke_dasharray = this.value;

                                layer.setStyle({

                                    dashArray: this.value,
                                    dashOffset: 0

                                });
                            
                            }
                            
                            obj_preview.setAttribute('stroke-dasharray', this.value);
                            obj_preview.setAttribute('stroke-dashoffset', 0);
                            
                            if (self.server) {
                                
                                active_layer_id = self.component_geolocation.active_layer_id;
                                self.component_geolocation.update_draw_data(active_layer_id);
                                
                            }
                            
                        }
                        
                    });

                    L.DomEvent.on(fill_opacity, 'change input', function(){
                        
                        if (layer.feature.special_tools.hasOwnProperty('multi_id')) {
                            
                            _multi_id_ = layer.feature.special_tools.multi_id;
                            
                            _this = this;
                            
                            self.map.eachLayer(function(_layer_){
                                
                                if (!_layer_.hasOwnProperty('feature')) return;
                                
                                if (_layer_.feature.special_tools.hasOwnProperty('multi_id')) {
                                    
                                    if (_multi_id_ === _layer_.feature.special_tools.multi_id && !_layer_.hasOwnProperty('_icon')) {
                                        
                                        _layer_.setStyle({fillOpacity: _this.value});
                                        _layer_.feature.special_tools.obj_fill_opacity = _this.value;
                                        
                                    }
                                    
                                }
                                
                            });
                            
                        } else {
                            
                            layer.setStyle({fillOpacity: this.value});
                            layer.feature.special_tools.obj_fill_opacity = this.value;

                        }
                                                
                        obj_preview.setAttribute('fill-opacity', this.value);

                        if (self.server) {

                            active_layer_id = self.component_geolocation.active_layer_id;
                            self.component_geolocation.update_draw_data(active_layer_id);

                        }
                        
                    });
                    
                }
                
            });
            
        });
        
    }
    
});

L.control.specialTools = function (options) {
    return new L.Control.SpecialTools(options);
};
