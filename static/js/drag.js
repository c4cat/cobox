// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

//jquery
$(function(){
	$('.drag').draggable({
		containment: $('#region'),
		zIndex: 999,
		create:function(event,ui){
			// console.log('create success');
		},
		start:function(event,ui){
			this.clientX_start = event.clientX;
			this.clientY_start = event.clientY;

			// $(this).addClass('whenDragging animated').removeClass('stopShake');
			console.log('start');
		},
		drag:function(event,ui){
		 	this.offsetX = event.offsetX;
		 	this.offsetY = event.offsetY;

		 	$(this).css("zIndex",999);

			draggingOpacity();
		},
		stop:function(event,ui){
			this.clientX_stop = event.clientX;
			this.clientY_stop = event.clientY;
			// this.time_stop = event.timeStamp;
			var obj = $('#drag'),
				offsetX  = event.offsetX - this.offsetX,
				offsetY  = event.offsetY - this.offsetY,
				time_count = (event.timeStamp - this.time_start) / 1000; //seconds 

				x_distance = Math.abs(this.clientX_stop - this.clientX_start),
				y_distance = Math.abs(this.clientY_stop - this.clientY_start),
				x_direction = (this.clientX_stop>this.clientX_start)? 'right':'left',
				y_direction = (this.clientY_stop>this.clientY_start)? 'down':'up';
			
				var argv4Crash = {
					dx : x_distance,
					dy : y_distance,
					t : time_count,
					clientX : event.clientX,
					clientY :event.clientY,
					left: $(this).css('left'),
					top : $(this).css('top')
				};

			$(this).removeClass('whenDragging animated').addClass('crashing revise').css("zIndex",2);

			revise(argv4Crash);
			$('.drag').css('opacity',1);
		}
	});
	
	function drag(){

	};

	function revise(argv4Crash){
		var boxWH = 101,
			numOfBoxFromLeft =  parseInt(Math.ceil(parseInt(argv4Crash.left)) / boxWH),
			numOfBoxFromTop = parseInt(Math.ceil(parseInt(argv4Crash.top)) / boxWH),
			leftOffect =  Math.ceil(parseInt(argv4Crash.left)) / boxWH - numOfBoxFromLeft,
			topOffect =  Math.ceil(parseInt(argv4Crash.top)) / boxWH - numOfBoxFromTop,
			x_direction = leftOffect<0.5? 'left':'right',
			y_direction = topOffect<0.5? 'top':'bottom',
			x_distance,
			y_distance,
			i;

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

			$('.revise').animate({
				'left' : x_distance,
				'top' : y_distance},
				100,
				"easeInQuad",
				function() {
					$(this).removeClass("revise").addClass('stopShake');
					// overlap or not?
					overlap($(this),x_distance,y_distance);
			});

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

