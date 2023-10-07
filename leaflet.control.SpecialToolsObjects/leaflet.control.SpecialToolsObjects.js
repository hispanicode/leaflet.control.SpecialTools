/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsObjects = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-objects special-tools-controls special-tools-disable');
 
        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsObjects/lang/lang.json')
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
            
            content = "<div>";
            
            content = content + "<h3>" + special_tools._T("Objetos Vectoriales", json_lang, lang) + "</h3>";
            
            var collection = component_geolocation.FeatureGroup[component_geolocation.active_layer_id];
            let layer;
            let leaflet_id;
            
            if (typeof collection === 'object') {
                
                    multi_id = null;
                    
                    for (let obj in collection._layers) {
                        
                        layer = collection._layers[obj];
                        leaflet_id = layer._leaflet_id;
                        
                        let checked = 'checked';
                        
                        if (!layer.hasOwnProperty('_icon') && !layer.feature.special_tools.hasOwnProperty('multi_id')) {                       
                            
                                if (layer.feature.special_tools.hasOwnProperty('display')) {

                                    if (layer.feature.special_tools.display === false) checked = '';

                                }
                            

                        } 
                        
                        else if (layer.feature.special_tools.hasOwnProperty('multi_id') && !layer.hasOwnProperty('_icon')) {
                            
                            if (layer.feature.special_tools.hasOwnProperty('display')) {

                                if (layer.feature.special_tools.display === false) checked = '';
                                
                            }  
                        
                            _multi_id = layer.feature.special_tools.multi_id;
                            
                            if (_multi_id !== multi_id) {
                                
                                multi_id = _multi_id;
                                
                                icon_edit = "<img class='icon-edit-object'  multi-id='" + multi_id + "' src='" + route + "/img/edit.png' style='cursor: pointer'>";
                                icon_view = "<img class='icon-view-object'  multi-id='" + multi_id + "' src='" + route + "/img/view.png' style='cursor: pointer'>";

                                content = content + "<p><input type='checkbox' class='leaflet-id' multi-id='" + multi_id + "' "+checked+"> multi_id: " + multi_id + " "+ icon_edit +" " + icon_view + "</p>";
                            
                            }
 
                        }
                    
                        else if (layer.hasOwnProperty('_icon')) {
                            
                            if (layer.feature.special_tools.hasOwnProperty('icon_display')) {
                                
                                if (layer.feature.special_tools.icon_display === 'none') checked = '';
                                
                            }
                            
                        }
                        
                        
                        if (!layer.feature.special_tools.hasOwnProperty('is_clipPolygon') && !layer.feature.special_tools.hasOwnProperty('multi_id')) {
                        
                            icon_edit = "<img class='icon-edit-object not-multi-id' leaflet-id='" + leaflet_id + "' src='" + route + "/img/edit.png' style='cursor: pointer'>";
                            icon_view = "<img class='icon-view-object not-multi-id' leaflet-id='" + leaflet_id + "' src='" + route + "/img/view.png' style='cursor: pointer'>";
                        
                            content = content + "<p><input type='checkbox' class='leaflet-id not-multi-id' leaflet-id='"+leaflet_id+"' "+checked+"> id: " + leaflet_id + " "+ icon_edit +" " + icon_view + "</p>";
                        
                        }
                    }
            }
            
            content = content + "<h3>" + special_tools._T("Objetos Rasterizados", json_lang, lang) + "</h3>";
            
            for (let obj in collection._layers) {
                
                layer = collection._layers[obj];
                leaflet_id = layer._leaflet_id;
                
                
                if (layer.feature.special_tools.hasOwnProperty('is_clipPolygon')) {
                    
                    checked = 'checked';
                    if (layer.feature.special_tools.hasOwnProperty('display')) {
                        if (layer.feature.special_tools.display) {
                            checked = 'checked';
                        } else {
                            checked = '';
                        }
                    }
                    
                    icon_edit = "<img class='icon-edit-object not-multi-id' leaflet-id='" + leaflet_id + "' src='" + route + "/img/edit.png' style='cursor: pointer'>";
                    icon_view = "<img class='icon-view-object not-multi-id' leaflet-id='" + leaflet_id + "' src='" + route + "/img/view.png' style='cursor: pointer'>";
                    
                    content = content + "<p><input type='checkbox' class='leaflet-id not-multi-id' leaflet-id='"+leaflet_id+"' "+checked+"> id: " + leaflet_id + " " + icon_edit + " " + icon_view + "</p>";
                }
            }
            
            content = content + "</div>";
            
            map.fire('modal', {

                title: special_tools._T("Objetos", json_lang, lang),
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
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                    
                    const leaflet_id_inputs = modal._container.querySelectorAll(".leaflet-id");

                    try {
                        for (let index in leaflet_id_inputs) {

                            L.DomEvent.on(leaflet_id_inputs[index], 'click', function(){
                                
                                var is_multi_id = false;
                                
                                if (L.DomUtil.hasClass(this, 'not-multi-id')) {
                                
                                    _leaflet_id = parseInt(this.getAttribute('leaflet-id'));
                                    
                                } else {
                                    
                                    _multi_id = this.getAttribute('multi-id');
                                    is_multi_id = true;
                                    
                                }

                                if (this.checked) {
                                    
                                    if (typeof collection === 'object') {

                                        if (is_multi_id) {
                                                
                                            map.eachLayer(function(_layer){
                                                if (!_layer.hasOwnProperty('_icon')  && _layer.hasOwnProperty('feature')) {
                                                    if (_layer.feature.special_tools.hasOwnProperty('multi_id')) {
                                                        if (_multi_id === _layer.feature.special_tools.multi_id) {

                                                            _layer._path.style.display = 'block';
                                                            _layer.feature.special_tools.display = true;

                                                        }
                                                    }
                                                } else if (_layer.hasOwnProperty('_icon')  && _layer.hasOwnProperty('feature')) {
                                                    
                                                    if (_layer.feature.special_tools.hasOwnProperty('multi_id')) {
                                                        
                                                            if (_multi_id === _layer.feature.special_tools.multi_id) {
                                                                
                                                            _layer._icon.style.display = 'block';
                                                            _layer.feature.special_tools.icon_display = 'block';
                                                            
                                                            if (_layer.hasOwnProperty('_shadow')) {

                                                                _layer._shadow.style.display = 'block';
                                                                _layer.feature.special_tools.shadow_display = 'block';

                                                            }
                                                        }
                                                    
                                                    }
                                                }
                                            });
                                            return;  
                                        }
                                        
                                        for (let obj in collection._layers) {
                                            
                                            const layer = collection._layers[obj];
                                            
                                            leaflet_id = collection._layers[obj]._leaflet_id;

                                            if (
                                                    !layer.hasOwnProperty('_icon') 
                                                    && !layer.feature.special_tools.hasOwnProperty('is_clipPolygon')
                                                    && !is_multi_id
                                                ) {
                                            
                                                if (leaflet_id === _leaflet_id) {

                                                layer._path.style.display = 'block';
                                                layer.feature.special_tools.display = true;
                                                
                                                break;
                                                    
                                                }
                                            } 
                                            
                                            else if (layer.feature.special_tools.hasOwnProperty('is_clipPolygon')) {
                                                
                                                if (leaflet_id === _leaflet_id) {
                                                    
                                                    image_id = layer.feature.special_tools.image_id;
                                                    
                                                    map.eachLayer(function(_layer){
                                                        
                                                       if (_layer.hasOwnProperty('special_tools')) {
                                                           
                                                           if (!_layer.hasOwnProperty('_icon') && _layer.special_tools.hasOwnProperty('image_id')) {
                                                               
                                                               if (image_id === _layer.special_tools.image_id) {
                                                                   
                                                                  _layer._image.style.display = 'block';
                                                                  
                                                                  layer.feature.special_tools.display = true;
                                                                  
                                                               }
                                                           } else if (_layer.hasOwnProperty('_icon') && _layer.special_tools.hasOwnProperty('image_id')) {

                                                                _layer._icon.style.display = 'block';

                                                                if (_layer.hasOwnProperty('_shadow')) {

                                                                    _layer._shadow.style.display = 'block';

                                                                }
                                                                
                                                                layer.feature.special_tools.display = true;
                                                                
                                                           }
                                                       } 
                                                    });
                                                    
                                                    break;
                                                }
                                            }

                                            else if (layer.hasOwnProperty('_icon') && !is_multi_id) {
                                                
                                                if (leaflet_id === _leaflet_id) {
                                                    
                                                    layer._icon.style.display = 'block';
                                                    layer.feature.special_tools.icon_display = 'block';
                                                    
                                                    if (layer.hasOwnProperty('_shadow')) {
                                                    
                                                        layer._shadow.style.display = 'block';
                                                        layer.feature.special_tools.shadow_display = 'block';
                                                        
                                                    }

                                                    break;
                                                    
                                                }
                                                
                                            }   
                                        }
                                            
                                    }
                                    
                                } else {
                                    
                                    if (typeof collection === 'object') {
                                        
                                        if (is_multi_id) {

                                            map.eachLayer(function(_layer){
                                                
                                                if (!_layer.hasOwnProperty('_icon') && _layer.hasOwnProperty('feature')) {
                                                    
                                                    if (_layer.feature.special_tools.hasOwnProperty('multi_id')) {
                                                        
                                                        if (_multi_id === _layer.feature.special_tools.multi_id) {

                                                            _layer._path.style.display = 'none';
                                                            _layer.feature.special_tools.display = false;

                                                        }
                                                        
                                                    }
                                                } else if (_layer.hasOwnProperty('_icon')  && _layer.hasOwnProperty('feature')) {
                                                    
                                                    if (_layer.feature.special_tools.hasOwnProperty('multi_id')) {
                                                    
                                                        if (_multi_id === _layer.feature.special_tools.multi_id) {
                                                                                                                   
                                                            _layer._icon.style.display = 'none';
                                                            _layer.feature.special_tools.icon_display = 'none';

                                                            if (_layer.hasOwnProperty('_shadow')) {

                                                                _layer._shadow.style.display = 'none';
                                                                _layer.feature.special_tools.shadow_display = 'none';

                                                            }
                                                        
                                                        }
                                                        
                                                        
                                                    }
                                                    
                                                }
                                            });
                                            return;
                                        }
                                        
                                        for (let obj in collection._layers) {
                                            
                                            const layer = collection._layers[obj];
                                            const leaflet_id = collection._layers[obj]._leaflet_id;
                                            
                                            if (
                                                    !layer.hasOwnProperty('_icon')  
                                                    && !layer.feature.special_tools.hasOwnProperty('is_clipPolygon')
                                                    && !is_multi_id
                                                ) {

                                                if (leaflet_id === _leaflet_id) {
                                                    
                                                    layer._path.style.display = 'none';
                                                    layer.feature.special_tools.display = false;
                                                    
                                                    break;
                                                }
                                            
                                            } 
                                            
                                            else if (layer.feature.special_tools.hasOwnProperty('is_clipPolygon')) {
                                                
                                                if (leaflet_id === _leaflet_id) {
                                                    
                                                    image_id = layer.feature.special_tools.image_id;
                                                    
                                                    map.eachLayer(function(_layer){
                                                        
                                                       if (_layer.hasOwnProperty('special_tools')) {
                                                           
                                                           if (!_layer.hasOwnProperty('_icon') && _layer.special_tools.hasOwnProperty('image_id')) {
                                                               
                                                                if (image_id === _layer.special_tools.image_id) {
                                                                   
                                                                  _layer._image.style.display = 'none';
                                                                  
                                                                  layer.feature.special_tools.display = false;
                                                                  
                                                               }
                                                               
                                                           } else if (_layer.hasOwnProperty('_icon') && _layer.special_tools.hasOwnProperty('image_id')) {

                                                                _layer._icon.style.display = 'none';

                                                                if (_layer.hasOwnProperty('_shadow')) {

                                                                    _layer._shadow.style.display = 'none';

                                                                }
                                                                
                                                                layer.feature.special_tools.display = false;
                                                                
                                                           }
                                                       } 
                                                    });
                                                    
                                                    break;
                                                }
                                            }
                                            
                                            else if (layer.hasOwnProperty('_icon') && !is_multi_id){
                                                
                                                if (leaflet_id === _leaflet_id) {
                                                    
                                                    layer._icon.style.display = 'none';
                                                    layer.feature.special_tools.icon_display = 'none';
                                                    
                                                    if (layer.hasOwnProperty('_shadow')) {
                                                        
                                                        layer._shadow.style.display = 'none';
                                                        layer.feature.special_tools.shadow_display = 'none';
                                                    
                                                    }
                                                    
                                                    break;
                                                    
                                                }
                                                
                                            }
                                            
                                        }
                                        
                                    }
                                    
                                }

                            });


                        }
 
                    } catch (e) {}
                    
                    try {
                        
                        const icon_view_object = modal._container.querySelectorAll(".icon-view-object");
                        
                        for (let index in icon_view_object) {

                            L.DomEvent.on(icon_view_object[index], 'click', function(){

                                is_multi_id = false;
                                const _leaflet_id = parseInt(this.getAttribute('leaflet-id'));
                                
                                if (isNaN(_leaflet_id) && this.hasAttribute('multi-id')) {
                                    
                                    is_multi_id = true;
                                    _multi_id = this.getAttribute('multi-id');
                                    
                                } 
                                    
                                if (typeof collection === 'object') {

                                    for (let obj in collection._layers) {
                                        
                                        const layer = collection._layers[obj];

                                        if (!is_multi_id) {
                                            
                                            const leaflet_id = collection._layers[obj]._leaflet_id;

                                            if (_leaflet_id === leaflet_id) {

                                                if (layer.hasOwnProperty('_icon')) {
                                                    
                                                    map.setView(layer._latlng, 16);
                                                    
                                                } else {
                                                    
                                                    map.fitBounds(layer.getBounds());
                                                    
                                                }

                                            }
                                            
                                        } else {
                                            
                                            const multi_id = collection._layers[obj].feature.special_tools.multi_id;
                                            
                                            if (_multi_id === multi_id) {

                                                if (layer.hasOwnProperty('_icon')) {
                                                    
                                                    map.setView(layer._latlng, 16);
                                                    
                                                } else {
                                                    
                                                    map.fitBounds(layer.getBounds());
                                                    
                                                }
                                                
                                                break;
                                                
                                            }
                                            
                                        }

                                    }
                                }
                            });
                            
                        }
                        
                    } catch (e) {}

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

L.control.specialToolsObjects = function (options) {
    
    return new L.Control.SpecialToolsObjects(options);
    
};