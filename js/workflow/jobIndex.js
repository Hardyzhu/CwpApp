mui.init();
mui.ready(function(){
	
	mui(".mui-bar-tab").on("tap",".button",function(){
	var id = this.getAttribute("id");
	console.log(id);
	var url="";
	var urlId="";
	switch(id){
		case "mytodo_bt":
			url="FaultRepair/myToDo.html";
			urlId="myToDo";
		break;
		case "mycreate_bt":
			url="FaultRepair/myCreate.html";
			urlId="myCreate";
		break;
		case "copytome_bt":
			url="FaultRepair/ccToMe.html";
			urlId="ccToMe";
		break;
		default:
		console.log(id);		
	}
	gotoNextPage(url,urlId);
	
	});
	
	mui(".linkButton").on("click",".linkItem",function(){
			var id = this.getAttribute("data-url");
			console.log(id);
			switch(id){
				case "addItem":
				break;
				case "faultRepair":
					gotoNextPage("FaultRepair/myAuditList.html","myAuditList");
				break;
				default:
				console.log(id);		
			}

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
	 plus.nativeUI.showWaiting();
}
