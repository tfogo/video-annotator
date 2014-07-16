'use strict';

var DataView = Backbone.View.extend({
    el: '#data',

    initialize: function() {
    },

    template: _.template('<h1>Hi</h1>'),

    events: {
        'click #period-btn': 'addPeriod',
        'click #point-btn': 'addPoint'
    },
    
    render: function() {
        $('#data-form').append(this.template());
    },

    addPeriod: function() {
        console.log('addPeriod');
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        var currentTime = video.currentTime;
        var percentage = (currentTime/duration)*100;
        periodList.add({
            startTime: percentage,
            endTime: 100 - percentage - 10,
            level: periodList.length,
            selected: true,
            period: true,
            vidName: $('#video').attr('src')
        });
    },

    addPoint: function() {
        console.log('addPoint');
        var video = $('#video')[0];
        var duration = video.seekable.end(0);
        var currentTime = video.currentTime;
        var percentage = (currentTime/duration)*100;
        periodList.add({
            startTime: percentage,
            endTime: percentage,
            level: periodList.length,
            selected: true,
            period: false,
            vidName: $('#video').attr('src')
        });
    }
    
});

var dataView = new DataView();
