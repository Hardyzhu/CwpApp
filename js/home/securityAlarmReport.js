mui.init({
		swipeBack:true 
	});

mui.plusReady(function(){
	//获取登录信息
	var oSwit = document.getElementById('mui-swit');
	var oTextarea = document.getElementById('textarea');
	var isLogin = plus.storage.getItem("userInfo");
	var self = plus.webview.currentWebview();
	var warningEventId="";
	var warningCategoryId="";
	var eventProgress="3";
	//预加载
	var detailPage = null;
	if(!detailPage){
		detailPage= mui.preload({
		     url:"securityAlarmDetail.html",
		     id:"securityAlarmDetail"
		});
	}
	/*if(isLogin){
		window.addEventListener('getReport',function(event){
			console.log("勘察报告");
			qmask.show();
			
			var oDeal = document.getElementById('dealTmpl');
			var dealHtml = template('dealTmp', event.detail.result);
			oDeal.innerHTML = dealHtml;
			qmask.hide();
			console.log(event.detail.result);
			warningEventId = event.detail.result.warningEventId;
			warningCategoryId = event.detail.result.warningCategoryId;
			oTextarea.value = event.detail.result.liveDescribe;
			console.log("告警ID："+warningEventId);
			console.log("告警类别ID："+warningCategoryId);
		});
	}*/
	if(self.result){
		qmask.show();					
		var oDeal = document.getElementById('dealTmpl');
		template.helper('dealerFormat',function(inp){
					if(inp==1){
						return '未处理';
					}else if(inp==2){
						return '处理中';
					}else{
						return '已完成';
					}
				});
		template.helper('colorFormat',function(inp){
			if(inp == 0){
				return 'blueColor';
			}else if(inp==1){
				return 'yellowColor';
			}else if(inp==2){
				return 'orangeColor';
			}else{
				return 'redColor';
			}
		});
		var dealHtml = template('dealTmp', self.result);
		oDeal.innerHTML = dealHtml;
		qmask.hide();
		console.log(self.result);
		warningEventId = self.result.warningEventId;
		warningCategoryId = self.warningCategoryId;
		oTextarea.value = self.result.liveDescribe;
	}
	
	//监听事件
	
	oSwit.addEventListener('toggle', function(event) {
		 eventProgress = event.detail.isActive ? '4' : '3';
	});
	
	

	document.getElementById('subit').addEventListener('tap',function(){
		qmask.show();
		var liveDescribe = oTextarea.value;
		console.log("告警ID:"+warningEventId );
		console.log("告警描述:"+liveDescribe);
		console.log("用户ID:"+JSON.parse(isLogin).userId);
		console.log("事件级别:"+eventProgress);
		mui.ajax({
			type: "post",
			url: global_url+"/cwp/front/sh/warningEvent!execute",
			async: true,
			data: {
				uid:"c025",							
				warningEventId:warningEventId,
				handleOpinion :liveDescribe,
				handleId:JSON.parse(isLogin).userId,
				eventProgress:eventProgress,
				updateOrDetail:"2"
			},
			dataType: "json",
			timeout: 1000000,
			success: function(data) {
				mui.toast('提交成功!');
				//预加载子页面
				//plus.nativeUI.showWaiting();

				console.log("提交告警ID："+warningEventId);
				console.log("提交告警类型ID："+warningCategoryId);
				mui.fire(detailPage,'detailId',{
				    warningEventId:warningEventId,
				    warningCategoryId:warningCategoryId
				});
				setTimeout(function() {
					mui.back();
					qmask.hide();
				}, 200);
			
				/*mui.openWindow({
				  id:'securityAlarmDetail',
				  waiting: {
					autoShow: false
				  },
				  createNew:true,
				});*/
			},
			error: function(xhr, type, errorThrown) {
				if(type=='timeout'){
					mui.toast('提交超时:请检查网络!');
				}else{
					mui.toast('提交失败!');
				}
				qmask.hide();
			}
		});
	});
});