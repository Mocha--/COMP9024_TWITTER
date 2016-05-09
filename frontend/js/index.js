

//*************************** Data on the top ********************************
var data = 0;
$('.cluster .currentData').addClass('currentData').attr('data-content', data);
setInterval(function() {
    data = data + 13;
    $('.cluster .currentData').addClass('currentData').attr('data-content', data);
}, 5000);

//*************************** wheel ********************************
var sections = [];
sections = document.getElementsByClassName("section");
 // console.log(sections);
var index = 0;

var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
 
if (document.attachEvent) //if IE (and Opera depending on user setting)
    document.attachEvent("on" + mousewheelevt, sectionChange);
else if (document.addEventListener) //WC3 browsers
    document.addEventListener(mousewheelevt, sectionChange, false);

var isFinished = true;

var requestSent = false;

function sectionChange(e) {
	var evt = window.event || e;
	var delta = evt.detail? evt.detail * (-120) : evt.wheelDelta;
    if(isFinished) {
        if(index < sections.length - 1 && delta <= -180) {
            scrollFunc(1);           
        }    
        if(index > 0 && delta >= 180) {
            scrollFunc(-1);         
        }
    }
	
	if (evt.preventDefault) //disable default wheel action of scrolling page
        evt.preventDefault();
    else
        return false;
}

function scrollFunc(change) {
    isFinished = false;
    index = index + change;
        $('html,body').animate({ scrollTop: sections[index].offsetTop }, 600, function () { 
            if(requestSent) return;
            $(sections[index]).find('.charts').removeClass('hidden');      
            $(sections[index]).find('.title').addClass('left-to-center'); 
            if(!requestSent) {
                requestSent = true;
                loadchart(index);
            }                      
            $(sections[index - change]).find('.charts').addClass('hidden');  
            isFinished = true;
            if(index === sections.length - 1) {
                $('.cluster .nextPage').addClass('hidden');
            }
            else if(index === 0) {
                $('.cluster .previousPage').addClass('hidden');
            }
            else {
                $('.cluster .nextPage').removeClass('hidden');
                $('.cluster .previousPage').removeClass('hidden');
            }

            if(index === 0) {
                $('.cluster .menu .overview').addClass('active');
                $('.cluster .menu .overseas').removeClass('active');
                $('.cluster .menu .domestic').removeClass('active');
            }
            else if(index > 0 && index < 4) {
                $('.cluster .menu .overview').removeClass('active');
                $('.cluster .menu .overseas').addClass('active');
                $('.cluster .menu .domestic').removeClass('active');
            }
            else {
                $('.cluster .menu .overview').removeClass('active');
                $('.cluster .menu .overseas').removeClass('active');
                $('.cluster .menu .domestic').addClass('active');
            }
        });
    $(sections[index]).find('.title').removeClass('left-to-center');
}


//****************************** charts *********************************

function loadchart(index) {  

    if(index === 0) {
        $.getJSON("http://localhost:8080/graph1",function(data) {
            $('#pie-chart').highcharts({
                chart: {
                    // backgroundColor: "transparent",
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {text: 'Browser market shares. January, 2015 to May, 2015'},
                tooltip: {
                    pointFormat: '<b>{point.name}: </b><b>{point.y} tweets</b>', 
                    style: {fontSize: '18px'},          
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: '#fff',
                                fontSize: '18px',
                            },
                            connectorColor: '#fff'
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    data: data,
                }]
            });
        requestSent = false;
        });
    }

    if(index === 1) {
        $.getJSON("http://localhost:8080/graph2",function(data) {
            var positive = [];
            var negative = [];
            var continents = [];
            for(var i = 0; i < data.length; i ++) {
                positive.push(data[i].positive);
                negative.push(data[i].negative);
                continents.push(data[i].name);
            }
            $('#overseas').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Stacked column chart'
                },
                xAxis: {
                    categories: continents,
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Tourists',
                        style: {
                            color: '#fff',
                            fontSize: '20px'
                        }
                    },
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: '16px',
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 0,
                    shadow: false,
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'16px'
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px white',
                                fontSize: '15px'
                            }
                        }
                    }
                },
                series: [{
                    name: 'positive',
                    data: positive
                }, {
                    name: 'negative',
                    data: negative
                }]
            });
        requestSent = false;
        });
    }//

    if(index === 2) {
        $.getJSON('http://localhost:8080/graph3', function (data) {

        // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
        $.each(data, function () {
            this.flag = this.code.replace('UK', 'GB').toLowerCase();
        });

        // Initiate the chart
        $('#heatmap').highcharts('Map', {

            title: {
                text: 'Tourists Distribution'
            },

            legend: {
                title: {
                    text: 'Number of Tweets',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            tooltip: {
                backgroundColor: 'none',
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                padding: 0,
                pointFormat: '<span class="f32"><span class="flag {point.flag}"></span></span>' +
                    ' {point.name}: <b>{point.value}</b>',
                positioner: function () {
                    return { x: 0, y: 250 };
                }
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic'
            },

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Number of Tweets',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                }
            }]
        });
        requestSent = false;
    });
    }

    if(index === 3) {
        $.getJSON("http://localhost:8080/graph4",function(data) {
            var overseas = [];
            var domestic = [];
            var cities = [];
            for(var i = 0; i < data.length; i ++) {
                overseas.push(data[i].overseas);
                domestic.push(data[i].domestic);
                cities.push(data[i].name);
            }
            $('#travelToOverseas').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Stacked column chart',
                },
                xAxis: {
                    categories: cities,
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Tourists',
                        style: {
                            color: '#fff',
                            fontSize: '20px'
                        }

                    },
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: '16px'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 0,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px white',
                                fontSize: '15px'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Domestic',
                    data: domestic
                }, {
                    name: 'Overseas',
                    data: overseas
                }]
            });
            requestSent = false;
        });
    }//

    if(index === 4) {
        $.getJSON("http://localhost:8080/graph5",function(data) {
            var positive = [];
            var negative = [];
            var states = [];
            for(var i = 0; i < data.length; i ++) {
                positive.push(data[i].positive);
                negative.push(data[i].negative);
                states.push(data[i].name);
            }
            $('#domesticFrom').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Stacked column chart'
                },
                xAxis: {
                    categories: states,
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    },
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Tourists',
                        style: {
                            color: '#fff',
                            fontSize:'20px'
                        }
                    },
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#fff'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 0,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
                            style: {
                                textShadow: '0 0 3px white',
                                fontSize: '15px'
                            }
                        }
                    }
                },
                series: [{
                    name: 'positive',
                    data: positive
                }, {
                    name: 'negative',
                    data: negative
                }]
            });
            requestSent = false;
        });
    }//

    if(index === 5) {
        $.getJSON("http://localhost:8080/graph6",function(data) {
            var states = [];
            var melbourne = [];
            var sydney = []
            for(var i = 0; i < data.length; i ++) {
                states.push(data[i].state);
                melbourne.push(-data[i].melbourne);
                sydney.push(data[i].sydney);
            }
            $('#melbourneSydney').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Population pyramid for Germany, 2015'
                },
                subtitle: {
                    text: 'Source: <a href="http://populationpyramid.net/germany/2015/">Population Pyramids of the World from 1950 to 2100</a>'
                },
                xAxis: [{
                    categories: states,
                    reversed: false,
                    labels: {
                        step: 1,
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    }
                }, { // mirror axis on right side
                    opposite: true,
                    reversed: false,
                    categories: states,
                    linkedTo: 0,
                    labels: {
                        step: 1,
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    }
                }],
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function () {
                            return Math.abs(this.value);
                        },
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    }
                },
                legend: {
                    itemStyle: {
                     font: '18px Unica One, sans-serif',
                     color: '#fff'
                  },
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + ', ' + this.point.category + '</b><br/>' +
                            'Tourists: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                    }
                },

                series: [{
                    name: 'Melbourne',
                    data: melbourne
                }, {
                    name: 'Sydney',
                    data: sydney
                }]
            });
            requestSent = false;
        });
    }//

    if(index === 6) {
        $.getJSON("http://localhost:8080/graph7",function(data) {
            var states = [];
            var income = [];
            var population = [];
            for (var i = 0; i < data.length; i ++) {
                states.push(data[i].state);
                income.push(data[i].income);
                population.push(data[i].number);
            }
            $('#travelerIncome').highcharts({
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: 'Average Monthly Temperature and Rainfall in Tokyo'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: [{
                    categories: states,
                    crosshair: true,
                    labels: {
                        style: {
                            color: '#fff',
                            fontSize:'18px'
                        }
                    }
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[1],
                            fontSize:'18px'
                        }
                    },
                    title: {
                        text: 'Average Income (AUD/Per year)',
                        style: {
                            color: Highcharts.getOptions().colors[1],
                            fontSize:'20px'
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Number of Tourists',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize:'20px'
                        }
                    },
                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize: '18px'
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    x: 120,
                    verticalAlign: 'top',
                    y: 100,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                series: [{
                    name: 'Number of Tourists',
                    type: 'column',
                    yAxis: 1,
                    data: population,
                    tooltip: {
                        valueSuffix: ''
                    }

                }, {
                    name: 'Average Income',
                    type: 'spline',
                    data: income,
                    tooltip: {
                        valueSuffix: 'AUD'
                    }
                }]
            });
            requestSent = false;
        });
    }//


}
//******************** Initialization **************************
$(document).ready(function() {
    var height = window.screen.availHeight;
    $('.cluster .background').css({'height': height + 50 + 'px'});
    $('.cluster .section').css({'height': height + 'px'});
    loadchart(index);
    $('.cluster .previousPage').addClass('hidden');

    //********************* menu button ******************************
$('.cluster .menu .overview').click(function() {
    scrollFunc(-index);
});
$('.cluster .menu .overseas').click(function() {
    scrollFunc(1 - index);
});
$('.cluster .menu .domestic').click(function() {
    scrollFunc(4 - index);
});

//******************** turn over the page *************************
$('.cluster .previousPage a').click(function() {
        if(index > 0)
            scrollFunc(-1);
    });
    $('.cluster .nextPage a').click(function() {
        if(index < sections.length - 1)
            scrollFunc(1);
    });
});





