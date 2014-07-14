'use strcit';

var VideoView = Backbone.View.extend({
    
    el: '#video',
    
    events: {
        'timeupdate': 'emitEvent',
        'ended': 'emitEvent',
        'progress': 'emitEvent',
        'volumechange': 'emitEvent'
    },

    emitEvent: function(e) {
        var eventname = 'vid-' + e.type;
        Backbone.pubSub.trigger(eventname, e);
    }
    
    
});

var videoView = new VideoView();
