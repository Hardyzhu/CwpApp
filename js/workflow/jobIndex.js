mui.init();
mui.ready(function(){
	
	mui.plusReady(function(){
	console.log("lk");
	});


	mui(".comul").on("click",".button",function(){
	var id = this.getAttribute("id");
	console.log(id);
	var url="";
	var urlId="";
	switch(id){
		case "mytodo_bt":
			url="FaultRepair/myAuditList.html";
			urlId="myAuditList";
		break;
		case "mycreate_bt":
			url="FaultRepair/myAuditList.html";
			urlId="myAuditList";
		break;
		case "copytome_bt":
			url="FaultRepair/myAuditList.html";
			urlId="myAuditList";
		break;
		default:
		console.log(id);		
	}
	gotoNextPage(url,urlId);
	
	});
	
	
})

function gotoNextPage(url,urlId){
	mui.openWindow({
		url: url,
		id: urlId,
		waiting: {
			autoShow: false
		}
	});
}



function openWindows(){
	
}

