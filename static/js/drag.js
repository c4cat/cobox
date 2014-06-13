// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

$(function(){
	$('.drag').draggable({
		create:function(event,ui){
			// console.log('fxxk');
		},
		start:function(event,ui){
			this.x = event.clientX;
			$(this).addClass('rotate-left');
			console.log($(this));
			console.log(event.clientX);
		},
		drag:function(event,ui){
			// console.log(ui);
			console.log(event.clientX);
		},
		stop:function(event,ui){
			$(this).removeClass('rotate-left');
		}
	});
});

