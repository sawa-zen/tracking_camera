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
    var servo1 = new SG90('GPIO18', 90)
    var servo2 = new SG90('GPIO19', 90)
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
        servo1.setDegree(degree)
        servo2.setDegree(degree)
    }, intervalTimespan)

    process.stdin.resume();
    process.on('SIGINT', function() {
        servo1.reset()
        servo2.reset()
        process.exit()
    });
});

class SG90 {
    static MIN_DEGREE = 0
    static MAX_DEGREE = 180

    degree = 0

    constructor(pin, defaultDegree) {
        this.pin = pin
        this.defaultDegree = defaultDegree
        this.pwm = new PWM(pin)
        this.setDegree(defaultDegree)
    }

    setDegree(degree) {
        if (degree > SG90.MAX_DEGREE) {
            console.warn(`${degree}度は最大角度の180度を超過しています`)
            degree = SG90.MAX_DEGREE
        } else if (degree < SG90.MIN_DEGREE) {
            console.warn(`${degree}度は最小角度の0度を超過しています`)
            degree = SG90.MIN_DEGREE
        }

        this.degree = degree
        const rate = convertDegreeToRate(degree)
        this.pwm.write(rate)
    }

    reset() {
        this.setDegree(this.defaultDegree)
    }
}