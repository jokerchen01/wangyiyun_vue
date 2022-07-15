export function handleNum(num) {
    if (num > 10000) {
        num = (num / 10000).toFixed(1)
        return num + '万'
    } else {
        return num
    }
}


// 处理音乐时长的时间
export function handleMusicTime(time) {
    // 如果超过了100000 基本都是毫秒为单位的了 先转成秒的

    time = parseInt(time)
    if (time > 10000) {
        time = Math.floor(time / 1000);
    } else {
        time = Math.floor(time)
    }
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return m + ':' + s;

}
export function MusicTotalTime(time) {
    // 如果超过了100000 基本都是毫秒为单位的了 先转成秒的
    if (time > 10000) {
        let time1 = parseInt(time)
        time1 = Math.floor(time1 / 1000);
        let m = Math.floor(time1 / 60);
        let s = Math.floor(time1 % 60);
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        time1 = m + ':' + s;
        return time1
    } else {
        return time
    }


}

// 将播放时长还原为秒数 用于进度条
export function returnSecond(time) {
    if (time > 10000) {
        let time1 = parseInt(time)
        time1 = Math.floor(time1 / 1000);
        let m = Math.floor(time1 / 60);
        let s = Math.floor(time1 % 60);
        return m * 60 + s;
    } else {
        time = time.split(":")
        let m = parseInt(time[0]);
        let s = parseInt(time[1]);
        return m * 60 + s;
    }


}