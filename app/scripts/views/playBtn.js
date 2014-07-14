'use strcit';

var PlayBtnView = Backbone.View.extend({
    el: '#play-btn',
    
    events: {
        'click': 'togglePlay'
    },

    initialize: function() {
        Backbone.pubSub.on('vid-ended', this.stop);
    },
    
    togglePlay: function(){
        $('.play-btn > i.fa').toggleClass('fa-play').toggleClass('fa-pause');
        var video = $('#video')[0];
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    },

    stop: function() {
        $('.play-btn > i.fa').toggleClass('fa-play').toggleClass('fa-pause');
    }
});

var playBtnView = new PlayBtnView();
