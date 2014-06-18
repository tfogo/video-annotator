'use strict';

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}

var showSelector = function(position) {
    $('.selector').css({
        'display': 'block',
        'left': position + 'px'
    });
}

var mouseDownOnBar = function(event) {
    var positionInDiv = event.pageX - $(this).offset().left;
    var percentage = positionInDiv/$(this).width();
    $('.watched-bar').width(positionInDiv);
    event.data.video.currentTime = event.data.duration*percentage;
    event.data.bar = $(this);
    $(window).mousemove(event.data, function(event) {
        var positionInDiv = event.pageX - event.data.bar.offset().left;
        var percentage = positionInDiv/event.data.bar.width();
        $('.watched-bar').width(positionInDiv);
        event.data.video.currentTime = event.data.duration*percentage;
    });
};

var mouseDownOnArrow = function(event) {
    event.stopPropagation();
    console.log('mouseDownOnArrow');
    var positionInDiv = event.pageX - $(this).parent().offset().left;
    var percentage = positionInDiv/$(this).parent().width();
    $(this).css({
        'left': positionInDiv - 10 + 'px'
    });
    event.data.video.currentTime = event.data.duration*percentage;
    event.data.arrow = $(this);
    $(window).mousemove(event.data, function(event) {
        var positionInDiv = event.pageX - event.data.arrow.parent().offset().left;
        var percentage = positionInDiv/event.data.arrow.parent().width();
        event.data.arrow.css({
            'left': positionInDiv - 10 + 'px'
        });
        event.data.video.currentTime = event.data.duration*percentage;
    });
};

var mouseUpOnBar = function(event) {
    $(window).unbind('mousemove');
};

var mouseUpOnArrow = function(event) {
    event.stopPropagation();
    $(window).unbind('mousemove');
};

var createPointer = function(event) {
    console.log('createPointer');
    var arrow = $('<div class=\"arrow-down\"></div>');
    var arrowContainer = $('<div class=\"arrow-container\"></div>');
    var pos = event.pageX - $(this).offset().left - 10;
    var selectorPos = event.pageX - $('.positioner').offset().left - 10;
    if (selectorPos < 80) {
        selectorPos = 80;
    } else if (selectorPos > 520 - $('.selector').width() - 20){
        selectorPos = 520 - $('.selector').width() - 20;
    }
    arrowContainer.css({
        'left': pos + 'px'
    });
    arrowContainer.append(arrow);
    $(this).append(arrowContainer);
    arrowContainer
        .bind('mousedown', event.data, mouseDownOnArrow)
        .bind('mouseup', event.data, mouseUpOnArrow);

    showSelector(selectorPos);
}

$(document).ready(function(){
    $('#video').bind('loadedmetadata', function(){
        var video = $(this)[0];
        console.log(video);
        var duration = video.seekable.end(0);
        console.log('duration: ' + duration);
        var videoData = {
            duration: duration,
            video: video
        };
        
        $('.bar')
            .mousedown(videoData, mouseDownOnBar)
            .mouseup(videoData, mouseUpOnBar);

        $('.sub-bar').click(videoData, createPointer);

        $('.arrow-container')
            .mousedown(videoData, mouseDownOnArrow)
            .mouseup(videoData, mouseUpOnArrow);
    });

    $('#video').bind('loadeddata', function() {
        $('.controls').css({
            'display': 'block',
            'height': $(this).height()
        });

        $('.play-btn').click(function(){
            $('.play-btn > i.fa').toggleClass('fa-play').toggleClass('fa-pause');
            var video = $('#video')[0];
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        })
    });

    $('#video').bind('timeupdate', function() {
        var video = $(this)[0];
        var duration = video.seekable.end(0);
        var watchedBarWidth = (video.currentTime/duration)*450;
        $('.watched-bar').width(watchedBarWidth);
        var minutes = Math.floor(video.currentTime/60);
        var remainingSeconds = Math.floor(video.currentTime % 60);
        $('.time').text(zeroFill(minutes,2) + ':' + zeroFill(remainingSeconds,2));
    });
});

