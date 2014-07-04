// mrc
// i#cornelia.in
// 2014/06/25 21:04:49
// written by Backbone

//model

//get window width and height
function get_wh(){
	var window_width = $(window).width(),
		window_height = $(window).height();
	var re = {
		w : window_width,
		h : window_height
	}
	return re;
}

// jquery 
$(function(){

//start bg view
var BgView = Backbone.View.extend({
	// 
	el : '#bg',
	// defaults:{
	// },
	initialize:function(){
		var t = this;
		$(window).on("resize",whenResize);
			//function 
			function whenResize(){
				t.removee();
				t.create();
				}

		this.create();
		this.setBgImage();

		// drag box
		new DragBoxView();
	},

	test:function(){
		alert('test!!!');
	}, 
	create:function(){
		var w_count = Math.ceil(get_wh().w/101),
			h_count = Math.ceil(get_wh().h/101),
			offect = (w_count-1) * 101,
			tem = "<div class='box'></div>",
			tem_sp = "<div class='box-sp box'></div>";
		
		// for normal box
		for(var i=0;i<w_count;i++){ 
			for(var j=0;j<h_count;j++){ 
				$('#bg-nm').append(tem);
			}
		}	
		// for sp
		for(var j=0;j<h_count;j++){
			$('#bg-sp').append(tem_sp);
		}

		$('#bg-sp').css('left',offect);
		$('#bg-img>img').css({'width':get_wh().w,'min-height':get_wh().h});
	},
	removee:function(){
		$('#bg-nm,#bg-sp').empty();
	},
	setBgImage:function(){
		var arr = ['./static/img/b1.jpg','./static/img/b2.jpg','./static/img/b3.jpg','./static/img/b4.jpg','./static/img/b5.jpg','./static/img/b6.jpg','./static/img/b7.jpg','./static/img/b8.jpg','./static/img/b9.jpg','./static/img/b10.jpg','./static/img/b11.jpg'],
			random = _.random(0,10);
		$('#bg-img>img').attr('src',arr[random]);	  
		// $('#bg-img>img').attr('src','./static/img/b2.jpg');	  
	}
	});

//  end Bgview;

var DragBox = Backbone.Model.extend({
	initialize:function(){
		this.add();
		console.log(123);
	},
	addOne:function(){
		$('#region').append("<div class='box'></div>");
	},
	add:function(){
		var i=5;
	},
	test:function(){
		alert('have a test');
	}
});

var DragBoxView = Backbone.View.extend({
	el : "#region",
	template : _.template($('#drag-box').html()),
	render:function(){
		this.$el.html(this.template());
	},
	initialize: function(){
		this.render();

		$('.drag').draggable({
			containment: $('#region'),
			zIndex:999,
			create:function(){},
			start:function(){
				this.clientX_start = event.clientX;
				this.clientY_start = event.clientY;

				$(this).addClass('whenDragging animated').removeClass('stopShake');
			},
			drag:function(){
				this.offsetX = event.offsetX;
		 		this.offsetY = event.offsetY;
		 		$(this).css("zIndex",999);
		 		$('.drag:not(.ui-draggable-dragging)').each(function(){
					$(this).css('opacity',0.4);
				});
			},
			stop:function(){
				this.clientX_stop = event.clientX;
				this.clientY_stop = event.clientY;

				var obj = $('#drag'),
				offsetX  = event.offsetX - this.offsetX,
				offsetY  = event.offsetY - this.offsetY,

				x_distance = Math.abs(this.clientX_stop - this.clientX_start),
				y_distance = Math.abs(this.clientY_stop - this.clientY_start),
				x_direction = (this.clientX_stop>this.clientX_start)? 'right':'left',
				y_direction = (this.clientY_stop>this.clientY_start)? 'down':'up';
			
				var argv4Crash = {
					dx : x_distance,
					dy : y_distance,
					clientX : event.clientX,
					clientY :event.clientY,
					left: $(this).css('left'),
					top : $(this).css('top')
				};
				$(this).removeClass('whenDragging animated').addClass('crashing revise').css("zIndex",2);

				revise(argv4Crash);
				$('.drag').css('opacity',1);

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
	};
			}
		});
	}

});



var app = new BgView();
var app2 = new DragBoxView();


});
