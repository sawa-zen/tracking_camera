import { Rect } from 'opencv4nodejs'
import { FaceDetectCamera } from './classes/FaceDetectCamera'
import { TiltPan } from './classes/TiltPan'

// 30FPS更新
class Zensuke {
  private _camera: FaceDetectCamera
  private _frameCount: number = 0
  private _tiltPan: TiltPan
  private _stopTiltPan: boolean = false
  private _target: Rect | null
  private _detectedTime: number

  constructor () {
    this._camera = new FaceDetectCamera()
    this._tiltPan = new TiltPan('GPIO18', 'GPIO19')
    this._tiltPan.write()
  }

  private _move = () => {
    const diff = 50

    if (this._target) {
      const targetCenterX = (this._target.x + (this._target.width / 2))
      const targetCenterY = (this._target.y + (this._target.height / 2))
      const addPanDegree = Math.abs(FaceDetectCamera.PHOTO_CENTER_X - targetCenterX) * 0.005
      const addTiltDegree = Math.abs(FaceDetectCamera.PHOTO_CENTER_Y - targetCenterY) * 0.005
      if (targetCenterX > FaceDetectCamera.PHOTO_CENTER_X + diff) {
        this._tiltPan.panTo(Math.min(180, this._tiltPan.panDegree + addPanDegree))
      } else if (targetCenterX < FaceDetectCamera.PHOTO_CENTER_X - diff) {
        this._tiltPan.panTo(Math.max(0, this._tiltPan.panDegree - addPanDegree))
      }
      if (targetCenterY > FaceDetectCamera.PHOTO_CENTER_Y + diff) {
        this._tiltPan.tiltTo(Math.min(180, this._tiltPan.tiltDegree + addTiltDegree))
      } else if (targetCenterY < FaceDetectCamera.PHOTO_CENTER_Y - diff) {
        this._tiltPan.tiltTo(Math.max(0, this._tiltPan.tiltDegree - addTiltDegree))
      }
    } else if (!this._stopTiltPan) {
      const addDegree = 0.5
      if (this._tiltPan.panDegree > TiltPan.PAN_DEFAULT_DEGREE) {
        this._tiltPan.panTo(this._tiltPan.panDegree - addDegree)
      } else if (this._tiltPan.panDegree < 90) {
        this._tiltPan.panTo(this._tiltPan.panDegree + addDegree)
      }
      if (this._tiltPan.tiltDegree > TiltPan.TILT_DEFAULT_DEGREE) {
        this._tiltPan.tiltTo(this._tiltPan.tiltDegree - addDegree)
      } else if (this._tiltPan.tiltDegree < 90) {
        this._tiltPan.tiltTo(this._tiltPan.tiltDegree + addDegree)
      }
    }
    this._tiltPan.write()
  }

  private _handleFaceDetect = (newTarget: Rect) => {
    this._target = newTarget
    if (newTarget) {
      this._detectedTime = this._frameCount
      this._stopTiltPan = true
    } else if (this._frameCount - this._detectedTime > 30) {
      this._detectedTime = 0
      this._stopTiltPan = false
    }
  }

  private _exec = async () => {
    if (this._frameCount % 20 === 0) {
      this._camera.faceDetect().then(this._handleFaceDetect)
    }

    if (this._frameCount % 1 === 0) {
      this._move()
    }
  }

  public run = () => {
    this._exec()

    this._frameCount++
    setTimeout(this.run, 33)
  }
}

const zensuke = new Zensuke()
zensuke.run()

