/*
    Javascript files including like this:
*/



/* CLOSEST */

!function(e){"function"!=typeof e.matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,o=(t.document||t.ownerDocument).querySelectorAll(e),n=0;o[n]&&o[n]!==t;)++n;return Boolean(o[n])}),"function"!=typeof e.closest&&(e.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode}return null})}(window.Element.prototype);


/* END CLOSEST */


document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('#calc-form'),
        btnCount = document.querySelector('.js-calc-count'),
        btnReset = document.querySelector('.js-calc-reset'),
        resultItem = document.querySelector('.calc__result span'),
        wallInputs = document.querySelectorAll('input[name="wall-material"]'),
        externalWall = document.querySelectorAll('.calc-param__label--external-wall'),
        btnSend = document.querySelector('#calc-send-mail'),
        formData;



    form.addEventListener('submit', function (e) {
        e.preventDefault();


        formData = {
            meters: document.querySelector('input[name="meters"]').value,
            wallMaterial: document.querySelector('input[name="wall-material"]:checked').value,
            innerNetworkValue: [],
            externalNetworkValue: [],
            floor: document.querySelector('input[name="floor-count"]:checked').value,
            project: document.querySelector('input[name="project"]:checked').value,
            totalSum: resultItem.innerHTML
        };


        innerNetwork.forEach(function(item) {
            formData.innerNetworkValue.push(item.value);
        });


        externalNetwork.forEach(function(item) {
            formData.externalNetworkValue.push(item.value);
        });

    });


    wallInputs.forEach(function(item) {
        item.addEventListener('click', function() {
            var parent = item.parentNode,
                textNode = parent.querySelector('.calc-param__custom-field');

            if (item.value.toLowerCase() === 'клееный брус') {
                externalWall.forEach(function(item) {
                    var input = item.querySelector('input');


                    if (input.value.toLowerCase() !== 'покраска') {
                        item.classList.add('hidden');
                    }
                })
            }else {
                externalWall.forEach(function(item) {
                    if(item.classList.contains('hidden')) {
                        item.classList.remove('hidden');
                    }
                })
            }
        });
    })



    btnCount.addEventListener('click', function (e) {
        var inputGroups = document.querySelectorAll('.calc-param');

        inputGroups.forEach(function(item) {
            var title = item.querySelector('.calc-param__title'),
                fields = item.querySelector('.calc-param__fields'),
                options = fields.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked'),
                meters = document.querySelector('input[name="meters"]');

            fields.classList.remove('error');

            if (options.length == 0) {
                fields.classList.add('error');
            }

            if (meters.value.length != 0) {
                meters.closest('.calc-param__fields').classList.remove('error');
            }

            if (form.querySelectorAll('.error').length === 0) {
                calculation();
            }
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


    btnSend.addEventListener('click', function() {

        formData = {
            meters: document.querySelector('input[name="meters"]').value,
            wallMaterial: document.querySelector('input[name="wall-material"]:checked').value,
            innerNetworkValue: [],
            externalNetworkValue: [],
            floor: document.querySelector('input[name="floor-count"]:checked').value,
            project: document.querySelector('input[name="project"]:checked').value,
            totalSum: resultItem.innerHTML
        };

        calculation();

        innerNetwork.forEach(function(item) {
            formData.innerNetworkValue.push(item.value);
        });


        externalNetwork.forEach(function(item) {
            formData.externalNetworkValue.push(item.value);
        });


        console.log(formData);
    });


    function calculation() {
        var costItems = document.querySelectorAll('input'),
            floors = document.querySelectorAll('input[data-floor]'),
            floorValue,
            total = 0,
            basePrice = 300,
            meters = document.querySelector('input[data-calc="meters"]').value,
            externalNetwork = document.querySelectorAll('input[name="external-network"]:checked'),
            innerNetwork = document.querySelectorAll('input[name="inner-network"]:checked');

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
        total = Number(basePrice * +meters);

        resultItem.innerHTML = Intl.NumberFormat().format(total);


        if (resultItem.innerHTML != '0') {
            document.querySelector('.calc-offer').classList.remove('hidden');
        }
    }

});


