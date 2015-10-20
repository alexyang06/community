if(typeof(guest)!== "undefined"  ){
		$.ajaxSetup({
			  data: {'guest':guest}
			});
		
}	


$(function() {
	$(document).on("click", ".ajax-post",
	function(d) {
		d.preventDefault();
		var b = $(this).attr("href");
		var c = $(this).attr("data-confirm");
		if (c) {
			var a = confirm(c);
			if (!a) {
				return false
			}
		}
		$.post(b, {},
		function(f, e, g) {
			handleAjax(f)
		})
	});
	$(document).on("submit", "form.ajax-form",
	function(f) {
		f.preventDefault();
		if (typeof checkform == "function") {
			if (checkform() == false) {
				return false
			}
		}
		var b = $(this);
		$("[type=submit]", b).addClass("disabled").attr("disabled", "true");
		var d = $(this).attr("action");
		var g = $(this).attr("method");
		if (!d) {
			return false
		}
		if (!g) {
			g = "get"
		}
		var c = $(this).serialize();
		var a;
		if (g == "post") {
			a = $.post
		} else {
			a = $.get
		}
		a(d, c,
		function(e) {
			handleAjax(e);
			$("[type=submit]", b).removeClass("disabled").removeAttr("disabled")
		},
		"json");
		return false
	})
});
function uaredirect(i) {
	try {
		if (document.getElementById("bdmark") != null) {
			return
		}
		var g = false;
		if (arguments[1]) {
			var j = window.location.host;
			var h = window.location.href;
			if (isSubdomain(arguments[1], j) == 1) {
				i = i + "/#m/" + h;
				g = true
			} else {
				if (isSubdomain(arguments[1], j) == 2) {
					i = i + "/#m/" + h;
					g = true
				} else {
					i = h;
					g = false
				}
			}
		} else {
			g = true
		}
		if (g) {
			var l = window.location.hash;
			if (!l.match("fromapp")) {
				if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i))) {
					location.replace(i)
				}
			}
		}
	} catch(k) {}
}
function isSubdomain(h, g) {
	this.getdomain = function(c) {
		var d = c.indexOf("://");
		if (d > 0) {
			var a = c.substr(d + 3)
		} else {
			var a = c
		}
		var b = /^www\./;
		if (b.test(a)) {
			a = a.substr(4)
		}
		return a
	};
	if (h == g) {
		return 1
	} else {
		var h = this.getdomain(h);
		var e = this.getdomain(g);
		if (h == e) {
			return 1
		} else {
			h = h.replace(".", "\\.");
			var f = new RegExp("\\." + h + "$");
			if (e.match(f)) {
				return 2
			} else {
				return 0
			}
		}
	}
}
function op_success(b, a) {
	toastr.options = {
		"debug": false,
		"positionClass": "toast-center",
		"onclick": null,
		"showDuration": "1000",
		"hideDuration": "1000",
		"timeOut": "2000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};
	toastr.success(b, a)
}
function op_error(b, a) {
	toastr.options = {
		"debug": false,
		"positionClass": "toast-center",
		"onclick": null,
		"showDuration": "1000",
		"hideDuration": "1000",
		"timeOut": "2000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};
	toastr.error(b, a)
}
function handleAjax(b) {
	if (b.url) {
		b.info += "，页面即将跳转～"
	}
	if (b.status == 1) {
		if (b.msg) {
			op_success(b.msg, "温馨提示")
		}
		if (b.html) {
			$("#mes_con").prepend(b.html).hide().fadeIn("slow")
		}
	} else {
		op_error(b.msg, "温馨提示")
	}
	var c = 1500;
	if (b.url == "refresh") {
		setTimeout(function() {
			location.href = location.href
		},
		c)
	} else {
		if (b.url) {
			setTimeout(function() {
				location.href = b.url
			},
			c)
		}
	}
};
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
	} 
function trial(open){
	if(open == 1){
		layer.open({
		style:'background-color:rgba(16, 16, 16, 0.48); color:#fff;',
		shadeClose: false,
	    title: [
	        ''
	    ],
	    content: '<p>您目前使用的是免费试用版喜帖</p><p>部分功能有限制</p><p>请向商家索取制作码</p><p>升级后效果更佳</p><input type="text" class="xt_control" name="xt_code" placeholder="如需升级请输入制作码" ><input type="button" onclick="cu($(this));" id="btn" value="提交" />'		
		});
	}
}
function cu(e){
	var that = e;
	var c = $("input[name=xt_code]").val();
	var id = getQueryString('id');
	if(isNaN(c)){
		alert('您输入的制作码不正确~，请重新填写');
		return;
	}
	if(c.length !== 12){
		alert('您输入的制作码位数错误~，请重新确认后填写~');
		return;
	}
	
	if(isNaN(id)){
		alert('然而该喜帖并不存在~');
		return;
	}
	$.ajax({
		  type: 'POST',
		  url: '/create.php?ctl=create&act=no_login_update',
		  data: {id:id,c:c},
		  dataType: 'json',
		  beforeSend: function(){
			  that.attr("disabled", true);
			  that.val('验证中...');
		  },
		  success: function(obj){
			  if(obj.status == 200){
				  isTrial=0;
				  that.attr("disabled", false);
				  alert('验证成功');
				  layer.closeAll();
			  }else{
				  that.val('重新验证');
				  that.removeAttr("disabled");
				  alert('验证失败,请重新输入');
				  $("input[name=xt_code]").val("");
				  //layer.closeAll();
			  }
			
			//  op_success(obj.msg, "温馨提示")
		  }
		 
		});
}
$(document).ready(function(){
trial(isTrial);

});
