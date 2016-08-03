mui.init(
	/*{
		preloadPages:[{                      //预加载页面
		    id:'message',
		    url:'../main/message.html'           
		}]
	}*/
);
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	var entrance = self.entrance;
	/*var subStyles = {
		top: "45px",
		bottom: "50px",
	};*/
	/*mui.preload({
		url:"../main/user.html",
		id:"user.html",
		styles:subStyles
	});*/
	if(entrance === 'user') {
		var wvs = plus.webview.all();
		var fristWv = plus.webview.getLaunchWebview();
		// 关闭除当前页以及入口页面外所有页面
		for(var i = 0; i < wvs.length; i++) {
			if(wvs[i].getURL() == self.getURL() || wvs[i].getURL() == fristWv.getURL()) {
				continue;
			}
			wvs[i].close("none");
		}
	}
	var first = null;
	mui.back = function() {
		if(!first) {
			first = new Date().getTime();
			plus.nativeUI.toast("再按一次退出应用");
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if(new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	};
	//}
	/**
	 * 点击登录按钮，进行登录；
	 */
	document.getElementById("loginApp").addEventListener("tap", function() {
		var uphone = document.getElementById("userPhone").value.trim();
		var upwd = document.getElementById("userPassword").value.trim();
		if(uphone == '' || uphone == null) {
			mui.toast('请输入用户名');
			return
		} else if(upwd == '' || upwd == null) {
			mui.toast('请输入密码');
			return
		}
		var time = Date.parse(new Date());
		dataTime = this.getAttribute('data-time');
		if(!dataTime) {
			this.setAttribute('data-time', time);
		} else {
			if(dataTime - time <= '1000') {
				mui.toast('正在登录，请稍后...');
				return
			}
		}
		loginByPhone(uphone, upwd);
	});
	
	function bindAlias(name) {
		console.log("bind name:" + name);
		if(plus.os.name == "Android") {
			var pushManager = plus.android.importClass("com.igexin.sdk.PushManager");
			var main = plus.android.runtimeMainActivity();
			if(pushManager != null && pushManager != undefined && main != null && main != undefined) {
				console.log(pushManager.getInstance().getClientid(main));
				var result = pushManager.getInstance().bindAlias(main, name);
				console.log(result);
			}

		} else if(plus.os.name == "iOS") {
			var geTuiSdk = plus.ios.importClass("GeTuiSdk");
			if(geTuiSdk != null && geTuiSdk != undefined) {
				console.log(geTuiSdk.clientId());
				geTuiSdk.bindAlias(name);
				plus.ios.deleteObject(geTuiSdk);
			}

		} else {
			var info = plus.push.getClientInfo();
			console.log("获取客户端推送标识信息：");
			console.log("info: " + JSON.stringify(info));
		}
	}
	
	function loginByPhone(uphone, upwd) { //调用登录接口
		var self = null;
		var user = null;
		mui.ajax({
			type: "get",
			url: global_url + "/cwp/front/sh/login!login",
			async: true,
			data: {
				uid: 'L001',
				loginName: uphone,
				loginPwd: upwd
			},
			dataType: "json",
			timeout: 10000,
			success: function(data) {
				if(data.returnCode == "0" && data.object != "") {
					var lastLoginUser=plus.storage.getItem("userInfo");
					var lastLoginUserAlias="";
					if(lastLoginUser!=undefined && lastLoginUser!=null && lastLoginUser!="" ){
						if(mui.parseJSON(lastLoginUser)!=undefined && mui.parseJSON(lastLoginUser).userAlias!=undefined){
							lastLoginUserAlias=mui.parseJSON(lastLoginUser).userAlias;
							console.log(lastLoginUserAlias);
						}
					}
					
					mui.toast('登录成功!');
					var obj = data.object;
					var str = JSON.stringify(obj);
					plus.storage.removeItem('userInfo');
					plus.storage.setItem("userInfo", str);
					console.log(str);
					if(obj.userAlias !=undefined  && obj.userAlias!=lastLoginUserAlias){
						if(obj.userAlias!=null && obj.userAlias!=""){
							bindAlias(obj.userAlias);
						}else{
							console.log("登录别名不能为空！");
						}
						
					}
					
					if(!self) {
						self = plus.webview.currentWebview();
					}
					/*if(!user)
					{
						user = plus.webview.getWebviewById('user.html');
					}*/
					// 根据入口不同，进行的操作也不同，具体参数在两个入口处都有区分；
					mui.openWindow({
						url: "../main/main.html",
						id: "main.html",
						waiting: {
							autoShow: false
						},
						createNew: true,
						extras: {
							entrance: "login"
						}
					});
					plus.nativeUI.showWaiting();
					mui.fire(user, "getuser", {
						isLog: str
					});
					setTimeout(function() {
						//plus.nativeUI.closeWaiting();
					}, 200);
				} else if(data.returnCode == "1") {
					mui.toast('该用户不存在!');
					return;
				} else {
					mui.toast('登录失败!');
					return;
				}
	
			},
			error: function(xhr, type, errorThrown) {
				if(type == 'timeout') {
					mui.toast('请求超时:请检查网络!');
				} else {
					mui.toast('登录失败!');
					return;
				}
			}
		});
	}
});

