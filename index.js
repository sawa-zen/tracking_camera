const raspi = require('raspi');
var PWM = require('raspi-pwm').PWM;


var minRate = 0.025
var maxRate = 0.12
var rateDiff = maxRate - minRate
var convertDegreeToRate = (degree) => {
    return ((rateDiff / 180) * degree) + minRate
}

var degree = 90
var addNum = 5
var minDegree = 60
var maxDegree = 180
var intervalTimespan = 20
raspi.init(() => {
    var pwm1 = new PWM('GPIO18');
    var pwm2 = new PWM('GPIO19');
    setInterval(() => {
        degree += addNum
        console.info(degree, addNum)
        if (degree >= maxDegree) {
            degree = maxDegree
            addNum = -addNum
        } 
        if (degree <= minDegree) {
            degree = minDegree
            addNum = -addNum
        }
        const rate1 = convertDegreeToRate(degree)
        pwm1.write(rate1)
        const rate2 = convertDegreeToRate(degree)
        pwm2.write(rate2)
    }, intervalTimespan)

    process.stdin.resume();
    process.on('SIGINT', function() {
        const rate1 = convertDegreeToRate(90)
        pwm1.write(rate1)
        const rate2 = convertDegreeToRate(90)
        pwm2.write(rate2)
        //終了処理…
        process.exit();
    });
});
