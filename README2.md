# About the data

## The XML File

There were 1392 tags and comments made overall. These tags and comments can be found in `tagdata.xml`. Each tag or comment is described by a `<tag>` element. The tags that were put in the comments box have the attribute `comment="true"`. Users could attribute multiple tags to a single period they defined. Thus multiple tags may come from the same time period. Times are in seconds from the start of the video. Thus, if a tag was made at 30 seconds in `<video_id>_2.mp4`, the tag was made at 120 + 30 = 150 seconds in `<video_id>.mp4`.

## General Stats

- `tagsperuser.json`: The number of tags each user made in ascending order.
- `tagspervideo.json`: The number of tags made on each video in ascending order.
- `tagsused.json`: The number of times each tag and comment was used on any video in ascending order.
- `userspervid.json`: The users that tagged each video.

## Raw Data

The folder `Raw data` includes JSON exports of the collections from the MongoDB database. These are the model schemas:

```JavaScript
TagSchema = {
    period: Boolean, //Whether it is a period or a point
    startTime: Number, // Percentage time through the video
    endTime: Number, // 100 - percentage time through the video
    // If tag is a point, (tag.startTime === 100 - tag.endTime)
    data: String, // JSON. Keys are the tag names and values are boolean. Values are true if they have been selected.
    dateSubmitted: Date,
    comments: String, // Tags that have been put in the comments text box
    vidName: String, // includes file extension. Videos longer than 2:30 were split into 2 minute videos and a video of the remaining time. they were called <original_name>_1.mp4, <original_name>_2.mp4, etc.
    username: String 
};

VideoSchema = {
    name: String, // as above
    users: [String], // Array of users that made a tag on this video
    numberOfUsers: {type: Number, default: 0}, // length of the above array
    duration: Number // In seconds
};

UserSchema = {
    username: {
        type: String,
        unique: true
    },
    password: String
};
```
