//co2
//email:i#ailenroc.cn
//2014年1月13日11:55:16
//pikibox 

$(function(){

//get the width(getWH()[0]) and height(getWH()[1])
function getWH(){
	var window_width = $(window).width(),
		window_height = $(window).height(),
		arr = [window_width,window_height];
	return arr;
};

function creartBg(){
	var numH = Math.ceil(getWH()[1]/101), //hang
		numL = Math.ceil(getWH()[0]/101), //lie
		i,j,
		bg = $('#bg');

		bg.css('height',getWH()[1]);
		bg.css('width',getWH()[0]+100);

	for(i=0;i<numL;i++){ 
		for(j=0;j<numH;j++){ 
			var el = "<div class='box'></div>";
			bg.append(el);
		}
	}	
};



creartBg();

$(window).resize(function(){
	$('.box').remove();
	creartBg();
});

});
