// mrc
// i#cornelia.in
// 2014-6-13-16:33:17
// 2014-8-10-21:50:54 rewrite 
// 2014-10-29-00:42:04 rewrite
// ver:2.0

function pepjs(){ 
	$('.drag').pep({
		constrainTo:'html',
		cssEaseDuration:450,
		useCSSTranslation: false,
		callIfNotStarted:[],
		allowDragEventPropagation:false,
		start:function(e){
			this.dragStartPos = {
    		  x: e.clientX,
    		  y: e.clientY
    		};
    		this.boxStartPos = {
    		  x: $(this.el).offset().left + 50,
    		  y: $(this.el).offset().top + 50
    		};
    		this.grabOffset = {
    		  x: e.offsetX - 50,
    		  y: e.offsetY - 50
    		};
    		this.original = {
    		  x:$(this.el).attr('x'),
    		  y:$(this.el).attr('y')
    		}
    		$(this.el).addClass('noclick');
		},
		drag:function(e){
			var angle, centerDelta, centerDistance, dampenedDistance, delta, determinant, distance, dotProduct;
    		delta = {
      			x: e.clientX - this.dragStartPos.x,
      			y: e.clientY - this.dragStartPos.y
    		};
    		distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    		dampenedDistance = 500 * (1 - Math.pow(Math.E, -0.002 * distance));
    		angle = Math.atan2(delta.y, delta.x);

    		centerDelta = {
    		  x: e.clientX - this.boxStartPos.x,
    		  y: e.clientY - this.boxStartPos.y
    		};
    		centerDistance = Math.sqrt(Math.pow(centerDelta.x, 2) + Math.pow(centerDelta.y, 2));
    		dotProduct = centerDelta.x * this.grabOffset.x + centerDelta.y * this.grabOffset.y;
    		determinant = centerDelta.x * this.grabOffset.y - centerDelta.y * this.grabOffset.x;
    		this.dragAngle = -Math.atan2(determinant, dotProduct);

    		$('.drag:not(.pep-active)').css('opacity',0.4);
    		$(this.el).css({"transform":"rotate(" + (this.dragAngle.toPrecision(2)) + "rad)","zIndex":3});
		},
		stop:function(e){
			$('.drag').animate({'opacity':1},200);
		},
		rest:function(e){
			var width = 101,
				arr = [],
				_left = parseInt($(this.el).css('left'))/width,
				_top = parseInt($(this.el).css('top'))/width;

			var direction = {
				x:'', 
				y:''
			}
			
			_left - Math.floor(_left) > 0.5? direction.x = Math.ceil(_left) : direction.x = Math.floor(_left);
			_top - Math.floor(_top) > 0.5? direction.y = Math.ceil(_top) : direction.y = Math.floor(_top);
				
			$('.drag').each(function(){
				arr.push([$(this).attr('x'),$(this).attr('y')]);
			});
			
			direction = target(direction);

			$(this.el) .css({"transform":"rotate(0)","left":direction.x*width,"top":direction.y*width,"zIndex":2})
			.attr({'x':direction.x,'y':direction.y});

			// in or not
			function target(obj){
				var tem = [obj.x,obj.y];
				for(var i=0;i<arr.length;i++){
		 			if(tem.toString() == arr[i].toString()){
		 					return moveRandom(obj);
		 			}
				}
				return obj;	
			};
			function moveRandom(obj){
				var x = _.random(-1,1),
					y = _.random(-1,1),
					wh = new Wh();
				var edge={
					x:Math.floor(wh.width/101),
					y:Math.floor(wh.height/101)
				}

				if(x>0)
					obj.x= x<0&&obj.x-1>0? obj.x-1:obj.x+1;
				else
					obj.y= y<0&&obj.y-1>0? obj.y-1:obj.y+1;

				if(obj.x>edge.x-1) obj.x = obj.x-2;
				if(obj.y>edge.y-1) obj.y = obj.y-2;

				return target(obj);
			};
		}
	});
};

