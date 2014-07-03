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
//set 
// function set_wh(arg){
// 	$(arg).css({'width':get_wh().w,'height':get_wh().h});
// }

// function set_img_wh(arg){
// 	$(arg).css({'width':get_wh().w,'min-height':get_wh().h});
// }

// jquery 
$(function(){

//start bg view

var BgView = Backbone.View.extend({
	// 
	model : BgBox,
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

// .box model
var Box = Backbone.Model.extend({
	initialize:function(){
		this.add();
		console.log(123);
	},
	addOne:fnction(){
		$('#region').append("<div class='box'></div>");
	},
	add:function(){

	},
	test:function(){
		alert('have a test');
	}
});

// .box collection 
// var BgBoxList = Backbone.Collection.extend({
// 	model: Bgbox,
// 	initialize:function(){

// 	},
// 	comparator: 'order'
// });

var app = new BgView();


});
