var $$ = (function($){
	//注入$
	var $$ = $||{};
	/**
	 * 描述：查询消息
	 * @param {String} index (1,消息，2，消息详情)
	 * @param {Object} json
	 */
	$$.selectData = function (index,json)
	{
		if(arguments.length==2){
			//json
			for(var i in json){
				if(json.hasOwnProperty(i)){
					this.selectData(index,i,json[i]);
				}
			}
		}	
		else	//name, value
		{
			if(index==1){
				this.searchData(arguments[1],arguments[2]);
			}else{
				this.searchDetailData(arguments[1],arguments[2]);
				this.updatePushMessageAllStatus(arguments[1],arguments[2]);
			}
		}
	};

	//搜索方法
	$$.searchData = function(arg,item)
	{
		var parm = {};
		var _thiss = this;
		var oNumList = document.querySelectorAll('.mesA');                        //tip数字
		var oMesDate = document.querySelectorAll('.mesDate');                     //推送日期
		var oMesCon = document.querySelectorAll('.mesCon');                       //推送类容
		var oMesLevel = document.querySelectorAll('.mesLevel');                   //推送级别
		var self = plus.webview.currentWebview();
		parm[arg] = item.toUpperCase();
		if(arg=='status'){
			//通过状态查询
			websql.selectPushMsgByStatus(parm,function(res){
		  		var data = res.responseData;
		  		if (data.length>0) {
		  			//渲染图标红点
		  			self.parent().evalJS("document.getElementById('tips').style.display = 'block'");
			  	}else{
			  		self.parent().evalJS("document.getElementById('tips').style.display = 'none'");
			  	}
		  		var mess = {security:0,alarm:0,order:0};
			  	//消息分类处理
			  	for(var i=0;i<data.length;i++){
			  		 if (data[i].type=='SECURITY') {
					  	mess.security++;
					  }else if (data[i].type=="WARN") {
					  	mess.alarm++;	
					  } else{
					  	mess.order++;
					  }
			  	}
			  	if(mess.security!=0){
			  		_thiss.setStyle(oNumList[0],{opacity:100,display:'block'});
			  		oNumList[0].innerHTML = mess.security;
			  	}else{
			  		_thiss.setStyle(oNumList[0],{opacity:0,display:'none'});
			  		oNumList[0].innerHTML = '';
			  	}
			  	if(mess.alarm!=0){
			  		_thiss.setStyle(oNumList[1],{opacity:100,display:'block'});
			  		oNumList[1].innerHTML = mess.alarm;
			  	}else{
			  		_thiss.setStyle(oNumList[1],{opacity:0,display:'none'});
			  		oNumList[1].innerHTML = '';
			  	}
			  	if(mess.order!=0){
			  		_thiss.setStyle(oNumList[2],{opacity:100,display:'block'});
			  		oNumList[2].innerHTML = mess.order;
			  	}else{
			  		_thiss.setStyle(oNumList[2],{opacity:0,display:'none'});
			  		oNumList[2].innerHTML = '';
			  	}
		  	});
		}else{
			//通过类型查询
			websql.selectPushMsgByType(parm,function(res){
				var data = res.responseData;
				var security = {},
					warn = {},
					order = {};
				template.helper('isnotNull',function(inp){
					if(inp==''||inp==null){
						return '暂无记录';
					}else{
						return inp;
					}
				});
				if((data instanceof Array)&&(data.length>0)){
					switch(data[0].type){
						case 'SECURITY':
							//alert(JSON.stringify(data));
							security = data[0];
							//alert(1);
							var securityTmp = document.getElementById('securityTmp');
							var secHtml = template('securityTmpl',security);
							securityTmp.innerHTML = secHtml;
							break;
						case 'WARN':
							//alert(JSON.stringify(data));
							warn = data[0];
							//alert(2);
							var warnTmp = document.getElementById('warnTmp');
							var warnHtml = template('warnTmpl',warn);
							warnTmp.innerHTML = warnHtml;
							break;
						case 'ORDER':
							//alert(JSON.stringify(data));
							order = data[0];
							//alert(3);
							var orderTmp = document.getElementById('orderTmp');		
							var orderHtml = template('orderTmpl',order);
							orderTmp.innerHTML = orderHtml;
						    break;
					}
				}else{
					
					switch(item.toUpperCase()){
						case 'SECURITY':
							//alert(11);	
							var securityTmp = document.getElementById('securityTmp');
							var secHtml = template('securityTmpl',security);
							securityTmp.innerHTML = secHtml;
							break;
						case 'WARN':
							//alert(22);
							var warnTmp = document.getElementById('warnTmp');
							var warnHtml = template('warnTmpl',warn);
							warnTmp.innerHTML = warnHtml;
							break;
						case 'ORDER':
						
							//alert(33);
							var orderTmp = document.getElementById('orderTmp');		
							var orderHtml = template('orderTmpl',order);
							orderTmp.innerHTML = orderHtml;
						    break;
					}
				}
				
				
				
				/*if((res.responseData instanceof Array)&&(res.responseData.length>0)){
					var reslut = {security:{},warn:{},order:{}};
					switch(item.toUpperCase()){
						case 'SECURITY':
							reslut.security = res.responseData[0];
							break;
						case 'WARN':
							reslut.warn = res.responseData[0];
							break;
						case 'ORDER':
							reslut.order = res.responseData[0];
						    break;
					}
					if(_thiss.isNullObj(reslut.security)){
				  		_thiss.setStyle(oMesDate[0],{opacity:100,display:'block'});
				  		_thiss.setStyle(oMesLevel[0],{opacity:100,display:'block'});
				  		oMesDate[0].innerHTML = reslut.security.pushDate;
				  		oMesCon[0].innerHTML = reslut.security.content;
				  		oMesLevel[0].innerHTML = reslut.security.processAction;
				  	}else{
				  		_thiss.setStyle(oMesDate[0],{opacity:0,display:'none'});
				  		_thiss.setStyle(oMesLevel[0],{opacity:0,display:'none'});
				  		oMesCon[0].innerHTML = '暂无消息';
				  	}
				  	
				  	if(_thiss.isNullObj(reslut.alarm)){
				  		_thiss.setStyle(oMesDate[1],{opacity:100,display:'block'});
				  		_thiss.setStyle(oMesLevel[1],{opacity:100,display:'block'});
				  		oMesDate[1].innerHTML = reslut.alarm.pushDate;
				  		oMesCon[1].innerHTML = reslut.alarm.content;
				  		oMesLevel[1].innerHTML = reslut.alarm.processAction;
				  	}else{
				  		_thiss.setStyle(oMesDate[1],{opacity:0,display:'none'});
				  		_thiss.setStyle(oMesLevel[1],{opacity:0,display:'none'});
				  		oMesCon[1].innerHTML = '暂无消息';
				  	}
				  	if(_thiss.isNullObj(reslut.order)){
				  		_thiss.setStyle(oMesDate[2],{opacity:100,display:'block'});
				  		_thiss.setStyle(oMesLevel[2],{opacity:100,display:'block'});
				  		oMesDate[2].innerHTML = reslut.alarm.pushDate;
				  		oMesCon[2].innerHTML = reslut.alarm.content;
				  		oMesLevel[2].innerHTML = reslut.alarm.processAction;
				  	}else{
				  		_thiss.setStyle(oMesDate[2],{opacity:0,display:'none'});
				  		_thiss.setStyle(oMesLevel[2],{opacity:0,display:'none'});
				  		oMesCon[2].innerHTML = '暂无消息';
				  	}
				}*/
			});
		}
	};
	//修改方法
	//修改方法
	$$.updatePushMessageAllStatus = function(arg,item){
		var parm = {};                          //渲染部分
		parm['status'] = '1';
		parm[arg] = item.toUpperCase();
		websql.updatePushMessageAllStatus(parm,function(res){});
	};
	
	//查询详情列表
	$$.searchDetailData = function(arg,item)
	{
		qmask.show();
		var parm = {};
		var _thiss = this;                      
		var oList = document.getElementById('list');                            //渲染部分
		parm[arg] = item.toUpperCase();
		//通过类型查询
		websql.selectPushMsgByType(parm,function(res){
			if((res.responseData instanceof Array)&&(res.responseData.length>0)){
				var data = {result:[]};
				data.reslut = res.responseData;
				template.helper('colFormat',function(inp){
				   	if(inp==0){
				   		return 'blueColor';
				   	}else if(inp==1){
						return 'yellowColor';
					}else if(inp==2){
						return 'orangeColor';
					}else{
						return 'redColor';
					}
				});
				//设备图标
				template.helper('nameFormat',function(inp){
					var b = '';
					switch(inp){                   
						case '1003185':            //空调
						  b = 'icon-kongdiao';
						  break;
						case '1003186':            //新风
						  b = "icon-tongfeng"
						  break;
						case '1003187':            //排污泵
						  b = "icon-135" 
						  break;  
						case '1004001':            //门禁设备
						  b = "icon-menjinxitong"
						  break;  
						
					}
					if(b!=''||b!=null){
						return b;
					}
				});
				var dealHtml = template('detailTmpl', data);
				oList.innerHTML = dealHtml;
				
			}
			
			qmask.hide();
		});
	};
	//设置样式
	$$.setStyle = function (obj, json)
	{
		if(obj.length)
			for(var i=0;i<obj.length;i++) this.setStyle(obj[i], json);
		else
		{
			if(arguments.length==2)	//json
				for(var i in json) this.setStyle(obj, i, json[i]);
			else	//name, value
			{
				switch(arguments[1].toLowerCase())
				{
					case 'opacity':
						obj.style.filter='alpha(opacity:'+arguments[2]+')';
						obj.style.opacity=arguments[2]/100;
						break;
					default:
						if(typeof arguments[2]=='number')
						{
							obj.style[arguments[1]]=arguments[2]+'px';
						}
						else
						{
							obj.style[arguments[1]]=arguments[2];
						}
						break;
				}
			}
		}
	};
	//判断对象是否为空
	$$.isNullObj = function(obj){
		for(var i=0 in obj){
			if(obj.hasOwnProperty(i)){
				return true;
			}
		}
		return false;
	};
	return $$;
})({});
