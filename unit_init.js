"use strict";
(function( exports ){
	function initUnit( app, unit, canvas, context ){
		var w = canvas.width,
			h = canvas.height,
			imageHandler = new ImageHandler( context.getImageData( 0, 0, w, h ) ),
			canvasHandler = new CanvasHandler( canvas ),
			spriteHandler = new SpriteHandler();
		
		imageHandler.option( app.optionMachine.get('similar') );
		
		canvasHandler.bind( 'click', function( x, y ){
					app.stateMachine.when('similar', function(){
						if( imageHandler.get(x, y).a == 0 ){
							return;
						}
						var option = app.optionMachine.get('similar');
						imageHandler.setSimilar( x, y, { a: 0 }, context, option.similar );
						app.selector.justOne( unit );
						
					}).when('select', function(){
						app.selector.justOne( unit );
					}).when('pick', function(){
						var p = imageHandler.get( x, y );
						utils.Event.emit('pickColor', p.getRGBA(), p.get16());
					}).when('fill', function(){
						var p = imageHandler.get( x, y );
						utils.Event.emit('getColor', function( color ){
								var option = app.optionMachine.get('similar');
								imageHandler.setSimilar( x, y, color, context, option.similar );
								app.selector.justOne( unit );
							});
					}).when('sprite', function(){
						var rect = spriteHandler.cut( imageHandler, x, y );
						if( rect == undefined){
							return;
						}
						imageHandler.setRect( rect, function( pixel ){
							pixel.r = 255;
							pixel.a = 255;
							pixel.b = 0;
							pixel.g = 0;
							return pixel;
						}, context);
					});
				});
		canvasHandler.bind( 'mousemove', function( x, y ){
					app.stateMachine.when('pick', function(){
						var p = imageHandler.get( x, y );
						utils.Event.emit('showColor', p.getRGBA(), p.get16());
					});
				});

	}

	exports.initUnit = initUnit;
})( window );