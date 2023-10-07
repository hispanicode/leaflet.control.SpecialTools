/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsCatastro = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;
        
        this.special_tools_msg = null;
        
        const controlDiv = L.DomUtil.create('div', 'special-tools-catastro special-tools-controls special-tools-disable');
        
        controlDiv.innerText = 'Catast';

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsCatastro/lang/lang.json')
        .then(function(response){
            
            return response.json();
            
        }).then(function(data){
            
            json_lang = data;
            
        });
        
        var enable_catastro = false;
        
        var wms = null;
        
        L.DomEvent.addListener(controlDiv, 'click', function(e){
            
            if (L.DomUtil.hasClass(controlDiv, 'special-tools-disable')) {
                          
                    window.setTimeout(function(){

                        map.on('click', map_click);

                        map.eachLayer(function(layer){

                            if (!(layer instanceof L.TileLayer)) {

                                layer.on('click', layer_click);

                            }

                        });

                    }, 1500);
                
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
                    
                    leaflet_control_layers_selector = leaflet_control_layers_base.querySelectorAll('.leaflet-control-layers-selector');
                    
                    for (let index in leaflet_control_layers_selector) {
                        
                        if (leaflet_control_layers_selector[index].checked) {
                            
                            basemap_history = index;
                            
                            break;
                            
                        }
                        
                    }

                    last_basemap_index = leaflet_control_layers_selector.length-1;

                    catastro_input_radio = leaflet_control_layers_selector[last_basemap_index];

                    catastro_input_radio.click();

                }  else {
                    
                    map.off('click', map_click);

                    map.eachLayer(function(layer){

                        if (!(layer instanceof L.TileLayer)) {

                            layer.off('click', layer_click);

                        }

                    });

                    L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                    
                    L.DomUtil.removeClass(controlDiv, 'special-tools-enable');

                    component_geolocation.layer_control.removeLayer(wms);
                    
                    wms.removeFrom(map);

                    document.querySelectorAll('.leaflet-control-layers-selector')[basemap_history].click();
                    
                    enable_catastro = false;
                    
                }

                L.DomEvent.stop(e);
                
            });
            
        map_click = function(event) {

            if (
                !special_tools.geoman_edition_mode(map)
                && enable_catastro) {

                content = "<div class='special-tools-container'>";
                content = content + "<div id='special_tools_msg'></div>";
                content = content + "</div>";

                map.fire('modal', {

                    title: special_tools._T("Catastro", json_lang, lang),
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

                        self.special_tools_msg.innerHTML = special_tools._T("Obteniendo parcela ...", json_lang, lang);

                        let bbox = map.getBounds().toBBoxString();

                        let point = map.latLngToContainerPoint(event.latlng, map.getZoom());

                        let size = map.getSize();

                        let url = route + '/leaflet.control.SpecialToolsCatastro/ajax/catastro_wms_refcat.php?';

                        fetch(url + new URLSearchParams({

                            url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?request=getFeatureInfo&layers=Catastro&query_layers=Catastro&srs=EPSG:4326&bbox='+bbox+'&height='+size.y+'&width='+size.x+'&x='+point.x+'&y='+point.y

                        }))
                        .then(function(response) {

                            return response.text();

                        })
                        .then(function(data){

                            let content = L.DomUtil.create('div');

                            content.innerHTML = data;

                            if (typeof content.querySelectorAll('a')[0] === 'undefined') {

                                self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Es posible que el servidor del Catastro esté saturado o la zona seleccionada no tenga una parcela asociada.", json_lang, lang);

                                window.setTimeout(function(){

                                    modal._container.querySelector('.close').click();

                                }, 3500);

                                return;

                            }

                            let refcat = content.innerText.trim();

                            let refcat_url = content.querySelectorAll('a')[0].href;

                            if (typeof refcat_url !== 'undefined') {

                                url = route + '/leaflet.control.SpecialToolsCatastro/ajax/catastro_wfs_getfeature.php?';

                                fetch(url + new URLSearchParams({

                                    url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getneighbourparcel&refcat='+refcat,
                                    getneighbourparcel: 1

                                }))
                                .then(function(response) {

                                    return response.text();

                                })
                                .then(function(polygon_coord) {

                                    if (polygon_coord !== '') {

                                        latlngs = JSON.parse(polygon_coord);

                                        if (typeof latlngs !== 'object') {

                                            self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Inténtelo de nuevo.", json_lang, lang);

                                            window.setTimeout(function(){

                                                modal._container.querySelector('.close').click();

                                            }, 3500);

                                            return;

                                        }

                                        let polygon = L.polygon(latlngs);

                                        polygon.feature = polygon.toGeoJSON();

                                        polygon.feature.special_tools = {};

                                        polygon.feature.special_tools.is_catastro = true;

                                        polygon.feature.special_tools.geoman_edition = false;

                                        polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                        polygon.feature.properties.url = refcat_url;

                                        try {

                                            self.special_tools_msg.innerHTML = special_tools._T("Creando la parcela ...", json_lang, lang);

                                            map.fire('pm:create', {layer: polygon});
                                            
                                            map.fitBounds(polygon.getBounds());

                                            modal._container.querySelector('.close').click();

                                        } catch(error) {

                                            self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                            window.setTimeout(function(){

                                                modal._container.querySelector('.close').click();

                                            }, 3500);

                                        }

                                        L.DomEvent.stop(event);

                                    } else {

                                        url = route+'/leaflet.control.SpecialToolsCatastro/ajax/catastro_wfs_getfeature.php?';

                                        fetch(url + new URLSearchParams({

                                            url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getparcel&refcat='+refcat,
                                            getparcel: 1

                                        }))
                                        .then(function(response){

                                            return response.text();

                                        })
                                        .then(function(polygon_coord) {
                                            
                                            
                                            if (polygon_coord === '') {
                                                
                                                self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Inténtelo de nuevo.", json_lang, lang);

                                                window.setTimeout(function(){

                                                    modal._container.querySelector('.close').click();

                                                }, 3500);

                                                return;
                                                
                                            }


                                            if (polygon_coord !== '') {

                                                latlngs = JSON.parse(polygon_coord);

                                                if (typeof latlngs !== 'object') {

                                                    self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Inténtelo de nuevo.", json_lang, lang);

                                                    window.setTimeout(function(){

                                                        modal._container.querySelector('.close').click();

                                                    }, 3500);

                                                    return;

                                                }

                                                let polygon = L.polygon(latlngs);

                                                polygon.feature = polygon.toGeoJSON();

                                                polygon.feature.special_tools = {};

                                                polygon.feature.special_tools.is_catastro = true;

                                                polygon.feature.special_tools.geoman_edition = false;

                                                polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                                polygon.feature.properties.url = refcat_url;

                                                try {

                                                    self.special_tools_msg.innerHTML = special_tools._T("Creando la parcela ...", json_lang, lang);

                                                    map.fire('pm:create', {layer: polygon});
                                                    
                                                    map.fitBounds(polygon.getBounds());

                                                    modal._container.querySelector('.close').click();

                                                } catch(error) {

                                                    self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                                    window.setTimeout(function(){

                                                        modal._container.querySelector('.close').click();

                                                    }, 3500);

                                                }

                                                L.DomEvent.stop(event);

                                            }
                                        })
                                        .catch(function(error) {

                                            self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                            window.setTimeout(function(){

                                                modal._container.querySelector('.close').click();

                                            }, 3500);

                                        });
                                    }
                                })
                                .catch(function(error) {

                                    self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                    window.setTimeout(function(){

                                        modal._container.querySelector('.close').click();

                                    }, 3500);

                                });
                            }
                        })
                        .catch(function(error) {

                            self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                            window.setTimeout(function(){

                                modal._container.querySelector('.close').click();

                            }, 3500);

                        });

                        map.off('click', map_click);

                        window.setTimeout(function(){

                            map.on('click', map_click);

                        }, 1000);

                    }
                });
            }
        };

        var stop = false;
        
        layer_click = function(event){

            const _layer = this;

            if (
                !special_tools.geoman_edition_mode(map)
                && enable_catastro && !stop
                ) {
            
                    content = "<div id='special_tools_msg'></div>";

                    map.fire('modal', {

                        title: special_tools._T("Catastro", json_lang, lang),
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

                            self.special_tools_msg.innerHTML = special_tools._T("Obteniendo parcela ...", json_lang, lang);

                            let bbox = map.getBounds().toBBoxString();

                            let point = map.latLngToContainerPoint(event.latlng, map.getZoom());

                            let size = map.getSize();

                            let url = route+'/leaflet.control.SpecialToolsCatastro/ajax/catastro_wms_refcat.php?';

                            fetch(url + new URLSearchParams({

                                url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?request=getFeatureInfo&layers=Catastro&query_layers=Catastro&srs=EPSG:4326&bbox='+bbox+'&height='+size.y+'&width='+size.x+'&x='+point.x+'&y='+point.y

                            }))
                            .then(function(response) {

                                return response.text();

                            })
                            .then(function(data) {

                                let content = L.DomUtil.create('div');

                                content.innerHTML = data;

                                if (typeof content.querySelectorAll('a')[0] === 'undefined') {

                                    self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Es posible que el servidor del Catastro esté saturado o la zona seleccionada no tenga una parcela asociada.", json_lang, lang);

                                    window.setTimeout(function(){

                                        modal._container.querySelector('.close').click();

                                    }, 3500);

                                    return;

                                }

                                let refcat = content.innerText.trim();

                                let refcat_url = content.querySelectorAll('a')[0].href;

                                if (typeof refcat_url !== 'undefined') {

                                    url = route+'/leaflet.control.SpecialToolsCatastro/ajax/catastro_wfs_getfeature.php?';

                                    fetch(url + new URLSearchParams({

                                        url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getneighbourparcel&refcat='+refcat,
                                        getneighbourparcel: 1

                                    }))
                                    .then(function(response) {

                                        return response.text();

                                    })
                                    .then(function(polygon_coord) {
                                        
                                        if (polygon_coord !== '') {

                                            latlngs = JSON.parse(polygon_coord);
                                    
                                            if (typeof latlngs !== 'object') {
                                                
                                                self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Inténtelo de nuevo.", json_lang, lang);

                                                window.setTimeout(function(){

                                                    modal._container.querySelector('.close').click();

                                                }, 3500);

                                                return;
                                                
                                            }

                                            let polygon = L.polygon(latlngs);

                                            polygon.feature = polygon.toGeoJSON();

                                            polygon.feature.special_tools = {};

                                            polygon.feature.special_tools.is_catastro = true;

                                            polygon.feature.special_tools.geoman_edition = false;

                                            polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                            polygon.feature.properties.url = refcat_url;

                                            if (_layer.hasOwnProperty('feature')) {

                                                if (_layer.feature.geometry.coordinates === polygon.feature.geometry.coordinates) {

                                                    return;

                                                }
                                            }

                                            try {

                                                 self.special_tools_msg.innerHTML = special_tools._T("Creando la parcela ...", json_lang, lang);

                                                 map.fire('pm:create', {layer: polygon});
                                                 
                                                 map.fitBounds(polygon.getBounds());

                                                 modal._container.querySelector('.close').click();

                                             } catch(error) {

                                                 self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                                 window.setTimeout(function(){

                                                     modal._container.querySelector('.close').click();

                                                 }, 3500);

                                             }

                                        } else {

                                            url = route+'/leaflet.control.SpecialToolsCatastro/ajax/catastro_wfs_getfeature.php?';

                                            fetch(url + new URLSearchParams({

                                                url: 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx?service=WFS&version=2.0&srs=EPSG:3857&request=getfeature&STOREDQUERIE_ID=getparcel&refcat='+refcat,
                                                getparcel: 1

                                            }))
                                            .then(function(response){

                                                return response.text();

                                            })
                                            .then(function(polygon_coord) {
                                                
                                                if (polygon_coord === '') {

                                                    self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Inténtelo de nuevo.", json_lang, lang);

                                                    window.setTimeout(function(){

                                                        modal._container.querySelector('.close').click();

                                                    }, 3500);

                                                    return;

                                                }

                                                if (polygon_coord !== '') {

                                                    latlngs = JSON.parse(polygon_coord);

                                                    if (typeof latlngs !== 'object') {

                                                        self.special_tools_msg.innerHTML = special_tools._T("No ha sido posible obtener la parcela. Inténtelo de nuevo.", json_lang, lang);

                                                        window.setTimeout(function(){

                                                            modal._container.querySelector('.close').click();

                                                        }, 3500);

                                                        return;

                                                    }

                                                    let polygon = L.polygon(latlngs);

                                                    polygon.feature = polygon.toGeoJSON();

                                                    polygon.feature.special_tools = {};

                                                    polygon.feature.special_tools.is_catastro = true;

                                                    polygon.feature.special_tools.geoman_edition = false;

                                                    polygon.feature.special_tools.tools_id = special_tools.make_id(20);

                                                    polygon.feature.properties.url = refcat_url;

                                                    try {

                                                        self.special_tools_msg.innerHTML = special_tools._T("Creando la parcela ...", json_lang, lang);

                                                        map.fire('pm:create', {layer: polygon});
                                                        
                                                        map.fitBounds(polygon.getBounds());

                                                        modal._container.querySelector('.close').click();

                                                    } catch(error) {

                                                        self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                                        window.setTimeout(function(){

                                                            modal._container.querySelector('.close').click();

                                                        }, 3500);

                                                    }

                                                }
                                            })
                                            .catch((error) => {

                                                self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                                window.setTimeout(function(){

                                                    modal._container.querySelector('.close').click();

                                                }, 3500);

                                            });
                                        }
                                    })
                                    .catch((error) => {

                                        self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                        window.setTimeout(function(){

                                            modal._container.querySelector('.close').click();

                                        }, 3500);

                                    });
                                }
                            })
                            .catch((error) => {

                                self.special_tools_msg.innerHTML = special_tools._T("Ha ocurrido un error al intentar crear la parcela", json_lang, lang);

                                window.setTimeout(function(){

                                    modal._container.querySelector('.close').click();

                                }, 3500);

                            });

                            stop = true;

                            _layer.off('click', map_click);

                            window.setTimeout(function(){

                                _layer.on('click', map_click);
                                stop = false;

                            }, 1000);
                

                    }
                });
            }
        };     

        false_div = L.DomUtil.create('div');
        
        return false_div;
        
    }
});

L.control.specialToolsCatastro = function (options) {
    
    return new L.Control.SpecialToolsCatastro(options);
    
};