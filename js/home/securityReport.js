mui.init({
		swipeBack:true 
	});
mui('.mui-scroll-wrapper').scroll();
mui.plusReady(function(){
	//获取登录信息
	var oSwit = document.getElementById('mui-swit');
	var oTextarea1 = document.getElementById('textarea1');
	var oTextarea2 = document.getElementById('textarea2');
	var isLogin = plus.storage.getItem("userInfo");
	var self = plus.webview.currentWebview();
	var warningEventId="";
	var warningCategoryId="";
	var eventProgress="3";
	//预加载
	var detailPage = null;
	if(!detailPage){
		detailPage= mui.preload({
		     url:"securityDetail.html",
		     id:"securityDetail"
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
		oTextarea1.value = self.result.liveDescribe;
	}
	
	//监听事件
	oSwit.addEventListener('toggle', function(event) {
		var isShow = mui('.isShow');
		console.log(isShow);
		 eventProgress = event.detail.isActive ? '4' : '3';
		 if(eventProgress==4){
		 	//开启
		 	setStyle(isShow,{opactiy:'100',display:'block'})
		 }else{
		 	//关闭
		 	setStyle(isShow,{opactiy:'0',display:''});
		 }
	});
	//setCss
	function setStyle(obj, json)
	{
		if(obj.length)
			for(var i=0;i<obj.length;i++) setStyle(obj[i], json);
		else
		{
			if(arguments.length==2)	//json
				for(var i in json) setStyle(obj, i, json[i]);
			else	//name, value
			{
				switch(arguments[1].toLowerCase())
				{
					case 'opacity':
						obj.style.filter='alpha(opacity:'+arguments[2]+')';
						obj.style.opacity=arguments[2]/100;
						break;
					default:
						if(typeof arguments[2]=='number')
						{
							obj.style[arguments[1]]=arguments[2]+'px';
						}
						else
						{
							obj.style[arguments[1]]=arguments[2];
						}
						break;
				}
			}
		}
	}
	
	//维修服务
	var info = document.getElementById('change_sever');
	var lead_money = document.getElementById('lead_money');
	var end_timer = document.getElementById('estimated_finish_time');;
	document.getElementById('severs').addEventListener('tap',function(e){
		var tip = '';
		if(info.innerHTML=='无偿服务'){
			tip = '有偿服务';
		}else{
			tip = '无偿服务';
		}
		var btnArray = ['取消', '确定'];
		mui.confirm('是否切换为'+tip, '维修服务', btnArray, function(e) {
			if (e.index == 1) {
				info.innerHTML = tip;
			}
		})	
	});
	//预估费用
	document.getElementById('money').addEventListener('tap',function(e){
		e.detail.gesture.preventDefault();
		var btnArray = ['取消', '确定'];
		mui.prompt('请输入费用：', '请输入费用', '预付费用', btnArray, function(e) {
			if (e.index == 1) {
				lead_money.innerHTML = (+e.value).toFixed(2);
			}
		})
	});
	
	//计划完成时间
	document.getElementById('end_time').addEventListener('tap',function(){
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var id = this.getAttribute('id');
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			end_timer.innerHTML = rs.text;
			picker.dispose();
		});
	});
	//提交
	document.getElementById('subit').addEventListener('tap',function(){
		qmask.show();
		var liveDescribe = oTextarea2.value;
		
		console.log("告警ID:"+warningEventId );
		console.log("告警描述:"+liveDescribe);
		console.log("用户ID:"+JSON.parse(isLogin).userId);
		console.log("事件级别:"+eventProgress);
		if(eventProgress==4){
			console.log(1);
			var orderDescribe = oTextarea1.value;    //维修说明
			var serviceBudget = lead_money.innerHTML  //预估费用
			var planCompleteDate = end_timer.innerHTML;   //预计结束时间
			var serviceType = '';                    //服务类型
			if(info.innerHTML = '有偿服务'){
				serviceType = '1';
			}else{
				serviceType = '0';
			}
			mui.ajax({
				type: "post",
				url: "http://192.168.92.227:8010/cwp/front/sh/faultRepairWf!execute",
				data: {
					uid:"startFaultRepair",							
					eventId:warningEventId,
					serviceType:serviceType,
					orderDescribe :orderDescribe,
					userId:JSON.parse(isLogin).userId,
					serviceBudget:serviceBudget
				},
				dataType: "json",
				timeout: 10000,
				success: function(data) {
					mui.toast('提交成功!');
					console.log(JSON.stringify(data));
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
		}
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