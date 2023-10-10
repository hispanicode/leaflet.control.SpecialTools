/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsLegend = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        var json_lang = {};
        
        fetch(route + '/leaflet.control.SpecialToolsLegend/lang/lang.json')
        .then(function(response){
            
            return response.json();
            
        }).then(function(data){
            
            json_lang = data;
            
        });
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-legend special-tools-controls special-tools-disable');

        this.legend_div_container = L.DomUtil.create('div', 'special-tools-container-legend-div');
        
        this.legend_div = L.DomUtil.create('div', 'special-tools-legend-div');

        this.legend_div.style.left = ((map.getSize().x / 2) + 100) + "px";
        
        map.on('resize', function(e){
            
            self.legend_div.style.left = ((e.newSize.x / 2) + 100) + "px";
            
        });

        map._controlCorners.topleft.appendChild(this.legend_div);

        if (!L.Browser.mobile) {
            
            special_tools.special_tools_btns.appendChild(controlDiv);
            
        } else {
            
            this.legend_div.style.display = 'none';
            
        }
       
        url = route + "/leaflet.control.SpecialToolsLegend/ajax/legend.json?v=" + special_tools.make_id(100);

        fetch(url)
        .then(function(response) {

            return response.json();

        }).then(function(data){

            legend_json = data;
            
            if (legend_json.hasOwnProperty('enable')) {
                
                if (legend_json.enable) {
                    
                    self.legend_div.style.display = 'block';
                    
                } else {
                    
                    self.legend_div.style.display = 'none';
                    
                }
                
            }
            
            self.legend_div.innerHTML = '';

            _legend_title = L.DomUtil.create('div');
            _legend_title.setAttribute('class', 'special-tools-legend-name');
            _legend_title.innerText = legend_json.legend;

            self.legend_div.appendChild(_legend_title);

            for (let col in legend_json.columns) {

                _column_div = L.DomUtil.create('div');

                _column_div.setAttribute('class', 'special-tools-column-div');

                _column_name = L.DomUtil.create('div');
                _column_name.setAttribute('class', 'special-tools-container special-tools-column-name');
                _column_name.innerText = legend_json.columns[col].name;

                _column_div.appendChild(_column_name);

                self.legend_div.appendChild(_column_div);

                for (let elem in legend_json.columns[col].elements) {

                    _element_div = L.DomUtil.create('div');

                    _element_color = L.DomUtil.create('div');
                    _element_color.style.backgroundColor = legend_json.columns[col].elements[elem].color;
                    _element_color.style.width = '8px';
                    _element_color.style.height = '8px';
                    _element_color.style.marginTop = '3px';
                    _element_color.style.marginRight = '4px';
                    _element_color.style.float = 'left';

                    _element_name = L.DomUtil.create('div');
                    _element_name.innerText = legend_json.columns[col].elements[elem].name;
                    _element_name.style.float = 'left';

                    _element_clear = L.DomUtil.create('div');
                    _element_clear.style.clear = 'left';

                    _element_div.appendChild(_element_color);
                    _element_div.appendChild(_element_name);
                    _element_div.appendChild(_element_clear);

                    _column_div.appendChild(_element_div);
                }

            }

        });

        L.DomEvent.addListener(controlDiv, 'click', function(){
            
            L.DomUtil.addClass(controlDiv, 'special-tools-enable');
            L.DomUtil.removeClass(controlDiv, 'special-tools-disable');
            
            let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');

            try {
                special_tools.only_one_control_active(elements_controls, controlDiv);
            } catch (e) {};
            
            
            chk_checked = '';
            
            if (legend_json.hasOwnProperty('enable')) {
                
                if (legend_json.enable) {
                    
                    chk_checked = 'checked';
                    
                } else {
                    
                    chk_checked = '';
                    
                }
                
            }
            
            content = "<div class='special-tools-container special-tools-div-33'>";
            content = content + special_tools._T("Leyenda: ", json_lang, lang) + "<input type='text' id='legend_name' class='special-tools-input-150' value='"+ legend_json.legend +"'>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container special-tools-div-40'>";
            content = content + "<button type='button' id='btn_add_column' class='special-tools-btn-default'>" + special_tools._T("Nueva columna", json_lang, lang) + "</button>";
            content = content + " <button type='button' id='btn_save_legend' class='special-tools-btn-primary'>" + special_tools._T("Guardar", json_lang, lang) + "</button>";
            content = content + "</div>";

            content = content + "<div class='special-tools-container special-tools-div-33'>";
            content = content + special_tools._T("Mostrar leyenda: ", json_lang, lang) + "<input type='checkbox' id='chk_show_legend' " + chk_checked + ">";
            content = content + "</div>";
            
            content = content + "<div style='clear: left;'></div>";
            
            content = content + "<div class='special-tools-container' id='legend_msg_box'></div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='div_columns'></div>";
            content = content + "</div>";

            map.fire('modal', {
                
              title: special_tools._T("Generar leyenda", json_lang, lang),
              content: content,
              template: ['<div style="padding: 0px;"><div class="special-tools-h1">{title}</div></div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '</div>'
              ].join(''),

              width: 'auto',
                
                onShow: function(evt){
                    
                    modal = evt.modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";

                    legend_url = route + '/leaflet.control.SpecialToolsLegend/ajax/legend.json?' + special_tools.make_id(100);
                    
                    fetch(legend_url)
                    .then(function(response){
                        
                        return response.json();
                
                    }).then(function(data){

                        legend_json = data;
                        console.log(legend_json);
                        
                    });
                    
                    legend_name = modal._container.querySelector('#legend_name');
                    
                    btn_save_legend = modal._container.querySelector('#btn_save_legend');
                    
                    btn_add_column = modal._container.querySelector('#btn_add_column');
                    
                    div_columns = modal._container.querySelector('#div_columns');
                    
                    btn_add_element = modal._container.querySelector('#btn_add_element');
                    
                    chk_show_legend = modal._container.querySelector('#chk_show_legend');
                    
                    legend_msg_box = modal._container.querySelector('#legend_msg_box');
                    

                    L.DomEvent.on(legend_name, 'keyup', function(){
                        
                        legend_json.legend = this.value;
                        
                    });
                    
                    L.DomEvent.on(chk_show_legend, 'click', function() {
                        
                        if (this.checked) {
                            
                            self.legend_div.style.display = 'block';
                            legend_json.enable = true;
                            
                            
                        } else {
                            
                            self.legend_div.style.display = 'none';
                            legend_json.enable = false;
                            
                        }
                        
                    });
                    
                    L.DomEvent.on(btn_save_legend, 'click', function(){
                        
                        url = route + "/leaflet.control.SpecialToolsLegend/ajax/legend.php?";

                        legend_json.legend = legend_name.value;
                        legend_json.columns = columns;

                        fetch(url + new URLSearchParams({
                                    
                             content: JSON.stringify(legend_json)
                                
                        }))
                        .then(function(response) {
                            
                            return response.json();
                            
                        }).then(function(data){
                            
                            legend_json = data;
                            
                        });
                        
                        self.legend_div.innerHTML = '';
                        
                        legend_title = modal._container.querySelector('#legend_name');

                        _legend_title = L.DomUtil.create('div');
                        _legend_title.setAttribute('class', 'special-tools-legend-name');
                        _legend_title.innerText = legend_title.value;
                        
                        self.legend_div.appendChild(_legend_title);
                        
                        for (let col in columns) {
                            
                            _column_div = L.DomUtil.create('div');
                            
                            _column_div.setAttribute('class', 'special-tools-column-div');
                            
                            _column_name = L.DomUtil.create('div');
                            _column_name.setAttribute('class', 'special-tools-container special-tools-column-name');
                            _column_name.innerText = columns[col].name;;
                            
                            _column_div.appendChild(_column_name);
                            
                            self.legend_div.appendChild(_column_div);
                            
                            for (let elem in columns[col].elements) {
                                
                                _element_div = L.DomUtil.create('div');
                                
                                _element_color = L.DomUtil.create('div');
                                _element_color.style.backgroundColor = columns[col].elements[elem].color;
                                _element_color.style.width = '8px';
                                _element_color.style.height = '8px';
                                _element_color.style.marginTop = '3px';
                                _element_color.style.marginRight = '4px';
                                _element_color.style.float = 'left';
                                
                                _element_name = L.DomUtil.create('div');
                                _element_name.innerText = columns[col].elements[elem].name;
                                _element_name.style.float = 'left';
                                
                                _element_clear = L.DomUtil.create('div');
                                _element_clear.style.clear = 'left';

                                _element_div.appendChild(_element_color);
                                _element_div.appendChild(_element_name);
                                _element_div.appendChild(_element_clear);

                                _column_div.appendChild(_element_div);
                            }
                            
                        }
                        
                        legend_msg_box.innerHTML = special_tools._T("Leyenda guardada con éxito", json_lang, lang);
                        L.DomUtil.removeClass(legend_msg_box, 'special-tools-msg-error');
                        L.DomUtil.addClass(legend_msg_box, 'special-tools-msg-ok');
                        
                        window.setTimeout(function(){
                           
                            legend_msg_box.innerHTML = '';
                            
                        }, 3000);
                        
                    });

                    columns = legend_json.columns;
                    
                    for (let index in legend_json.columns) {
                        
                        const div = L.DomUtil.create('div');
                        div.style.borderTop = '1px solid #1ACBED';
                        div.setAttribute('class', 'div-column');

                        const div_container_1 = L.DomUtil.create('div');
                        div_container_1.setAttribute('class', 'special-tools-container special-tools-div-33');

                        const input_column_span = L.DomUtil.create('span');
                        input_column_span.innerText = special_tools._T("Columna: ", json_lang, lang);
                        
                        const input_column = L.DomUtil.create('input');
                        input_column.type = 'text';
                        input_column.setAttribute('class', 'special-tools-input-150');
                        input_column.setAttribute('index-column', index);
                        input_column.value = legend_json.columns[index].name;
                        
                        div_container_1.appendChild(input_column_span);
                        div_container_1.appendChild(input_column);
                        
                        
                        const div_container_2 = L.DomUtil.create('div');
                        div_container_2.setAttribute('class', 'special-tools-container special-tools-div-50');
                        
                        const btn_column = L.DomUtil.create('button');
                        btn_column.type = 'button';
                        btn_column.innerText = special_tools._T("Añadir elemento", json_lang, lang);
                        btn_column.setAttribute('class', 'special-tools-btn-default');
                        btn_column.setAttribute('index-column', index);
                        
                        const btn_column_delete = L.DomUtil.create('button');
                        btn_column_delete.innerText = special_tools._T("Eliminar columna", json_lang, lang);
                        btn_column_delete.setAttribute('class', 'special-tools-btn-danger');
                        btn_column_delete.setAttribute('index-column', index);
                        
                        div_container_2.appendChild(btn_column);
                        div_container_2.appendChild(btn_column_delete);
                        
                        const div_clear = L.DomUtil.create('div');
                        div_clear.style.clear = 'left';
                        
                        const div_column = L.DomUtil.create('div');
                        
                        div.appendChild(div_container_1);
                        div.appendChild(div_container_2);
                        div.appendChild(div_clear);
                        div.appendChild(div_column);

                        div_columns.appendChild(div);
                        
                         L.DomEvent.on(btn_column_delete, 'click', function(){
                            
                            _index_column = this.getAttribute('index-column');
                            
                            delete columns[parseInt(_index_column)];
                            
                            columns = columns.flat();
                            
                            window.setTimeout(function(){
                                
                                L.DomUtil.remove(div);
                                
                            }, 500);
                            
                            
                            _div_columns = div_columns.querySelectorAll('.div-column');
                            
                            for (x = 0; x < _div_columns.length; x++) {
                                
                                _div_columns[x].children[0].querySelector('input').setAttribute('index-column', x);
                                _div_columns[x].children[1].querySelectorAll('button')[0].setAttribute('index-column', x);
                                _div_columns[x].children[1].querySelectorAll('button')[1].setAttribute('index-column', x);
                                
                                _div_elements = _div_columns[x].children[2].querySelectorAll('.div-elements');

                                for (y = 0; y < _div_elements.length; y++) {

                                    _div_elements[y].children[1].setAttribute('index-column', x);
                                    _div_elements[y].children[2].setAttribute('index-column', x);
                                    _div_elements[y].children[3].setAttribute('index-column', x);

                                }
                                
                            } 
                            
                        });
                        
                        L.DomEvent.on(input_column, 'keyup', function(){
                            
                            this.setAttribute('value', this.value);
                            
                            _index_column = this.getAttribute('index-column')
                            
                            columns[parseInt(_index_column)].name = this.value;
                            
                        });
                        
                        L.DomEvent.on(btn_column, 'click', function(){
                            
                            const __index_column__ = parseInt(this.getAttribute('index-column'));
                            
                            if (columns[__index_column__].elements.length === 0) {
                                
                                columns[__index_column__].elements[0] = {
                                    
                                    "name": "",
                                    "color": "#000000"
                                    
                                };
                                
                                __index_element__ = 0;
                                
                            } else {
                                
                                columns[parseInt(__index_column__)].elements[columns[parseInt(__index_column__)].elements.length] = {
                                    
                                    "name": "",
                                    "color": "#000000"
                                    
                                };
                                
                                __index_element__ = columns[__index_column__].elements.length-1;

                            }
                            
                            const column = L.DomUtil.create('div');
                            column.setAttribute('class', 'special-tools-container div-elements');
                            
                            const element_name_span = L.DomUtil.create('span');
                            element_name_span.innerText = special_tools._T("Elemento: ", json_lang, lang);
                            
                            const element_name = L.DomUtil.create('input');
                            element_name.type = 'text';
                            element_name.setAttribute('class', 'special-tools-input-150');
                            element_name.setAttribute('index-column', __index_column__);
                            element_name.setAttribute('index-element', __index_element__);
                            
                            const element_color = L.DomUtil.create('input');
                            element_color.type = 'color';
                            element_color.style.margin = '5px';
                            element_color.setAttribute('index-column', __index_column__);
                            element_color.setAttribute('index-element', __index_element__);
                            
                            const element_delete = L.DomUtil.create('button');
                            element_delete.innerHTML = "<img width='20' height='20' src='" + route + "/leaflet.control.SpecialToolsLegend/img/trash.png'>";
                            element_delete.setAttribute('class', 'special-tools-btn-danger');
                            element_delete.setAttribute('index-column', __index_column__);
                            element_delete.setAttribute('index-element', __index_element__);
                            
                            column.appendChild(element_name_span);
                            column.appendChild(element_name);
                            column.appendChild(element_color);
                            column.appendChild(element_delete);
                            
                            div_column.appendChild(column);

                            L.DomEvent.on(element_name, 'keyup', function(){
                                
                                this.setAttribute('value', this.value);
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                _index_element = parseInt(this.getAttribute('index-element'));
                                
                                columns[_index_column].elements[_index_element].name = this.value;
                                
                            });
                            
                            L.DomEvent.on(element_color, 'input change', function(){
                                
                                this.setAttribute('value', this.value);
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                _index_element = parseInt(this.getAttribute('index-element'));
                                columns[_index_column].elements[_index_element].color = this.value;
                                
                            });
                            
                            L.DomEvent.on(element_delete, 'click', function(){
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                
                                _index_element = parseInt(this.getAttribute('index-element'));
                                
                                delete columns[_index_column].elements[_index_element];
                                
                                columns[_index_column].elements = columns[_index_column].elements.flat();
                                
                                window.setTimeout(function(){
                                    
                                    L.DomUtil.remove(column);
                                    
                                }, 500);
                                
                                _div_elements = div_column.querySelectorAll('.div-elements');

                                for (x = 0; x < _div_elements.length; x++) {

                                    _div_elements[x].children[1].setAttribute('index-element', x);
                                    _div_elements[x].children[2].setAttribute('index-element', x);
                                    _div_elements[x].children[3].setAttribute('index-element', x);

                                }
                                
                            });
                          
                        });
                        
                        
                        for (let index_elem in columns[index].elements) {
                            
                            const column = L.DomUtil.create('div');
                            column.setAttribute('class', 'special-tools-container div-elements');
                            
                            const element_name_span = L.DomUtil.create('span');
                            element_name_span.innerText = special_tools._T("Elemento: ", json_lang, lang);
                            
                            const element_name = L.DomUtil.create('input');
                            element_name.type = 'text';
                            element_name.setAttribute('class', 'special-tools-input-150');
                            element_name.setAttribute('index-column', index);
                            element_name.setAttribute('index-element', index_elem);
                            element_name.value = columns[index].elements[index_elem].name;
                            
                            const element_color = L.DomUtil.create('input');
                            element_color.type = 'color';
                            element_color.style.margin = '5px';
                            element_color.setAttribute('index-column', index);
                            element_color.setAttribute('index-element',index_elem);
                            element_color.value = columns[index].elements[index_elem].color;
                            
                            const element_delete = L.DomUtil.create('button');
                            element_delete.innerHTML = "<img width='20' height='20' src='" + route + "/leaflet.control.SpecialToolsLegend/img/trash.png'>";
                            element_delete.setAttribute('class', 'special-tools-btn-danger');
                            element_delete.setAttribute('index-column',index);
                            element_delete.setAttribute('index-element', index_elem);
                            
                            column.appendChild(element_name_span);
                            column.appendChild(element_name);
                            column.appendChild(element_color);
                            column.appendChild(element_delete);
                            
                            div_column.appendChild(column);

                            L.DomEvent.on(element_name, 'keyup', function(){
                                
                                this.setAttribute('value', this.value);
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                _index_element = parseInt(this.getAttribute('index-element'));
                                
                                columns[_index_column].elements[_index_element].name = this.value;
                                
                            });
                            
                            L.DomEvent.on(element_color, 'input change', function(){
                                
                                this.setAttribute('value', this.value);
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                _index_element = parseInt(this.getAttribute('index-element'));
                                columns[_index_column].elements[_index_element].color = this.value;
                                
                            });
                            
                            L.DomEvent.on(element_delete, 'click', function(){
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                
                                _index_element = parseInt(this.getAttribute('index-element'));
                                
                                delete columns[_index_column].elements[_index_element];
                                
                                columns[_index_column].elements = columns[_index_column].elements.flat();
                                
                                window.setTimeout(function(){
                                
                                    L.DomUtil.remove(column);
                                
                                }, 500);
                                
                                _div_elements = div_column.querySelectorAll('.div-elements');

                                for (x = 0; x < _div_elements.length; x++) {

                                    _div_elements[x].children[1].setAttribute('index-element', x);
                                    _div_elements[x].children[2].setAttribute('index-element', x);
                                    _div_elements[x].children[3].setAttribute('index-element', x);

                                }
                                
                            });
                            
                        }
                        
                        
                        
                    }
                    
                    L.DomEvent.on(btn_add_column, 'click', function(){
                        
                        if (columns.length === 4) {
                            
                            legend_msg_box.innerHTML = special_tools._T("El máximo de columnas permitidas son 4", json_lang, lang);
                            L.DomUtil.removeClass(legend_msg_box, 'special-tools-msg-ok');
                            L.DomUtil.addClass(legend_msg_box, 'special-tools-msg-error');

                            window.setTimeout(function(){

                                legend_msg_box.innerHTML = "";

                            }, 3000);
                            
                            return;
                            
                        }
                        
                        if (columns.length === 0) {
                            
                        columns[0] = {
                            
                            "name": "",
                            "elements": []
                            
                        };
                        
                        _index_column_ = 0;
                                             
                        } else {
                            
                            columns[columns.length] = {
                                
                                "name": "",
                                "elements": []
                            };
                            
                            _index_column_ = columns.length-1;
                            
                        }

                        const div = L.DomUtil.create('div');
                        div.style.borderTop = '1px solid #1ACBED';
                        div.setAttribute('class', 'div-column');

                        const div_container_1 = L.DomUtil.create('div');
                        div_container_1.setAttribute('class', 'special-tools-container special-tools-div-33');

                        const input_column_span = L.DomUtil.create('span');
                        input_column_span.innerText = special_tools._T("Columna: ", json_lang, lang);
                        
                        const input_column = L.DomUtil.create('input');
                        input_column.type = 'text';
                        input_column.setAttribute('class', 'special-tools-input-150');
                        input_column.setAttribute('index-column', _index_column_);
                        
                        div_container_1.appendChild(input_column_span);
                        div_container_1.appendChild(input_column);
                        
                        
                        const div_container_2 = L.DomUtil.create('div');
                        div_container_2.setAttribute('class', 'special-tools-container special-tools-div-50');
                        
                        const btn_column = L.DomUtil.create('button');
                        btn_column.type = 'button';
                        btn_column.innerText = special_tools._T("Añadir elemento", json_lang, lang);
                        btn_column.setAttribute('class', 'special-tools-btn-default');
                        btn_column.setAttribute('index-column', _index_column_);
                        
                        const btn_column_delete = L.DomUtil.create('button');
                        btn_column_delete.innerText = special_tools._T("Eliminar columna", json_lang, lang);
                        btn_column_delete.setAttribute('class', 'special-tools-btn-danger');
                        btn_column_delete.setAttribute('index-column', _index_column_);
                        
                        div_container_2.appendChild(btn_column);
                        div_container_2.appendChild(btn_column_delete);
                        
                        const div_clear = L.DomUtil.create('div');
                        div_clear.style.clear = 'left';
                        
                        const div_column = L.DomUtil.create('div');
                        
                        div.appendChild(div_container_1);
                        div.appendChild(div_container_2);
                        div.appendChild(div_clear);
                        div.appendChild(div_column);

                        div_columns.appendChild(div);
                        
                        L.DomEvent.on(btn_column_delete, 'click', function(){
                            
                            _index_column = this.getAttribute('index-column');
                            
                            delete columns[parseInt(_index_column)];
                            
                            columns = columns.flat();
                            
                            console.log(columns);
                            
                            window.setTimeout(function(){
                            
                                L.DomUtil.remove(div);
                            
                            }, 500);
                            
                            _div_columns = div_columns.querySelectorAll('.div-column');
                            
                            for (x = 0; x < _div_columns.length; x++) {
                                
                                _div_columns[x].children[0].querySelector('input').setAttribute('index-column', x);
                                _div_columns[x].children[1].querySelectorAll('button')[0].setAttribute('index-column', x);
                                _div_columns[x].children[1].querySelectorAll('button')[1].setAttribute('index-column', x);
                                
                                _div_elements = _div_columns[x].children[2].querySelectorAll('.div-elements');

                                for (y = 0; y < _div_elements.length; y++) {

                                    _div_elements[y].children[1].setAttribute('index-column', x);
                                    _div_elements[y].children[2].setAttribute('index-column', x);
                                    _div_elements[y].children[3].setAttribute('index-column', x);

                                }
                                
                            } 
                            
                        });

                        L.DomEvent.on(input_column, 'keyup', function(){
                            
                            this.setAttribute('value', this.value);
                            
                            _index_column = this.getAttribute('index-column')
                            
                            columns[parseInt(_index_column)].name = this.value;
                            
                        });

                        L.DomEvent.on(btn_column, 'click', function(){
                            
                            const __index_column__ = parseInt(this.getAttribute('index-column'));
                            
                            if (columns[__index_column__].elements.length === 0) {
                                
                                columns[__index_column__].elements[0] = {
                                    
                                    "name": "",
                                    "color": "#000000"
                                    
                                };
                                
                                __index_element__ = 0;
                                
                            } else {
                                
                                columns[parseInt(__index_column__)].elements[columns[parseInt(__index_column__)].elements.length] = {
                                    
                                    "name": "",
                                    "color": "#000000"
                                    
                                };
                                
                                __index_element__ = columns[__index_column__].elements.length-1;

                            }
                            
                            const column = L.DomUtil.create('div');
                            column.setAttribute('class', 'special-tools-container div-elements');
                            
                            const element_name_span = L.DomUtil.create('span');
                            element_name_span.innerText = special_tools._T("Elemento: ", json_lang, lang);
                            
                            const element_name = L.DomUtil.create('input');
                            element_name.type = 'text';
                            element_name.setAttribute('class', 'special-tools-input-150');
                            element_name.setAttribute('index-column', __index_column__);
                            element_name.setAttribute('index-element', __index_element__);
                            
                            const element_color = L.DomUtil.create('input');
                            element_color.type = 'color';
                            element_color.style.margin = '5px';
                            element_color.setAttribute('index-column', __index_column__);
                            element_color.setAttribute('index-element', __index_element__);
                            
                            const element_delete = L.DomUtil.create('button');
                            element_delete.innerHTML = "<img width='20' height='20' src='" + route + "/leaflet.control.SpecialToolsLegend/img/trash.png'>";
                            element_delete.setAttribute('class', 'special-tools-btn-danger');
                            element_delete.setAttribute('index-column', __index_column__);
                            element_delete.setAttribute('index-element', __index_element__);
                            
                            column.appendChild(element_name_span);
                            column.appendChild(element_name);
                            column.appendChild(element_color);
                            column.appendChild(element_delete);
                            
                            div_column.appendChild(column);

                            L.DomEvent.on(element_name, 'keyup', function(){
                                
                                this.setAttribute('value', this.value);
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                _index_element = parseInt(this.getAttribute('index-element'));
                                
                                columns[_index_column].elements[_index_element].name = this.value;
                                
                            });
                            
                            L.DomEvent.on(element_color, 'input change', function(){
                                
                                this.setAttribute('value', this.value);
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                _index_element = parseInt(this.getAttribute('index-element'));
                                columns[_index_column].elements[_index_element].color = this.value;
                                
                            });
                            
                            L.DomEvent.on(element_delete, 'click', function(){
                                
                                _index_column = parseInt(this.getAttribute('index-column'));
                                
                                _index_element = parseInt(this.getAttribute('index-element'));
                                
                                delete columns[_index_column].elements[_index_element];
                                
                                columns[_index_column].elements = columns[_index_column].elements.flat();
                                
                                window.setTimeout(function(){
                                
                                    L.DomUtil.remove(column);
                                
                                }, 500);
                                
                                _div_elements = div_column.querySelectorAll('.div-elements');

                                for (x = 0; x < _div_elements.length; x++) {

                                    _div_elements[x].children[1].setAttribute('index-element', x);
                                    _div_elements[x].children[2].setAttribute('index-element', x);
                                    _div_elements[x].children[3].setAttribute('index-element', x);

                                }
                                
                            });
                          
                        });
                        
                    });
                    
                    
                },
                
                onHide: function() {
                    
                    L.DomUtil.addClass(controlDiv, 'special-tools-disable');
                    L.DomUtil.removeClass(controlDiv, 'special-tools-enable');
                
                }
                
            });
             
        });
               
        false_div = L.DomUtil.create('div');
        return false_div;
        
    }
});

L.control.specialToolsLegend = function (options) {
    return new L.Control.SpecialToolsLegend(options);
};
