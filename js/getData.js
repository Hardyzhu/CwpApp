var $$ = (function($){
	//注入$
	var $$ = $||{};
	//搜索推送消息
	$$.selectData = function (json)
	{
		var temp = {};
		if(arguments.length==1){
			//json
			for(var i in json){
				if(json.hasOwnProperty(i)){
					this.selectData(i,json[i]);
				}
			}
		}	
		else	//name, value
		{
			this.searchData(arguments[0],arguments[1]);
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
//		alert(oNumList);
//		alert(oMesDate);
//		alert(oMesCon);
//		alert(oMesLevel);
		parm[arg] = item.toUpperCase();
//		alert(JSON.stringify(parm));
		if(arg=='status'){
			//通过状态查询
			websql.selectPushMsgByStatus(parm,function(res){
		  		var data = res.responseData;
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
			  	}else if(mess.alarm!=0){
			  		_thiss.setStyle(oNumList[1],{opacity:100,display:'block'});
			  		oNumList[1].innerHTML = mess.alarm;
			  	}else if(mess.order!=0){
			  		_thiss.setStyle(oNumList[2],{opacity:100,display:'block'});
			  		oNumList[2].innerHTML = mess.order;
			  	}
			  	
		  	});
		}else{
			//通过类型查询
			websql.selectPushMsgByType(parm,function(res){
				if((res.responseData instanceof Array)&&(res.responseData.length>0)){
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
					alert(JSON.stringify(resulte));
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
				  		oMesCon[2].innerHTML = '暂无消息';
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
					/*var oList = document.getElementById("list");
					var html = template('detailTmpl', reslut);
					oList.innerHTML += html;*/
				}
			});
		}
	};
	//设置样式
	$$.setStyle = function (obj, json)
	{
		if(obj.length)
			for(var i=0;i<obj.length;i++) setStyle(obj[i], json);
		else
		{
			if(arguments.length==2)	//json
				for(var i in json) setStyle(obj, i, json[i]);
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
		var mark = false;
		for(var i=0 in obj){
			if(obj.hasOwnProperty(i)){
				mark = true;
			}
		}
		return mark;
	};
	return $$;
})({});
