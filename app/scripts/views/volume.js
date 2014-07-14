'use strcit';

var VolumeView = Backbone.View.extend({
    initialize: function() {
        Backbone.pubSub.on('vid-volumechange', this.updateHeadPos);
        $('#video').trigger('volumechange');
    },
    
    el: '.vol-bar-container',
    
    events: {
        'mousedown .vol-thumb': 'mouseDownOnThumb'
    },

    updateHeadPos: function(e) {
        var video = e.target;
        var volume = video.volume;
        var volumeWidth = $('.vol-bar').width();
        var headPos = volume*volumeWidth;
        
        $('.vol-thumb').css({
            left: headPos + 'px'
        });

        $('.vol-up-bar').css({
            width: headPos + 'px'
        });
    },

    mouseDownOnThumb: function(e) {
        var video = $('#video')[0];
        var volume = video.volume;
        e.originalEvent.preventDefault();
        
        data = {
            volBar: this.$el,
            volume: volume,
            video: video
        };
        
        $(window).mousemove(data, function(e) {
            var positionInDiv = event.pageX - $('.vol-bar').offset().left;
            var percentage = positionInDiv/$('.vol-bar').width();
            if (percentage < 0) {
                percentage = 0;
            } else if (percentage > 1) {
                percentage = 1;
            }
            e.data.video.volume = percentage;
        });

        $(window).mouseup(function() {
            $(window).unbind('mousemove');
        });
    }

    
});

var volumeView = new VolumeView();
