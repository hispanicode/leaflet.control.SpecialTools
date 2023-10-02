/*
 * Author: Manuel Jesús Dávila González
 * e-mail: manudavgonz@gmail.com
 */
L.Control.SpecialToolsDemo = L.Control.extend({
    
    onAdd: function (map) {
        
        const self = this;
        
        const special_tools = this.options.special_tools;
        
        const route = special_tools.options.route;
        
        const lang = special_tools.options.lang;
        
        const server = special_tools.options.server;
        
        const component_geolocation = special_tools.options.component_geolocation;

        const controlDiv = L.DomUtil.create('div', 'special-tools-demo special-tools-controls special-tools-disable');

        special_tools.special_tools_btns.appendChild(controlDiv);
        
        var json_lang = {};
        
        fetch(route + '/example.leaflet.control.SpecialTools/lang/lang.json')
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
            
            content = special_tools._T("Demostración", json_lang, lang);
            
            map.fire('modal', {
                
              title: special_tools._T("Demostración", json_lang, lang),
              content: content,
              template: ['<div class="modal-header"><h2>{title}</h2></div>',
                '<hr>',
                '<div class="modal-body">{content}</div>',
                '<div class="modal-footer">',
                '<p><button class="topcoat-button--large {CANCEL_CLS}">{cancelText}</button></p>',
                '</div>'
              ].join(''),

              cancelText: 'Cerrar',
              CANCEL_CLS: 'modal-cancel',

              width: 'auto',
                
                onShow: function(evt){
                    
                    modal = evt.modal;
                    
                    modal._container.querySelector('.modal-content').style.backgroundColor = "rgba(255, 255, 255, 0.8)";

                    L.DomEvent
                      .on(modal._container.querySelector('.modal-cancel'), 'click', function() {
                        modal.hide();
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

L.control.specialToolsDemo = function (options) {
    
    return new L.Control.SpecialToolsDemo(options);
    
};
