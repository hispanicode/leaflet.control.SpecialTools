/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsLegend = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-legend special-tools-controls special-tools-disable');

        this.legend_div = L.DomUtil.create('div');
        this.legend_div.style.display = 'none';
        
        this.legend_div.setAttribute('class', 'special-tools-legend-div');
        
        map_width = map.getSize().x;
        
        legend_left = (map_width / 2) - 150;
        
        this.legend_div.style.left = legend_left + 'px';

        map._controlCorners.bottomleft.appendChild(this.legend_div);

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        map.on('resize', function(e){

            map_width = e.newSize.x;;

            legend_left = (map_width / 2) - 150;

            self.legend_div.style.left = legend_left + 'px';
            
        });

        L.DomEvent.addListener(controlDiv, 'click', function(){
            
            L.DomUtil.addClass(controlDiv, 'special-tools-enable');
            L.DomUtil.removeClass(controlDiv, 'special-tools-disable');
            
            let elements_controls = special_tools.controlDiv.querySelectorAll('.special-tools-controls');

            try {
                special_tools.only_one_control_active(elements_controls, controlDiv);
            } catch (e) {};
            
            content = "<div class='special-tools-container'>";
            content = content + "Leyenda: <input type='text' style='width: 250px' id='legend_name'>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<button type='button' id='btn_add_column' class='special-tools-btn-default'>Nueva columna</button>";
            content = content + " <button type='button' id='btn_save_legend' class='special-tools-btn-success'>Guardar</button>";
            content = content + "</div>";
            
            content = content + "<div class='special-tools-container'>";
            content = content + "<div id='div_columns'></div>";
            content = content + "</div>";

            map.fire('modal', {
                
              title: 'Generar leyenda',
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

                    legend_url = route + '/json/legend/legend.json';
                    
                    legend_json = {};
                    
                    fetch(legend_url)
                    .then(function(response){
                        
                        return response.json();
                
                    }).then(function(data){

                        legend_json = data;
                        
                    });
                    
                    legend_name = modal._container.querySelector('#legend_name');
                    
                    btn_save_legend = modal._container.querySelector('#btn_save_legend');
                    
                    btn_add_column = modal._container.querySelector('#btn_add_column');
                    
                    div_columns = modal._container.querySelector('#div_columns');
                    
                    btn_add_element = modal._container.querySelector('#btn_add_element');
                    
                    L.DomEvent.on(legend_name, 'keyup', function(){
                        
                        legend_json.legend = this.value;
                        
                    });
                    
                    L.DomEvent.on(btn_save_legend, 'click', function(){
                        
                        url = route + "/leaflet.control.SpecialToolsLegend/ajax/legend.php?";

                        fetch(url + new URLSearchParams({
                                    
                             content: JSON.stringify(columns)
                                
                        }))
                        .then(function(response) {
                            
                            return response.json();
                            
                        }).then(function(data){
                            
                            console.log(data);
                            
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
                        
                    });

                    columns = new Array();
                    
                    L.DomEvent.on(btn_add_column, 'click', function(){
                        
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
                        div_container_1.setAttribute('class', 'special-tools-container');

                        const input_column_span = L.DomUtil.create('span');
                        input_column_span.innerText = 'Columna: ';
                        
                        const input_column = L.DomUtil.create('input');
                        input_column.type = 'text';
                        input_column.style.width = '150px';
                        input_column.setAttribute('index-column', _index_column_);
                        
                        div_container_1.appendChild(input_column_span);
                        div_container_1.appendChild(input_column);
                        
                        
                        const div_container_2 = L.DomUtil.create('div');
                        div_container_2.setAttribute('class', 'special-tools-container');
                        
                        const btn_column = L.DomUtil.create('button');
                        btn_column.type = 'button';
                        btn_column.innerText = 'Añadir elemento';
                        btn_column.setAttribute('class', 'special-tools-btn-default');
                        btn_column.setAttribute('index-column', _index_column_);
                        
                        const btn_column_delete = L.DomUtil.create('button');
                        btn_column_delete.innerText = 'Eliminar columna';
                        btn_column_delete.setAttribute('class', 'special-tools-btn-danger');
                        btn_column_delete.setAttribute('index-column', _index_column_);
                        
                        div_container_2.appendChild(btn_column);
                        div_container_2.appendChild(btn_column_delete);
                        
                        const div_column = L.DomUtil.create('div');
                        
                        div.appendChild(div_container_1);
                        div.appendChild(div_container_2);
                        div.appendChild(div_column);

                        div_columns.appendChild(div);
                        
                        L.DomEvent.on(btn_column_delete, 'click', function(){
                            
                            _index_column = this.getAttribute('index-column');
                            
                            delete columns[parseInt(_index_column)];
                            
                            columns = columns.flat();
                            
                            console.log(columns);
                            
                            L.DomUtil.remove(div);
                            
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
                            element_name_span.innerText = "Elemento: ";
                            
                            const element_name = L.DomUtil.create('input');
                            element_name.type = 'text';
                            element_name.style.width = '130px';
                            element_name.setAttribute('index-column', __index_column__);
                            element_name.setAttribute('index-element', __index_element__);
                            
                            const element_color = L.DomUtil.create('input');
                            element_color.type = 'color';
                            element_color.style.marginRight = '5px';
                            element_color.setAttribute('index-column', __index_column__);
                            element_color.setAttribute('index-element', __index_element__);
                            
                            const element_delete = L.DomUtil.create('button');
                            element_delete.innerText = 'Eliminar';
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
                                
                                L.DomUtil.remove(column);
                                
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
