
CurrentTime()
get_gauge();
lhistogram();
get_pie();
get_table();

get_waringclass();
get_histogram();
get_wordcloud();



function CurrentTime() {
	function getNow(Mytime) { return Mytime < 10 ? '0' + Mytime : Mytime; }
    var myDate = new Date();
    //获取当前年份
    var year = myDate.getFullYear();
    //获取当前月份
    var month = myDate.getMonth() + 1;
    //获取当前日期
    var date = myDate.getDate();
    //获取当前小时数(0-23)
    var h = myDate.getHours();
    //获取当前分钟数(0-59)
    var m = myDate.getMinutes();
    var s = myDate.getSeconds();
    var Now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
    $("#ntime").text(Now);
        }
        //间隔一秒执行一次获取当前时间的方法
        setInterval(function () { CurrentTime() }, 1000);

function get_gauge(){
	var finishPercentage;
	var chartDom = document.getElementById('gauge');
	var myChart = echarts.init(chartDom, 'dark');
	var option;

	option = {
	  backgroundColor: 'rgba(1,202,217,.2)',
	  series: [
	    {
	      type: 'gauge',
	      progress: {
	        show: true,
	        width: 10
	      },
	      center: ['50%', '60%'],
	      axisLine: {
	        lineStyle: {
	          width: 10
	        }
	      },
	      axisTick: {
	        show: false
	      },
	      splitLine: {
	        show: false
	      },
	      axisLabel: {
	        show: false
	      },
	      anchor: {
	        show: true,
	        showAbove: true,
	        size: 15,
	        itemStyle: {
	          borderWidth: 2
	        }
	      },
	      title: {
	        show: false,
	      },
	      detail: {
	        valueAnimation: true,
	        fontSize: 20,
	        offsetCenter: [0, '70%'],
	        formatter: '{value}%',
	      },
	      data: [
	        {
	          value: 0,
	          name: '打卡率'
	        }
	      ],
	      title:{
			offsetCenter : [0, '-150%']//设置完成率位置
		  }
	    }
	  ]
	};
  myChart.setOption(option, true);

  myChart.showLoading(); //loading动画
  $.ajax({
        type : "POST",
        async : true,
        url : "/today_datanum",
        dataType:"JSON",
        success:function(res) {
            if(res.msg == "success"){
                // console.log(res.data);
                myChart.hideLoading();
                finishPercentage = res.data.finishPercentage.replace("%", "");
                myChart.setOption({
                    series: [
                    	{
	                        data: [
	                        	{ value: finishPercentage, name: '打卡率' },
					        ]
	                    },
	                ],
                });

            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
  	myChart.setOption(option, true);

}

function lhistogram() {
	$.ajax({
        type : "POST",
        async : true,
        url : "/today_datanum",
        dataType:"JSON",
        success:function(res) {
            if(res.msg == "success"){
                // console.log(res.data);
                document.getElementById('rep').innerText = res.data.finishCount
                document.getElementById('unr').innerText = res.data.unreportedCount
                document.getElementById('abn').innerText = res.data.abnormalCount
                $('.sya').each(function(){
				    $(this).prop('Counter',0).animate({
				        Counter: $(this).text()
				    },{
				        duration: 3500,
				        easing: 'swing',
				        step: function (now){
				            $(this).text(Math.ceil(now));
				        }
				    });
				});
            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
}

function get_pie(){
	var chartDom = document.getElementById('pie');
	var myChart = echarts.init(chartDom, 'dark');
	var option;
	option = {
	  title: {
	    // text: 'Referer of a Website',
	    // subtext: 'Fake Data',
	    left: 'center'
	  },
	  tooltip: {
	    trigger: 'item'
	  },
	  legend: {
	    orient: 'vertical',
	    left: 'left'
	  },
	  color: ['#91cc75', '#fac858', '#ee6666'],
	  backgroundColor: 'rgba(1,202,217,.2)',
	  series: [
	    {
	      name: '打卡状态',
	      type: 'pie',
	      label: {
            normal: {
                show: true,
                formatter: '{b}: {c}({d}%)'
            }
          },
          emphasis: {
          	focus: 'self'
          },
	      radius: ['30%', '70%'],
	      data: [],
	      // top: '5%',
	      
	    },
	  ]
	};
	myChart.setOption(option);

	myChart.showLoading(); //loading动画
    $.ajax({
        type : "POST",
        async : true,
        url : "/today_datanum",
        dataType:"JSON",
        success:function(res) {
            if(res.msg == "success"){
                // console.log(res.data);
                var finishCount = res.data.finishCount
                var unreportedCount = res.data.unreportedCount
                var abnormalCount = res.data.abnormalCount
                myChart.hideLoading();
                myChart.setOption({
                    series: [
                    	{
	                        data: [
	                        	{ value: finishCount, name: '已打卡' },
						        { value: unreportedCount, name: '未打卡' },
						        { value: abnormalCount, name: '打卡异常' },
					        ]
	                    },
	                ],
                });
            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
    myChart.setOption(option, true);
};


function get_table(){
    $.ajax({
        type : "POST",
        async : true,
        url : "/today_undonelist",
        dataType:"JSON",
        success: function(res) {
            if(res){
                // console.log(res);
                var abnormal_list = res.Abnormal.data.tableData
                for (i in abnormal_list){
                	var info = abnormal_list[i]
                	thead='<td style="width: 12%">' + info['提交状态'] + '</td><td style="width: 16%">' + info['姓名'] + '</td><td style="width: 24%">' + info['学号'] + '</td><td style="width: 47%">' + info['班级'] + '</td>'
                	$("#cmt").append('<tr class="text-danger">' + thead + '</tr>')
                }

                var unreported_list = res.Unreported.data.tableData
                for (i in unreported_list){
                	var info = unreported_list[i]
                	thead='<td style="width: 12%">' + info['提交状态'] + '</td><td style="width: 16%">' + info['姓名'] + '</td><td style="width: 24%">' + info['学号'] + '</td><td style="width: 47%">' + info['班级'] + '</td>'
                	$("#cmt").append('<tr class="text-warning">' + thead + '</tr>')
                }
            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
};





function get_waringclass(){
	var chartDom = document.getElementById('lagclass');
    var cavheight = document.getElementById("lagclass").offsetHeight; 
	var myChart = echarts.init(chartDom, 'dark', {height:cavheight});
	var option;

  option = {
    legend: {},
    backgroundColor: 'rgba(1,202,217,.2)',
	  // color: ['#fac858', '#ee6666', '#4292e1'],
    tooltip: {
      trigger: 'axis',
      showContent: false
    },
    dataset: {
      source: []
    },
	tooltip: {
	    trigger: 'axis',
	    axisPointer: {
	      type: 'line',
	      lineStyle: {
	        color: {
	          type: 'line',
	          x: 0,
	          y: 0,
	          x2: 1,
	          y2: 1,
	          colorStops: [{
	            offset: 0, color: 'rgba(0, 6, 20, 0.3)'
	          }, {
	            offset: 1, color: 'rgba(0, 6, 20, 0.3)'
	          }],
	        },
	        type: 'solid',
	        width: 70,
	      },
	    }
	  },
    xAxis: { gridIndex: 0 },
    yAxis: { 
    	type: 'category',
    	axisLabel: {
	      // x轴文本换行
	      formatter: function (params) {
	        var newParamsName = '' // 最终拼接成的字符串
	        var paramsNameNumber = params.length // 实际标签的个数
	        var provideNumber = 10 // 每行能显示的字的个数
	        var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
	        // 条件等同于rowNumber>1
	        if (paramsNameNumber > provideNumber) {
	          // 循环每一行,p表示行
	          for (var p = 0; p < rowNumber; p++) {
	            var tempStr = "" // 表示每一次截取的字符串
	            var start = p * provideNumber // 开始截取的位置
	            var end = start + provideNumber // 结束截取的位置
	            // 此处特殊处理最后一行的索引值
	            if (p == rowNumber - 1) tempStr = params.substring(start, paramsNameNumber)
	            else tempStr = params.substring(start, end) + "\n" // 每一次拼接字符串并换行
	            newParamsName += tempStr // 最终拼成的字符串
	          }
	        } else {
	          newParamsName = params // 将旧标签的值赋给新标签
	        }
	        return newParamsName
	      }
	    }
    },
    grid: { 
    	top: '42%',
	    left: '20%',
	    right: '4%',
	    bottom: '5%',
	    // height: "80px",
    	 },
    series: [
      {
        type: 'bar',
        label: {
	        show: true,
	        // show: false
	      },
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'bar',
        label: {
	        show: true,
	        // show: false
	      },
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      // {
      //   type: 'pie',
      //   id: 'pie',
      //   radius: '30%',
      //   center: ['50%', '25%'],
      //   emphasis: {
      //     focus: 'self'
      //   },
      //   label: {
      //     formatter: '{b}: {@2012} ({d}%)'
      //   },
      //   encode: {
      //     itemName: '班级',
      //     value: '2012',
      //     tooltip: '2012'
      //   }
      // }
    ]
  };
  myChart.on('updateAxisPointer', function (event) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      myChart.setOption({
        series: {
          id: 'pie',
          label: {
            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
          },
          encode: {
            value: dimension,
            tooltip: dimension
          }
        }
      });
    }
  });


	myChart.setOption(option);

	myChart.showLoading();
	$.ajax({
        type : "POST",
        async : true,
        url : "/waring_class",
        dataType:"JSON",
        success: function(res) {
            if(res){
                var rankJson = {}
                for (className in res){
                	rankJson[className] = res[className].sumCount
                }

                var rankArray = []
                for (className in res){
                	var i = {}
                	i['className'] = className
                	i['unreportedCount'] = res[className].Unreported
                	i['abnormalCount'] = res[className].Abnormal
                	i['sumCount'] = res[className].sumCount
                	rankArray.push(i)
                }
                function sortIdDesc(a,b){  
				   return b.sumCount-a.sumCount
				}
				rankArray.sort(sortIdDesc)
                // console.log(rankArray)
                rankArray = rankArray.slice(0,5)
                var rankClass = []
                var unreportedCount = []
                var abnormalCount = []
                for (item in rankArray){
                	rankClass.push(rankArray[item].className)
					unreportedCount.push(rankArray[item].unreportedCount)
					abnormalCount.push(rankArray[item].abnormalCount)
                }
                rankClass = rankClass.reverse()
                unreportedCount = unreportedCount.reverse()
                abnormalCount = abnormalCount.reverse()
                rankClass.unshift('班级')
                unreportedCount.unshift('未打卡')
                abnormalCount.unshift('打卡异常')

                myChart.hideLoading();
     			myChart.setOption({
	     			dataset: {
						source: [
						    rankClass,
						    unreportedCount,
						    abnormalCount,
						]
					},
					series: [
						{
						    type: 'pie',
						    id: 'pie',
						    radius: '30%',
						    center: ['50%', '25%'],
						    emphasis: {
						      focus: 'self'
						    },
						    label: {
							  formatter: '{b}: {@' + rankClass[5] + '} ({d}%)'
							},
						    encode: {
						      itemName: '班级',
						      value: rankClass[5],
						      tooltip: rankClass[5],
						    },
						},
					]
     			})
            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
    myChart.setOption(option, true);
}



function get_histogram(){

	var chartDom = document.getElementById('histogram');
	var myChart = echarts.init(chartDom, 'dark');
	var option;
	
	option = {
	  color: ['#fac858', '#ee6666', '#4292e1'],
	  backgroundColor: 'rgba(1,202,217,.2)',
	  grid: {
        top:'15%',
        left: '1%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
	  tooltip: {
	    trigger: 'axis',
	    axisPointer: {
	      type: 'line',
	      lineStyle: {
	        color: {
	          type: 'line',
	          x: 0,
	          y: 0,
	          x2: 1,
	          y2: 1,
	          colorStops: [{
	            offset: 0, color: 'rgba(0, 6, 20, 0.3)'
	          }, {
	            offset: 1, color: 'rgba(0, 6, 20, 0.3)'
	          }],
	        },
	        type: 'solid',
	        width: 66
	      },
	    }
	  },
	  
	  legend: {
	    data: ['未打卡', '打卡异常', '两者之和']
	  },
	  xAxis: [
	    {
	      type: 'category',
	      // axisTick: { show: false },
	      show: false,
	      data: [],
	    }
	  ],
	  yAxis: [
	    {
	      type: 'value',
	      // show: false,
	    },
	    {
	      type: 'value',
	      interval: 5,
	      show: false,
	      axisLabel: {
	        formatter: '{value}'
	      },
	    }
	  ],
	  series: [
	    {
	      name: '未打卡',
	      type: 'bar',
	      barWidth: 26,
	      label: {
	        show: true,
	        // show: false
	      },
	      emphasis: {
	        focus: 'series'
	      },
	      data: [],
	    },
	    {
	      name: '打卡异常',
	      type: 'bar',
	      barWidth: 26,
	      label: {
	      	show: true,
	      },
	      emphasis: {
	        focus: 'series'
	      },
	      data: [],
	    },
	    {
	      name: '两者之和',
	      type: 'line',
	      yAxisIndex: 1,
	      tooltip: {
	        valueFormatter: function (value) {
	          return value;
	        }
	      },
	      data: []
	    }
	  ]
	};
	myChart.setOption(option);

	myChart.showLoading();
    $.ajax({
        type : "POST",
        async : true,
        url : "/get_weektrend",
        dataType:"JSON",
        success:function(res) {
            if(res){
                // console.log(res);
                var dateList = []
                var unreportedCount = []
                var abnormalCount = []
                for (i in res['weektrend']){
                	// console.log(res['weektrend'][i])
                	dateList.push(res['weektrend'][i].date)
                	unreportedCount.push(res['weektrend'][i].Unreported)
                	abnormalCount.push(res['weektrend'][i].Abnormal)
                }
                // console.log(dateList)
                var sumCount = []
                for (i in unreportedCount){
                	sumCount.push(unreportedCount[i] + abnormalCount[i])
                }

                myChart.hideLoading();
                myChart.setOption({
                	xAxis: [
					    {
					      data: dateList,
					    }
					],
                    series: [
                        {data: unreportedCount},
					    {data: abnormalCount},
					    {data: sumCount},
                    ],
                });
            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
    myChart.setOption(option, true);

}

function get_wordcloud(){
	var chartDom = document.getElementById('wordcloud');
	var myChart = echarts.init(chartDom, 'dark');
	var option;

	option = {
		backgroundColor: 'rgba(1,202,217,0.2)',
		series: [{
	        type: 'wordCloud',
	        shape: 'circle',
	        keepAspect: false,

	        left: 'center',
	        top: 'center',
	        width: '70%',
	        height: '80%',
	        right: null,
	        bottom: null,

	        sizeRange: [12, 40],

	        rotationRange: [-45, 45],
	        rotationStep: 45,

	        gridSize: 30,
	        drawOutOfBound: false,
	        layoutAnimation: true,

	        // Global text style
	        textStyle: {
	            fontFamily: 'sans-serif',
	            fontWeight: 'bold',
	            // Color can be a callback function or a color string
	            color: function () {
	                // Random color
	                return 'rgb(' + [
	                    Math.round(Math.random() * 200),
	                    Math.round(Math.random() * 200),
	                    Math.round(Math.random() * 200)
	                ].join(',') + ')';
	            }
	        },
	        emphasis: {
	            focus: 'self',

	            textStyle: {
	                textShadowBlur: 10,
	                textShadowColor: '#333'
	            }
	        },
	        data: [],
	    }]
	};

	myChart.setOption(option);

	myChart.showLoading();
    $.ajax({
        type : "POST",
        async : true,
        url : "/get_wordcloud",
        dataType:"JSON",
        success:function(res) {
            if(res){
                // console.log(res);
                var wordclouddata = res['wordcloud']
                // console.log(wordclouddata)
                myChart.hideLoading();
                myChart.setOption({
                	series: [
                		{
                			data: wordclouddata,
                		},
                	],
                	
                });
            }
            else{
                 console.log("error");
            }
        },
        error : function(errorMsg) {
            console.log(errorMsg);
        }
    });
    myChart.setOption(option, true);
}