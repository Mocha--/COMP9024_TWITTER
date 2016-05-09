

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
    console.log(1);
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
            console.log(1);
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
                        text: 'Population',
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
        $('#travelToOverseas').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Stacked column chart',
            },
            xAxis: {
                categories: ['Melbourne', 'Sydney', 'Brisbane', 'Adalaide', 'Perth'],
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
                    text: 'Population',
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
                name: 'John',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Jane',
                data: [2, 2, 3, 2, 1]
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5]
            }]
        });
        requestSent = false;
    }

    if(index === 4) {
        var categories = [{"name": "Asia", "countries": ["China", "Korea"], "positive": 45, "negative": 55}, {"name": "Europe", "countries": ["UK", "Italy"], "positive": 45, "negative": 55}];
        var ca = eval(categories);
        var positive = [];
        var negative = [];
        var continents = [];
        for(var i = 0; i < categories.length; i ++) {
            positive.push(categories[i].positive);
            negative.push(categories[i].negative);
            continents.push(categories[i].name);
        }
        $('#domesticFrom').highcharts({
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
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population',
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
    }//

    if(index === 5) {
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
                categories: categories,
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
                categories: categories,
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
                        return Math.abs(this.value) + '%';
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
                    return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },

            series: [{
                name: 'Male',
                data: [-2.2, -2.2, -2.3, -2.5, -2.7, -3.1, -3.2,
                    -3.0, -3.2, -4.3, -4.4, -3.6, -3.1, -2.4,
                    -2.5, -2.3, -1.2, -0.6, -0.2, -0.0, -0.0]
            }, {
                name: 'Female',
                data: [2.1, 2.0, 2.2, 2.4, 2.6, 3.0, 3.1, 2.9,
                    3.1, 4.1, 4.3, 3.6, 3.4, 2.6, 2.9, 2.9,
                    1.8, 1.2, 0.6, 0.1, 0.0]
            }]
        });
        requestSent = false;
    }//

    if(index === 6) {
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
                    text: 'Population',
                    style: {
                        color: Highcharts.getOptions().colors[1],
                        fontSize:'20px'
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Average Income (AUD/Per year)',
                    style: {
                        color: Highcharts.getOptions().colors[0],
                        fontSize:'20px'
                    }
                },
                labels: {
                    format: '{value} mm',
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
                name: 'Population',
                type: 'column',
                yAxis: 1,
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                tooltip: {
                    valueSuffix: ' mm'
                }

            }, {
                name: 'Average Income',
                type: 'spline',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                tooltip: {
                    valueSuffix: '°C'
                }
            }]
        });
        requestSent = false;
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





