function getUid(length) { //not permanent here i ll delete it 
    let uid = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;

    for (let i = 0; i < length; ++i) {
        uid += chars[getRandomInt(0, charsLength - 1)];
    }

    return uid;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function toHHMMSS(string) { //Helper Function
    var sec_num = parseInt(string, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes;
}

function findObjectByKey(array, key, value) { //Helper Function
    var arr = [];
    if (!array) return arr;
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            arr.push(array[i]);
        }
    }
    return arr;
}

module.exports.findObjectByKey = findObjectByKey;
module.exports.toHHMMSS = toHHMMSS;
module.exports.getUid = getUid;