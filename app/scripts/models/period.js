'use strict';

var Period = Backbone.Model.extend({
    //urlRoot: '/period',
    initialize: function() {
        this.attributes.tags = {};
        for (var type in tagNames) {
            var tags = tagNames[type];
            for (var i = 0; i < tags.length; i++) {
                this.attributes.tags[tags[i]] = false;
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
