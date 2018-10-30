/*!
 * swiper JavaScript Library v1.0
 *
 * Date: 2018-10-26T23:49Z
 */

 ( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "Swiper requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {	
		let version='1.0',
			startX=0,
			endX=0,
			startY=0,
			endY=0,
			options=null,

			handler={
						'touchstart':function(e){						
							let x=Math.abs(cssGet('transform').x);
							startX=e.changedTouches[0].pageX+x;
						},
						'touchmove':function(e){
							endX=e.changedTouches[0].pageX;									
							cssSet([{pro:'transform',val:'translateX('+(endX-startX)+'px)'}])
						},
						'touchend':function(e,containerW,baseW){
							let x=Number(cssGet('transform').x),
								tmp_containerW=containerW-baseW;							
								if(x>0||x<-tmp_containerW){
									cssSet([{pro:'transform',val:'translateX(0)'}]);
									x=0;
								}
								else
									x=Math.abs(x);
								index=Math.round(x/baseW);
							options.bg.src=options.img_list[index].src;

						}
					},
			Swiper=function(obj){
				/*@params:container img_list  必须
				* @methods: simple 默认样式
				*
				*
				*
				*/
				 options={
					container:obj.container,
					img_list:obj.img_list,	
					bg:obj.bg,				
					time:obj.time||'.5s',
					count:obj.img_list.length				
				}

				return new Swiper.fn.simple();
			};


		Swiper.fn=Swiper.prototype={
			swiper_version:version,
			constructor:Swiper,
			simple:simple,
			cssSet:cssSet,
			cssGet:cssGet
		}	

	//待优化
	function cssSet(items){	
		//传入为字符串  options.container添加单个属性
		//...
		//传入为对象    指定对象添加单个获多个属性
		//...
		//传入为数组类型	
		items.forEach(item=>{
			let target=item.target||options.container,
				pro=item.pro,
				val=item.val;
			target.style[pro]=val;
		})
	}

	function cssGet(property,target){		
		let container=target||options.container,
			str=getComputedStyle(container)[property];			
			str=/matrix\((.+)\)/.exec(str)[1].split(',');	
		return {
			x:str[4],
			y:str[5]
		}			
	}

    function simple(){     	
    	let {container,count,time}=options;  
    	cssSet([
    		{pro:'width',val:[100*count+'vw']},
    		{pro:'transition',val:['transform '+time+';']}
    	])
    	let containerW=container.offsetWidth,
    		baseW=containerW/count;    	
    	container.addEventListener('touchstart',function(e){
    		handler['touchstart'](e)
    	})

	    container.addEventListener('touchmove',function(e){
	    	handler['touchmove'](e)
	    })

		container.addEventListener('touchend',function(e){			
			handler['touchend'](e,containerW,baseW)
		});
    }

	 
	if ( !noGlobal ) {
	window.Swiper= Swiper;
	}
})