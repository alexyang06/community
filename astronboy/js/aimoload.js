/**
 * Javascript Image Delay load
 *
 * @author Eric,<wangyinglei@yeah.net>
 */
(function(){
	//预定义变量，减小代码体积
	var _ = document,
		A = _.compatMode,
		B = _.body,
		C = _.documentElement;

	//Constructor
	function AimoLoad(e){
		//要处理的包含延迟加载图片的容器
		this.area = e ?  this.get(e) : _;
		//需要延迟加载的所有图片对象
		this.imgs = [];
		//获取所有的需要延迟加载的图片对象
		this.getImages();
		console.log(this.imgs);
		//执行判断 条件成立 载入图片
		this.run();
	}
	AimoLoad.prototype = {
		'get' : function(e){
			return typeof(e)=='string' ? _.getElementById(e) : e;
		},
		'getImages' : function(){
			var i = 0, 
				imgs = this.area.getElementsByTagName('img'),
				l = imgs.length;
			for ( ; i < l; i++) {
				if(imgs[i].getAttribute('bigsrc')){
					this.imgs.push(imgs[i]);
				}
			}
		},
		'getPosition' : function(el){
			var x = 0, y = 0;;
			if (el.getBoundingClientRect) {
				var box = el.getBoundingClientRect(),
					el = (A != "CSS1Compat") ? 
					_.body : C;
				x = box.left + el.scrollLeft - el.clientLeft;
				y = box.top + el.scrollTop - el.clientTop;
			} else {
				x = el.offsetLeft;
				y = el.offsetTop;
				var parent = el.offsetParent;
				while (parent) {
					x += parent.offsetLeft;
					y += parent.offsetTop;
					parent = parent.offsetParent;
				}
			}
			return {'x' : x, 'y' : y};
		},
		'defined' : function(o){
			return (typeof(o)!="undefined");
		},
		'zeroFix' : function(n){
			return (!this.defined(n) || isNaN(n))? 0 : n;
		},
		'getVisibileHeight' : function(){
			var cm = C && (!A || A=="CSS1Compat");
			if (!window.opera && cm) {
				return C.clientHeight;
			} else if (A && !window.opera && B) {
				return B.clientHeight;
			}
			return this.zeroFix(self.innerHeight);
		},
		'getScrollTop' : function(){
			if (C && this.defined(C.scrollTop) && C.scrollTop>0) {
				return C.scrollTop;
			}
			if (B && this.defined(B.scrollTop)) {
				return B.scrollTop;
			}
			return 0;
		},
		'run' : function(){
			//var _resize = window.onresize || function(){}, 
			//	_scroll = window.onscroll || function(){};
			var	_self = this,
				delayLoad = function(){
					var i = 0,
						m = _self.imgs,
						l = _self.imgs.length,
						y = _self.getVisibileHeight(),
						t = _self.getScrollTop();
					for( ; i < l; i++){
						(function(i){
							var pos = _self.getPosition(m[i]);
							if(t + y > pos.y){
								if(!m[i].getAttribute('has')){
									m[i].setAttribute('src', m[i].getAttribute('bigsrc'));
									m[i].setAttribute('has','ok');
								}
							}
						})(i);
					}
				};
			$(window).on('scroll',function(){
				delayLoad();
			}).on('resize',function(){
				delayLoad();
			});
			/*
			window.onscroll = function(){
				//_scroll();
				delayLoad();
			};
			window.onresize = function(){
				//_resize();
				delayLoad();
			};*/
			delayLoad();
		}
	}
	window.AimoLoad = AimoLoad;
})();