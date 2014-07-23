'use strcit';

var PlayheadView = Backbone.View.extend({
    initialize: function() {
        Backbone.pubSub.on('vid-timeupdate', this.updateHeadPos);
    },
    
    el: '.playhead',
    
    events: {
        'mousedown .playhead-thumb': 'mouseDownOnThumb'
    },

    updateHeadPos: function(e) {
        var video = e.target;
        var duration = video.seekable.end(0);
        var timelineWidth = $('.timeline').width();
        var headPos = (video.currentTime/duration)*timelineWidth;
        
        $('.playhead').css({
            left: headPos + 'px'
        });
    },

    mouseDownOnThumb: function(e) {
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        e.originalEvent.preventDefault();
        
        var data = {
            playhead: this.$el,
            duration: duration,
            video: video
        };

        dataFormListView.collection.forEach(function(period) {
            period.attributes.selected = false;
        }, this);
        Backbone.pubSub.trigger('model-change-form');
        Backbone.pubSub.trigger('model-change');
        
        $(window).mousemove(data, function(e) {
            var positionInDiv = event.pageX - e.data.playhead.parent().offset().left;
            var percentage = positionInDiv/e.data.playhead.parent().width();
            e.data.video.currentTime = e.data.duration*percentage;
        });

        $(window).mouseup(function() {
            $(window).unbind('mousemove');
        });
    }

    
});

var playhead = new PlayheadView();
