use video-annotator
for(var i = 1; i < 41; i++){
    db.users.insert({
            "username": "p" + i,
            "password": "password"
            });
}
