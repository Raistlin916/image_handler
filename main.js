"use strict";
(function(window){
	var app = new AppManager();
	app.init();

	$$('#download_btn').onclick = function(){
		app.selector.forEach(function( unit ){
			download( unit.canvas );
		});
	}

	$$('#compose_btn').onclick = function(){
		var units = app.units,
			w = app.ground.offsetWidth;
		compose( units, w );
	}

	function compose( units, w ){
		var us = units.map(function( u, i ){
			return { w:u.canvas.width, h:u.canvas.height, i:i };
		});

		us.sort( function(a, b){
			return b.h - a.h;
		});
		

		var picker = new PH_Picker(w),
			th = picker.fit(us),
			canvas = document.createElement('canvas');

		canvas.width = w;
		canvas.height = th;

		var context = canvas.getContext('2d');

		us.forEach(function(u){
			context.drawImage( units[u.i].canvas, u.fit.x, u.fit.y );
		});

		document.body.appendChild( canvas );
		//download(canvas);
	}

	function download( canvas ){
		var data = canvas.toDataURL(),
			a = document.createElement('a');
		if( !canvas ){
			return;
		}
		a.href = data;
		a.download = canvas.dataset.name;
		a.click();
	}
	
})(window);