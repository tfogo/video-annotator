'use strict';

var TickView = Backbone.View.extend({
    template: _.template('<div class="tick-container"><div class="mtick"></div><div class="stick"></div><div class="time-label">0:00</div></div><% for(var i = 1; i < 5; i++) { %><div class="tick-container" style="left:<%= Math.floor((timelineWidth/4)*i - (timelineWidth/8)) %>px"><div class="stick"></div></div><div class="tick-container" style="left:<%= Math.floor((timelineWidth/4)*i) %>px"><div class="mtick"></div><div class="stick"></div><div class="time-label"><%= fmtTime((duration/4)*i) %></div></div><% } %>'),
    
    el: '.ticks',
    
    render: function() {
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        var timeline = $('.timeline');
        var timelineWidth = timeline.width();
        var data = {
            duration: duration,
            timelineWidth: timelineWidth,
            fmtTime: this.fmtTime(this)
        };
        this.$el.html(this.template(data));
    },

    fmtTime: function(context) {
        return function(seconds){
            var minutes = Math.floor(seconds/60);
            var remainingSeconds = Math.floor(seconds % 60);
            return context.zeroFill(minutes,1) + ':' + context.zeroFill(remainingSeconds,2);
        }
    },

    zeroFill: function( number, width ) {
        width -= number.toString().length;
        if ( width > 0 ) {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    }
    
});

var tickView = new TickView();

$(document).ready(function(){
    $('#video').bind('loadeddata', function() {
        tickView.render();

        window.onresize = function(event) {
            tickView.render();
        };
    });
});
