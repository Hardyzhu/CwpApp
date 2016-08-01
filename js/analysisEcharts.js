
//var getOption = function(chartType) {
//	var chartOption= {
//		legend: {
//			data: ['故障统计']
//		},
//		color:['#007aff'],//设置曲线颜色
//		grid: {
//			x: 60,
//			x2: 30,
//			y: 35,
//			y2: 30
//		},
//		tooltip : {    //	气泡提示框
//			trigger: 'axis' //直角坐标系中的一个坐标轴，坐标轴可分为类目型、数值型或时间型
//		},
//		calculable: true,
//		xAxis: [{
//			type: 'category',
//			boundaryGap : false,
//			data: ['1月', '2月', '3月', '4月', '5月', '6月']
//		}],
//		yAxis: [{
//			type: 'value',
//			axisLabel : {//设置纵坐标的单位
//				formatter: '{value} kwh'
//			}
//		}],
//		series: [{
//			name: '故障统计',
//			type:'line',
//			smooth:true,
//			itemStyle: {normal: {areaStyle: {type: 'default'}}},//图表样式设置
//			data: [31, 35, 24, 26, 50, 75]
//		}]
//	}
//	return chartOption;
//};
//var byId = function(id) {
//	return document.getElementById(id);
//};
//var lineChart = echarts.init(byId('lineChart'));
//lineChart.setOption(getOption('line'));
	
var orderEcharts = echarts.init(document.getElementById('lineChart'));
orderEcharts.setOption({
    legend: {
        data:['设备数','故障数']
    },
    color:["#87cefa","#fa7d3c"],
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['空调','新风','排污泵','门禁']
        }
    ],
    yAxis : [
        {
            type : 'value',
            splitArea : {show : true}
        }
    ],
    series : [
        {
            name:'设备数',
            type:'bar',
            data:[20, 30, 7, 25]
        },
        {
            name:'故障数',
            type:'bar',
            data:[2, 6, 9, 7]
        }
    ]
});



<!--第二个；列表展示-->
//
//var getOption1= function(chartType) {
//	var chartOption ={
//		legend: {
//			data: ['耗电量统计']
//		},
//		color:['#007aff'],//设置曲线颜色
//		grid: {
//			x: 60,
//			x2: 30,
//			y: 35,
//			y2: 30
//		},
//		tooltip : {    //	气泡提示框
//			trigger: 'axis' //直角坐标系中的一个坐标轴，坐标轴可分为类目型、数值型或时间型
//		},
//		calculable: true,
//		xAxis: [{
//			type: 'category',
//			boundaryGap : false,
//			data: ['1月', '2月', '3月', '4月', '5月', '6月']
//		}],
//		yAxis: [{
//			type: 'value',
//			axisLabel : {//设置纵坐标的单位
//				formatter: '{value} kwh'
//			}
//		}],
//		series: [{
//			name: '耗电量统计',
//			type:'line',
//			smooth:true,
//			itemStyle: {normal: {areaStyle: {type: 'default'}}},//图表样式设置
//			data: [80, 35, 67, 26, 77, 45]
//		}]
//	}
//	return chartOption;
//};
//var byId = function(id) {
//	return document.getElementById(id);
//};
//var lineChart = echarts.init(byId('lineChart2'));
//lineChart.setOption(getOption1('line'));
