'use strict';

var Period = Backbone.Model.extend({
    urlRoot: '/tags',
    initialize: function() {
        this.attributes.tags = {};
        for (var type in tagNames) {
            var tagsarr = tagNames[type];
            for (var i = 0; i < tagsarr.length; i++) {
                var tags = tagsarr[i];
                for (var j = 0; j < tags.length; j++) {
                    this.attributes.tags[tags[j]] = false;
                }
            }
        }
        //this.bind('change', this.save);
        Backbone.pubSub.on('model-change', function() {
            console.log('SAVE');
            console.log(this);
            this.save();
        }, this);

    },

    idAttribute: "_id"
});


var PeriodList = Backbone.Collection.extend({
    model: Period,
    
    url: '/tags',

    initialize: function() {
        //this.on('add', this.setLevel, this);
        this.on('add', this.setSelected, this);
        //Backbone.pubSub.on('model-change2', this.setLevel, this);
        Backbone.pubSub.on('model-change3', this.setSelected, this);
        this.on('remove',this.hideModel);
        
    },

    hideModel: function(model) {
        console.log('hide model');
        model.trigger('hide');
    },

    setSelected: function(periodItem) {
        this.forEach(function(item) {
            if(item == periodItem) {
                item.attributes.selected = true;
            } else {
                item.attributes.selected = false;
            }
        });
        Backbone.pubSub.trigger('model-change');
        Backbone.pubSub.trigger('model-change-form');
    },

    setLevel: function(periodItem) {
        this.forEach(function(secondItem) {
            if (periodItem == secondItem) {
                return;
            }
            // if (periodItem.attributes.level !== secondItem.attributes.level) {
            //     return;
            // }
            console.log(periodItem.attributes.level);
            console.log(secondItem.attributes.level);
            
            
            console.log(periodItem.attributes.endTime);
            console.log(secondItem.attributes.startTime);
            if (periodItem.attributes.level == secondItem.attributes.level) {
                
                if (100 - periodItem.attributes.endTime > secondItem.attributes.startTime
                    && periodItem.attributes.startTime < 100 - secondItem.attributes.endTime) {
                    console.log('CROSSSS!!!');
                    periodItem.attributes.level = secondItem.attributes.level + 1;
                }
                
            }
            if (periodItem.attributes.level > secondItem.attributes.level){
                 if (100 - periodItem.attributes.endTime > secondItem.attributes.startTime
                    && periodItem.attributes.startTime < 100 - secondItem.attributes.endTime) {
                    console.log('CROSSSS!!!');
                    periodItem.attributes.level = secondItem.attributes.level + 1;
                }
            }
            if (periodItem.attributes.level > 0){
                 if (!(100 - periodItem.attributes.endTime > secondItem.attributes.startTime
                    && periodItem.attributes.startTime < 100 - secondItem.attributes.endTime)) {
                    console.log('CROSSSS!!!');
                    periodItem.attributes.level = 0;
                }
            }
        });
        
    }
});

var periodList = new PeriodList();
