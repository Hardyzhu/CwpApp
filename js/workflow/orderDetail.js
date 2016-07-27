mui.init();
var orderNO="20160725143544175003";
mui.ready(function(){
	console.log("23");
	mui('.mui-scroll-wrapper').scroll({
		 scrollY: true, //是否竖向滚动
		 scrollX: false, //是否横向滚动
		 indicators: true, //是否显示滚动条
		 deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
		 bounce: true //是否启用回弹
	});
	
	var options={
		"businessKey":orderNO,
		currentPage:1,
		pageSize:1000
	}
	
	amGloble.web.AUDIT_HISTORY.exec(options,function(ret){
		
		if(ret.result!=undefined && ret.result==0){
			var responData=ret.data;
			if(responData.returnCode!=undefined && responData.returnCode=="0"){
				console.log(responData);
				var todoListUl=mui("#dataDault");
				var html = template('dataTmpl', responData.beans);
				
				todoListUl[0].innerHTML = html;


					
			}else{
				mui.toast(responData.returnMessage);
			}
		}
	});
	
	
	
});