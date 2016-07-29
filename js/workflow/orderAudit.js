mui.init();
var operId="";
var curAid="";
var processInstId="";
var taskId="";
var businessKey="";

mui.ready(function(){
	var self=this;
	mui('.mui-scroll-wrapper').scroll({
		 scrollY: true, //是否竖向滚动
		 scrollX: false, //是否横向滚动
		 indicators: false, //是否显示滚动条
		 deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
		 bounce: true //是否启用回弹
	});
	
	if(mui.os.plus){
		
		mui.plusReady(function(){
			var _self=plus.webview.currentWebview();
			console.log(_self);
			operId=_self.operId;
			curAid=_self.curAid;
			businessKey=_self.businessKey;
			taskId=_self.taskId;
			processInstId=_self.processInstId;
		})
	
	}else{
		
	}
	
	mui(".mui-button-row").on("tap","#sumbit",function(){
		var comment=mui("#auditComment")[0].value.trim();
		if(comment!=null && comment!=""){
			var options={
				"auditComment":comment,
				"processInstId":processInstId,
				"taskId":taskId,
				"businessKey":businessKey
			};
			console.log(options);
			switch(curAid){
				case "AuditOrder":
				options.invalidOrder=(operId=="agree")?"valid":"invalid";
				self.auditOrder(options);
				break;
				case "RepairFault":
				self.repairComplete(options);
				break;
				case "AcceptanceOrder":
				options.acceptanceResult=(operId=="agree")?"pass":"nopass";
				self.acceptanceOrder(options);
				break;
				default:
				console.log(curAid);
			}
			
			
		}else{
			mui.focus(mui("#auditComment")[0]);
			mui.toast('请输入审批意见');
		}
	});
	

});

// 审核工单
function auditOrder(options){	
	console.log(options);
	amGloble.web.AUDIT_ORDER.exec(options,function(ret){
		resultValid(ret);
	});
}

// 工单维修完成
function repairComplete(options){
	amGloble.web.ORDER_REPAIR_COMPLETE.exec(options,function(ret){
		resultValid(ret);
	});
}

// 验收工单
function acceptanceOrder(options){
	amGloble.web.ORDER_ACCEPTANCE.exec(options,function(ret){
		resultValid(ret);
	});
}

function resultValid(ret){
	if(ret.result!=undefined && ret.result==0){
		var responData=ret.data;
		if(responData.returnCode!=undefined && responData.returnCode=="0"){
			console.log(responData);
			mui.alert("当前流程审批成功！","审批结果","确认",function(){
				mui.back();
			});			
			
		}else if(responData.returnCode=="-9999"){					
			mui.toast("服务器接口内部错误！");
		}else{
			mui.toast("未知异常！");
		}
		
	}
}
