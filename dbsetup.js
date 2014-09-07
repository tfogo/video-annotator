db = db.getSiblingDB('video-annotator');

for(var i = 1; i < 41; i++){
    db.users.insert({
        "username": "s" + i,
        "password": "password"
    });
}
