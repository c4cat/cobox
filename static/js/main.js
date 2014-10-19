//mrc
//email:i#ili.li
//2014-10-19 18:04:05
//re-write

//common function

function Wh(){ //get window width and height
	this.w = $(window).width();
	this.h = $(window).height();
}

//common end

//backbone
//BG view
var BgBox = Backbone.Model.extend({
	template:'<div class="box"></div>',
	create:function(rowNum,colNum,target){
		for(var i=0;i<colNum;i++)
			for(var j=0;j<rowNum;j++)
				$(target).append(this.template);	
	}
});

var BgView = Backbone.View.extend({
	el: "#background",
	initialize:function(){
		var wh = new Wh();
		this.width = wh.w;
		this.height = wh.h;

		var	rowNum = Math.ceil(this.width/101),
			colNum = Math.ceil(this.width/101),
			offset = (rowNum-1) * 101;
		//nomarl
		var bgBox =  new BgBox();
		bgBox.create(rowNum,colNum,'#bgNormal');
		//special
		if(rowNum%101!=0){
			var bgBoxSpec = new BgBox();
			bgBoxSpec.create(1,colNum,'#bgSpecial');
		}
		//setting
		$('#bgSpecial').css('left',offset);
		$('#bgImage>img').css({'width':this.width,'min-height':this.height});
		this.bgBoxHover();
	},
	setBgImage:function(){
		var arr = ['./static/img/b1.jpg','./static/img/b2.jpg','./static/img/b3.jpg','./static/img/b4.jpg','./static/img/b5.jpg','./static/img/b6.jpg','./static/img/b7.jpg','./static/img/b8.jpg','./static/img/b9.jpg','./static/img/b10.jpg','./static/img/b11.jpg'],
			random = _.random(0,10);
		$('#bgImage>img').attr('src',arr[random]);	
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
//BG view end 

//DragBox
var DragBox = Backbone.Model.extend({

	list:['ABOUT','LINKS','IMAGE','WORKS','CONTACT']
});
var dragBox = new DragBox();
var DragBoxView = Backbone.View.extend({
	el:'',
	model:dragBox,
	initialize:function(){
		var wh = new Wh();
		this.width = wh.width;
		this.height = wh.height;
		this.list = this.model.get('list');
	},
	create:function(){
		var	tmp = '';
		for(var i=0;i<list.length;i++)
			tmp+='<div class="drag" id="'+list[i].toLowerCase()+'">'+list[i]+'</div>';
	},
	append:function(){
		this.$el.append(tmp);
	},
	setPosition:function(){
		var count = 0,
			arr = [];
		for(var i=0;i<this.list.length;i++)
			var random = this.createRandomArr();
			if(true)
				arr.push(random)	
	},
	createRandomArr:function(){
		var rowCount = Math.floor()
	}
});
//DragBox end

//action
var app = new BgView();
	app.setBgImage();

//jquery
$(document).ready(function(){
	$(window).on('resize',function(){
		$('#bgNormal,#bgSpecial').empty();
		var afterResizeApp = new BgView();
	});
});

