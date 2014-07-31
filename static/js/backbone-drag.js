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
		this.drag = __bind(this.drag, this);
		this.stopDrag = __bind(this.stopDrag, this);
	},
	events:{
		// "mousedown .drag": "startDrag"
	},
	startDrag:function(e){
    	// ele.removeClass("animate spin");
    	if (this.isDragging) {
    	  return;
    	}
    	var ele = $(e.currentTarget);
    	// this.$el.removeClass("animate spin");
    	this.isDragging = true;
    	this.ele = ele;
    	this.dragStartPos = {
    	  x: e.clientX,
    	  y: e.clientY
    	};
    	this.boxStartPos = {
    	  x: ele.offset().left + ele.width() / 2,
    	  y: ele.offset().top + ele.height() / 2
    	};
    	this.grabOffset = {
    	  x: e.offsetX - ele.width() / 2,
    	  y: e.offsetY - ele.height() / 2
    	};
    	this.grabDistance = Math.sqrt(Math.pow(this.grabOffset.x, 2) + Math.pow(this.grabOffset.y, 2));
    	ele.css("transform-origin", "" + e.offsetX + "px " + e.offsetY + "px");
    	this.dragOffset = null;
    	// $(document).on({
    	//   "mousemove.drag": this.drag,
    	//   "mouseup.drag": this.stopDrag
    	// });
    	return $("body").addClass("dragging");
	},
	drag:function(e){
		console.log(e);
		var angle, centerDelta, centerDistance, dampenedDistance, delta, determinant, distance, dotProduct;
    	delta = {
    	  x: e.clientX - this.dragStartPos.x,
    	  y: e.clientY - this.dragStartPos.y
    	};
    	distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
    	dampenedDistance = 500 * (1 - Math.pow(Math.E, -0.002 * distance));
    	angle = Math.atan2(delta.y, delta.x);
    	if (this.grabDistance > 10) {
    	  centerDelta = {
    	    x: e.clientX - this.boxStartPos.x,
    	    y: e.clientY - this.boxStartPos.y
    	  };
    	  centerDistance = Math.sqrt(Math.pow(centerDelta.x, 2) + Math.pow(centerDelta.y, 2));
    	  dotProduct = centerDelta.x * this.grabOffset.x + centerDelta.y * this.grabOffset.y;
    	  determinant = centerDelta.x * this.grabOffset.y - centerDelta.y * this.grabOffset.x;
    	  this.dragAngle = -Math.atan2(determinant, dotProduct);
    	} else {
    	  this.dragAngle = 0;
    	}
    	this.dragOffset = {
    	  x: Math.round(Math.cos(angle) * dampenedDistance),
    	  y: Math.round(Math.sin(angle) * dampenedDistance)
    	};

    	return $(this.ele).css("transform", "translate(" + (Math.round(this.dragOffset.x)) + "px, " + (Math.round(this.dragOffset.y)) + "px)\nrotate(" + (this.dragAngle.toPrecision(2)) + "rad)");
	},
	stopDrag:function(e){
    var bounce, correction, cos, deg, sin;
    var __modulo = function(a, b) { return (a % b + +b) % b; };
    if (!this.isDragging) {return;}
    this.isDragging = false;
    if (this.dragOffset) {
      cos = Math.cos(this.dragAngle);
      sin = Math.sin(this.dragAngle);
      correction = {
        x: this.grabOffset.x - (this.grabOffset.x * cos - this.grabOffset.y * sin),
        y: this.grabOffset.y - (this.grabOffset.x * sin + this.grabOffset.y * cos)
      };
      this.ele.css({"transform-origin":"","transform":""});
      // this.ele.css("transform", "translate(" + (this.dragOffset.x + correction.x) + "px, " + (this.dragOffset.y + correction.y) + "px)\nrotate(" + this.dragAngle + "rad)");
      // this.ele.css({"left":e.clientX,"top":e.clientY});

      deg = this.dragAngle / Math.PI * 180;

      if (__modulo(deg, 90) > 45) {
        deg += 90 - __modulo(deg, 90);
      } else {
        deg -= __modulo(deg, 90);
      }
    }
    $(document).off(".drag");
    return $("body").removeClass("dragging");
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
			$(this).attr({'x':arr[count][0],'y':arr[count][1]}).css({'left':arr[count][0]*101+'px','top':arr[count][1]*101+'px'});
			count++;
		});
		
		return;
	},
	createRandomArr:function(){
		var w_count = Math.ceil(get_wh().w/101),
			h_count = Math.ceil(get_wh().h/101),
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
	template: _.template($('#around-template').html()),
	events:{
		'click #links' : 'aroundFun',
		'click .around-close' : 'aroundClr',
		'mouseover .around-close' : 'mouseoverClose',
		'mouseout .around-close' : 'mouseoutClose'

	},
	initialize:function(){
		var t = this;
		this.list = new AroundModelList();
	},
	render:function(args){
		this.id.append(this.template(args));
	},
	test:function(){
		alert('test');
	},
	// fetch_fun:function(){
	// 	links.fetch({
	// 		add:'true',
	// 		data:{
	// 			skip:3
	// 		},
	// 		success:function(collection,res){
	// 			var i =0
	// 			// collection.each(function(links){
	// 			for(var j=0;j<collection.length;j++){	
	// 				if(i<3){
	// 					i++;
	// 					break;
	// 				}
	// 				console.log(collection);
	// 			};
	// 			return collection;
	// 		},
	// 		error:function(collection,res){
	// 			console.log('aroung view get json error,please check the json file');
	// 		}
	// 	})
	// },
	mouseoverClose:function(e){
		var el = $(e.currentTarget);
	},
	mouseOutClose:function(e){
		var el = $(e.currentTarget);
	},
	aroundClr:function(e){
		e.stopPropagation();
		var el = $(e.currentTarget);
		$('.around-close').hide().remove();
		$('.around-box').each(function(){
			var random = Math.random()*10;
			// $(this).delay(random*1000).addClass('hinge animated');
			$(this).delay(random*10).animate({'opacity':1},function(){
				if(parseInt(random) % 2 == 0){
					// console.log('left');
					$(this).addClass('dragDownLeft animated');
				}else{
					// console.log('right');
					$(this).addClass('dragDownRight animated');
				}
			});
		});
		$('#region .drag').each(function(){
			if(!$(this).hasClass('arounding')){
				$(this).show();
				$(this).addClass('animation-target');
			}
		});
		
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
			console.log(arr);
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
			// n<5? n=5:n=n; 
			while(arr.length<args.num){
				var append_arr = this.createSimpleArr(n);
				append_arr.sort(function(){return 0.5 - Math.random()});
				for(var k=0;k<append_arr.length;k++){
					var simple_arr2 = this.arr_plus(append_arr[k],start);
					this.more9Push(arr,simple_arr2,args);
				}	
				n++;
				console.log(arr.length);
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

		$('.around-box').each(function(){
			$(this).css({
				'left': el.attr('x')*101+'px',
				'top' : el.attr('y')*101+'px',
				'transform' :'rotate(90deg)'
			});
			$(this).animate({
				'left':arr[i][0]*101+'px',
				'top':arr[i][1]*101+'px',
				transform:'rotate(0)'
				// 'rotate':'30deg'
			},200).attr({'x':arr[i][0],'y':arr[i][1]});


			i++;
		});
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
// links.bind('reset', function () { console.log(123); });

var app = new BgView();
var app2 = new DragBoxView();
var app3 = new AroundView();
});
