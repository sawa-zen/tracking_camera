import { PWM } from 'raspi-pwm'

export class ServoMotor {
  public degree: number
  private readonly pwm: PWM

  constructor(
    public readonly pin: string,
    public readonly defaultDegree: number,
    public readonly frequency: number,
    public readonly minRate: number,
    public readonly maxRate: number,
    public readonly maxDegree: number,
  ) {
    this.degree = defaultDegree
    this.pwm = new PWM({ pin, frequency })
  }

  private _validateDegree(degree: number): boolean {
    switch (true) {
      case degree < 0:
        console.warn(`${degree}度は最小角度の${0}度を超過しています`)
        return false
      case degree > this.maxDegree:
        console.warn(`${degree}度は最大角度の${this.maxDegree}度を超過しています`)
        return false
      default:
        return true
    }
  }

  private _convertDegreeToRate(degree: number): number {
    const rateDiff = this.maxRate - this.minRate
    return ((rateDiff / this.maxDegree) * degree) + this.minRate
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
  }
}
