mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					up: {
						auto:true,
						callback: pullupRefresh
					}
				}/*,
				preloadPages:[{                     //预加载页面		
				    id:'securityAlarmDetail',
				    url:'../task/securityAlarmDetail.html'
				}]*/
			});
			
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				var isLogin = plus.storage.getItem("userInfo");
				var userId=JSON.parse(isLogin).userId;
				var userRole=JSON.parse(isLogin).role[0].roleId;
				console.log("用户ID:"+userId)
				console.log("角色ID:"+userRole);
				var resHeight = window.innerHeight - 84;
				mui('.mui-control-content').each(function(){
					this.setAttribute("style","min-height:"+resHeight+"px;");
					var isActive = this.classList.contains('mui-active') ? true : false;
					if(isActive){
						var state = this.getAttribute('data-state');
						getProductList(state,'');
					}
				});
				
				var processing = document.getElementById("processing");;
				var processed = document.getElementById("processed");
				document.getElementById('slider').addEventListener('slide', function(e) {			
					if (e.detail.slideNumber === 1) {
						if (processing.querySelector('.mui-loading')) {
							if(JSON.parse(isLogin).role!=""||JSON.parse(isLogin).role!=0){
								for(var i = 0; i < JSON.parse(isLogin).role.length; i++){
									if(userRole=='8'||userRole=='12'){
										getProductList(2);
									}
									else if(userRole=='6'){
										getProductList(2,userId);
									}	
								}
							}
						
						}
					} else if (e.detail.slideNumber === 2) {
						if (processed.querySelector('.mui-loading')) {
							for(var i = 0; i < JSON.parse(isLogin).role.length; i++){
									if(userRole=='8'||userRole=='12'){
										getProductList(3,'');
									}
									else if(userRole=='6'){
										getProductList(3,userId);
									}	
							}
						}
					}
				});
				
				mui('.mui-scroll-wrapper').scroll({
			        indicators: true //是否显示滚动条
			    });
				/**
				 * 跳转到详情页面
				 */
				var detailPage = null;
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
					  url:'../task/securityAlarmDetail.html',
					  id:'securityAlarmDetail',
					  waiting: {
						autoShow: false
					  },
					  extras: {
						warningEventId:warningEventId,
					    warningCategoryId:warningCategoryId
					  }
					});
				});
			});
			var page = 1;
			var mark = false;
			//渲染数据
			function getProductList(eventProcessStatus,userId) { //获取工单列表
				console.log("得到用户ID："+userId);
				qmask.show();
				mui.ajax({
					url: global_url+"/cwp/front/sh/warningEvent!execute",
					type: "post",
					async: true,
					data: {
						uid: 'c016',
						currentPage:page,
						pageSize:'5',
						dictValue:'', 
						eventProcessStatus:eventProcessStatus,
						eventType:2,
						responseOfficerId:userId
					},
					dataType: "json",
					timeout: 1000000,
					success: function(data) {
						var getId="";		
						var oList = "";
						switch(eventProcessStatus){
							case 1:	
//								getId="untreatedList";
								oList = document.getElementById("untreatedList");
								break;
							case 2:		
//								getId="processingList";
								oList = document.getElementById("processingList");
								break;
							case 3:
//								getId="processedList";	
								oList = document.getElementById("processedList");
								break;
						}

						var html = template('detailTmpl', data);
						oList.innerHTML = html;
						if(data.beans instanceof Array && data.beans.length<5){
							mark = true;
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
							setTimeout(function(){
//								mui.toast('没有更多数据了!');
								var tipHtml="<div class=t-norecord><i class='icon iconfont icon-baogaoyichuangjian'></i><p>暂无数据记录</p></div>";
								switch(eventProcessStatus){
									case 1:			
										document.getElementById("untreatedList").innerHTML=tipHtml;
										break;
									case 2:	
										document.getElementById("processingList").innerHTML=tipHtml;
										break;
									case 3:
										document.getElementById("processedList").innerHTML=tipHtml;
										break;
								}
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
			
			/**
			 * 上拉加载具体业务实现
			 */
			function pullupRefresh() {
				if(!mark){
					qmask.show();
					setTimeout(function() {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(mark); //参数为true代表没有更多数据了。
						page++;
						getProductList(1,'');
					}, 1500);
				}
			}
			if (mui.os.plus) {
				mui.plusReady(function() {
					setTimeout(function() {
						mui('#pullrefresh').pullRefresh().pullupLoading();
					}, 1000);

				});
			} else {
				mui.ready(function() {
					mui('#pullrefresh').pullRefresh().pullupLoading();
				});
			}