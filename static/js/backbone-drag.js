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
};

// jquery 
$(document).ready(function(){
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
		// this.setBgImage();
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
		$('#bg,#around-container').css({'width':get_wh().w,'height':get_wh().h});
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
		var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
		this.createTem();
		this.$el.css({'width':get_wh().w,'height':get_wh().h});
		$(window).on("resize",function(){
			t.setPosition();
			t.$el.css({'width':get_wh().w,'height':get_wh().h});
		});
		// this.drag = __bind(this.drag, this);
		// this.stopDrag = __bind(this.stopDrag, this);
	},
	events:{
		// "mousedown .drag": "startDrag"
	},
	createTem:function(){
		var list = this.model.get('list'),
			tmp = '';
		for(var i=0;i<list.length;i++){
			tmp += '<div class="drag" id="' + list[i].toLowerCase() + '">'+ list[i] +'</div>';
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
			if(!this.inOrNot(random,arr)){
				arr.push(random);
			}
		}
		$('.drag').each(function(){
			$(this).attr({'x':arr[count][0],'y':arr[count][1]}).css({'left':arr[count][0]*101+'px','top':arr[count][1]*101+'px'}).addClass('trans450');
			count++;
		});
		
		return;
	},
	createRandomArr:function(){
		var w_count = Math.floor(get_wh().w/101),
			h_count = Math.floor(get_wh().h/101),
			w_random = _.random(0,w_count-2),
			h_random = _.random(0,h_count-2);

		return([w_random,h_random]);
	},
	inOrNot:function(obj,arr){
		for(var i=0;i<arr.length;i++){
 			if(obj.toString() == arr[i].toString()){
 					return true;
 				}
			}
		return false;	
	},
	test:function(){
		alert('test');		
	}
});
// ================= //
// ===links model=== //
// ================= //
var AroundModel = Backbone.Model.extend({
	defaults: {
		name: '',
		url : '',
		img : ''
	},
	initialize: function(){
		var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };		
		console.log('AroundModel create!');
	}
});

var AroundModelList = Backbone.Collection.extend({
	model:AroundModel,
	url:'links.json'
});

var links = new AroundModelList();

var AroundView = Backbone.View.extend({
	el:$('body'),
	id:$('#around-container'),
	template: _.template($('#around-img-template').html()),
	events:{
		'click #links' : 'aroundFun',
		'click .around-close' : 'clear',
		'mouseover .around-close' : 'mouseoverClose',
		'mouseout .around-close' : 'mouseoutClose',
		'mouseenter .around-img' : 'mouseroverScale80p',
		'mouseout .around-img' : 'mouseroverScale100p',

	},
	initialize:function(){
		var t = this;
		$(window).on('resize',t.clear); 
		//when resize clear
		this.list = new AroundModelList();
	},
	render:function(args){
		this.id.append(this.template(args));
	},
	test:function(){
		alert('test');
	},
	mouseoverClose:function(e){
		var el = $(e.currentTarget);
	},
	mouseOutClose:function(e){
		var el = $(e.currentTarget);
	},
	mouseroverScale80p:function(e){
		var el = $(e.currentTarget);
		el.find('img').removeClass().addClass('animation-scale80p');
	},
	mouseroverScale100p:function(e){
		var el = $(e.currentTarget);
		el.find('img').removeClass().addClass('animation-scale100p');
	},
	aroundFun:function(e){
		var args = {
				width : Math.floor(get_wh().w/101), //num of width
				height : Math.floor(get_wh().h/101), //num of height
				left : parseInt($(e.currentTarget).attr('x')), // left coor
				top : parseInt($(e.currentTarget).attr('y')),
				num : ''
			},
			t=this;
			this.eee = $(e.currentTarget);

			$('#around-container').empty();

			links.fetch({
				success:function(collection,response){
					collection.each(function(links){
						t.render(links.attributes);
					});
					args.num = collection.length;
					// two situations
					args.num<9? t.less9(args):t.more9(args);
					return collection;
				},
				error:function(collection, response){
					console.log(collection);
					console.log(response);
					console.log('aroung view get json error,please check the json file');
				}
			});	
	},
	less9:function(args){
		var arr = [],
			arrs, 
			arr_spec = [[0,-1],[-1,0],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]],
			arr_simple = this.createSimpleArr(args),
			n = Math.ceil(Math.sqrt(args.num)),
			offset,
			start;

			n<5 ? n=3:n=n;
			offset = n-2;

			start = [args.left-offset,args.top-offset];
			// 
			args.num<9? arr_s=arr_spec : arr_s=arr_simple;

			for(var j=0;j<args.num;j++){
				var real_arr = this.arr_plus(arr_s[j],start);
				var plus_or_not = this.plusOrNot(real_arr,arr);
				var tem = this.overOrNot(plus_or_not,args,arr);
				arr.push(tem);
			}
			// console.log(arr);
			this.set(arr);
	},
	more9:function(args){
		var arr = [],
			offset,
			start = [args.left,args.top],
			n = Math.ceil(Math.sqrt(args.num)),
			nine = this.createSimpleArr(3); // arr less than nine
			//front 9
			for(var j=0;j<nine.length;j++){
				var simple_arr = this.arr_plus(nine[j],start);
				this.more9Push(arr,simple_arr,args);
			}
			//after 9
			while(arr.length<args.num){
				var append_arr = this.createSimpleArr(n);
				append_arr.sort(function(){return 0.5 - Math.random()});
				for(var k=0;k<append_arr.length;k++){
					var simple_arr2 = this.arr_plus(append_arr[k],start);
					this.more9Push(arr,simple_arr2,args);
				}	
				n++;
				// console.log(arr.length);
			}
			this.set(arr);
	},
	more9Push:function(arr,simple_arr,args){
		if(this.plusOrNot(simple_arr) && this.overOrNot(simple_arr,args) && this.inOrNot(simple_arr,arr)){
			arr.push(simple_arr);
		}
	},
	createSimpleArr:function(n){
		var arr = [],
			offset= Math.floor(n/2)*-1;
		for(var i=offset;i<n+offset;i++){
			for(var j=offset;j<n+offset;j++){
				if(i==0 && j==0){
					// leave the self postition
				}else{
					arr.push([j,i]);
				}
			}
		}
		// arr.sort(function(){return 0.5 - Math.random()});// random arr 
		return arr;
	},
	set:function(arr){
		var i = 0;
		//eee is form aroundFun 
		var el = this.eee;
		var center = [,el.attr('y')];

		el.addClass('arounding').removeClass('drag');
		// hide other
		$('#region .drag').each(function(){
			if(!$(this).hasClass('arounding')){
				$(this).hide();
				// $(this).addClass('animated bounceInDown');
			}
		});
		// append close button
		el.append('<div class="around-close"></div>');

		$('.around-img').each(function(){
			var random = Math.random(),
				random2 = Math.random(),
				time = random * 700,
				plus;
				// random the direction
				Math.ceil(random*10)%2==0? plus=1:plus=-1;

			var	transform = 'rotate(' + 90*random*plus + 'deg) scale(0.8)';

			$(this).css({
				'left': el.attr('x')*101+'px',
				'top' : el.attr('y')*101+'px',
				'transform' : transform
			// }).addClass('animation-scale100p-noBounce');
			});
			$(this).animate({
				'left':arr[i][0]*101+'px',
				'top':arr[i][1]*101+'px',
				transform:'rotate(0) scale(1)'
				// 'rotate':'30deg'
			},time,'easeOutExpo',function(){
			}).attr({'x':arr[i][0],'y':arr[i][1]});
			//img
			$(this).find('img').css('transform','scale(0.8)');
			$(this).find('img').animate({
				transform: 'scale(1)',
			},time,'easeOutExpo');
			i++;
		});
		//rounding-mode		
		$('body').addClass('rounding-mode');
	},
	clear:function(e){
		if($('body').hasClass('rounding-mode')){
		e.stopPropagation();
		var el = $(e.currentTarget).parent();

		$('.around-close').hide().remove();
		//each
		$('.around-img').each(function(){
			var random = Math.random(),
				random2 = Math.random(),
				time = random * 400,
				plus;
			// random the direction
			Math.ceil(random*10)%2==0? plus=1:plus=-1;
			var	transform = 'rotate(' + 20*random*plus + 'deg)';
			var transformOrigin =  Math.round(random)*50+'px '+ Math.round(random2)*50+'px'
			// $(this).delay(random*1000).addClass('hinge animated');
			$(this).removeClass('animation-aroundCreate').css({'transformOrigin':transformOrigin}).animate({
					'transform':transform,
				},150,function(){
					$(this).addClass('animation-whenDrop');
			});
			$(this).find('img').addClass('animation-scale80pNobounce');
		});
		$('#region .drag').each(function(){
			if(!$(this).hasClass('arounding')){
				$(this).show();
				$(this).addClass('animation-dragDrop');
			}
		});
		$('.arounding').addClass('drag').removeClass('arounding');
		$('body').removeClass('rounding-mode');
		}
	},
	loadImage:function(){

	},
	plusOrNot:function(arr){
		if(arr[0]>=0 && arr[1]>=0){
			return true;
		}else{
			return false;
		}
	},
	overOrNot:function(arr,args){
		if(args.width>arr[0]&&args.height>arr[1]){
			return true;
		}else{
			return false;
		}
	},
	inOrNot:function(obj,arr){
		for(var i=0;i<arr.length;i++){
 			if(obj.toString() == arr[i].toString()){
 					return false;
 				}
			}
		console.log('not in');	
		return true;	
	},	
	arr_plus:function(arr1,arr2){
		var arr3 = [arr1[0]+arr2[0],arr1[1]+arr2[1]];
		return arr3;
	}
});

// ================= //
// ===links model=== //
// ================= //

var ImgModel = Backbone.Model.extend({
	defaults: {
		name: '',
		title : '',
		img : ''
	},
	initialize: function(){
		
	}
});

var img = new ImgModel();

var ImgView = Backbone.View.extend({
	el:$('body'),
	model:img,
	id:$('#img-container'),
	template: _.template($('#around-template').html()),
	events:{
		'click .round-img' : 'imgLoad',
	},
	initialize:function(){
		$('body').append('<div id="img-container"></div>');
		$('#img-container').css({'width':get_wh().w,'height':get_wh().h});
		$(window).on("resize",function(){
			$('#img-container').css({'width':get_wh().w,'height':get_wh().h});
		});
	},
	render:function(args){
		this.id.append(this.template(args));
	},
	test:function(){
		alert('test');
	},
});

var app = new BgView();
var app2 = new DragBoxView();
var app3 = new AroundView();

// $('#links').addClass('animation-aroundCreate');
});
