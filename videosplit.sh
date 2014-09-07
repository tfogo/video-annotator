#!/bin/bash

rm -rf /media/sf_marathon/videos/output/*
FILES=/media/sf_marathon/videos/*.mp4
for f in $FILES
do
    time="$(avprobe "$f" 2>&1 >/dev/null | grep -Po '(?<=Duration:\s)\d{2}:\d{2}:\d{2}')"
    hrs="$(echo "$time" | grep -Po '\d{2}(?=:\d{2}:\d{2})')"
    mins="$(echo "$time" | grep -Po '(?<=\d{2}:)\d{2}(?=:\d{2})')"
    secs="$(echo "$time" | grep -Po '(?<=\d{2}:\d{2}:)\d{2}')"
    filename="$(echo "$f" | grep -Po '(?<=/media/sf_marathon/videos/).*(?=\.mp4)')"
    echo "filename $filename | hrs $hrs | mins $mins | secs $secs | time $time"
    let num=0
    let time=$hrs*3600+$mins*60+$secs
    echo $time
    if [[ $time -gt 150 ]]
    then
        split=120

        while [ $split -lt $time ]
        do
            let diff=time-split

            if [[ $diff -gt 120 ]]
            then
                diff=120
            fi

            let number=split/120

            ffmpeg -i "$f" -ss "$split" -t "$diff" -acodec copy -vcodec copy -async 1 -y  /media/sf_marathon/videos/output/"$filename"_"$number".mp4

            let split=split+120
        done
    else
        cp /media/sf_marathon/videos/"$filename".mp4 /media/sf_marathon/videos/output/"$filename"_1.mp4
        echo copy
    fi
    let num=num+1
    echo "NUM $num"
    
done
