// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

$(function(){
	$('.drag').draggable({
		containment: $('#region'),
		create:function(event,ui){
			// console.log('create success');
		},
		start:function(event,ui){
			this.clientX_start = event.clientX;
			this.clientY_start = event.clientY;
			this.time_start = event.timeStamp;

			$(this).addClass('dragRotateLeft').removeClass('stopShake');
			console.log('start');
		},
		drag:function(event,ui){
		 	this.offsetX = event.offsetX;
		 	this.offsetY = event.offsetY;
		 	// console.log(event);
		 	if(event.clientX + 50 > $(window).width() || event.clientY + 50 > $(window).height()){
		 		console.log('edge stop');

		 		// return false;
		 	}
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

			//commond
			$(this).removeClass('dragRotateLeft');
			$(this).addClass('crashing revise');
			// console.log(x_distance);
			

			// drag time 0.2 second
			if(time_count > 0.2){

			}else{
				//100 just a num
				if(x_distance > 100) {};
			}

			revise(argv4Crash);
			exist();
		}
	});

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
			});
	};

	function exist(){
		var i=1;
		$('.drag').each(function(){
			$(this).css('left')
		});
	}

	// crash
	// function crash(clientX,clientY){
	// 	var window_width = $(window).width(),
	// 		window_height = $(window).height(),
	// 		i;
	// 		clientX += 100;
	// 		$('.crashing').animate({
	// 				'left': window_width - 150 +'px',
	// 				'top':'150px'
	// 			}, 200, function(){
	// 		  		$('.crashing').animate({'left': '500px'},100);
	// 		});
	// };

});

