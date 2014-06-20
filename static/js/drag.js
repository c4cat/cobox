// mrc
// i#cornelia.in
// 2014年6月13日16:33:17
// drag.js

//backbone
var Dropbox = Backbone.Model.extend({
	initialize:function(){
		console.log('dropbox create');
	},
	defaults:{

	}
});

var DropboxList = Backbone.Collection.extend({
	model:Dropbox,
	comparator: 'order'
});

var Dropboxs =  new DropboxList;

// var DropboxView = Backbone.View.extend({
// 	// tagname : "div",
// 	template : _.template($('#dropbox-item').html())
// });

var AppView = Backbone.View.extend({
	el:'body',
	events:{

	},
	initialize:function(){
		console.log('message');
	},
	render:function(){
		var template = _.template($('#dropbox-item').html());
		
			$(this.el).append(template);
	},
	addOne:function(){
		console.log(123);
	},
	addAll:function(){

	},
	breakdown:function(){

	}
});

var demo = new AppView;
demo.render();

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
			this.time_start = event.timeStamp;

			$(this).addClass('dragRotateLeft').removeClass('stopShake');
			console.log('start');
		},
		drag:function(event,ui){
		 	this.offsetX = event.offsetX;
		 	this.offsetY = event.offsetY;
		 	// console.log(event);
		 	if(event.clientX + 50 > $(window).width() || event.clientY + 50 > $(window).height()){
		 		// console.log('edge stop');
		 		// return false;
		 	}
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

			$(this).removeClass('dragRotateLeft').addClass('crashing revise').css("zIndex",2);

			revise(argv4Crash);
			$('.drag').css('opacity',1);
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

	$('.about-hidden').clone().prependTo('.drop');

	for(var ii=1;ii<4;ii++){
		for(var jj=1;jj<4;jj++){
			$('.drop[data-x='+ii+'][data-y='+jj+']').find('.about-hidden').css({'top': (ii-1)*-101+'px','left':(jj-1)*-101+'px'});
		}
	}
	// var angle_arr = randomAngle();
 	// 	var count = 0;
	// for(var ii=1;ii<4;ii++){
	// 	for(var jj=1;jj<4;jj++){
	// 		$('.drop[data-x='+ii+'][data-y='+jj+']').animate({
	// 			'zIndex':-1
	// 		},{step:function(){
	// 			$(this).css('transform','rotate('+angle_arr[count]+'deg)'); 
	// 			console.log(count);
	// 		}, duration:'slow'},'linear');
	// 		count++;
	// 	}
	// }
	// function randomAngle(){
	// 		var	arr = [];
	// 	for(var i=0;i<18;i++){	
	// 		var random = Math.ceil(Math.random()*10),
	// 			angle = random * 18;
	// 		arr.push(angle);
	// 	}
	// 	console.log(arr);
	// 	return arr;
	// }

});

