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
		// $('.box').each(function(){
		// 	var random = _.random(1,10);
		// 	$(this).css({'position':'absloute'});
		// 	$(this).animate({
		// 		left:0,
		// 		top:0,
		// 		transform:'rotate('+random*10+'deg)'
		// 	},500);
		// });

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
		'click .around-img' : ' test',
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
	f:function(args){
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
			k=0,
			nine = this.createSimpleArr(3); // arr less than nine
			//front 9
			for(var j=0;j<nine.length;j++){
				var simple_arr = this.arr_plus(nine[j],start);
				this.more9Push(arr,simple_arr,args);
			}
			//after 9
			while(arr.length<args.num){
				// must deal with the situation when the offer less than args.num
				// a very simple solve,i don't agree with it
				if(k>999) break;
				//
				var append_arr = this.createSimpleArr(n);
				append_arr.sort(function(){return 0.5 - Math.random()});
				for(var k=0;k<append_arr.length;k++){
					var simple_arr2 = this.arr_plus(append_arr[k],start);
					this.more9Push(arr,simple_arr2,args);
				}	
				n++;
				k++;
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
		'click .around-img' : 'imgLoad',
		'mouseover .arounding' : 'showClose',
		'mouseout .arounding' : 'hideClose',
		'click .piece-close' : 'clear',
		'mouseover .piece_hover' : 'pieceMouseover',
		'mouseout .piece_hover' : 'pieceMouseout',
		'click .info': 'showInfo',
		'click .small': 'showImgSize',
		'click .big': 'showFullScreen'

	},
	initialize:function(){
		var t = this;
		this.$el.append('<div id="img-container"></div>');
		this.id.css({'width':get_wh().w,'height':get_wh().h});
		$(window).on("resize",function(){
			this.id.css({'width':get_wh().w,'height':get_wh().h});
		});
	},
	test:function(){
		alert('test');
	},
	imgLoad:function(e){
		//prevent the default event
		e.preventDefault();

		console.log(e);
		var width = get_wh().w,
			height = get_wh().h,

			url = $(e.currentTarget).find('a').attr('href'),
			title = $(e.currentTarget).find('img').attr('alt'),
			description = $(e.currentTarget).find('img').attr('description'),

			css = '';

			css += '.img_piece{';
			css += 'width:' + width + 'px;';
			css += 'height:' + height + 'px;';
			css += 'background-image: url(' + url + ');';
			// css += 'background-image: url(http://localhost:5177/2.png);';
			css += 'background-repeat: no-repeat;';
			css += 'background-size:cover;';

			css_default = '';

		var args = {
			targetX : e.clientX,
			targetY : e.clientY

		}
		
		$('#style').html('').append(css);

		this.create(args);
		this.createDiv4Clone(title,description);
	},
	create:function(args){
		var w_count = Math.ceil(get_wh().w/101),
			h_count = Math.ceil(get_wh().h/101),
			k = 0,
			style = 'width:'+ w_count*101 + 'px;height:' + h_count*101 +'px;';
		
		//first create the container
		$('body').append('<div id="img_piece_container" style="'+ style +'"></div>');
		// for normal box
		console.log(w_count);
		for(var j=0;j<w_count;j++){ 
			for(var i=0;i<h_count;i++){ 
				var bag_pos = j*-101 +'px ' + i*-101 + 'px';
				var tem = "<div class='piece' x='"+ j +"' y='"+ i +"'><div class='img_piece' style='background-position:"+ bag_pos +"'></div><div class='piece_hover'><div class='piece_other_button'></div></div>";
				$('#img_piece_container').append(tem);
			}
		}	

		$('.piece').each(function(){
			var x = $(this).attr('x'),
				y = $(this).attr('y'),
				random = _.random(30,90),
				angle = random + 'deg';

			$(this).css({
				'left' : args.targetX,
				'top' : args.targetY,
				'transform':'rotate('+ angle +')'
			});

			$(this).delay(k*15).animate({
				'left' : x*101,
				'top' : y*101,
				'opacity' : 1,
				'transform':''
			},200,function(){
				$('#img_piece_container').css('background','#a4a4a4');
			});

			k++;
		});
		//
		this.showTheControll();
	},
	createDiv4Clone:function(t,d){
		//t is title,d is description
		var temp = '<div id="div4clone" class="n"><h6>'+t+'</h6><p>'+d+'</p></div><div id="clone"></div>';

		$('#img_piece_container').append(temp);

		// the intro box size 
		var str_length = d.length,
			w_count = Math.ceil(get_wh().w/101),
			h_count = Math.ceil(get_wh().h/101),
			numOfWidth = w_count - 6, //  left 4 and right 2
			numOfHeight,
			originWidth = $('#div4clone').width(),
			targetWidth;

			originWidth>numOfWidth? targetWidth=numOfWidth*101 : targetWidth=Math.ceil(originWidth/101)*101;

			// alert(originWidth + ',' + originWidth);

		$('#div4clone,#clone').css({'width':targetWidth});

		var originHeight = $('#div4clone').height(),
			numOfHeight = Math.ceil(originHeight/101),
			targetHeight = numOfHeight*101;

		$('#div4clone,#clone').css({'height':targetHeight});
		var clone = $('#div4clone').clone().html();
		console.log(clone);
		// clone.attr('id','').removeClass('n');
		// $('#clone').append(clone);

		for(var i=0;i<numOfWidth;i++){
			for(var j=0;j<numOfHeight;j++){
				// clone
				var div_temp = '<div class="clone" x="'+i+'" y ="'+j+'" style="top:'+(j*101)+'px;left:'+(i*101+404)+'px"><div class="in"  style="width:'+ targetWidth +'px;height:'+ targetHeight+'px;top:'+(j*-101)+'px;left:'+(i*-101)+'px">'+clone+'</div></div>';
				$('#clone').append(div_temp);
			}
		}

		//let's clone
	},
	clearclone:function(){

	},
	showTheControll:function(){
		var arounding = $('.arounding').clone();
		// remove 
		$('#region>.arounding').remove();

		var temp = '<div class="big"></div><div class="small"></div><div class="info">i</div>';

		//create small,big,info
		$('#img_piece_container').append(temp);
		$('#img_piece_container').append(arounding);
		$('#img_piece_container>.arounding').find('.around-close').addClass('piece-close');

		$('.arounding').css({

		});

		//set the position
		$('.arounding').animate({
			'left': 101*2,
			'top' : 0,
			'zIndex' : 9999
		},200,function(){
			$('.info,.small').delay(1000).fadeIn();
		});
	},
	showInfo:function(){

	},
	showImgSize:function(){
		$('.small').hide();
		$('.big').show();
		$('.img_piece').addClass('background-size-normal');
	},
	showFullScreen:function(){
		$('.small').show();
		$('.big').hide();
		$('.img_piece').removeClass('background-size-normal');
	},
	pieceMouseover:function(e){
		var target = $(e.currentTarget);
		target.stop(true,true)
		target.animate({opacity:0.3},200);
		target.find('.piece_other_button').css({'display':'block'});
	},
	pieceMouseout:function(e){
		var target = $(e.currentTarget);
		target.animate({opacity:0},1000);
		target.find('.piece_other_button').css({'display':'none'});
	},
	showClose:function(){
		$('.around-close').show();
	},
	hideClose:function(){
		$('.around-close').hide();
	},
	clear:function(e){
		console.log('clear');
		// if($('body').hasClass('rounding-mode')){
		e.stopPropagation();

		var el = $(e.currentTarget).parent();

		$('.around-close').hide().remove();
		//each

		$('.piece').each(function(){
			var random = Math.random(),
				random2 = Math.random(),
				time = random * 400,
				plus;
			// random the direction
			Math.ceil(random*10)%2==0? plus=1:plus=-1;
			var	transform = 'rotate(' + 20*random*plus + 'deg)';
			var transformOrigin =  Math.round(random)*50+'px '+ Math.round(random2)*50+'px';

			$(this).css({'transformOrigin':transformOrigin}).animate({
					'transform':transform,
				},250,function(){
					$(this).addClass('animation-whenDrop');
			});
			$(this).find('img_piece').addClass('animation-scale80pNobounce');
		});

		// $('body').removeClass('rounding-mode');
		// }
	},
});

var app = new BgView();
var app2 = new DragBoxView();
var app3 = new AroundView();
var app4 = new ImgView();

// $('#links').addClass('animation-aroundCreate');
});
