var todoCount = 1;
var todoPageNum=1;
var todoTotalPage=0;

var auditCount = 1;
var auditPageNum=1;
var auditTotalPage=0;

mui.init({
  pullRefresh : {
    container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    up : {
      height:50,//可选.默认50.触发上拉加载拖动距离
      callback :pullfreshUp //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }
  }
});

mui.ready(function(){	
	mui('.mui-control-content').each(function(){
		var resHeight = window.innerHeight - 109;
		this.setAttribute("style","min-height:"+resHeight+"px;");
		var isActive = this.classList.contains('mui-active') ? true : false;
		if(isActive){
			var state = this.getAttribute('data-state');
			if(state == 'mytodoTab'){
				loadMyToDoList();
			}else if(state == 'myauditTab'){
				loadMyAuditList();
			}
			
		}
	});
	
	mui('.mui-scroll-wrapper').scroll({
		scrollX: false, //是否横向滚动
		indicators: true, //是否显示滚动条
		deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
 		bounce: false //是否启用回弹
	});
	
	var item2Show=false;//子选项卡是否显示标志
	document.querySelector('.mui-slider').addEventListener("slide",function(event){
		 if (event.detail.slideNumber === 1&&!item2Show) {
		    //切换到第二个选项卡
		    loadMyAuditList();
		    item2Show = true;
  		}
	});
	
	

	

});


function loadMyToDoList(){
			
	var options={
		currentPage:todoPageNum,
		pageSize:10
	};
	
	amGloble.web.MY_TODO_LIST.exec(options,function(ret){
		console.log(ret);
		if(ret.result!=undefined && ret.result==0){
			var responData=ret.data;
			if(responData.returnCode!=undefined && responData.returnCode=="0"){
				
				var todoListUl=mui("#mytodolist");
				var html = template('mytodoTmpl', responData);
				
				if(todoCount==1){
					todoListUl[0].innerHTML = html;
				}else{
					todoListUl[0].innerHTML += html;
				}
				todoCount++;
				todoTotalPage=ret.data.object.totalPage;


					
			}else{
				mui.toast(responData.returnMessage);
			}
		}
		
	});
	
	mui(".mui-slider-group").on("tap",".item",function(){
		var id = this.getAttribute("id");
		gotoNextPage("orderDetail.html","orderDetail",{
			orderNum:id
    })
	});
	
}

function gotoNextPage(url,urlId,extras){
	mui.openWindow({
		url: url,
		id: urlId,
		waiting: {
			autoShow: false
		},
		extras:extras
	});
}

function loadMyAuditList(){
			
	var options={
		currentPage:auditPageNum,
		pageSize:10
	};
	
	amGloble.web.MY_AUDIT_LIST.exec(options,function(ret){
		console.log(ret);
		if(ret.result!=undefined && ret.result==0){
			var responData=ret.data;
			if(responData.returnCode!=undefined && responData.returnCode=="0"){
				
				var auditListUl=mui("#myauditlist");
				var html = template('myAuditTmpl', responData);
				
				if(auditCount==1){
					auditListUl[0].innerHTML = html;
				}else{
					auditListUl[0].innerHTML += html;
				}
				auditCount++;
				auditTotalPage=ret.data.object.totalPage;
			}else{
				mui.toast(responData.returnMessage);
			}
		}
		
	});
	
}

function pullfreshUp(){
	
			if (mui.os.plus) {
				mui.plusReady(function() {
					mui.later(function() {
						mui('#refreshContainer').pullRefresh().pullupLoading();
					}, 1000);
				});
			} else {
				mui.ready(function() {
					mui('#refreshContainer').pullRefresh().pullupLoading();
				});
			}
     //注意：
     //1、加载完新数据后，必须执行如下代码，true表示没有更多数据了：
     //2、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后
     var self=this;
     mui.later(function(){
     	if(auditPageNum<auditTotalPage){
     		self.endPullupToRefresh(false);
     		auditPageNum++;
     		loadMyAuditList();
     	}else{
     		self.endPullupToRefresh(true);			
     	}

     	
     },1500)
     
}