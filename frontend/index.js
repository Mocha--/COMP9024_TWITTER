$(document).ready(function() {
	var height = window.screen.availHeight;
	$('.cluster .background').css({'height': height + 100 + 'px'});
	$('.cluster .section').css({'height': height + 'px'});

});

var sections = [];
sections = document.getElementsByClassName("section");
 // console.log(sections);
var index = 0;

var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
 
if (document.attachEvent) //if IE (and Opera depending on user setting)
    document.attachEvent("on" + mousewheelevt, sectionChange);
else if (document.addEventListener) //WC3 browsers
    document.addEventListener(mousewheelevt, sectionChange, false);


function sectionChange(e) {
	var evt = window.event || e;
	var delta = evt.detail? evt.detail * (-120) : evt.wheelDelta;
	if(index < sections.length - 1 && delta <= -200) {
		index = index + 1;
		$('html,body').animate({ scrollTop: sections[index].offsetTop }, 600, function () {
        $(sections[index]).find('.title').addClass('left-to-center');         
    });
    $(sections[index]).find('.title').removeClass('left-to-center');
	}
	if(index > 0 && delta >= 200) {
		index = index - 1;
		$('html,body').animate({ scrollTop: sections[index].offsetTop }, 600, function () {
       $(sections[index]).find('.title').addClass('left-to-center');          
    });
    $(sections[index]).find('.title').removeClass('left-to-center');
	}
	if (evt.preventDefault) //disable default wheel action of scrolling page
        evt.preventDefault()
    else
        return false
}
