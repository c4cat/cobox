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
		$(window).on("resize",function(){
			t.removee();
			t.create();
		});
		this.create();
		this.bgBoxHover();
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
			if(get_wh().w%101 != 0){
				$('#bg-sp').append(tem_sp);
			}
		}

		$('#bg-sp').css('left',offect);
		$('#bg-img>img').css({'width':get_wh().w,'min-height':get_wh().h});
		$('#bg').css({'width':get_wh().w,'height':get_wh().h});
	},
	removee:function(){
		$('#bg-nm,#bg-sp').empty();
	},
	setBgImage:function(){
		var arr = ['./static/img/b1.jpg','./static/img/b2.jpg','./static/img/b3.jpg','./static/img/b4.jpg','./static/img/b5.jpg','./static/img/b6.jpg','./static/img/b7.jpg','./static/img/b8.jpg','./static/img/b9.jpg','./static/img/b10.jpg','./static/img/b11.jpg'],
			random = _.random(0,10);
		$('#bg-img>img').attr('src',arr[random]);	  
		// $('#bg-img>img').attr('src','./static/img/b2.jpg');	  
	},
	bgBoxHover:function(){
		$('.box').hover(function(){
			$(this).stop(true,true)
			$(this).animate({opacity:0.6},200);
		},function(){
			$(this).animate({opacity:0.4},1000);
		});
	}
	});
//  end Bgview;
var DragBox = Backbone.Model.extend({
	defaults:function(){
		return{
			list:['ABOUT','LINKS','IMAGE','WORKS','CONTACT']
		};
	},
	initialize:function(){

	}
});

var dragBox = new DragBox();

var DragBoxView = Backbone.View.extend({
	el:'#region',
	model:dragBox,
	initialize:function(){
		var t = this;
		this.createTem();
		this.$el.css({'width':get_wh().w,'min-height':get_wh().h});
		$(window).on("resize",function(){
			t.setPosition();
			t.$el.css({'width':get_wh().w,'min-height':get_wh().h});
		});
	},
	createTem:function(){
		var list = this.model.get('list'),
			tmp = '';
		for(var i=0;i<list.length;i++){
			tmp += '<div class="drag" id="' + list[i].toLowerCase() + '">'+ list[i] +'</div>'
		}
		this.$el.append(tmp);
		this.setPosition();
		//return tmp;
	},
	setPosition:function(){

		var drag_count = $('.drag').length,
			count = 0,
			arr = [];

		for(var i=0;i<drag_count*2;i++){
			var random = this.createRandomArr();
			for(var j=0;j<arr.length;j++){
 				if(random.toString() == arr[j].toString()){
 					break;
 				}
 				// arr.push(random);
			}
			arr.push(random);
		}

		console.log(arr);

		$('.drag').each(function(){
			$(this).css({'left':arr[count][0]*101+'px','top':arr[count][1]*101+'px'});
			count++;
		});
	},
	createRandomArr:function(){
		var w_count = Math.ceil(get_wh().w/101),
			h_count = Math.ceil(get_wh().h/101),
			w_random = _.random(0,w_count-2),
			h_random = _.random(0,h_count-2);

		return([w_random,h_random]);
	},
	test:function(){
		alert('test');		
	}
});



var app = new BgView();
var app = new DragBoxView();


});
