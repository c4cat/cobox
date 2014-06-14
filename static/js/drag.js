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
			$(this).addClass('rotate-go-right');
			// console.log($(this));
			console.log('start');

			// $(this).mousedown(function(){
				console.log('mousedown' + event.clientX);
			// })
			// console.log(event.clientX);
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
			this.clientX_end = 
			$(this).removeClass('rotate-go-right');
			$(this).addClass('crashing');
				var offsetX  = event.offsetX - this.offsetX;
				var offsetY  = event.offsetY - this.offsetY;

				console.log(event.clientX);

				var obj = $('#drag');

				crash(event.clientX,event.clientY);
		},
	});

	console.log(document.documentElement.clientHeight);
	console.log($(window).width());

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

