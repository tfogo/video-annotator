dir=/media/sf_marathon/videos/output
N=80
ls $dir | sort -R | tail -$N | while read file; do
	cp $dir/$file $dir/select/$file
done

total=0
FILES=/media/sf_marathon/videos/output/select/*.mp4
for f in $FILES
do
    time="$(avprobe "$f" 2>&1 >/dev/null | grep -Po '(?<=Duration:\s)\d{2}:\d{2}:\d{2}')"
    hrs="$(echo "$time" | grep -Po '\d{2}(?=:\d{2}:\d{2})')"
    mins="$(echo "$time" | grep -Po '(?<=\d{2}:)\d{2}(?=:\d{2})')"
    secs="$(echo "$time" | grep -Po '(?<=\d{2}:\d{2}:)\d{2}')"
    let time=$hrs*3600+$mins*60+$secs
    let total=$total+$time
    echo $total
done


