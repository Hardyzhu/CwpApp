
window.amGloble={
	userInfo:{}
};

(function () {
    window.webService = function (opt) {
        if (!opt) return;
        if (opt.serviceName && opt.method && opt.uid) {
            this.options=opt;       
        } else {
            throw ('Api error: 必须输入{serviceName && method && uid must be valid!}');
        }
    };
    
    window.webService.prototype = {
    	options:{
    		
    	},
        exec: function (opt, cb) {
            this.getdata(opt, cb);
        },
        getdata: function (opt, callback) {
        	var self=this;
        	var _opt=this.options;
        	
        	if (_opt.method.toUpperCase()=="GET" ||  _opt.method.toUpperCase()=="POST" )
        	{
        		
        		
        		if(amGloble.userInfo!=undefined && mui.isEmptyObject(amGloble.userInfo)){
					if(mui.os.plus){
						mui.plusReady(function(){
							amGloble.userInfo=mui.parseJSON(plus.storage.getItem("userInfo"));
							self.ajaxCommon(opt,callback);
						});
					}else{
						var local=localStorage.getItem("userInfo");
						if(local){
							amGloble.userInfo=mui.parseJSON(local);
						}else{
							amGloble.userInfo={};
						}
						
						self.ajaxCommon(opt,callback);
					}
					
				}else{
					self.ajaxCommon(opt,callback);
				}
        		
        		


        	 }else {
        		 throw ('Api error: 输入的请求类型错误，需要为POST 或 GET')
        	 }
        },
        ajaxCommon:function(opt,callback){
        	var responseData={};
        		var self=this.options;
        		console.log(amGloble.userInfo);
        		
        	    opt.userId=amGloble.userInfo.userId;
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
        }
        
    };
   
})();

(function() {	
	var serviceName="http://58.96.169.201:28090/cwp";
	var serviceType={POST:"POST",GET:"GET"};
	
	var self = amGloble.web = {
		USER_LOGIN : new webService({
			serviceName : serviceName + "/front/sh/login!login",
			uid:'L001',
			method:serviceType.GET
		}),
		MY_AUDIT_LIST:new webService({
			serviceName:serviceName+"/front/sh/workflow!execute",
			uid:'myAuditList',
			method:serviceType.GET,
			desc:"获取我的审批工单"
		}),
		MY_TODO_LIST:new webService({
			serviceName:serviceName+"/front/sh/workflow!execute",
			uid:"myTodoList",
			method:serviceType.GET,
			desc:"获取我的待办列表"
		}),
		AUDIT_HISTORY:new webService({
			serviceName:serviceName+"/front/sh/workflow!execute",
			uid:'auditHistory',
			method:serviceType.GET,
			desc:"流程审批记录"
		} ),
		MY_CREATE_LIST:new webService({
			serviceName:serviceName+"/front/sh/workflow!execute",
			uid:'myCreateList',
			method:serviceType.GET,
			desc:"获取我的发起工单"
		} ),
		AUDIT_ORDER:new webService({
			serviceName:serviceName+"/front/sh/faultRepairWf!execute",
			uid:"auditOrder",
			method:serviceType.GET,
			desc:"审核工单接口"
		}),
		ORDER_REPAIR_COMPLETE:new webService({
			serviceName:serviceName+"/front/sh/faultRepairWf!execute",
			uid:"repairComplete",
			method:serviceType.GET,
			desc:"工单维修完成"
		}),
		ORDER_ACCEPTANCE:new webService({
			serviceName:serviceName+"/front/sh/faultRepairWf!execute",
			uid:"acceptanceOrder",
			method:serviceType.GET,
			desc:"工单验收"
		})
	}
})();

