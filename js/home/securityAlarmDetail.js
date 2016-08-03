mui.init();
mui.plusReady(function(){
	//获取登录信息
	var isLogin = plus.storage.getItem("userInfo");
	var userRole=JSON.parse(isLogin).role[0].roleId;
	console.log("角色ID:"+userRole);
	var self = plus.webview.currentWebview();
	//预加载
	//var reportPage = null;
	/*if(!reportPage){
		reportPage = mui.preload({
		    id:'securityAlarmReport',
	    	url:'securityAlarmReport.html'
		});
	}*/
	var warningEventId;
	var warningCategoryId;
	//添加newId自定义事件监听
	if(self.warningEventId!=''){
		warningEventId = self.warningEventId;
		warningCategoryId = self.warningCategoryId;
		//信息部分
		if(warningCategoryId==undefined) warningCategoryId="";
	 	res(warningEventId,warningCategoryId,1,1);
	}
	window.addEventListener('detailId',function(event){
		warningEventId = event.detail.warningEventId;
		warningCategoryId = event.detail.warningCategoryId;
		//信息部分
		if(warningCategoryId==undefined) warningCategoryId="";
	 	res(warningEventId,warningCategoryId,1,1);
	});
	
	//渲染刷新部分
	/**
	 * eventProgress  3代表已接受 ，1
	 * updateOrDetail 1，详情，2，接受
	 */
	function res(warningEventId,warningCategoryId,updateOrDetail,eventProgress){
		console.log("详情告警ID:"+warningEventId);
		console.log("详情告警ID:"+warningCategoryId);
		console.log("详情告警ID:"+updateOrDetail);
		console.log("详情事件级别ID:"+eventProgress);
		qmask.show();
		mui.ajax({
			type: "post",
			url: global_url+"/cwp/front/sh/warningEvent!execute",
			async: true,
			data: {
				uid:"c025",
				warningEventId:warningEventId,
				warningCategoryId:warningCategoryId,
				updateOrDetail:updateOrDetail,
				responseOfficerId:JSON.parse(isLogin).userId,
				eventProgress:eventProgress
			},
			dataType: "json",
			timeout: 1000000,
			success: function(data) {							
				if(updateOrDetail==1){
					mui.toast('查询成功!');
				}else{
					mui.toast('接受成功!');
				}
				var oBtoo = document.getElementById('btooTmpl');
				var oDeal = document.getElementById('dealTmpl');
				var oDault = document.getElementById('dataDault');
				var oPosone = document.getElementById('posoneTmpl');
				template.helper('toGet',function(inp){
					if(inp==''||inp==null){
						return '抢单';
					}else{
						return '已接单';
					}
				});
				template.helper('dealerFormat',function(inp){
					if(inp==1){
						return '未处理';
					}else if(inp==2){
						return '处理中';
					}else{
						return '已处理';
					}
				});
				//通知人
//				template.helper('noticeName',function(inp){
//					var roleList=data.bean.appPush;
//					if(roleList!="")
//					{
//						var noticeNameArray=roleList.split(',');
//						noticeName=noticeNameArray[1]+"<br/>"+noticeNameArray[0];
//					}
//					return noticeName;
//					
//				});
				template.helper('toIndexOf',function(inp){
					console.log(inp.length);
					console.log(inp.lastIndexOf(','));
					if((inp.length-1)==inp.lastIndexOf(',')){
						var b = inp.substring(0,inp.length-1);	
						return b.replace(/\,/g,'/');
					}else{
						return inp.replace(/\,/g,'/');
					}
					
				});
				//设备类型
			
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
				template.helper('toState',function(inp){
					if(inp==4){
						return '转故障';
					}
				});
				template.helper('sFormat',function(inp,iAttr){
					if(inp==null||inp==''){
						if(iAttr==1){
							return 'comp';
						}else{
							return 'conp';	
						}
					}
				});
				//加入角色信息
				if(JSON.parse(isLogin).role!=""||JSON.parse(isLogin).role!=0){
					for(var i = 0; i < JSON.parse(isLogin).role.length; i++){
						if(userRole=='6'){
							//已完成并没有转故障
							if(data.bean.eventProcessStatus=='3'&&data.bean.eventProgress=='3'){
								document.getElementById('bottom_bar').style.display = 'none';								
							}else{
								var bottomHtml = template('btooTmp', data.bean);
								oBtoo.innerHTML = '';
								console.log(bottomHtml);
								oBtoo.innerHTML = bottomHtml;
								
								//防止渲染不好看
								document.getElementById('bottom_bar').style.visibility = 'visible';
							}
						}	
					}
				}
				var dealHtml = template('dealTmp', data.bean);
				oDeal.innerHTML = dealHtml;
				//抢单
				if(data.bean.eventProcessStatus>=2){
					var posHtml = template('posTpl', data.bean);
					oPosone.innerHTML = '';
					oPosone.innerHTML = posHtml;
				}
				var daultHtml = template('dataTmpl', data.bean);
				oDault.innerHTML = '';
				oDault.innerHTML = daultHtml;
				//预加载子页面
				/*mui.fire(reportPage, 'getReport', {
				    result:data.bean
				});*/
				//跳转处理报告
				mui('#btooTmpl').on('tap', '#goReport', function(e) {
					var state = this.getAttribute('data-state');
					if(state==''||state==null){
						mui.toast('请先接受工单!');
						return;
					}
					mui.openWindow({
						url: 'securityAlarmReport.html',
						id: 'securityAlarmReport',
						waiting: {
							autoShow: false
						},
						extras: {
							result: data.bean
						}
					});
				});
				qmask.hide();
			},
			error: function(xhr, type, errorThrown) {
				if(type=='timeout'){
					mui.toast('请求超时:请检查网络!');
				}else if(updateOrDetail==1){
					mui.toast('查询失败!');
				}else{
					mui.toast('接单失败!');
				}
				qmask.hide();
				return;
			}
		});
	}
	
	//接收工单
	function order(warningEventId,warningCategoryId,updateOrDetail,eventProgress){
		qmask.show();
		mui.ajax({
			type: "post",
			url: global_url+"/cwp/front/sh/warningEvent!execute",
			async: true,
			data: {
				uid:"c025",
				warningEventId:warningEventId,
				warningCategoryId:warningCategoryId,
				updateOrDetail:updateOrDetail,
				responseOfficerId:JSON.parse(isLogin).userId,
				eventProgress:eventProgress							
			},
			dataType: "json",
			timeout: 1000000,
			success: function(data) {
				console.log(data);
				if(data.returnCode==0){
					res(warningEventId,warningCategoryId,1,2);
					mui.toast('抢单成功!');
				}else{
					mui.toast('抢单失败!');
				}						
				qmask.hide();
			},
			error: function(xhr, type, errorThrown) {
				if(type=='timeout'){
					mui.toast('请求超时:请检查网络!');
				}else if(updateOrDetail==1){
					mui.toast('查询失败!');
				}else{
					mui.toast('抢单失败!');
				}
				qmask.hide();
				return;
			}
		});
	}
	
	//调用电话
	mui('.mui-content').on('tap', '#goDetail', function(e) {
		var phone = this.getAttribute('data-phone');
		console.log(phone);
		if(window.plus){
			toPhone(phone);
		}else{
			document.addEventListener("plusready",toPhone(phone),false);
		}
	});
	function toPhone(phone){
		plus.device.dial(phone, false);
	}
	//抢单
	mui('#btooTmpl').on('tap', '#accept', function(e) {
		var dataHtml = this.innerHTML;				
		if(dataHtml.indexOf("已接单")>-1){
			mui.toast('该工单已抢单,请勿重复点击！');
		}else{
			order(warningEventId,warningCategoryId,2,2);
		}
	});
	//转故障告警
	mui('#btooTmpl').on('tap', '#goSecurity', function(e) {
		var Url = this.getAttribute('data-url');
		mui.openWindow({
			url: '../home/'+Url,
			id: Url,
			waiting: {
				autoShow: false
			}
		});
	});
	
});