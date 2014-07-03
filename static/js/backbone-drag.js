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
function set_wh(arg){
	$(arg).css({'width':get_wh().w,'height':get_wh().h});
}

function set_img_wh(arg){
	$(arg).css({'width':get_wh().w,'height':'auto'});
}
//function
$(function(){

var Bg = Backbone.Model.extend({
	initialize:function(){

	},
	defaults:{
		bgImage : ['../img/bg1.jpg','../img/bg1.jpg','../img/bg1.jpg']
	}
});

var BgView = Backbone.View.extend({
	// 
	model:Bg,
	el:'#bg',
	initialize:function(){
		console.log('bg view work');
		this.create();
		console.log(this);
		this.listenTo(this.el,'change',this.create);
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
				$(this.el).append(tem);
			}
		}	
		// for sp
		for(var j=0;j<h_count;j++){
			$('#bg-sp').append(tem_sp);
		}

		$('#bg-sp').css('left',offect);
	},
		whichImage:function(){

		}
	});

var app = new BgView();

});
