"use strict";
function insertAfter( newElement, targetElement ){
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    }
    else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

(function( exports, undefined ){
	var parts = exports.parts;

	function AppManager(){
		this.units = [];
		this.ground = $$('.ground');
		this.input = $$('.input');
		this.input.onclick = function(e) {
			e.preventDefault();
		}
	}
	AppManager.prototype = {
		init: function(){
				var fr = new FileReceiver( this.ground ),
					self = this,
					ul = $('ul')[0];
				fr.onload = function( e ){
					self.units.push( new Unit( self, e.data, e.name, this, ul, initUnit ) );
				};
				
				var stateMachine = this.stateMachine = new parts.StateMachine(),
				optionMachine = this.optionMachine = new parts.OptionMachine({ similar: 40 });
				this.selector = new parts.Selector();
				var toolbar = new Toolbar( $('.toolbar')[0], optionMachine, stateMachine );
		},
		remove: function( unit ){
			var index = this.units.indexOf( unit );
			if( ~index ){
				var u = this.units.splice( index, 1 );
				u[0].remove();
			}
		}
	}

	exports.AppManager = AppManager;
})(window);