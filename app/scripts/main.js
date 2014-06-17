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

var mouseUpOnBar = function(event) {
    $(window).unbind('mousemove');
};

var createPointer = function(event) {
    var arrow = $('<div class=\"arrow-down\"></div>');
    arrow.css({
        'left': event.pageX - $(this).offset().left - 10 + 'px'
    });
    $(this).append(arrow);
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

        $('.sub-bar').click(createPointer);
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

