/*import {initMap} from "./map";

function setMapSize (mapsId) {
    let maps = document.getElementById(mapsId);
    maps.style.width = window.innerWidth;
    maps.style.height = window.innerHeight;
}*/

import {getHttpPromise, equalsMode} from "./api";

document.addEventListener("DOMContentLoaded", function () {

    let config = {
        method: "GET",
        url: "/data/input.json",
        contentType: "application/json",
    };

    getHttpPromise(config).then(function (response) {
        let data = JSON.parse(response);

        let rates = data.rates;

        rates.sort(function (a, b) {
            return a.value - b.value;
        });

        let hoursCosts = [];

        for (let i = 0; i < rates.length; i++) {
            let from = rates[i].from;
            let to = rates[i].to;

            if (from > 23 || to > 23) {
                console.log("Некорректные входные данные > 23 часов");
            }

            if (from < 0 || to < 0) {
                console.log("Некорректные входные данные < 0 часов");
            }

            let counter = from;
            do {
                if (counter >= 24) {
                    counter = 0;
                }

                hoursCosts.push({
                    time: counter,
                    value: rates[i].value
                });
                // hoursCosts[counter] = rates[i].value;
                counter++;
            } while (counter !== to );
        }

        let devices = data.devices;

        // Инициализация массива с ответами...
        let result = {
            schedule: {},
            consumedEnergy: {
                value: 0,
                devices: {

                }
            }
        };
        for (let i = 0; i < 24; i++) {
            result.schedule[i] = [];
        }

        let totalEnergySumm = 0;
        for (let i = 0; i < devices.length; i++) {
            let totalEnergy = 0;
            let workTime = 0;
            for (let j = 0; j < hoursCosts.length; j++) {
                if (!equalsMode(hoursCosts[j].time, devices[i].mode)) {
                    continue;
                }

                if (workTime >= devices[i].duration) {
                    break;
                }

                result.schedule[hoursCosts[j].time].push(devices[i].id);
                totalEnergy += devices[i].power * hoursCosts[j].value;
                workTime++;
            }

            // Переводим в кВт * ч
            result.consumedEnergy.devices[devices[i].id] = totalEnergy / 1000;
            totalEnergySumm += totalEnergy;
        }

        result.consumedEnergy.value = totalEnergySumm / 1000;

        console.log(result);

        // В консоли смотреть на ответ - удобней...
        document.body.innerHTML = JSON.stringify(result);

    });
});


