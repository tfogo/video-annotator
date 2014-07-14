'use strict';

var tagNames = {};

$.getJSON('/tagnames', function(data) {
    console.log(data);
    tagNames = data;
});

var DataFormView = Backbone.View.extend({
    //el: 'div',
    
    initialize: function() {
        Backbone.pubSub.on('model-change-form', this.render, this);
        this.tagNames = tagNames;
    },

    template: _.template('<div style="display:<% if(selected) { %> block <% } else { %> none <% } %>;"><% for (var type in tagdata) { %> <h4><%= type %></h4><% var tags = tagdata[type]; for (var i = 0; i < tags.length; i++) { %><button type="button" class="btn <% if (this.model.attributes.tags[tags[i]]) { %> btn-primary <% } else { %> btn-default <% } %> btn-xs" data-toggle="button"><%= tags[i] %></button> <% } } %></div>'),

    events: {
        'click button': 'selectTag'
    },
    
    render: function(tagdata) {
        console.log('data form view render');
        var tagobj = {};
        tagobj.tagdata = this.tagNames;
        tagobj.selected = this.model.attributes.selected;
        this.$el.html(this.template(tagobj));
        return this;
    },

    selectTag: function(e) {
        if (this.model.attributes.tags[$(e.target).text()]) {
            this.model.attributes.tags[$(e.target).text()] = false;
        } else {
            this.model.attributes.tags[$(e.target).text()] = true;
        }
        this.model.attributes.data = JSON.stringify(this.model.attributes.tags, null, 4);
        //this.model.attributes.data2 = 'test';
        Backbone.pubSub.trigger('model-change-form');
        Backbone.pubSub.trigger('model-change');
    }

});



var DataFormListView = Backbone.View.extend({
    el: '#data-form',

    url: '/tags',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        //this.collection.on('change', this.addAll, this);
    },
    
    render: function() {
        console.log('data form list view render');
        this.addAll();
    },

    addOne: function(periodItem) {
        console.log('addOne data form');
        var dataFormView = new DataFormView({model: periodItem});
        this.$el.append(dataFormView.render().el);
    },

    addAll: function() {
        this.collection.forEach(this.addOne, this);
    }
});

var dataFormListView = new DataFormListView({collection: periodList});
