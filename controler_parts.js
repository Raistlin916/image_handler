"use strict";
(function(exports, undefined){
	var extend = exports.utils.extend;
	function StateMachine() {
		this.state = "";
	}
	StateMachine.prototype = {
		when: function( name, fn ){
			if( this.state === name ){
				fn && fn();
			}
			return this;
		},
		turn: function( state, b ){
			if( b ){
				this.state = state;
			} else {
				this.state = "";
			}
		}
	}

	function OptionMachine( obj ){
		this.option = obj || {}
	}
	OptionMachine.prototype = {
		set: function( obj ){
			extend( this.option, obj );
		},
		get: function(){
			var obj = {},
				self = this;
			Array.prototype.forEach.call( arguments, function( key ){
				obj[key] = self.option[key];
			})
			return obj;
		}
	}


	function Selector(){
		this.arr = [];
	}
	Selector.prototype = {
		forEach: function(fn){
			this.arr.forEach(fn);
		},
		add: function(t){
			this.arr.push(t);
			this._set(t);
		},
		getAll: function(){
			return this.arr;
		},
		justOne: function(t){
			var self = this;
			this.arr.forEach(function( unit ){
				if( unit != t){
					self._unset( unit );
				}
			});
			this.arr = [t];
			this._set(t);
		},
		clear: function(){
			this.arr.forEach(function( unit ){
				self._unset( unit );
			});
			this.arr = [];
		},
		_set: function( unit ){
			unit.canvas.classList.add('selected');
			unit.li.classList.add('selected');
		},
		_unset: function( unit ){
			unit.canvas.classList.remove('selected');
			unit.li.classList.remove('selected');
		}
	};

	function ComplexButton( btn ){
		this.mainBtn = btn;
	}
	ComplexButton.prototype = {
		openSubMenu: function( state ){
			if( this.div == undefined ){
				return;
			}
			var self = this;
			if( state ){
				this.div.style.display = 'inline-block';
				clearTimeout(this.lastSTO);
				setTimeout(function(){
					self.div.style.width = '35px';
					self.div.style.opacity = '100';
				});
			} else {
				setTimeout(function(){
					self.div.style.width = '0';
					self.div.style.opacity = '0';
					self.lastSTO = setTimeout(function(){
						self.div.style.display = 'none';
					}, 500);
				});
			}
		},
		setSubMenu: function( elems ){
			if( elems == undefined ){
				return;
			}
			var div = document.createElement('div');
				/*div.style.border = '1px solid grey';*/
			div.style.display = 'none';
			div.style.opacity = '0';
			div.style.overflow = 'hidden';
			div.style.cssFloat = 'left';

			div.style.webkitTransitionDuration = '0.5s';
			if( elems.length != undefined ){
				elems = Array.prototype.slice.call( elems );
				elems.forEach(function( elem ){
					div.appendChild( elem );
				});
			} else {
				div.appendChild( elems );
			}
			
			insertAfter( div, this.mainBtn );
			this.div = div;
		}
	}

	function ColorShower(){
		var wrapper = document.createElement('div');


		var colorD = document.createElement('div');
		colorD.style.width = '100%';
		colorD.style.height = '100%';
		colorD.style.webkitTransitionDuration = '0.3s';

		var colorD_background = document.createElement('div');
		colorD_background.style.width = '16px';
		colorD_background.style.height = '16px';
		colorD_background.style.border = '1px solid black';
		colorD_background.style.marginLeft = '8px';
		colorD_background.classList.add('pseudo-transparent');


		var shower = document.createElement('div');
		shower.style.fontSize = '9px';
		shower.style.webkitTextSizeAdjust = 'none';
		shower.innerHTML = '#ffffff';

		wrapper.appendChild(shower);
		wrapper.appendChild(colorD_background);
		colorD_background.appendChild(colorD);
		

		this.colorD = colorD;
		this.wrapper = wrapper;
		this.shower = shower;
	}
	ColorShower.prototype = {
		setShower: function( n ){
			this.shower.innerHTML = n;
		},
		setColor: function( color ){
			this.colorD.style.backgroundColor = color;
		},
		getElement: function(){
			return this.wrapper;
		},
		getColor: function(){
			return this.shower.innerHTML;
		}
	}

	exports.parts = {
		StateMachine: StateMachine,
		OptionMachine: OptionMachine,
		Selector: Selector,
		ComplexButton: ComplexButton,
		ColorShower: ColorShower
	};
})(window);