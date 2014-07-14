'use sctrict';

var TimeView = Backbone.View.extend({

    initialize: function() {
        Backbone.pubSub.on('vid-timeupdate', this.changeTime, this);
    },

    el: '#time',

    zeroFill: function( number, width ) {
        width -= number.toString().length;
        if ( width > 0 ) {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    },

    changeTime: function(e) {
        var video = e.target;
        var minutes = Math.floor(video.currentTime/60);
        var remainingSeconds = Math.floor(video.currentTime % 60);
        var totalMinutes = Math.floor(video.seekable.end(0)/60);
        var totalRemainingSeconds = Math.floor(video.seekable.end(0) % 60);
        this.$el.html(this.zeroFill(minutes,1) + ':' + this.zeroFill(remainingSeconds,2) + '/' + this.zeroFill(totalMinutes,1) + ':' + this.zeroFill(totalRemainingSeconds,2));
    }
    
});

var timeView = new TimeView();
