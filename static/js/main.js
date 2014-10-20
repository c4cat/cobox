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
	// x:0,
	// y:0,
	list:['ABOUT','LINKS','IMAGE','WORKS','CONTACT'],

	ele : '#region',
	//tmp : '<div class="drag" id="'+list[i].toLowerCase()+'">'+list[i]+'</div>',

	create:function(x,y) {
		this.ele.append(tmp);
	},
});
// var dragBox = new DragBox();

var DragBoxList = Backbone.Collection.extend({
	model:DragBox,
	url:'setting.json',
	parse:function(){
		
	}
});

var DragBoxView = Backbone.View.extend({
	el:'',
	model:DragBox,
	initialize:function(){
		var wh = new Wh();
		this.width = wh.width;
		this.height = wh.height;
		
		//nav
		this.dragBoxList = new DragBoxList();
		this.get();
	},
	get:function(){ //return an arr 
		// this.dragBoxList.fetch({
		// 	success:function(collection,response){
		// 		// collection.each(function(data){
		// 			// t.render(data.attributes);
		// 			// console.log(data.attributes['content']);
		// 			console.log(collection['models']);
		// 		// });
		// 	},
		// 	error:function(){
		// 		console.log('Get json error,please check the json file');
		// 	}
		// });	
		var fetch = this.dragBoxList.fetch();
		console.log(fetch);
	},
	create:function(){
		var	data = this.get;
		console.log(data);
		for(var i=0;i<data.length;i++)
			console.log('message');
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
var app = new BgView();
	app.setBgImage();

var app2 = new DragBoxView();


//jquery
$(document).ready(function(){
	$(window).on('resize',function(){
		$('#bgNormal,#bgSpecial').empty();
		var afterResizeApp = new BgView();
	});
});

