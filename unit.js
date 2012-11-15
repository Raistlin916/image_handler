"use strict";
(function( exports ){
	function Unit( ctx, data, name, board, ul, init ){
		this.data = data;
		this.name = name;
		this.canvas = this.createCanvas( board, init );
		this.li = this.appendList( ul );
		this.ctx = ctx;
	}
	Unit.prototype = {
		createCanvas: function( board, init ){
			var image = new Image(),
				canvas = document.createElement('canvas'),
				context = canvas.getContext('2d'),
				self = this;
			image.src = this.data;
			image.onload = function(){
				canvas.width = image.width,
				canvas.height = image.height;
				canvas.dataset.name = self.name;
				context.drawImage( image, 0, 0 );

				init && init( self.ctx, self, canvas, context );
				board.appendChild( canvas );
			}
			
			return canvas;
		},
		appendList: function( ul ){
			var li = document.createElement('li'),
				self = this;
			li.innerHTML = this.name;
			ul.appendChild(li);
			li.addEventListener('click', function(e){
				if( e.ctrlKey ){
					self.ctx.selector.add( self );
				} else {
					self.ctx.selector.justOne( self );
				}
				// offsetTop?
				self.ctx.ground.scrollTop = self.canvas.offsetTop - self.ctx.ground.offsetTop - 7;
			});

			var button = document.createElement('button');
			button.innerHTML = 'X';
			li.appendChild( button );
			li.addEventListener('mouseover', function(){
				button.style.opacity = 1;
			})
			li.addEventListener('mouseout', function(){
				button.style.opacity = 0;
			})
			button.addEventListener('click', function(){
				self.ctx.remove( self );
			})

			return li;
		},
		remove: function(){
			this.canvas.parentNode.removeChild( this.canvas );
			this.li.parentNode.removeChild( this.li );
		}
	}

	exports.Unit = Unit;
})( window )