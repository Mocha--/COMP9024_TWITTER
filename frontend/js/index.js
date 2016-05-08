$(document).ready(function() {
	var height = window.screen.availHeight;
	$('.cluster .background').css({'height': height + 50 + 'px'});
	$('.cluster .section').css({'height': height + 'px'});
    loadchart(index);
});

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
            $(sections[index]).removeClass('hidden');
            $(sections[index]).find('.title').addClass('left-to-center'); 
            loadchart(index);
            $(sections[index - change]).addClass('hidden');
            isFinished = true;
        });
    $(sections[index]).find('.title').removeClass('left-to-center');
}


//****************************** charts *********************************

function loadchart(index) {  

    if(index === 0) {
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
                pointFormat: '<b>{point.name}: </b><b>{point.percentage:.1f}%</b>', 
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
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white',
                            fontSize: '18px',
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Brands',
                data: [
                    { name: 'Domestic', y: 56.33 },
                    {
                        name: 'Overseas',
                        y: 43.67,
                        sliced: true,
                        selected: true
                    },
                ]
            }]
        });
    }

    if(index === 1) {
        $('#overseas').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Stacked column chart'
            },
            xAxis: {
                categories: ['Asia', 'Europe', 'North America', 'Oceania', 'South America'],
                style: {fontSize: '18px'},
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
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
                borderWidth: 1,
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
                            textShadow: '0 0 3px black'
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
    }

    if(index === 3) {
        $('#travelToOverseas').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Stacked column chart'
            },
            xAxis: {
                categories: ['Melbourne', 'Sydney', 'Brisbane', 'Adalaide', 'Perth'],
                style: {fontSize: '18px'},
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
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
                borderWidth: 1,
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
                            textShadow: '0 0 3px black'
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
    }
}



