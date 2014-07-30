var mongoose = require('mongoose');

// config
var config = require('./config');
 
// mongodb URI
var uristring = config.db;

// connect to db
mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Mongoose started!");
});

// mongoose models
require('./models');

var Video = mongoose.model('Video');
var Tag = mongoose.model('Tag');
var User = mongoose.model('User');
var config = require('./config');
var fs = require('fs');
var exec = require('child_process').exec;

var videos = fs.readdirSync(config.videoDir);

// FIRST to populate duration of videos
// Requires pull request from models
var popduration = function() {
    videos.forEach(function(vid) {
        var cmdstring = 'ffmpeg -i ' + config.videoDir + '/' + vid + ' 2>&1 >/dev/null | grep -Po \'(?<=Duration:\\s)\\d{2}:\\d{2}:\\d{2}\'';
        console.log(cmdstring);
        var child = exec(cmdstring, function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            
            var pattern = /(\d{2}):(\d{2}):(\d{2})/
                
            var hrs = stdout.match(pattern)[1];
            var min = stdout.match(pattern)[2];
            var sec = stdout.match(pattern)[3];

            var time = hrs*3600 + min*60 + sec*1;

            Video.find({name: vid}, function(err, vids) {
                var v = vids[0];
                console.log(v);
                v.duration = time;
                v.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(vid);
                    }
                });
            });
            
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    });
};

//popduration();

noTags = 0;
JSONTags = [];
XMLTags = [];
fs.writeFile('tagdata.xml', '<?xml version="1.0" encoding="UTF-8"?>\n', function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});
// fs.writeFile('tagdata.json', '{data:[', function (err) {
//     if (err) throw err;
//     console.log('It\'s saved!');
// });

var numberOfTags = function() {
    Tag.find({}, function(err, tags){
        tags.forEach(function(tag) {
            
            Video.find({name: tag.vidName}, function(err, vids){
                
                var vid = vids[0];
                
		if (!!tag.comments) {
                    noTags++;
                    var XMLString = '<tag comment="true">\n\t<name>' + tag.comments + '</name>\n\t<user>' + tag.username + '</user>\n\t<video>' + tag.vidName + '</video>\n\t';
                    if (tag.startTime === 100 - tag.endTime) {
			XMLString += '<type>point</type>\n\t<time>' + (tag.startTime/100)*vid.duration + '</time>\n';
                    } else {
			XMLString += '<type>period</type>\n\t<start-time>' + (tag.startTime/100)*vid.duration + '</start-time>\n\t<end-time>' + ((100 - tag.endTime)/100)*vid.duration + '</end-time>\n';
                    }
                    XMLString += '</tag>\n';
                    console.log(XMLString);
                    XMLTags.push(XMLString);
                    fs.appendFile('tagdata.xml', XMLString, function (err) {
			if (err) throw err;
			console.log('It\'s saved!');
                    });
                    console.log(noTags);
		}

		if (!!tag.data){
                    var tagdata = JSON.parse(tag.data);
                    for (var data in tagdata) {
			if (tagdata[data]) {
                            noTags++;
                            var XMLString = '<tag>\n\t<name>' + data + '</name>\n\t<user>' + tag.username + '</user>\n\t<video>' + tag.vidName + '</video>\n\t';
                            if (tag.startTime === 100 - tag.endTime) {
				XMLString += '<type>point</type>\n\t<time>' + (tag.startTime/100)*vid.duration + '</time>\n';
                            } else {
				XMLString += '<type>period</type>\n\t<start-time>' + (tag.startTime/100)*vid.duration + '</start-time>\n\t<end-time>' + ((100 - tag.endTime)/100)*vid.duration + '</end-time>\n';
                            }
                            XMLString += '</tag>\n';
                            console.log(XMLString);
                            XMLTags.push(XMLString);
                            fs.appendFile('tagdata.xml', XMLString, function (err) {
				if (err) throw err;
				console.log('It\'s saved!');
                            });
                            console.log(noTags);
			}
                    }
		}
                
            });
        });
        //console.log(XMLTags);
        
    });
};

// SECOND: XML File
numberOfTags();

var JSONTags = function() {
    Tag.find({}, function(err, tags){
        tags.forEach(function(tag) {
            Video.find({name: tag.vidName}, function(err, vids){
                
                var vid = vids[0];
                
                tagdata = JSON.parse(tag.data);
                for (var data in tagdata) {
                    if (tagdata[data]) {
                        var JSONString = {};
                        JSONString.name = data;
                        JSONString.user = tag.username;
                        JSONString.video = tag.vidName;
                        if (tag.startTime === 100 - tag.endTime) {
                            JSONString.type = 'point';
                            JSONString.time = (tag.startTime/100)*vid.duration;
                        } else {
                            JSONString.type = 'period';
                            JSONString.startTime = (tag.startTime/100)*vid.duration;
                            JSONString.endTime = ((100 - tag.endTime)/100)*vid.duration;
                        }
                        JSONTags.push(JSONString);
                        
                    }
                }
                
            });
        });
        //console.log(XMLTags);
        
    });
};

// Third: run then put ]} at end of file.
// JSONTags();

// setTimeout(getStats, 5000);

// var getStats = function() {
//     JSONTags.forEach(function(){
        
//     });
// };

var tagsPerUser = function(){
    rankings = {};
    
    var rankUsers = function() {
        Tag.find({}, function(err, tags){
            finalRankings = {};
            tags.forEach(function(tag) {
                rankings[tag.username]++;
            });
            console.log(rankings);
            var sortable = [];
            for (var user in rankings) {
                sortable.push([user, rankings[user]]);
            }
            sortable.sort(function(a, b) {return a[1] - b[1]});
            sortable.forEach(function(arr) {
                finalRankings[arr[0]] = arr[1];
            });
            console.log(finalRankings);
            //process.exit(0);
        });
    };
    
    User.find({}, function(err, users) {
        users.forEach(function(user) {
            rankings[user.username] = 0;
        });
        rankUsers()
    });

}

//fourth
//tagsPerUser();

var tagsPerVid = function(){
    rankings = {};
    
    var rankVids = function() {
        Tag.find({}, function(err, tags){
            finalRankings = {};
            tags.forEach(function(tag) {
                rankings[tag.vidName]++;
            });
            console.log(rankings);
            var sortable = [];
            for (var user in rankings) {
                sortable.push([user, rankings[user]]);
            }
            sortable.sort(function(a, b) {return a[1] - b[1]});
            sortable.forEach(function(arr) {
                finalRankings[arr[0]] = arr[1];
            });
            console.log(finalRankings);
            //process.exit(0);
        });
    };
    
    Video.find({}, function(err, videos) {
        videos.forEach(function(vid) {
            rankings[vid.name] = 0;
        });
        rankVids()
    });

}

//fifth
//tagsPerVid();

var tagsRank = function(){
    rankings = {};
    
    
    var rankTags = function() {
        Tag.find({}, function(err, tags){
            finalRankings = {};
            
            tags.forEach(function(tag) {
		if(!!tag.comments){
		    if(!!tag.comments) {
			rankings[tag.comments]++;
                    }
		}

		if (!!tag.data){
		    tagdata = JSON.parse(tag.data);
                    
                    for (var data in tagdata) {
			if (tagdata[data]) {
                            rankings[data]++;
			}
                    }
		}
            });
            console.log(rankings);
            var sortable = [];
            for (var user in rankings) {
                sortable.push([user, rankings[user]]);
            }
            sortable.sort(function(a, b) {return a[1] - b[1]});
            sortable.forEach(function(arr) {
                finalRankings[arr[0]] = arr[1];
            });
            console.log(finalRankings);
            //process.exit(0);
        });
    };
    
    Tag.find({}, function(err, tags) {
        tags.forEach(function(tag){
            if(!!tag.comments) {
                rankings[tag.comments] = 0;
            }
            if(!!tag.data){
		tagdata = JSON.parse(tag.data);
		for (var data in tagdata) {
                    rankings[data] = 0;
		}
	    }
        });
       
        
        rankTags()
    });

}

//Final
//tagsRank();

var usersPerVid = function(){
    rankings = {};
    
    var rankVids = function() {
        Tag.find({}, function(err, tags){
            finalRankings = {};
            tags.forEach(function(tag) {
                rankings[tag.vidName]++;
            });
            console.log(rankings);
            var sortable = [];
            for (var user in rankings) {
                sortable.push([user, rankings[user]]);
            }
            sortable.sort(function(a, b) {return a[1] - b[1]});
            sortable.forEach(function(arr) {
                finalRankings[arr[0]] = arr[1];
            });
            console.log(finalRankings);
            //process.exit(0);
        });
    };
    
    Video.find({}, function(err, videos) {
        videos.forEach(function(vid) {
            rankings[vid.name] = vid.users;
        });

        console.log(rankings);
        
        //rankVids()
    });

}

//usersPerVid();
