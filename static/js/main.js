//co2
//email:i#cornelia.in
//2014年1月13日11:55:16
//pikibox 

$(function(){

function getWH(){
	var window_width = $(window).width(),
		window_height = $(window).height(),
		argv = {
			w : window_width,
			h : window_height
		}
	return argv;
};

function creartBg(){
	var width_count = Math.ceil(getWH().w/101), //how many 
		height_count = Math.ceil(getWH().h/101), 
		offect = (width_count-1) * 101; //offect form the left

	$('#bg,#region,#bg-img>img').css({'height':getWH().h,'width':getWH().w}); //set the width
	$('#bg-img>img').css({'height':'auto','width':getWH().w}); //set the width
	$('#bg_sp').css('left',offect); //set the offect

	//loop append the box
	for(var i=0;i<width_count;i++){ 
		for(var j=0;j<height_count;j++){ 
			var el = "<div class='box'></div>";
			$('#bg').append(el);
		}
	}	
	//speical box on the right
	for(var j=0;j<height_count;j++){
		var el_sp = "<div class='box_sp box'></div>";
		$('#bg_sp').append(el_sp);
	}

};



creartBg();

$(window).resize(function(){
	$('.box').remove();
	$('#region').css({'height':getWH().h,'width':getWH().w});
	$('#bg-img>img').css({'height':'auto','width':getWH().w});
	creartBg();
});

$('.box').hover(function(){
	$(this).stop(true,true)
	$(this).animate({opacity:0.6},200);
},function(){
	$(this).animate({opacity:0.4},1000);
});

});
