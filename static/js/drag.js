// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

// jquery.ui
$(function(){
	$('.drag').draggable({
		containment: $('#region'),
		zIndex: 999,
		create:function(e){
			console.log('nav create success');
		},
		start:function(e){
			this.clientX_start = event.clientX;
			this.clientY_start = event.clientY;
			// **bouncejs
			this.dragStartPos = {
    		  x: e.clientX,
    		  y: e.clientY
    		};
    		this.boxStartPos = {
    		  x: $(this).offset().left + $(this).width() / 2,
    		  y: $(this).offset().top + $(this).height() / 2
    		};
    		this.grabOffset = {
    		  x: e.offsetX - $(this).width() / 2,
    		  y: e.offsetY - $(this).height() / 2
    		};
    		this.grabDistance = Math.sqrt(Math.pow(this.grabOffset.x, 2) + Math.pow(this.grabOffset.y, 2));
    		$(this).css("transform-origin", "" + e.offsetX + "px " + e.offsetY + "px").removeClass('re');
    		this.dragOffset = null;

			console.log('drag start');
		},
		drag:function(e){
		 	this.offsetX = event.offsetX;
		 	this.offsetY = event.offsetY;
		 	$(this).css("zIndex",999);
		 	$(this).css({'left':'300px','top':'300px'});
			draggingOpacity();
			// **bouncejs
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

    		// $(this).css({"transform":"translate(" + (this.translateX) + "px, " + (this.translateY) + "px)\nrotate(" + (this.dragAngle.toPrecision(2)) + "rad)","left":this.clientX_start-50,"top":this.clientY_start-50});
    		$(this).css({"transform":"rotate(" + (this.dragAngle.toPrecision(2)) + "rad)","left":this.clientX_start-50,"top":this.clientY_start-50});
		},
		stop:function(e){
			this.clientX_stop = event.clientX;
			this.clientY_stop = event.clientY;
			var obj = $('#drag'),
				offsetX  = event.offsetX - this.offsetX,
				offsetY  = event.offsetY - this.offsetY,

				x_distance = Math.abs(this.clientX_stop - this.clientX_start),
				y_distance = Math.abs(this.clientY_stop - this.clientY_start),
				x_direction = (this.clientX_stop>this.clientX_start)? 'right':'left',
				y_direction = (this.clientY_stop>this.clientY_start)? 'down':'up';
				
				var arg = {
					dx : x_distance,
					dy : y_distance,
					clientX : event.clientX,
					clientY : event.clientY,
					left: parseInt($(this).css('left')),
					top : parseInt($(this).css('top')),
					angle : this.dragAngle.toPrecision(2),
					translateX:parseInt(this.translateX),
					translateY:parseInt(this.translateY)
				};
			$(this).removeClass('animated').addClass('revise').css("zIndex",2);

			revise(arg);
			console.log('drag stop');
		}
	});

	function revise(arg){
		var boxWH = 101,
			numOfBoxFromLeft =  parseInt(Math.ceil(parseInt(arg.left + arg.translateX )) / boxWH),
			numOfBoxFromTop = parseInt(Math.ceil(parseInt(arg.top + arg.translateY)) / boxWH),
			leftOffect =  Math.ceil(parseInt(arg.left)) / boxWH - numOfBoxFromLeft,
			topOffect =  Math.ceil(parseInt(arg.top)) / boxWH - numOfBoxFromTop,
			x_direction = leftOffect<0.5? 'left':'right',
			y_direction = topOffect<0.5? 'top':'bottom',
			x_distance,
			y_distance,
			i,
			window_width = Math.floor($(window).width()/101)*101,
			window_height = Math.floor($(window).height()/101)*101,
			angle = arg.angle;

			console.log(arg.translateX+arg.left);

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
			x_distance>window_width? x_distance=window_width:x_distance=x_distance;
			y_distance>window_height? y_distance=window_height:y_distance=y_distance;

			//animate css 4 append
		var css = '';
			css += '.re{';
			css += '-webkit-animation-name: re;';
			css += '-webkit-animation-duration: 0.2s;';
			css += '-webkit-animation-iteration-count: 1;'; //infinite
			css += '-webkit-animation-delay: 0s;';
			css += '-webkit-animation-timing-function: ease-in-out;';
			css += '}';
			css += '@-webkit-keyframes re {';
			css += '10%, 20%, 60%, 80%, 90%,100% { -webkit-transform-origin: center center; }';
			css += '10% { -webkit-transform: rotate('+ angle +'); }';
			css += '20% { -webkit-transform: translate(1px 1px); }';	
			css += '30% { -webkit-transform: translate(-1px -1px); }';	
			css += '100% { -webkit-transform: rotate(0); translate(0 0);}';
			css += '}';

			$('#style').html('').append(css);
			$('.revise').attr({'x':numOfBoxFromLeft,'y':numOfBoxFromTop}).addClass('re');

			$('.revise').animate({
				'left' : x_distance+'px',
				'top' : y_distance+'px',
				},
				100,
				"easeInQuad",
				function() {
					$(this).removeClass("revise");
					$(this).css('transform','');
					// overlap or not?
					overlap($(this),x_distance,y_distance);
			});
			$('.drag').css('opacity',1);
	};

	function overlap(_this,x_distance,y_distance){
		var i=0,
			arr = [];
			// console.log(x_distance);
		$('.drag').each(function(){
			var left = parseInt($(this).css('left')),
				top = parseInt($(this).css('top'));
			if(left == x_distance && top == y_distance){
				i++;
			}
		});
		if(i == 2){	
			_this.animate({
				'left' : x_distance+101,
				'top' : y_distance},
				100,
				"easeInQuad",
				function() {
					// $(this).addClass('stopShake');
					// overlap or not?
					// overlap($(this),x_distance,y_distance);
			});
		}
	}

	function draggingOpacity(){
		$('.drag:not(.ui-draggable-dragging)').each(function(){
			$(this).css('opacity',0.4);
		});
	}

	//
	//clone drop about
	function dropDown(){
		//clone first
		$('.about-hidden').clone().prependTo('.drop');

		for(var ii=1;ii<4;ii++){
			for(var jj=1;jj<4;jj++){
				$('.drop[data-x='+ii+'][data-y='+jj+']').find('.about-hidden').css({'top': (ii-1)*-101+'px','left':(jj-1)*-101+'px'});
			}
		}
		$('.drop').each(function(){
			var random = Math.random()*10;
			// $(this).delay(random*1000).addClass('hinge animated');
			console.log(random);
			$(this).delay(random*50).animate({'opacity':1},function(){
				if(parseInt(random) % 2 == 0){
					console.log('left');
					$(this).addClass('dragDownLeft animated');
				}else{
					console.log('right');
					$(this).addClass('dragDownRight animated');
				}
			});
		});
	}
	// dropDown();
});

