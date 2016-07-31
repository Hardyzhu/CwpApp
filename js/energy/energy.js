

//用电趋势开始----------------------------------
//$(".btnSearch").on("click",function(){
//  var cmbYear=$("#cmbYear").val();
//  var cmbMonth=$("#cmbMonth").val();
//  if(cmbYear=="")
//  {
//      alert("请选择年");
//  }
//  else{
//      powerTrendsEcharts(cmbYear,cmbMonth);
//  }
//});
//初始化方法
(function(){
	//用电趋势
	powerTrendsEcharts(2016,'');
	//楼栋用电
	banPower();
})();



//查询用电趋势
function selectPowerTrends(){
	var cmbYear=document.getElementById("cmbYear").value;
	var cmbMonth=document.getElementById("cmbMonth").value;
	if(cmbYear==""||cmbYear==undefined){
		mui.toast('请选择年份');
	}
	else{
		powerTrendsEcharts(cmbYear,cmbMonth);
	}
}

//初始用电趋势
function powerTrendsEcharts(cmbYear,cmbMonth){
//	var cmbYear=document.getElementById("cmYear").value;
//	var cmbMonth=document.getElementById("cmbMonth").value;
    var powerTrendsEcharts = echarts.init(document.getElementById('powerTrendsEcharts'));
    var powerTrendsOption = {
        tooltip : {                                                         //	气泡提示框
            trigger: 'axis'                                                //直角坐标系中的一个坐标轴，坐标轴可分为类目型、数值型或时间型
        },
        color:['#4b9ff5'],                                                //设置图表颜色
        legend: {                                                          //图例，表述数据和图形的关联
            data:['耗电量']
        },
        calculable : true,
        grid: {
            x: 60,
            x2: 30,
            y: 35,
            y2: 30
        },
        xAxis : [                                                           //直角坐标系中的横轴，通常并默认为类目型
            {
                type : 'category',
                boundaryGap : false,
                data : function (){                                        //加载横坐标数据
                            var list = [];
                            var count=0;
                            var day=[31,29,31,30,31,30,31,31,30,31,30,31];
                            var time="";
                            if(cmbMonth==""){
                                if(cmbYear==2016){
                                    count=8;
                                }
                                else{
                                    count=12;
                                }
                                time=cmbYear+"-";
                            }
                            else{
                                count=day[cmbMonth-1];
                                time=cmbYear+"-"+cmbMonth+"-";
                            }
                            for (var i = 1; i <= count; i++) {
                                list.push(time+i);
                            }
                            return list;
                }()
            }
        ],
        yAxis : [                                                            //	直角坐标系中的纵轴，通常并默认为数值型
            {
                type : 'value',
                axisLabel : {                                              //设置纵坐标的单位
                    formatter: '{value} kwh'
                }
            }
        ],
        series : [                                                         //数据系列，一个图表可能包含多个系列，每一个系列可能包含多个数据
            {
                name:'耗电量',                                            //所表示的类型
                type:'line',                                            //图标类型
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},    //图表样式设置
                data:function (){                                       //加载数据
                    var list = [];
                    for (var i = 1; i <= 31; i++) {
                        list.push(Math.round(Math.random()*20));
                    }
                    return list;
                }()
            }
        ]
    };
    // 为echarts对象加载数据
    powerTrendsEcharts.setOption(powerTrendsOption);
}
//用电趋势结束----------------------------------


//初始楼栋用电开始------------------------------
function banPower(){
    var myCharts = echarts.init(document.getElementById('banPower'));
    myCharts.setOption({
        legend: {
            data:['耗电量']
        },
        color:["#87cefa"],        
        calculable : true,
        grid: {
            x: 60,
            x2: 30,
            y: 35,
            y2: 30
        },
        xAxis : [
            {
                type : 'category',
                data:function (){                                       //加载数据
                    var list = [];
                    for (var i = 1; i <= 12; i++) {
                        list.push("cc-"+i);
                    }
                    return list;
                }()
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {                                              //设置纵坐标的单位
                    formatter: '{value} kwh'
                }
            }
        ],
        series : [
            {
                name:'耗电量',
                type:'bar',
                smooth:true,
                data:function (){                                       //加载数据
                    var list = [];
                    for (var i = 1; i <= 12; i++) {
                        list.push(Math.round(Math.random()*120));
                    }
                    return list;
                }()
            }
        ]
    });

    //点击柱状图事件
    myCharts.on("click", function (param) {
    	document.getElementById("banPower").style.display="none";
    	document.getElementById("banPermonthDisplay").style.display="block";
    	document.getElementById("banDevicesDisplay").style.display="block";
        banPermonth();
        devicesPowerCompared();
    });
}

//查询楼栋耗电
function searchBanPower(){
	var cmbBan=document.getElementById("cmbBan").value;
	if(cmbBan!=""){
		document.getElementById("banPower").style.display="none";
    	document.getElementById("banPermonthDisplay").style.display="block";
    	document.getElementById("banDevicesDisplay").style.display="block";
        banPermonth();
        devicesPowerCompared();
	}
	else{
		mui.toast('请选择楼栋');
	}
}

//根据楼栋显示当年每月耗电
function banPermonth(){
    var banPermonth = echarts.init(document.getElementById('banPermonth'));
    banPermonth.setOption({
        legend: {
            data:['耗电量']
        },
        color:["#87cefa"],
        calculable : true,
        grid: {
            x: 60,
            x2: 30,
            y: 35,
            y2: 30
        },
        xAxis : [
            {
                type : 'category',
                data:function (){                                       //加载数据
                    var list = [];
                    for (var i = 1; i <= 8; i++) {
                        list.push(i+"月");
                    }
                    return list;
                }()
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {                                              //设置纵坐标的单位
                    formatter: '{value} kwh'
                }
            }
        ],
        series : [
            {
                name:'耗电量',
                type:'bar',
                smooth:true,
                data:function (){                                       //加载数据
                    var list = [];
                    for (var i = 1; i <= 12; i++) {
                        list.push(Math.round(Math.random()*100));
                    }
                    return list;
                }()
            }
        ]
    });
}

//根据楼栋显示当月设备耗电比
function devicesPowerCompared(){
    //模拟数据
    var powerArray=[[30,20,40,10],[46,23,13,18],[26,33,23,18],[35,23,25,17],[46,23,13,18]];
    var power=powerArray[Math.round(Math.random()*5)];
    var devicesPowerCompared = echarts.init(document.getElementById('banDevicesPowerCompared'));

    var optionPowerCompared= {
        legend: {
            data : ['空调'+power[0]+'%','新风'+power[1]+'%','排污泵'+power[2]+'%','门禁'+power[3]+'%']
        },
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                smooth:true,
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:power[0], name:'空调'+power[0]+'%'},
                    {value:power[1], name:'新风'+power[1]+'%'},
                    {value:power[2], name:'排污泵'+power[2]+'%'},
                    {value:power[3], name:'门禁'+power[3]+'%'}
                ]
            }
        ]
    };
    devicesPowerCompared.setOption(optionPowerCompared);
}
