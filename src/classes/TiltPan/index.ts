import { SG90 } from '../SG90'

export class TiltPan {
  static readonly TILT_DEFAULT_DEGREE = 45
  static readonly PAN_DEFAULT_DEGREE = 90

  private _tiltServo: SG90
  private _panServo: SG90

  get tiltDegree(): number {
    return this._tiltServo.degree
  }
  get panDegree(): number {
    return this._panServo.degree
  }

  constructor(
    public tiltServoPin: string,
    public panServoPin: string,
  ) {
    this._tiltServo = new SG90(tiltServoPin, TiltPan.TILT_DEFAULT_DEGREE)
    this._panServo = new SG90(panServoPin, TiltPan.PAN_DEFAULT_DEGREE)
  }

  tiltTo(degree: number) {
    this._tiltServo.degree = degree
  }

  panTo(degree: number) {
    this._panServo.degree = degree
  }

  reset() {
    this._tiltServo.reset()
    this._panServo.reset()
  }

  write() {
    this._tiltServo.write()
    this._panServo.write()
  }
}
