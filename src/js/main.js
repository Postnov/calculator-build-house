/*
    Javascript files including like this:
*/

document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.calc'),
        btnCount = document.querySelector('.js-calc-count'),
        btnReset = document.querySelector('.js-calc-reset'),
        resultItem = document.querySelector('.calc__result span'),
        fieldLength = document.querySelector('input[data-calc="length"]'),
        fieldWidth = document.querySelector('input[data-calc="width"]');



    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    btnCount.addEventListener('click', function (e) {

        var costItems = document.querySelectorAll('input'),
            floors = document.querySelectorAll('input[data-floor]'),
            rectangular = +fieldLength.value * +fieldWidth.value,
            floorValue,
            total = 0,
            basePrice = 300;

        floors.forEach(function (item, i) {
            if (item.checked) {
                floorValue = +item.getAttribute('data-floor');
            }
        });

        costItems.forEach(function (item, i) {
            if (item.checked) {
                var additionCost = +item.getAttribute('data-cost');
                basePrice += additionCost;
            }
        });

        if (isNaN(floorValue)) floorValue = 1;

        basePrice *= floorValue;
        total = Number(basePrice * rectangular);

        resultItem.innerHTML = total.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    });

    btnReset.addEventListener('click', function () {
        var costItems = document.querySelectorAll('input');

        costItems.forEach(function (item, i) {
            item.checked = false;
            item.value = '';
        });

        document.querySelector('input[data-floor]').checked = true;

        resultItem.innerHTML = '0';
    });



});