// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

$(function(){
	$('.drag').draggable({
		create:function(event,ui){

		},
		start:function(event,ui){
			this.clientX_start = event.clientX;
			this.clientY_start = event.clientY;
			this.time_start = event.timeStamp;
			$(this).addClass('rotate-go-right');
			// console.log($(this));
			console.log('start');
			// console.log(event);
		},
		drag:function(event,ui){
			//console.log(event);
			//console.log(event.clientX);
		 	this.offsetX = event.offsetX;
		 	this.offsetY = event.offsetY;
		 	// console.log(event);
		 	// console.log(this.offsetX);
		 	if(event.clientX + 10 > $(window).width()){
		 		return false;
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
			//commond
			$(this).removeClass('rotate-go-right');
			$(this).addClass('crashing');

			if(time_count > 0.5){
				if()
			}else{
				//100 just a num
				if(x_distance > 100) {};
			}

			crash(event.clientX,event.clientY);
		},
	});

	function crash(clientX,clientY){
		var window_width = $(window).width(),
			window_height = $(window).height(),
			i;

			if(window_width - clientX){

			}
			// setInterval(function(){
				clientX += 100;
				// $('.crashing').css('left',clientX+'px');
				  $('.crashing').animate({'left': window_width - 150 +'px','top':'150px'}, 200, function(){
				  		$('.crashing').animate({'left': '500px'},100);
				  })
			// },50);
			// setTimeout(crash,30);

	};

});

