
const modeConst = {
    day: {
        from: 7,
        to: 21
    },
    night: {
        from: 21,
        to: 7
    }
/*    day: function (time) {
        if (between(time, 7, 21)) {
            return true;
        }

        return false;
    },
    night: function () {
        if (between(time, 21, 7)) {

        }
    }*/
};

export function  getHttpPromise (config) {
    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);
        xhr.setRequestHeader("Content-type", config.contentType);

        xhr.onload = function() {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send(JSON.stringify(config.jsonData));
    });
}

export function  equalsMode (time, mode) {
    if (!mode) {
        return true;
    }

    let currentMode = modeConst[mode];

    if (!currentMode) {
        console.log("Некорректные данные. Такого мода нет: " + mode);
    }

    return between(time, currentMode.from, currentMode.to)




}

function  between (time, from, to) {
    if (time >= from && time < to && (from < to)) {
        return true;
    }

    if (((time < 24 && time >= from) || (time < to && time >= 0)) && (from > to)) {
        return true;
    }

    return false;
}
