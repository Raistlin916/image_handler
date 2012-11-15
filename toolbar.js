(function( exports ){
	function Toolbar( toolbarElem , optionMachine, stateMachine ){
		this.buttons = $.call( toolbarElem, 'button' );
		this.init( optionMachine, stateMachine );
	}
	Toolbar.prototype = {
		init: function( optionMachine, stateMachine ){
				var buttons = this.buttons,
				selectedStyle = 'selected',
				cbs = [], cbs_content;

				
				this._createGlobalColor();

				function _getRange(){
					var rangeHandler = new Range( null, { min:0, max:50, step:5 }),
						range = rangeHandler.getElement();
					range.title = '相似度';
					rangeHandler.on( 'change', function( value ){
						optionMachine.set({'similar': value});
					});
					return [range];
				}

				cbs_content = {
					'similar': _getRange(),
					'pick': (function(){
									var colorShower = new parts.ColorShower();
									utils.Event.on('showColor', function( color, n16 ){
										colorShower.setColor( color );
										colorShower.setShower( n16 );
									});
									return [colorShower.getElement()];
								})(),
					'fill': _getRange()
				};

				buttons = Array.prototype.slice.call( buttons );
				buttons.forEach( function( button ){
					var cb = new parts.ComplexButton( button );
					cbs.push(cb);
					cb.setSubMenu( cbs_content[button.dataset.fn] );

					button.addEventListener( 'click', function(){
						buttons.forEach( function( btn ){
							if( button == btn ){
								return;
							}
							btn.classList.remove(selectedStyle);
						});
						cbs.forEach( function( c ){
							if( c == cb ){
								return;
							}
							c.openSubMenu( false );
						});
						this.classList.toggle( selectedStyle );
						var state = this.classList.contains( selectedStyle );
						stateMachine.turn( this.dataset.fn, state );
						cb.openSubMenu( state );
					});
				});
		},
		 _createGlobalColor: function(){
					var globalColor = new parts.ColorShower();
					utils.Event.on('pickColor', function( color, n16 ){
											globalColor.setColor( color );
											globalColor.setShower( n16 );
										});
					utils.Event.on('getColor', function( cb ){
											cb( globalColor.getColor() );
										});

					var globalColorElem = globalColor.getElement();
					globalColorElem.style.cssFloat = 'left';

					$('.toolbar')[0].appendChild(globalColorElem);
				}
	}

	exports.Toolbar = Toolbar;
})(window);