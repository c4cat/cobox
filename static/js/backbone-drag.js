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
		$('#bg').css({'width':get_wh().w,'height':get_wh().h});
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
			$(this).data({'x':arr[count][0],'y':arr[count][1]}).css({'left':arr[count][0]*101+'px','top':arr[count][1]*101+'px'});
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
		console.log('AroundModel create!');
	}
});

var AroundModelList = Backbone.Collection.extend({
	model:AroundModel,
	url:'links.json'
});

var links = new AroundModelList();


var AroundView = Backbone.View.extend({
	el:$('#around-container'),
	template: _.template($('#around-template').html()),
	events:{
		'click #links' : "aroundShow"
	},
	initialize:function(){
		var t = this;
		links.fetch({
			success:function(collection,response){
				collection.each(function(links){
					console.log(links.get('name'));
					t.render(links.attributes);
				});
				// console.log(this.co);
				return collection;
			},
			error:function(collection, response){
					console.log(collection);
					console.log(response);
					alert('aroung view get json error,please check the json file');
				}
		});

		this.list = new AroundModelList();
		//event listen on
		$('#links').on("click",this.aroundFun);
	},
	render:function(args){
		console.log(args);
		this.$el.append(this.template(args));
	},
	test:function(){
		alert('test');
	},
	aroundFun:function(e){
		console.log(e);
		// var numOfBoxFromLeft = Math.ceil(parseInt($(this).css('left'))/101),
		// 	   numOfBoxFromTop = Math.ceil(parseInt($(this).css('top'))/101);
		var numLeft = $(this).data('x'),
			numTop = $(this).data('y'),
			count = 3;

		this.aroundPosition();	
	},
	aroundSet:function(args){

	},
	createArr:function(args){
		var arr = [],
			x_random = _.random(0,args.count),
			y_random = _.random(0,h_count-2);

		if(args.count < 5){
			for(var i=0;i<args.count;i++){
				for(var j=0;j<5;j++){
					var xyz_x = args. 

				}
			}
		}		

		return([w_random,h_random]);
	},
	baseArr:function(){
		
	},
	inOrNot:function(obj,arr){
		for(var i=0;i<arr.length;i++){
 			if(obj.toString() == arr[i].toString()){
 					return true;
 				}
			}
		return false;	
	},
});


	/**
     * 生成矩阵
     * @param h 高
     * @param w 宽
     * @returns {Array}
     */
    function getMap(h, w) {
        var max = h * w,
            map = [],
            row = [],
            t,
            l,
            i,
            dir = 'r';
        for (t = 1; t <= h; t++) {
            row = [];
            for (l = 1; l <= w; l++) {
                row.push(null);
            }
            map.push(row);
        }
        ~function (n, t, l) {
            var next,
                next_t,
                next_l;
            map[t][l] = n;
            switch (dir) {
                case 'r':
                    next = map[t] === undefined ? undefined : map[t][l + 1];
                    next_t = t;
                    next_l = l + 1;
                    break;
                case 'b':
                    next = map[t + 1] === undefined ? undefined : map[t + 1][l];
                    next_t = t + 1;
                    next_l = l;
                    break;
                case 'l':
                    next = map[t] === undefined ? undefined : map[t][l - 1];
                    next_t = t;
                    next_l = l - 1;
                    break;
                case 't':
                    next = map[t - 1] === undefined ? undefined : map[t - 1][l];
                    next_t = t - 1;
                    next_l = l;
                    break;
            }
            if (next !== null) {
                switch (dir) {
                    case 'r':
                        dir = 'b';
                        next = map[t + 1][l];
                        next_t = t + 1;
                        next_l = l;
                        break;
                    case 'b':
                        dir = 'l';
                        next = map[t][l - 1];
                        next_t = t;
                        next_l = l - 1;
                        break;
                    case 'l':
                        dir = 't';
                        next = map[t - 1][l];
                        next_t = t -1;
                        next_l = l;
                        break;
                    case 't':
                        dir = 'r';
                        next = map[t][l + 1];
                        next_t = t;
                        next_l = l + 1;
                        break;
                }
            }
            if (n - 1 > 0) {
                arguments.callee(n - 1, next_t, next_l);
            }
        }(max, 0 ,0);
        return map;
    }

    /**
     *       输出
     * @param map
     */
    function showMap(map) {
        var htmlSt = '<table>';
        for (var i = 0, len = map.length; i < len; i++) {
            var trSt = '<tr>'
            for (var j = 0, rowlen = map[i].length; j<rowlen; j++) {
                htmlSt += '<td>' + map[i][j] + '</td>';
            }
            trSt += '</tr>';
            htmlSt += trSt;
        }
        document.write(htmlSt);
    }
    var a = getMap(4, 4);
    // showMap(a);

// links.bind('reset', function () { console.log(123); });

var app = new BgView();
var app2 = new DragBoxView();
var app3 = new AroundView();

});
