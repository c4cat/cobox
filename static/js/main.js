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
		y:'',
		type:'',
		json:''
	}
});
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
	},
	events: {
		'click':'clickFun'
	},
	render: function(){
		var x = this.model.get('x'),
			y = this.model.get('y');

		$('#region').append(this.$el.html(this.template(this.model.toJSON())));
		$(this.el).stop();
		$(this.el).addClass('drag')
				  .attr({'x':x,'y':y})
				  .css('transition','none')
				  .animate({'left':x*101+'px','top':y*101+'px'},_.random(100,400));
		return this;
	},
	clickFun: function(){
		var el = $(this.el),
			type = this.model.get('type'),
			json; //json file

			this.model.get('json')? json=this.model.get('json'):json=this.model.get('name')+'.json';

		if(el.hasClass('noclick')){
			setTimeout(function(){el.removeClass('noclick');},300);
		}else{
			switch(type){
				case 'aroundBox':
					console.log('aroundBox');
					aroundBoxFun(json);
					break;
				case 'about':
					console.log('about');
					aboutBoxFun();
					break;
				case 'contact':
					console.log('contact');		
			}
		}
	},
	fun4x5:function(){
		
	},
	aroundBoxFun: function(json){
		var AroundBoxList = Backbone.Collection.extend({
			model:AroundBox,
			url:json
		});
		this.aroundBoxs = new AroundBoxList;
		//end image box
		var that=this;
		//nav
		this.aroundBoxs.fetch({
			success:function(col,arr){
				that.createAroundBoxs();
			},
			error:function(){
				console.log('Get dragboxs json error,please check the json file');
			}
		});
	},
	createAroundBoxs: function(bool){
		var i = 0,
			j = 0,
			num = this.aroundBoxs.length,
			edge = {
				x: Math.floor(width/101),
				y: Math.floor(height/101)
			},
			local ={
				x: this.model.get('x'),
				y: this.model.get('y')
			}
			args = this.positionArr(num,edge,local);

		this.aroundBoxs.each(function(obj){
			// console.log(obj.get('id'));
			if(!bool) var view = new AroundBoxView({model:obj});
			obj.set({'parentXY':local});
			if(i<args.inside_num){
				obj.set({'x':args.inside_arr[i][0],'y':args.inside_arr[i][1]});
			}else{
				obj.set({'x':args.outside_arr[j][0],'y':args.outside_arr[j][1]});
				j++;
			}
			i++;
		});
	},
	positionArr: function(num,edge,local){
		var arr = [],
			length = Math.ceil(Math.sqrt(num+1))<3? 3:Math.ceil(Math.sqrt(num+1)),
			floor = 3;

		while(arr.length<num){
			if(floor>9999) break;

			var start = {
				x: local.x-Math.floor(floor/2),
				y: local.y-Math.floor(floor/2)
			};

			var local_item = [[local.x,local.y]];
			for(i=0;i<floor;i++){
				for(j=0;j<floor;j++){
					var item = [start.x+j,start.y+i];
					if(start.x+j+1>0&&start.y+i+1>0&&start.x+j<edge.x&&start.y+i<edge.y) //edge
						if(!inOrNot(item,arr))
							if(!inOrNot(item,local_item))
								arr.push(item);
				}
			}
			floor++;
		}	

		var arr_clone = arr.concat();
		var inside = (length-1)*(length-1)-1;
		var random_arr = [];

		//inside
		for(var i=0;i<inside;i++){
			$('#demo').append('<div class="box" style="left:'+arr[i][0]*50+'px;top:'+arr[i][1]*50+'px">'+arr[i]+'<div>');
			arr_clone.shift();
		}
		//outside
		while(random_arr.length<(num-inside)){
			var random = _.random(0,arr_clone.length-1);
			if(!inOrNot(arr_clone[random],random_arr))
				random_arr.push(arr_clone[random]);
		}

		for(var j=0;j<random_arr.length;j++){
			$('#demo').append('<div class="box" style="left:'+random_arr[j][0]*50+'px;top:'+random_arr[j][1]*50+'px">'+random_arr[j]+'<div>');
		}
		function inOrNot(obj,arr){
			for(var i=0;i<arr.length;i++){
	 			if(obj.toString() == arr[i].toString()){
	 					return true;
	 				}
				}
			return false;	
		}	

		var re = {
			inside_arr:arr,
			inside_num:inside,
			outside_arr:random_arr
		}
		return re;
	}
});
//end dragbox
//aroundBox
var AroundBox = Backbone.Model.extend({
	defaults:{
		x:'',
		y:'',
		url:'',
		thumbnail:'',
		content:'',
		parentXY:''
	}
});
var AroundBoxView = Backbone.View.extend({
	tagName: "div",
	model:AroundBox,
	template: _.template($("#around-img-template").html()),
	initialize:function(){
		this.listenTo(this.model, 'change', this.render);
	},
	events:{
		
	},
	render: function(){
		var x = this.model.get('x'),
			y = this.model.get('y'),
			parentXY = this.model.get('parentXY')

		$('#region').append(this.$el.html(this.template(this.model.toJSON())));
		$(this.el).stop();
		$(this.el).addClass('drag')
				  .attr({'x':x,'y':y})
				  .css({'transition':'none','left':parentXY.x*100+'px','top':parentXY.y*100+'px'})
				  .animate({'left':x*101+'px','top':y*101+'px'},_.random(100,400));
				  
		return this;
	}
});
//end aroungbox

//
var AppView = Backbone.View.extend({
	el:'',
	// model:DragBox,
	initialize:function(){		
		that=this;
		//nav
		dragBoxs.fetch({
			success:function(col,arr){
				that.createDragBoxs();
				pepjs();
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
		var wh = new Wh(),
			width = wh.width,
			height = wh.height;
		var rowNum = Math.floor(width/101),
			colNum = Math.floor(height/101),
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

