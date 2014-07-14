'use strict';

var BarView = Backbone.View.extend({
    initialize: function() {
        Backbone.pubSub.on('vid-timeupdate', this.updateBarWidth);
        Backbone.pubSub.on('vid-progress', this.updateBufferWidth);
    },
    
    el: '#bar',
    
    events: {
        'click': 'seekToClick',
        'timeupdate': 'updateBarWidth',
        'mousedown': 'mouseDownOnBar'
    },

    seekToClick: function(e) {
        console.log('seek');
        e.originalEvent.preventDefault();
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        var positionInDiv = e.pageX - this.$el.offset().left;
        var percentage = positionInDiv/this.$el.width();
        video.currentTime = duration*percentage;
    },

    updateBarWidth: function(e) {
        var video = e.target;
        var duration = video.seekable.end(0);
        var watchedBarWidth = (video.currentTime/duration)*100;
        $('.watched-bar').width(watchedBarWidth + '%');
    },

    updateBufferWidth: function(e) {
        var video = e.target;
        var duration = video.seekable.end(0);
        
        var currentTimeRangeIndex = video.buffered.length - 1;
        for (var i = 0; i < video.buffered.length; i++){
            if (video.currentTime > video.buffered.start(i) && video.currentTime < video.buffered.end(i)) {
                currentTimeRangeIndex = i;
                break;
            }
        }
        
        var bufferedBarWidth = ((video.buffered.end(currentTimeRangeIndex) - video.buffered.start(currentTimeRangeIndex))/duration)*100;
        var bufferedBarStart = (video.buffered.start(currentTimeRangeIndex)/duration)*100
        $('.buffered-bar').css({
            width: bufferedBarWidth + '%',
            left: bufferedBarStart + '%'
        });
    },

    mouseDownOnBar: function(e) {
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        e.originalEvent.preventDefault();
        var positionInDiv = e.pageX - this.$el.offset().left;
        var percentage = positionInDiv/this.$el.width();
        video.currentTime = duration*percentage;
        
        var data = {
            bar: this.$el,
            duration: duration,
            video: video
        };
        
        $(window).mousemove(data, function(e) {
            var positionInDiv = event.pageX - e.data.bar.offset().left;
            var percentage = positionInDiv/e.data.bar.width();
            e.data.video.currentTime = e.data.duration*percentage;
        });

        $(window).mouseup(function() {
            $(window).unbind('mousemove');
        });
    }

    
});

var BarView = new BarView();
