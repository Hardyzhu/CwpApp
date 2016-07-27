mui.init();
mui.ready(function(){
	
	mui.plusReady(function(){
	consle.log("lk");
	});


	mui(".comul").on("click",".button",function(){
	var id = this.getAttribute("id");
	console.log(id);
	switch(id){
		case "mytodo_bt":
		break;
		case "mycreate_bt":
		break;
		case "copytome_bt":
		break;
		default:
		console.log(id);		
	}	
	});
	
	
})


var options={
	loginName:"admin",
	loginPwd:"admin"
}

amGloble.webService.USER_LOGIN.exec(options,function(ret){
	console.log(ret);
});

function openWindows(){
	
}

