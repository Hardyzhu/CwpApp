window.amGloble={
	
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
						//异常处理；
						responseData.result=1;
						responseData.data=null;
						responseData.message="successful";
						
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
	var serviceName="http://192.168.92.201:28090";
	var serviceType={POST:"POST",GET:"GET"};
	
	var self = amGloble.webService = {
			
		USER_LOGIN : new webService({
			serviceName : serviceName + "/cwp/front/sh/login!login",
			uid:'L001',
			method:serviceType.GET
		})
	}
})();

