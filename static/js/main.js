//mrc
//email:i#ili.li
//2014-10-19 18:04:05
//re-write

//common function

function Wh(){ //get window width and height
	this.width = $(window).width();
	this.height = $(window).height();
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
		this.width = wh.width;
		this.height = wh.height;

		var	rowNum = Math.ceil(this.width/101),
			colNum = Math.ceil(this.height/101),
			offset = (rowNum-1) * 101;
		// nomarl
		var bgBox =  new BgBox();
		bgBox.create(rowNum,colNum,'#bgNormal');
		// special
		if(rowNum%101!=0){
			var bgBoxSpec = new BgBox();
			bgBoxSpec.create(1,colNum,'#bgSpecial');
		}
		//setting
		$('#bgSpecial').css('left',offset);
		$('#bgImage>img').css({'width':this.width,'min-height':this.height});
		// some browser should do this step,because html overflow hidden is not work, 
		// chrome 38 in win is not work, chrome 38 in os x is work,chrome 27 is work too,so add it. 
		$('#background').css({'width':this.width,'height':this.height}); 
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
	defaults:{
		x:'',
		y:''
	},
	initialize:function(){
		// this.listenTo(this,'change',this.setPosition);
	}
});
// var dragBox = new DragBox();

var DragBoxList = Backbone.Collection.extend({
	model:DragBox,
	url:'nav.json'
});

var dragBoxs = new DragBoxList;

var DragBoxView = Backbone.View.extend({
	tagName: "div",
	model:DragBox,
	template: _.template($("#dragbox-template").html()),
	initialize:function(){
		this.listenTo(this.model, 'change', this.render);
		// $(window).on("resize",this.setPosition);
		$(this.el).pep();
	},
	render: function(){
		var x = this.model.get('x'),
			y = this.model.get('y');

		$('#region').append(this.$el.html(this.template(this.model.toJSON())));
		$(this.el).stop();
		// $(this.el).addClass('drag').css({'left':x*101+20+'px','top':y*101+20+'px'}).animate({left:x*101+'px',top:y*101+'px'},_.random(300,500));
		$(this.el).addClass('drag').animate({'left':x*101+'px','top':y*101+'px'},_.random(100,400));
		return this;
	},
	// setPosition:function(){
	// 	dragBoxs.each(function(obj){
	// 		console.log(obj);
	// 	});
	// }
});

var AppView = Backbone.View.extend({
	el:'',
	// model:DragBox,
	initialize:function(){
		var wh = new Wh();
		this.width = wh.width;
		this.height = wh.height;
		
		that=this;

		//nav
		dragBoxs.fetch({
			success:function(col,arr){
				that.createDragBoxs();
			},
			error:function(){
				console.log('Get json error,please check the json file');
			}
		});

		$(window).on("resize",this.whenResize);
	},
	whenResize:function(){
		var dragBoxsLength = $('.drag').length;
		that.createDragBoxs('no need to create view again');
	},
	createDragBoxs:function(bool){
		var arr = this.randomArr(dragBoxs.length),
			i = 0; 
		dragBoxs.each(function(obj){
			// console.log(obj.get('id'));
			if(!bool)
				var view = new DragBoxView({model:obj});

			obj.set({'x':arr[i][0],'y':arr[i][1]});
			i++;
		});
	},
	randomArr:function(length){
		var i = 0,
			arr = [];
		while(i<length){
			var random = this.createRandom();
			if(!this.inOrNot(random,arr)){
				arr.push(random);
				i++;
			}
		}	
		return arr;
	},
	createRandom:function(){
		var rowNum = Math.floor(this.width/101),
			colNum = Math.floor(this.height/101),
			rowRandom = _.random(0,rowNum-1),
			colRandom = _.random(0,colNum-1);
		
		return([rowRandom,colRandom]);	
	},
	inOrNot:function(obj,arr){
		for(var i=0;i<arr.length;i++){
 			if(obj.toString() == arr[i].toString()){
 					return true;
 				}
			}
		return false;	
	}
});
//DragBox end

//action
var bg = new BgView();
	bg.setBgImage();

var app = new AppView();


//jquery
$(document).ready(function(){
	$(window).on('resize',function(){
		$('#bgNormal,#bgSpecial').empty();
		var afterResizeApp = new BgView();
	});
});

