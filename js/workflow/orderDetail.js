mui.init();
var orderNO="20160725143544175003";
var currenActivitid="";
var taskId="";

mui.ready(function(){
	var self=this;
	mui('.mui-scroll-wrapper').scroll({
		 scrollY: true, //是否竖向滚动
		 scrollX: false, //是否横向滚动
		 indicators: false, //是否显示滚动条
		 deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
		 bounce: true //是否启用回弹
	});
	
	//调用电话
	mui('.mui-table-view').on('tap', '#goDetail', function() {
		var phone = this.getAttribute('data-phone');
		if(window.plus){
			toPhone(phone);
		}else{
			document.addEventListener("plusready",toPhone(phone),false);
		}
	});

	if(mui.os.plus){
		
		mui.plusReady(function(){
			var _self=plus.webview.currentWebview();
			console.log(_self);
			orderNO=_self.orderNum;
			currenActivitid=_self.processInstId;
			taskId=_self.taskId;
			
			var options={
				"businessKey":orderNO,
				currentPage:1,
				pageSize:1000
			};
			loadDetailInfo(options);
		})

		
	}else{
		
		var options={
				"businessKey":orderNO,
				currentPage:1,
				pageSize:1000
		}
		loadDetailInfo(options);
	}
	
	
	mui("#flowOperBar").on("tap",".mui-tab-item",function(){
		var oid=this.getAttribute('data-oper');
		var currentAid=mui("#currentFlowStep")[0].getAttribute('data-actid');
		console.log(oid);
		console.log(currentAid)
		var extras={
			operId:oid,
			curAid:currentAid,
			processInstId:currenActivitid,
			taskId:taskId,
			businessKey:orderNO
		};
		
		self.gotoNextPage("orderAudit.html","orderAudit",extras)
	})
	
});

function toPhone(phone){
	plus.device.dial(phone, false);
}
	
function loadDetailInfo(options){
		amGloble.web.AUDIT_HISTORY.exec(options,function(ret){
		
		if(ret.result!=undefined && ret.result==0){
			var responData=ret.data;
			if(responData.returnCode!=undefined && responData.returnCode=="0"){
				console.log(responData);
				var dataListUl=mui("#dataDault");
				var orderInfoUl=mui("#orderInfoUl");
				var eventInfoUl=mui("#eventInfoUl");
				var orderBaseInfoUl=mui("#orderBaseInfoUl");
				var oPosone = mui('#posoneUl');
				
				if(validPermission(responData.bean)){
					var wrap=mui(".mui-scroll-wrapper")[0];
					wrap.setAttribute("style","top:50px;bottom:50px;");
					var flowOperBar=mui("#flowOperBar")[0];
					flowOperBar.removeAttribute("style");
				}

				
				
				
				template.helper('dealerFormat',function(inp){
					if(inp=="0"){
						return '无偿服务';
					}else if(inp=="1"){
						return '有偿服务';
					}else{
						return '其他';
					}
				});
				
				template.helper('dateFormat',function(inp){
					if(inp=="endevent"){
						return responData.bean.actualCompleteDate;
					}else{
						return "未完成";
					}
				});
				
				
				var historyHtml = template('dataTmpl', responData);
				var orderInfoHmtl = template('orderInfoImpl', responData.bean);
				var eventInfoHmtl = template('eventInfoImpl', responData.bean);
				var orderBaseInfoHtml=template('orderBaseInfoImpl', responData.bean);
				var posHtml = template('posTpl', responData.bean);
					
				oPosone[0].innerHTML = posHtml;
				dataListUl[0].innerHTML = historyHtml;
				orderInfoUl[0].innerHTML=orderInfoHmtl;
				eventInfoUl[0].innerHTML=eventInfoHmtl;
				orderBaseInfoUl[0].innerHTML=orderBaseInfoHtml;
				

					
			}else if(responData.returnCode=="-9999"){								
				mui.toast("服务器接口内部错误！");
			}else{
				mui.toast("未知异常！");
			}
		}
	});
}

function gotoNextPage(url,urlId,extras){
	mui.openWindow({
		url: url,
		id: urlId,
		waiting: {
			autoShow: false
		},
		extras:extras
	});
}

function validPermission(data){
	var showButton=false;
	if(data.person!=undefined && amGloble.userInfo.userId !=undefined){
		if(data.person==amGloble.userInfo.userId){
			showButton=true;
			return showButton;
		}
	}
	
	if(amGloble.userInfo.role !=undefined && amGloble.userInfo.role.length !=undefined
		&& amGloble.userInfo.role.length>0 &&
		data.currGroup !=undefined && data.currGroup !=""){
		var currGroupAry=data.currGroup.split(",");
		if(currGroupAry.length>0){
			mui.each(amGloble.userInfo.role,function(index,item){
		  		console.log(item);
		  		if(currGroupAry.indexOf(item)>=0){
		  			showButton=true;
					return showButton;
		  		}
			}) 
		}		
	}
		
	return showButton;
	
}
