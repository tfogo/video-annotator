'use strict';

var PeriodView = Backbone.View.extend({
    //className: 'period',
    //el: '.timeline',

    initialize: function() {
        this.model.on('change', function() {
            console.log('CHANGE!!!');
        });
        Backbone.pubSub.on('model-change', this.render, this);
        this.model.on('hide', this.remove, this);
        //Backbone.pubSub.on('delete-tag', this.remove, this);
    },

    
    holdingDiv: _.template('<div class="holding-div"></div>'),
    
    events: {
        'mousedown .right-handle': 'rightDrag',
        'mousedown .left-handle': 'leftDrag',
        'mousedown .period': 'fullDrag',
        'mouseup .period': 'jumpToStart',
        'click .period': 'selectPeriod'
    },
    
    templatePeriod: _.template('<div class="period <% if (selected) { %>selected<% } %>" style="left: <%= startTime %>%; right: <%= endTime %>%; bottom: <%= 22 + 32*level %>px;"><div class="left-handle"></div><div class="right-handle pull-right"></div></div>'),

    templatePoint: _.template('<div class="period point <% if (selected) { %>selected<% } %>" style="left: <%= startTime %>%; width: 6px; bottom: <%= 22 + 32*level %>px;"></div></div>'),

    render: function() {
        console.log(this.model.attributes.period);
        $('.timeline, .tag-frame').height(32*periodList.length + 30);
        if (this.model.attributes.period) {
            return this.renderPeriod();
        } else {
            return this.renderPoint();
        }
        
    },
    
    renderPeriod: function() {
        console.log('period view render');
        this.$el.html(this.templatePeriod(this.model.toJSON()));
        return this;
    },

    renderPoint: function() {
        console.log('point view render');
        this.$el.html(this.templatePoint(this.model.toJSON()));
        return this;
    },

    selectPeriod: function() {
        Backbone.pubSub.trigger('model-change3', this.model);
    },

    rightDrag: function(e) {
        Backbone.pubSub.trigger('model-change3', this.model);
        e.stopPropagation()
        e.originalEvent.preventDefault();
        console.log('rightdrag');
        
        var data = {
            playhead: this.$el,
            model: this.model
        };
        
        $(window).mousemove(data, function(e) {
            var positionInDiv = event.pageX - e.data.playhead.parent().offset().left;
            var percentage = positionInDiv/e.data.playhead.parent().width();
            data.model.attributes.endTime = 100 - percentage*100;
            Backbone.pubSub.trigger('model-change');
            Backbone.pubSub.trigger('model-change2', data.model);
        });

        $(window).mouseup(function() {
            $(window).unbind('mousemove');
        });
    },

    leftDrag: function(e) {
        Backbone.pubSub.trigger('model-change3', this.model);
        e.stopPropagation()
        e.originalEvent.preventDefault();
        console.log('leftdrag');
        
        var data = {
            playhead: this.$el,
            model: this.model
        };
        
        $(window).mousemove(data, function(e) {
            var positionInDiv = event.pageX - e.data.playhead.parent().offset().left;
            var percentage = positionInDiv/e.data.playhead.parent().width();
            data.model.attributes.startTime = percentage*100;
            Backbone.pubSub.trigger('model-change');
            Backbone.pubSub.trigger('model-change2', data.model);
        });

        $(window).mouseup(function() {
            $(window).unbind('mousemove');
        });
    },

    fullDrag: function(e) {
        Backbone.pubSub.trigger('model-change3', this.model);
        e.originalEvent.preventDefault();
        console.log('fulldrag');
        var startPositionInDiv = event.pageX - this.$el.parent().offset().left;
        var startPercentage = startPositionInDiv/this.$el.parent().width();
        var origStartTime = this.model.attributes.startTime;
        var origEndTime = this.model.attributes.endTime;
        
        var data = {
            playhead: this.$el,
            model: this.model
        };
        
        $(window).mousemove(data, function(e) {
            var positionInDiv = event.pageX - e.data.playhead.parent().offset().left;
            var percentage = positionInDiv/e.data.playhead.parent().width();
            var percentageChange = percentage - startPercentage;
            data.model.attributes.startTime = origStartTime + percentageChange*100;
            data.model.attributes.endTime = origEndTime - percentageChange*100;
            if (data.model.attributes.endTime < 0) {
                data.model.attributes.endTime = 0;
            }
            if (data.model.attributes.startTime < 0) {
                data.model.attributes.startTime = 0;
            }
            
            Backbone.pubSub.trigger('model-change');
            Backbone.pubSub.trigger('model-change2', data.model);
        });

        $(window).mouseup(function() {
            $(window).unbind('mousemove');
        });
    },

    jumpToStart: function(e) {
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        video.currentTime = duration*this.model.attributes.startTime/100;
    }

});

var PeriodListView = Backbone.View.extend({
    el: '.timeline',


    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('change', this.addAll, this);
        Backbone.pubSub.on('delete-tag', this.removeView, this);
    },
    
    render: function() {
        console.log('period list view render');
        
        this.addAll();
    },

    addOne: function(periodItem) {
        console.log('addOne');
        var periodView = new PeriodView({model: periodItem});
        this.$el.append(periodView.render().el);
    },

    addAll: function() {
        this.collection.forEach(this.addOne, this);
    },

    removeView: function(el) {
        this.addAll();
        console.log(el);
        console.log(this);
        //this.collection.remove(el);
    }
});

var periodListView = new PeriodListView({collection: periodList});
