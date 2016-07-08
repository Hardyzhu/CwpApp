
var getOption = function(chartType) {
	var chartOption = chartType == 'pie' ? {
		calculable: false,
	} : {
		legend: {
			data: ['故障统计']
		},
		grid: {
			x: 35,
			x2: 10,
			y: 30,
			y2: 25
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			}
		}],
		series: [{
			name: '故障统计',
			type: chartType,
			data: [31, 35, 24, 26, 50, 75, 65, 56, 43, 27, 20, 28]
		}]
	};
	return chartOption;
};
var byId = function(id) {
	return document.getElementById(id);
};
var lineChart = echarts.init(byId('lineChart'));
lineChart.setOption(getOption('line'));
	


<!--第二个；列表展示-->

var getOption1= function(chartType) {
	var chartOption = chartType== 'pie' ? {
		calculable: false,
	} : {
		legend: {
			data: ['耗电量统计']
		},
		grid: {
			x: 35,
			x2: 10,
			y: 30,
			y2: 25
		},
		toolbox: {
			show: false,
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: false,
		xAxis: [{
			type: 'category',
			data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{
			type: 'value',
			splitArea: {
				show: true
			}
		}],
		series: [{
			name: '耗电量统计',
			type: chartType,
			data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
		}]
	};
	return chartOption;
};
var byId = function(id) {
	return document.getElementById(id);
};
var lineChart = echarts.init(byId('lineChart2'));
lineChart.setOption(getOption1('line'));
