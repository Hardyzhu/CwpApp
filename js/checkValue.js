/**
 * 	作者：yeshengqiang
 *  时间：2016-06-29
 *	描述：验证
 */

var check = {};
//判断是否为空
check.isNotNull = function(item){
	var resulte = {state:false,info:''};
	if(item==undefined||item==''||item==null){
		resulte.state = false;
		resulte.info = '不能为空';
	}else{
		resulte.state = true;
		resulte.info = '通过';
	}
	return resulte
};
//判断新密码和重复密码是否相同
check.isEqual = function(newValue,oldValue){
	var resulte = {state:false,info:''};
		if(newValue===oldValue){
			resulte.state = true;
			resulte.info = '正确';
		}else{
			resulte.state = false;
			resulte.info = '错误';
		}
	return resulte;
};
//限定密码长度及密码复杂度
check.isComplex = function(item,info){
	var resulte = {state:false,info:''};
	var tem = this.isNotNull(item);
	var reg = /[^a-zA-Z0-9]+/;
	if(!tem.state){
		resulte.state = false;
		resulte.info = '请输入'+info+'密码';
		return resulte;
	}
	if(item.length<6){
		resulte.state = false;
		resulte.info = info+'密码长度必须大于6位';
		return resulte;
	}else if(reg.test(item)){
	 	resulte.state = false;
		resulte.info = info+'密码只能包含数字和字母';
		return resulte;
   }else{
    	resulte.state = true;
		resulte.info = '通过';
		return resulte;
    }
	//var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}');
};
