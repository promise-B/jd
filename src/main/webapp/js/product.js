$(document).ready(function(){	
	
	//获取用户uid
	var uid = sessionStorage.uid;
	//获取三级商品cid
	var cid = location.href.substr(location.href.indexOf('=')+1);
	
//	//截取路径中?后的内容   ?cid=cid&shopid=shopid
//	var str = location.href.substr(location.href.indexOf('?')+1)
//	//分隔   cid=cid&shopid=shopid
//	var arr = str.split('&');
//	
//	var cid
//	var shopid
//	for(var i=0;i<arr.length;i++){		
//		if(arr[i].indexOf('cid')>-1){
//			cid = arr[i].substr(arr[i].indexOf('=')+1);
//		}
//		if(arr[i].indexOf('shopid')>-1){
//			shopid = arr[i].substr(arr[i].indexOf('=')+1);
//		}
//	}
	//初始化：根据传入的三级商品cid，查询三级商品表信息
	$.ajax({
		url: 'selectCommodityByCid/' + cid,
		type: 'post',
		data: {},
		dataType: 'json',
		async:false,
		success: function(data) {
			console.log(data);
			var cdata = "<div id='mid_head' data-id='"+data.id+"'>" +
							"<img src="+data.imgurl+" />" + 
							"<div id='mid_price'>" +
								"<div>&yen;<span>"+data.price+"</span>.00</div>" + 
								"<div id='mid_collections'>" +
									"<div><img src='img/product-JJTZ.png' /><p>降价提醒</p></div>" + 
									"<div id='collections'><img id='collections_img' src='img/product-GZ.png' /><p>关注</p></div>" +
								"</div>" + 
							"</div>" + 
							"<div id='mid_name'><img src='img/product-ZY.png' />"+data.name+"</div>" +
							"<div id='mid_description'>"+data.description+"</div>" +
						"</div>";
			var ddata = "<div class='slide_title' data-id='"+data.id+"' data-shopid='"+data.shopid+"'>" +
							"<div class='slide_left'><img src='"+data.imgurl+"' /></div>" +
							"<div class='slide_right'>" +
								"<div class='slide_price'>&yen;<span>"+data.price+"</span>.00<img id='slide_close' src='img/product-XX.png' /></div>" + 
								"<div class='slide_name'><span>已选</span>&nbsp;"+data.name+"</div>" +
							"</div>" + 	
						"</div>";
			$("#mid").prepend(cdata);
			$("#slide").prepend(ddata);	
		}
	});	
	var shopid = $(".slide_title").attr("data-shopid");
	//初始化：根据传入的三级商品cid，查询三级商品尺寸表
	$.ajax({
		url: 'selectSizeByCid/' + cid,
		type: 'post',
		data: {},
		dataType: 'json',
		async:false,
		success: function(data) {
			console.log(data);
			var cdata = "<div class='size' id='default' data-id='"+data[0].id+"'>"+data[0].size+"</div>"			
			$(".slide_sizelist").append(cdata);
			for(var i=1;i<data.length;i++){
				var ddata = "<div class='size' data-id='"+data[i].id+"'>"+data[i].size+"</div>"
				$(".slide_sizelist").append(ddata);
			};
			var sizedata = "<span id='mid_size' data-id='"+data[0].id+"'>"+data[0].size+"</span>"
			$("#mid_sizeandcolor").prepend(sizedata);
		}
	});	
	var sizeid = $("#default").attr("data-id");
	//改变型号样式
	$(document).on("click",".size",function(){
		$(".size").css("color","black");
		$(".size").css("background-color","#c3c3c3");
		sizeid = $(this).attr("data-id");
		$(this).css("color","white");
		$(this).css("background-color","red");
		$("#mid_size").html($(this).html())
		$("#count").val("1");
	})
	//初始化：根据传入的三级商品cid，查询三级商品颜色表
	$.ajax({
		url: 'selectColorByCid/' + cid,
		type: 'post',
		data: {},
		dataType: 'json',
		async:false,
		success: function(data) {
			console.log(data);
			var cdata = "<div id='default' class='color' data-id='"+data[0].id+"'>"+data[0].color+"</div>"
			$(".slide_colorlist").append(cdata);
			for(var i=1;i<data.length;i++){
				var ddata = "<div class='color' data-id='"+data[i].id+"'>"+data[i].color+"</div>"
				$(".slide_colorlist").append(ddata);
			}
			var colordata = "<span id='mid_color' data-id='"+data[0].id+"'>"+data[0].color+",</span>"
			$("#mid_sizeandcolor").prepend(colordata);
		}
	});	
	var colorid = $("#default").attr("data-id");
	//改变颜色样式
	$(document).on("click",".color",function(){
		$(".color").css("color","black");
		$(".color").css("background-color","#c3c3c3");
		colorid = $(this).attr("data-id");
		$(this).css("color","white");
		$(this).css("background-color","red");
		$("#mid_color").html($(this).html()+",")
		$("#count").val("1");
	})
	//初始化：根据获取的用户uid，查询用户表地址
	$.ajax({
		url: 'selectUserByUid/' + uid,
		type: 'post',
		data: {},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			$("#adress").html(data.address);
		}
	});	
	
	//获取购买商品数量值
	var count = 1;
	$("#reduce").click(function(){
		var count = $("#count").val()
		if(count>1){
			count--;
			$("#count").val(count);
			$("#mid_count").html(count);
		}
	})
	$("#add").click(function(){
		var count = $("#count").val()
		count++;
		$("#count").val(count);	
		$("#mid_count").html(count);
	})
	
	//初始化商品信息页面后，在浏览记录表上传一条数据，传入用户uid、商品cid、当前系统时间
	$.ajax({
		url: 'insertRecord/' + uid + '/' + cid,
		type: 'post',
		data: {},
		dataType: 'json',
		success: function(data) {
			console.log(data);
		}
	});	
		
	//点击收藏按钮后，在商品收藏表上传一条数据，传入用户uid、商品cid、当前系统时间
	$(document).on("click","#collections",function(){
		$.ajax({
			url: 'insertCollections/' + uid + '/' + cid,
			type: 'post',
			data: {},
			dataType: 'json',
			success: function(data) {
				console.log(data);
				$("#collections_img").attr("src","img/product-GZ1.png");
			}
		});
	});
	
	//购物车购买动画效果
	$(document).on("click","#mid_purchase",function(){
		$("#slide").slideToggle("slow");
		$("#mid").css("filter","brightness(0.4)");
	})
	$("#bottom_right").click(function(){
		$("#slide").slideToggle("slow");
		$("#mid").css("filter","brightness(0.4)");
	})
	$(document).on("click","#slide_close",function(){
		$("#slide").slideToggle("slow");
		$("#mid").css("filter","none");
	})	
	//购物车动画效果，在购物车表上传一条数据，传入用户uid、商品cid、型号sizeid、颜色colorid、购买数量count、当前系统时间
	$("#slide_car").click(function(){
		$("#shoppingcart").fadeToggle(1500);
		$("#shoppingcart").fadeToggle(1500);
		$.ajax({
			url: 'insertShoppingCart/'+uid+'/'+cid+'/'+sizeid+'/'+colorid+'/'+count,
			type: 'post',
			data: {},
			dataType: 'json',
			success: function(data) {
				console.log(data);				
			}
		});
	})
	//购买动画效果，在订单表上传一条数据，传入用户uid、商品cid、购买数量count、是否已评价、当前系统时间
	$("#slide_buy").click(function(){
		$("#purchase").fadeToggle(1500);
		$("#purchase").fadeToggle(1500);
		$.ajax({
			url: 'insertOrders/'+uid+'/'+cid+'/'+count,
			type: 'post',
			data: {},
			dataType: 'json',
			success: function(data) {
				console.log(data);				
			}
		});
	})
	
	//上方返回功能
	$("#top_return").click(function(){
		history.back();
	})
	//上方页面切换
	$("#detail").click(function(){
		location.replace("detail.html?cid="+cid);
	})
	$("#evaluation").click(function(){
		location.replace("evaluation.html?cid="+cid);
	})
	//下方页面切换
	$("#left_shop").click(function(){
		location.href="shop.html?shopid="+shopid;
	})
	$("#left_shoppingcart").click(function(){
		location.href="shoppingcart.html";
	})
	
})
