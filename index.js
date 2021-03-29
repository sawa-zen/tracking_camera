const raspi = require('raspi');
var PWM = require('raspi-pwm').PWM;


var minRate = 0.025
var maxRate = 0.12
var rateDiff = maxRate - minRate
var convertDegreeToRate = (degree) => {
    return ((rateDiff / 180) * degree) + minRate
}

var counter = 0
raspi.init(() => {
    var pwm = new PWM('GPIO18');
    setInterval(() => {
        const rate = convertDegreeToRate(counter % 2 ? 0 : 90)
        pwm.write(rate);
        // pwm.write(0.025)
        counter += 1
    }, 500)
});


// var rpio = require('rpio');

// var pin = 12;           /* P12/GPIO18 */
// // var range = 1024;       /* LEDs can quickly hit max brightness, so only use */
// // var max = 128;          /*   the bottom 8th of a larger scale */
// var clockdiv = 8;       /* Clock divider (PWM refresh rate), 8 == 2.4MHz */
// var interval = 5;       /* setInterval timer, speed of pulses */
// var times = 5;          /* How many times to pulse before exiting */

// /*
//  * Enable PWM on the chosen pin and set the clock and range.
//  */
// rpio.open(pin, rpio.PWM);
// rpio.pwmSetClockDivider(clockdiv);
// // rpio.pwmSetRange(pin, range);

// // /*
// //  * Repeatedly pulse from low to high and back again until times runs out.
// //  */
// var direction = 1;
// var data = 0;
// // var pulse = setInterval(function() {
// //         rpio.pwmSetData(pin, data);
// //         if (data === 0) {
// //                 direction = 1;
// //                 if (times-- === 0) {
// //                         clearInterval(pulse);
// //                         rpio.open(pin, rpio.INPUT);
// //                         return;
// //                 }
// //         } else if (data === max) {
// //                 direction = -1;
// //         }
// //         data += direction;
// // }, interval, data, direction, times);
// setInterval(function() {
//         rpio.pwmSetData(pin, 15)
// }, interval, data, direction, times)

// rpio.close(pin)
