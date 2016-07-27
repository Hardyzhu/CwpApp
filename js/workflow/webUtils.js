window.amGloble={
	userSession:{},
	userInfo:function(){
		if(this.userSession!=undefined && mui.isEmptyObject(this.userSession)){
			if(mui.os.plus){		
				mui.plusReady(function(){
					this.userSession=mui.parseJSON(plus.storage.getItem("userInfo"));
				});
			}else{
				this.userSession=mui.parseJSON(localStorage.getItem("userInfo"));
			}
		}
		return this.userSession;
	}

};

(function () {
    window.webService = function (opt) {
        if (!opt) return;
        if (opt.serviceName && opt.method && opt.uid) {
            mui.extend(webService.Option,opt);           
        } else {
            throw ('Api error: 必须输入{serviceName && method && uid must be valid!}');
        }
    };
    window.webService.Option={};
    
    window.webService.prototype = {
        exec: function (opt, cb) {
            this.getdata(opt, cb);
        },
        getdata: function (opt, callback) {
        	
        	var self=webService.Option;
        	
        	if (self.method.toUpperCase()=="GET" ||  self.method.toUpperCase()=="POST" )
        	{
        		var responseData={};
        		opt.userId=amGloble.userInfo().userId;
        		mui.ajax(self.serviceName+"?uid="+self.uid,
        		{
					data:opt,
					dataType:'json',//服务器返回json格式数据
					type:self.method.toUpperCase(),//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					headers:{'Content-Type':'application/json'},	              
					success:function(data){
						//服务器返回响应，根据响应结果，分析是否登录成功；
						responseData.result=0;
						responseData.data=data;
						responseData.message="successful";
						callback && callback(responseData);
					},
					error:function(xhr,type,errorThrown){
						if(type=='timeout'){
							mui.toast('请求超时:请检查网络!');
						}else {
							mui.toast('数据加载失败!');
						}
						//异常处理；
						responseData.result=1;
						responseData.data=null;
						responseData.message="failed";						
						
						callback && callback(responseData);
					}
				});				
        		callback && callback(responseData);

        	 }else {
        		 throw ('Api error: 输入的请求类型错误，需要为POST 或 GET')
        	 }
        }
        
    };
   
})();

(function() {	
	var serviceName="http://192.168.100.65:20011/cwp";
	var serviceType={POST:"POST",GET:"GET"};
	
	var self = amGloble.webService = {
		USER_LOGIN : new webService({
			serviceName : serviceName + "/cwp/front/sh/login!login",
			uid:'L001',
			method:serviceType.GET
		}),
		MY_AUDIT_LIST:new webService({
			serviceName:serviceName+"/front/sh/workflow!execute",
			uid:'myAuditList',
			method:serviceType.GET
		}),
		MY_TODO_LIST:new webService({
			serviceName:serviceName+"/front/sh/workflow!execute",
			uid:"myTodoList",
			method:serviceType.GET
		})
		
	}
})();

