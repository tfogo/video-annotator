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

    template: _.template('<div style="display:<% if(selected) { %> block <% } else { %> none <% } %>;"><h4>Custom Tag</h4><textarea rows="1" id="comments" class="form-control"><%= comments %></textarea><% for (var type in tagdata) { %> <h4><%= type %></h4><% var tags = tagdata[type]; for (var i = 0; i < tags.length; i++) { %><button type="button" class="btn tag-toggle <% if (this.model.attributes.tags[tags[i]]) { %> btn-primary <% } else { %> btn-default <% } %> btn-xs" data-toggle="button"><%= tags[i] %></button> <% } } %><hr><button type="button" class="btn tag-delete btn-danger pull-right">Delete tag</button></div>'),

    events: {
        'click .tag-toggle': 'selectTag',
        'change textarea': 'setComments',
        //'click .tag-delete': 'deleteTag'
    },
    
    render: function(tagdata) {
        console.log('data form view render');
        var tagobj = {};
        tagobj.tagdata = this.tagNames;
        tagobj.selected = this.model.attributes.selected;
        tagobj.comments = this.model.attributes.comments;
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
    },

    setComments: function(e) {
        this.model.attributes.comments = $(e.target).val();
        Backbone.pubSub.trigger('model-change');
    },

    // deleteTag: function(e) {
    //     console.log(this.model);
    //     this.model.destroy();
    //     Backbone.pubSub.trigger('delete-tag', this);
    //     //this.remove();
    // }

});



var DataFormListView = Backbone.View.extend({
    el: '#data-form',

    url: '/tags',

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        //Backbone.pubSub.on('delete-tag', this.removeModel, this);

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
    },

    removeModel: function(el) {
        this.collection.remove(el);
    }
});

var dataFormListView = new DataFormListView({collection: periodList});
