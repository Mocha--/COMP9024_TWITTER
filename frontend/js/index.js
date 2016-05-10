
var apiBase = 'http://115.146.85.141/api/v1';
//*************************** Data on the top ********************************
var data = 0;
$('.cluster .currentData').addClass('currentData').attr('data-content', data);
setInterval(function() {
    $.getJSON(apiBase + '/amount', function(data) {
        $('.cluster .currentData').addClass('currentData').attr('data-content', data.amount);
    });
    
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
    if(isFinished && !requestSent) {
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
            else if(index > 0){
                requestSent = true;
                loadchart(index);
            }
            $(sections[index]).find('.title').addClass('left-to-center');

            isFinished = true;
            if(index === sections.length - 1) {
                $('.cluster .nextPage').addClass('hidden');
            }
            else if(index === 0) {
                $('.cluster .previousPage').addClass('hidden');
                $('.cluster .profile .image').addClass('scale');
            }
            else {
                $('.cluster .nextPage').removeClass('hidden');
                $('.cluster .previousPage').removeClass('hidden');
                $('.cluster .profile .image').removeClass('scale');
            }
            if (index === 0) {
                $('.cluster .menu .overview').removeClass('active');
                $('.cluster .menu .overseas').removeClass('active');
                $('.cluster .menu .domestic').removeClass('active');
            }
            else if(index === 1) {
                $('.cluster .menu .overview').addClass('active');
                $('.cluster .menu .overseas').removeClass('active');
                $('.cluster .menu .domestic').removeClass('active');
            }
            else if(index > 1 && index < 5) {
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

    if(index === 1) {
        $.getJSON(apiBase + "/graph1",function(data) {
            $('#pie-chart').highcharts({
                chart: {
                    // backgroundColor: "transparent",
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {text: 'Propotion of Australian tourists travelling overseas and domestically'},
                tooltip: {
                    pointFormat: '<b>{point.name}: </b><b>{point.y}</b>',
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

    if(index === 2) {
        $.getJSON(apiBase + "/graph2",function(data) {
            var positive = [];
            var negative = [];
            var continents = [];
            var countries = [];
            for(var i = 0; i < data.length; i ++) {
                positive.push(data[i].positive);
                negative.push(data[i].negative);
                continents.push(data[i].name);
                countries.push(data[i].countries);
            }
            console.log(negative);
            $('#overseas').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Distribution of Australian tourists traveling overseas by different continents'
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
                    formatter: function () {
                        var output = '<b>' + 'Most Popular Countries: ' + '</b><br/>';
                        for(var i = 0; i < data.length; i ++) {
                            if(data[i].name == this.point.category) {
                                for(var j = 1; j <= data[i].countries.length; j ++) {
                                    var percentage = data[i].countries[j-1].percentage * 100;
                                    output = output + '<b>' + j + '. ' + data[i].countries[j-1].name + ' : ' + parseInt(percentage) + '%' + '</b><br/>'; 
                                }
                                break;
                            }
                        }
                        return output;
                    },
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

    if(index === 3) {
        $.getJSON(apiBase + '/graph3', function (data) {

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
                    ' {point.name}: <b style="font-size:12px;">{point.value}</b>',
                positioner: function () {
                    return { x: 0, y: 250 };
                }
            },

            colorAxis: {
                min: 1,
                max: 2000,
                type: 'logarithmic',
                minColor: '#FFF5B5',
                maxColor: '#FE4E6E'
            },

            series : [{
                data : data,
                mapData: Highcharts.maps['custom/world'],
                joinBy: ['iso-a2', 'code'],
                name: 'Number of Tweets',
                states: {
                    hover: {
                        color: '#78DEC9'
                    }
                }
            }]
        });
        requestSent = false;
    });
    }

    if(index === 4) {
        $.getJSON(apiBase + "/graph4",function(data) {
            var overseas = [];
            var domestic = [];
            var cities = [];
            for(var i = 0; i < data.length; i ++) {
                overseas.push(data[i].overseas);
                domestic.push(data[i].domestic);
                cities.push(data[i].name);
            }
            console.log(overseas);
            console.log(domestic);
            console.log(cities);
            $('#travelToOverseas').highcharts({
                chart: {
                    type: 'column'
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

    if(index === 5) {
        $.getJSON(apiBase + "/graph5",function(data) {
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
                    text: 'With top 5 cities of each state'
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
                    formatter: function () {
                        var output = '<b>' + 'Most Popular Cities: ' + '</b><br/>';
                        for(var i = 0; i < data.length; i ++) {
                            if(data[i].name == this.point.category) {
                                for(var j = 1; j <= data[i].cities.length; j ++) {
                                    var percentage = data[i].cities[j-1].percentage * 100;
                                    output = output + '<b>' + j + '. ' + data[i].cities[j-1].name + ' : ' + parseInt(percentage) + '%' + '</b><br/>'; 
                                }
                                break;
                            }
                        }
                        return output;
                    },
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

    if(index === 6) {
        $.getJSON(apiBase + "/graph6",function(data) {
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
                    text: 'Distribution of Australian tourists in Melbourne/Sydney traveling domestically by different states'
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
                    formatter: function() {
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

    if(index === 7) {
        $.getJSON(apiBase + "/graph7",function(data) {
            var states = [];
            var income = [];
            var population = [];
            for (var i = 0; i < data.length; i ++) {
                states.push(data[i].state);
                income.push(data[i].income);
                population.push(parseFloat((data[i].percentage * 10).toFixed(2)));
            }
            console.log(population);
            $('#travelerIncome').highcharts({
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: null,
                },
                subtitle: {
                    text: 'Income Source: https://www.livingin-australia.com/salaries-australia/'
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
                        text: 'Number of Tourists/Total population',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize:'20px'
                        }
                    },
                    labels: {
                        format: '{value}‱',
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
                    name: 'Number of Tweets/Total Population',
                    type: 'column',
                    yAxis: 1,
                    data: population,
                    tooltip: {
                        valueSuffix: '‱'
                    }

                }, {
                    name: 'Average Income',
                    type: 'spline',
                    data: income,
                    tooltip: {
                        valueSuffix: ' AUD'
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
    scrollFunc(1 - index);
});
$('.cluster .menu .overseas').click(function() {
    scrollFunc(2 - index);
});
$('.cluster .menu .domestic').click(function() {
    scrollFunc(5 - index);
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
