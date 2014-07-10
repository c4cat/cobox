// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

//jquery
$(function(){
	$('.drag').draggable({
		containment: $('#region'),
		zIndex: 999,
		create:function(e){
			console.log('create success');
		},
		start:function(e){
			this.clientX_start = event.clientX;
			this.clientY_start = event.clientY;
			// $(this).addClass('whenDragging animated').removeClass('stopShake');

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
    		$(this).css("transform-origin", "" + e.offsetX + "px " + e.offsetY + "px");
    		this.dragOffset = null;

			console.log('start');
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
    		dampenedDistance = 2.5 * (1 - Math.pow(Math.E, -0.002 * distance));
    		angle = Math.atan2(delta.y, delta.x);
    		// if (this.grabDistance > 0) {
    		  centerDelta = {
    		    x: e.clientX - this.boxStartPos.x,
    		    y: e.clientY - this.boxStartPos.y
    		  };
    		  centerDistance = Math.sqrt(Math.pow(centerDelta.x, 2) + Math.pow(centerDelta.y, 2));
    		  dotProduct = centerDelta.x * this.grabOffset.x + centerDelta.y * this.grabOffset.y;
    		  determinant = centerDelta.x * this.grabOffset.y - centerDelta.y * this.grabOffset.x;
    		  this.dragAngle = -Math.atan2(determinant, dotProduct);
    		// } else {
    		//   this.dragAngle = 0;
    		// }
    		this.dragOffset = {
    		  x: Math.round(Math.cos(angle) * dampenedDistance),
    		  y: Math.round(Math.sin(angle) * dampenedDistance)
    		};

    		// $(this).css("transform", "translate(" + (Math.round(this.dragOffset.x)) + "px, " + (Math.round(this.dragOffset.y)) + "px)\nrotate(" + (this.dragAngle.toPrecision(2)) + "rad)");
    		$(this).css("transform", "rotate(" + (this.dragAngle.toPrecision(2)) + "rad)");
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
					left: $(this).css('left'),
					top : $(this).css('top'),
					angle : this.dragAngle.toPrecision(2)
				};

				//class crashing
			$(this).removeClass('whenDragging animated').addClass('revise').css("zIndex",2);

			// revise(arg);
			//bounce.js app 
			var bounce, correction, cos, deg, sin;
			var __modulo = function(a, b) { return (a % b + +b) % b; };

    		cos = Math.cos(this.dragAngle);
    		sin = Math.sin(this.dragAngle);
    		correction = {
    		  x: this.grabOffset.x - (this.grabOffset.x * cos - this.grabOffset.y * sin),
    		  y: this.grabOffset.y - (this.grabOffset.x * sin + this.grabOffset.y * cos)
    		};
    		$(this).css("transform-origin", "");
    		$(this).css("transform", "translate(" + (this.dragOffset.x + correction.x) + "px, " + (this.dragOffset.y + correction.y) + "px)\nrotate(" + this.dragAngle + "rad)");
    		deg = this.dragAngle / Math.PI * 180;
    		if (__modulo(deg, 90) > 45) {
    		  deg += 90 - __modulo(deg, 90);
    		} else {
    		  deg -= __modulo(deg, 90);
    		}

			bounce = new Bounce();
			bounce.translate({
    	    	stiffness: 1.5,
    	    	from: {
    			      x: this.dragOffset.x + correction.x,
    			      y: this.dragOffset.y + correction.y
    			    },
    			    to: {
    			      x: 0,
    			      y: 0
    			    }
    			}).rotate({
    			    stiffness: 0.5,
    			    from: this.dragAngle / Math.PI * 180,
    			    to: deg
    		});

    		playAnimation({
    			    bounceObject: bounce,
    			    duration: 600
    		});
    		function playAnimation(options) {
  				var bounce, css, duration, properties;
  				bounce = options.bounceObject;
  				duration = options.duration ;
  				properties = [];
  				properties.push("animation-duration: " + duration + "ms");
  				css = ".drag.animate {\n  " + (properties.join(";\n  ")) + ";\n}\n" + (bounce.getKeyframeCSS({
  				  name: "animation"
  				}));
  				// this.$style.text(PrefixFree.prefixCSS(css, true));
  				$(this).removeClass("animate");
  				$(this).offsetWidth;
  				$(this).addClass("animate");
  			};	
		}
	});

	function revise(arg){
		var boxWH = 101,
			numOfBoxFromLeft =  parseInt(Math.ceil(parseInt(arg.left)) / boxWH),
			numOfBoxFromTop = parseInt(Math.ceil(parseInt(arg.top)) / boxWH),
			leftOffect =  Math.ceil(parseInt(arg.left)) / boxWH - numOfBoxFromLeft,
			topOffect =  Math.ceil(parseInt(arg.top)) / boxWH - numOfBoxFromTop,
			x_direction = leftOffect<0.5? 'left':'right',
			y_direction = topOffect<0.5? 'top':'bottom',
			x_distance,
			y_distance,
			i,
			angle = arg.angle;

			if(x_direction == 'left'){
				x_distance =  numOfBoxFromLeft * 101;
			}else{
				x_distance =  (numOfBoxFromLeft + 1) * 101;
			}

			if(y_direction == 'top'){
				y_distance =  numOfBoxFromTop * 101;
			}else{
				y_distance =  (numOfBoxFromTop + 1) * 101;
			}
			rotate(angle);
			$('.revise').animate({
				'left' : x_distance,
				'top' : y_distance,
				'transform' : 'rotate(0)'
				},
				{
					duration:50,
					step: function(now,fx){
						console.log(now);
						$(this).css({"transform":"rotate("+ now +")"});
					}
				},
				150,
				"easeInQuad",
				function() {
					$(this).removeClass("revise");
					// $(this).css({"transform-origin":"","transform":""});
					// $(this).css({"transform-origin":""});

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
					$(this).addClass('stopShake');
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

