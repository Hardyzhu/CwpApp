mui.init();
(function($) {
	//阻尼系数
	var deceleration = mui.os.ios?0.003:0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration:deceleration
	});
	$.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		var isLogin = plus.storage.getItem("userInfo");
		var userId=JSON.parse(isLogin).userId;
		var userRole=JSON.parse(isLogin).role[0].roleId;
		console.log("用户ID:"+userId)
		console.log("角色ID:"+userRole);
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			console.log($(pullRefreshEl).pullRefresh());
			console.log($(pullRefreshEl).pullRefresh().disablePullupToRefresh);
			$(pullRefreshEl).pullToRefresh({
				up: {
					auto:true,
					callback: function() {
						var _self = this;
						setTimeout(function() {
							var dataList = _self.element.querySelector('.mui-text-center');
							getProductList($(pullRefreshEl),_self,dataList, index, 5 ,userId);
							if(_self.mark !=undefined){
								_self.endPullUpToRefresh(_self.mark);
							}else{
								_self.endPullUpToRefresh();
							}
						}, 1000);
					}
				}
			});
		});
		var processing = document.getElementById("processing");;
		var processed = document.getElementById("processed");

		/**
		 * 跳转到详情页面
		 */
		mui('.mui-content').on('tap', '.goToDel', function(e) {
			qmask.show();
			var warningEventId = this.getAttribute("data-id");
			var warningCategoryId = this.getAttribute("data-uid");
			//判断是否有这个页面
			/*if(!detailPage){
			    detailPage = plus.webview.getWebviewById('securityAlarmDetail');
			}*/
			//自定义事件
	
			/*mui.fire(detailPage,'detailId',{
			    warningEventId:warningEventId,
			    warningCategoryId:warningCategoryId
			});*/
			/*setTimeout(function() {
				qmask.hide();
			}, 200);*/
			//打开页面
			mui.openWindow({
			  url:'../task/securityDetail.html',
			  id:'securityDetail',
			  waiting: {
				autoShow: false
			  },
			  extras: {
				warningEventId:warningEventId,
			    warningCategoryId:warningCategoryId
			  }
			});
		});
		
		//渲染数据
		function getProductList(_elem,_this,obj,index,pageSize,userId) { //获取工单列表
			qmask.show();
			console.log("得到用户ID："+userId);
			var totalLength = obj.querySelectorAll('.listData').length;
			var page = (totalLength-pageSize)/pageSize;
			page += 2;
			console.log(page);
			obj.user_id = '';
			if(JSON.parse(isLogin).role!=""||JSON.parse(isLogin).role!=0){
				for(var i = 0; i < JSON.parse(isLogin).role.length; i++){
					if(userRole=='8'||userRole=='12'){
						obj.user_id = '';
					}
					else if(userRole=='6'){
						switch(++index){
							case 1:	
								obj.user_id = '';
								break;
							case 2:		
								obj.user_id = userId;
								break;
							case 3:
								obj.user_id = userId;
								break;
						}
					}	
				}
			}
			console.log(index);
			mui.ajax({
				url: global_url+"/cwp/front/sh/warningEvent!execute",
				type: "post",
				async: true,
				data: {
					uid: 'c001',
					currentPage:page,
					pageSize:pageSize,
					dictValue:'', 
					eventProcessStatus:index,
					eventType:1,
					responseOfficerId:obj.user_id
				},
				dataType: "json",
				timeout: 1000000,
				success: function(data) {
					template.helper('dealerFormat',function(inp){
						if(inp==1){
							return '未处理';
						}else if(inp==2){
							return '处理中';
						}else{
							return '已恢复';
						}
					});
					var html = template('detailTmpl', data);
					obj.innerHTML += html;
					if(data.beans instanceof Array && data.beans.length<5){
						_this.mark = true;
						setTimeout(function(){
							mui.toast('没有更多数据了!');
							//_elem.pullRefresh().disablePullupToRefresh();
							//var tipHtml="<div class=t-norecord><i class='icon iconfont icon-baogaoyichuangjian'></i><p>暂无数据记录</p></div>";
							//mui(_this).innerHTML = tipHtml;
						},500);
						qmask.hide();
						return;
					}
					qmask.hide();
				},
				error: function(xhr, type, errorThrown) {
					if(type=='timeout'){
						mui.toast('请求超时:请检查网络!');
					}else {
						mui.toast('数据加载失败!');
					}
					qmask.hide();
				}
			});
		}
	});
})(mui);