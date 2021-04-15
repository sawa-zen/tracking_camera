import { PWM } from "raspi-pwm"

export class SG90 {
    static readonly FREQUENCY: number = 50 // 50Mhz
    static readonly MIN_RATE: number = 0.025
    static readonly MAX_RATE: number = 0.12
    static readonly MIN_DEGREE: number = 0
    static readonly MAX_DEGREE: number = 180

    public degree: number
    private readonly pwm: PWM

    constructor(
        public readonly pin: string, 
        public readonly defaultDegree: number,
        public readonly minRate: number = SG90.MIN_RATE,
        public readonly maxRate: number = SG90.MAX_RATE,
        public readonly minDegree: number = SG90.MIN_DEGREE,
        public readonly maxDegree: number = SG90.MAX_DEGREE,
    ) {
        this.degree = defaultDegree
        this.pwm = new PWM(pin)
    }

    private _validateDegree(degree: number): boolean {
        switch (true) {
            case degree > this.maxDegree:
                console.warn(`${degree}度は最大角度の${this.maxDegree}度を超過しています`)
                return false
            case degree < this.minDegree:
                console.warn(`${degree}度は最小角度の${this.maxDegree}度を超過しています`)
                return false
            default: 
                return true
        }
    }

    private _convertDegreeToRate(degree: number): number {
        const rateDiff = this.maxRate - this.minRate
        return ((rateDiff / 180) * degree) + this.minRate
    }

    write() {
        if (!this._validateDegree(this.degree)) {
            throw new Error('指定した角度は範囲外です')
        }
        const rate = this._convertDegreeToRate(this.degree)
        this.pwm.write(rate)
    }

    reset() {
        this.degree = this.defaultDegree
        this.write()
    }
}