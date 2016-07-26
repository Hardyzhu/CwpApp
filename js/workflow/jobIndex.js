mui.init();
mui.plusReady(function(){
	consle.log("lk");
});

var options={
	loginName:"admin",
	loginPwd:"admin"
}

amGloble.webService.USER_LOGIN.exec(options,function(ret){
	console.log(ret);
});