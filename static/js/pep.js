// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// 2014年8月10日21:50:54 rewrite 
// stop use jqueryui and use jquert.pep.js

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
			// args
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

			//

			console.log('stop');
		},
		easing:function(e){

			console.log('easing');
		},
		rest:function(e){
			var offsetX  = e.offsetX - this.offsetX,
				offsetY  = e.offsetY - this.offsetY,

				x_distance = Math.abs(e.clientX - this.dragStartPos.x),
				y_distance = Math.abs(e.clientY - this.dragStartPos.y),
				x_direction = (e.clientX >this.dragStartPos.x)? 'right':'left',
				y_direction = (e.clientY >this.dragStartPos.y)? 'down':'up';
				
				var arg = {
					dx : x_distance,
					dy : y_distance,
					clientX : e.clientX,
					clientY : e.clientY,
					left: parseInt($(this.el).css('left')),
					top : parseInt($(this.el).css('top')),
					angle : this.dragAngle.toPrecision(2),
					translateX:parseInt(this.translateX),
					translateY:parseInt(this.translateY)
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
			x_direction = leftOffset<0.5? 'left':'right',
			y_direction = topOffset<0.5? 'top':'bottom',
			x_distance,
			y_distance,
			i,
			window_width = Math.floor($(window).width()/101)*101,
			window_height = Math.floor($(window).height()/101)*101,
			angle = arg.angle;


			if(x_direction == 'left'){
				x_distance =  numOfBoxFromLeft * 101;
			}else{
				x_distance =  (numOfBoxFromLeft + 1) * 101;
				numOfBoxFromLeft = numOfBoxFromLeft + 1;
			}

			if(y_direction == 'top'){
				y_distance =  numOfBoxFromTop * 101;
			}else{
				y_distance =  (numOfBoxFromTop + 1) * 101;
				numOfBoxFromTop = numOfBoxFromTop + 1;
			}

			x_distance<0? x_distance=0:x_distance=x_distance;
			y_distance<0? y_distance=0:y_distance=y_distance;
			x_distance>window_width? x_distance=window_width-101:x_distance=x_distance;
			y_distance>window_height? y_distance=window_height-101:y_distance=y_distance;

			$('.revise').animate({
				'left' : x_distance+'px',
				'top' : y_distance+'px',
				transform : 'rotate('+ angle +')'
				},
				100,
				"easeInQuad",
				function() {
					$(this).removeClass("revise");
					$(this).attr({'x':x_distance/101,'y':y_distance/101}).css({'transform':''});
					// overlap or not?
					overlap($(this),[x_distance/101,y_distance/101]);
			});
	};

	function overlap(_this,obj){
		var i=0,
			arr = [];
			// console.log(x_distance);
		$('.drag').each(function(){
			var left = $(this).attr('x'),
				top = $(this).attr('y');
				if(left==obj[0]&&top==obj[1]){

				}else{
					arr.push([left,top]);

				}
		});
		console.log(obj);
		console.log(arr);
		if(inOrNot(obj,arr)){	
			_this.animate({
				'left' : (obj[0]+1)*101,
				'top' : obj[1]*101 },
				100,
				"easeInQuad",
				function() {
					// $(this).addClass('stopShake');
					// overlap or not?
					// overlap($(this),x_distance,y_distance);
			});
			console.log('in');
		}else{
			console.log('not-in');
		}
	};

	function inOrNot(obj,arr){
		for(var i=0;i<arr.length;i++){
 			if(obj.toString() == arr[i].toString()){
 					return true;
 				}
			}
		// console.log('not in');	
		return false;	
	};

});

