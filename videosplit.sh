#!/bin/bash
FILES=/home/tim/marathon/test/*.mp4
for f in $FILES
do
    time="$(ffprobe "$f" 2>&1 >/dev/null | grep -Po '(?<=Duration:\s)\d{2}:\d{2}:\d{2}')"
    hrs="$(echo "$time" | grep -Po '\d{2}(?=:\d{2}:\d{2})')"
    mins="$(echo "$time" | grep -Po '(?<=\d{2}:)\d{2}(?=:\d{2})')"
    secs="$(echo "$time" | grep -Po '(?<=\d{2}:\d{2}:)\d{2}')"
    filename="$(echo "$f" | grep -Po '(?<=/home/tim/marathon/test/).*(?=\.mp4)')"
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

            ffmpeg -i "$f" -ss "$split" -t "$diff" -acodec copy -vcodec copy -async 1 -y  /home/tim/marathon/test/output/"$filename"_"$number".mp4

            let split=split+120
        done
    else
        cp /home/tim/marathon/test/"$filename".mp4 /home/tim/marathon/test/output/"$filename"_1.mp4
        echo copy
    fi
    let num=num+1
    echo "NUM $num"
    
done

