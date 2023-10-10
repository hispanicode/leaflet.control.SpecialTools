/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsMapImageDownload = L.Control.extend({
    
    onAdd: function (map) {

        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-map-image-download special-tools-controls special-tools-disable');

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsMapImageDownload/lang/lang.json')
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
            
            content = "<div class='special-tools-container special-tools-div-33'>";
            content = content +  special_tools._T("Exportar como: ", json_lang, lang);
            content = content + "<select class='special-tools-select' id='raster_export'>";
            content = content + "<option value='tif'>Raster GeoTiff</option>";
            content = content + "<option value='png'>png</option>";
            content = content + "<option value='jpg'>jpg</option>";
            content = content + "<option value='gif'>gif</option>";
            content = content + "<option value='webp'>webp</option>";
            content = content + "</select>"; 
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container special-tools-div-66'>";
            content = content + special_tools._T(" Nombre: ", json_lang, lang) + "<input type='text' id='raster_name' class='special-tools-input-150' value='" + special_tools._T("archivo", json_lang, lang) + "'>";
            content = content + "<img id='btn_map_download' src='"+route+"/img/download.png' style='cursor: pointer; width: 24px; height; 24px;' title='" + special_tools._T("Descargar Mapa", json_lang, lang) + "'>";
            content = content + "</div>";
            
            content = content + "<div style='clear: left;'></div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='while_download' class='special-tools-while-download'></div>";
            content = content + "</div>";
            
            map.fire('modal', {
                
              title: special_tools._T("Descargar Mapa", json_lang, lang),
              content: content,
              template: ['<div style="padding: 0px"><div class="special-tools-h1">{title}</div></div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '</div>'
              ].join(''),
              width: 'auto',
                
                onShow: function(evt){
                    
                    modal = evt.modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                    
                    btn_map_download = modal._container.querySelector('#btn_map_download');
                    
                    L.DomEvent.on(btn_map_download, 'click', function() {
                        
                        while_download = modal._container.querySelector('#while_download');

                        raster_name = modal._container.querySelector('#raster_name');

                        raster_export = modal._container.querySelector('#raster_export');

                        file_type = raster_export.options[raster_export.selectedIndex].value;

                        if (raster_name.value === '') {
                            
                            while_download.innerHTML = special_tools._T("Por favor, indique un nombre para el archivo", json_lang, lang);
                            
                            L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                            
                            return;
                        }

                        map._controlCorners.topright.style.display = 'none';
                        map._controlCorners.topleft.style.display = 'none';
                        map._controlCorners.bottomright.style.display = 'none';
                        map._controlCorners.bottomleft.style.display = 'none';

                        leaflet_pane = map._container.querySelector('.leaflet-pane');

                        domtoimage.toPng(leaflet_pane, {cacheBust: true, width: map._size.x, height: map._size.y})

                        .then(function (dataUrl) {
                            
                                while_download.innerHTML = '';
                                L.DomUtil.addClass(while_download, 'special-tools-msg-ok');

                                var chars_download = new Array('|', '\\', '_', '/');

                                var i_char = 0;

                                function _while_download() {

                                    if (i_char > chars_download.length-1) i_char = 0;

                                    while_download.innerHTML = special_tools._T("Descargando ... ", json_lang, lang) + chars_download[i_char];

                                    i_char++;
                                }

                                timer = window.setInterval(_while_download, 1000);

                                if (file_type === 'tif') {

                                    tif_bounds = map.getBounds().getNorthWest().lng;
                                    tif_bounds = tif_bounds + ' ' + map.getBounds().getNorthWest().lat;
                                    tif_bounds = tif_bounds + ' ' + map.getBounds().getSouthEast().lng;
                                    tif_bounds = tif_bounds + ' ' + map.getBounds().getSouthEast().lat;

                                } else {

                                    tif_bounds = null;

                                }

                                formData = new FormData();
                                formData.append('raster_name', raster_name.value);
                                formData.append('file_type', file_type);
                                formData.append('tif_bounds', tif_bounds);
                                formData.append('dataUrl', dataUrl);
                                url = route + '/leaflet.control.SpecialToolsMapImageDownload/ajax/map-image-download.php';

                                fetch(url, {
                                  method: "POST", 
                                  body: formData

                                }).then(function(response) {

                                    return response.text();

                                }).then(function(data){

                                    data = JSON.parse(data);

                                    if (data.success) {

                                        window.open(route + '/leaflet.control.SpecialToolsMapImageDownload/ajax/'+data.zip, '_blank');

                                        map._controlCorners.topright.style.display = 'block';
                                        map._controlCorners.topleft.style.display = 'block';
                                        map._controlCorners.bottomright.style.display = 'block';
                                        map._controlCorners.bottomleft.style.display = 'block';
                                        
                                        window.clearInterval(timer);
                                        
                                        L.DomUtil.addClass(while_download, 'special-tools-msg-ok');
                                        while_download.innerHTML = special_tools._T("Archivo descargado correctamente", json_lang, lang);

                                    } else {

                                        window.clearInterval(timer);
                                        
                                        L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                                        while_download.innerHTML = special_tools._T("Ha ocurrido un error al crear el archivo", json_lang, lang);

                                    }

                                });
                                
                            }).catch(function(error){
                                
                                if (typeof timer !== 'undefined') {
                                    
                                    window.clearInterval(timer);
                                    
                                }
 
                                L.DomUtil.addClass(while_download, 'special-tools-msg-error');
                                while_download.innerHTML = special_tools._T("Ha ocurrido un error al crear la imagen. Error CORS. El mapa base no tiene el protocolo https.", json_lang, lang);
                                
                                map._controlCorners.topright.style.display = 'block';
                                map._controlCorners.topleft.style.display = 'block';
                                map._controlCorners.bottomright.style.display = 'block';
                                map._controlCorners.bottomleft.style.display = 'block';
                                
                            });

                    });
                    
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

L.control.specialToolsMapImageDownload = function (options) {
    return new L.Control.SpecialToolsMapImageDownload(options);
};

