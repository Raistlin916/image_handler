(function( exports, undefined ){

  function basePoint( x, y, w ){
  	return {x:x, y:y, w:w};
  }
  
	function PH_Picker( w ){
    this.w = w;
  }
  PH_Picker.prototype = {
    fit: function( units ){
      // 复制并编号
      var temp = units.map( function( unit, i ){
        return { w: unit.w, h: unit.h, i: i };
      });
      
      // 初始化
      this.temp = temp;
      this.bps = [basePoint( 0, 0, this.w )];
      this.th = 0; 
      
      var self = this, ret;
      while( temp.length ){
        var t = temp.shift();
        units[t.i].fit = this.levelUp(t);
        
      	temp = temp.filter( function( t, i ){
        	ret = self.insert( t );
          if( ret ){
          	units[t.i].fit = ret;
            return false;
          }
          return true;
        });
        self.temp = temp;
      }
      
      return this.th;
    },
    insert: function( t ){
    	if( t == undefined ){
      	return null;
      };
      var self = this, ret;
      this.bps.every(function( bp, i ){
        var f = t.w <= bp.w && t.h + bp.y <= self.th; //能否找到立足点
      	if( f ){ // 找到立足点后生根，并更新土地
        	self.bps.push( basePoint( bp.x, bp.y+ t.h, t.w ) );
          ret = JSON.parse(JSON.stringify(bp));
          if( t.w == bp.w ){  // 土地被榨干，删除
          	self.bps.splice( i, 1 );
          } else {
          	self.bps[i].w -= t.w;
            self.bps[i].x += t.w;
          }
          

          self.bps.forEach( function( bp, i ){ 
          	var next = self.bps[i+1],f,d,ad;
            while( next ){
              d = bp.y - next.y;
              ad = Math.abs(d);
              f = self.temp.some(function(u){
              	return (u.h <= ad) && ( u.w <= bp.w || u.w <= next.w );
              });
              if(f){
              	break;
              }
              bp.w += next.w;
              d < 0 && ( bp.y = next.y );
              bp.x = Math.min( bp.x, next.x );
              self.bps.splice( i+1, 1 );
              next = self.bps[i+1];
              if( next == undefined ){
                break;
              }
           	}
          });
          
        }
        return !f;
      });
      return ret;
    },
    levelUp: function( bos ){
    	if( bos.w <= this.w ){
        var result = { x:0, y: this.th };
        this.th += bos.h;
        this.bps = this.bps.filter(function( bp, i ){
          if( bp.x + bp.w <= bos.w ){
          	return false;
          }
          if( bp.x < bos.w ){
            bp.w = bp.w - bos.w + bp.x;
            bp.x = bos.w; 
          }
          return true;
        });
        this.bps.push( new basePoint( 0, this.th, bos.w ));
              
        return result;
      }
      return null;
    }
  };
  exports.PH_Picker = PH_Picker;
})( window );