// mrc
// i#cornelia.in
// 2014-6-13-16:33:17
// 2014-8-10-21:50:54 rewrite 
// 2014-10-29-00:42:04 rewrite
// ver:2.0

$(function(){
	$('.drag').pep({
		constrainTo:'window',
		cssEaseDuration:450,
		useCSSTranslation: false,
		callIfNotStarted:[],
		// shouldEase:false,
		start:function(e){
			// mark the id
			this.the_id = $(this.el).attr('id');
			$(this.el).attr('id','').removeClass('animation-dragDrop trans450');

			this.dragStartPos = {
    		  x: e.clientX,
    		  y: e.clientY
    		};
    		this.boxStartPos = {
    		  x: $(this.el).offset().left + $(this.el).width() / 2,
    		  y: $(this.el).offset().top + $(this.el).height() / 2
    		};
    		this.grabOffset = {
    		  x: e.offsetX - $(this.el).width() / 2,
    		  y: e.offsetY - $(this.el).height() / 2
    		};
    		this.original = {
    		  x:$(this.el).attr('x'),
    		  y:$(this.el).attr('y')
    		}
			console.log('start');
		},
		drag:function(e){
			//drag effect
			this.offsetX = e.offsetX;
		 	this.offsetY = e.offsetY;

			$('.drag:not(.pep-active)').css('opacity',0.4);
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

    		this.dragOffset = {
    		  x: Math.round(Math.cos(angle) * dampenedDistance),
    		  y: Math.round(Math.sin(angle) * dampenedDistance)
    		};

    		this.translateX = Math.round(this.dragOffset.x);
    		this.translateY = Math.round(this.dragOffset.y);

    		$(this.el).css({"transform":"rotate(" + (this.dragAngle.toPrecision(2)) + "rad)"});
		},
		stop:function(e){
			//set the id again for click
			var the_id = this.the_id,
				the_el = this.el;
			setTimeout(function(){$(the_el).attr('id',the_id)},300);

			$('.drag').animate({'opacity':1},200);

			console.log('stop');
		},
		easing:function(e){
			// console.log('easing');
		},
		rest:function(e){
			var offsetX  = e.offsetX - this.offsetX,
				offsetY  = e.offsetY - this.offsetY;

				var arg = {
					clientX : e.clientX,
					clientY : e.clientY,
					left: parseInt($(this.el).css('left')),
					top : parseInt($(this.el).css('top')),
					angle : this.dragAngle.toPrecision(2),
					translateX:parseInt(this.translateX),
					translateY:parseInt(this.translateY),
					original:this.original
				};

			$(this.el).addClass('revise');
			// .css("zIndex",2);

			revise(arg);
			console.log('rest');
		},
		debug:true
	});

	function revise(arg){
		var boxWH = 101,
			numOfBoxFromLeft =  parseInt(Math.ceil(parseInt(arg.left + arg.translateX )) / boxWH),
			numOfBoxFromTop = parseInt(Math.ceil(parseInt(arg.top + arg.translateY)) / boxWH),
			leftOffset =  Math.ceil(parseInt(arg.left)) / boxWH - numOfBoxFromLeft,
			topOffset =  Math.ceil(parseInt(arg.top)) / boxWH - numOfBoxFromTop,
			directionX = leftOffset<0.5? 'left':'right',
			directionY = topOffset<0.5? 'top':'bottom',
			distanceX,
			distanceY,
			i,
			window_width = Math.floor($(window).width()/101)*101,
			window_height = Math.floor($(window).height()/101)*101,
			angle = arg.angle;


			if(directionX == 'left'){
				distanceX =  numOfBoxFromLeft * 101;
			}else{
				distanceX =  (numOfBoxFromLeft + 1) * 101;
				numOfBoxFromLeft = numOfBoxFromLeft + 1;
			}

			if(directionY == 'top'){
				distanceY =  numOfBoxFromTop * 101;
			}else{
				distanceY =  (numOfBoxFromTop + 1) * 101;
				numOfBoxFromTop = numOfBoxFromTop + 1;
			}

			// the edge
			distanceX<0? distanceX=0:distanceX=distanceX;
			distanceY<0? distanceY=0:distanceY=distanceY;
			distanceX>window_width? distanceX=window_width-101:distanceX=distanceX;
			distanceY>window_height? distanceY=window_height-101:distanceY=distanceY;

			$('.revise').animate({
				'left' : distanceX+'px',
				'top' : distanceY+'px',
				transform : 'rotate('+ angle +')'
				},
				100,
				"easeInQuad",
				function() {
					var attr ={
						'x':distanceX/101,
						'y':distanceY/101
					}
					$(this).removeClass("revise");
					$(this).attr({'x':attr.x,'y':attr.y}).css({'transform':''});
					// overlay or not?
					overlay($(this),attr,arg.original);
			});
	};
	// after drag  is overlay?
	function overlay(_this,attr,original){
		var i=0;
		$('.drag').each(function(){
			var left = $(this).attr('x'),
				top = $(this).attr('y');
				if(left==attr.x && top==attr.y){
					i++;
				}
		});
		if(i>1){
			_this.animate({
				'left' : original.x*101,
				'top' : original.y*101 },
				100,
				"easeInQuad",
				function() {
					_this.attr({'x':original.x,'y':original.y});
			});
			// console.log('in');
		}
	};
	// array in 2d array or not
	function inOrNot(obj,arr){
		for(var i=0;i<arr.length;i++){
 			if(obj.toString() == arr[i].toString()){
 					return true;
 				}
			}
		return false;	
	};

});

