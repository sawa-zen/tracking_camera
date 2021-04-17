import { Canvas, createCanvas, loadImage } from 'canvas'
import * as fs from 'fs'
import * as cv from 'opencv4nodejs'
import * as PiCamera from 'pi-camera'

const DEBUG = false

export class FaceDetectCamera {
  static readonly PHOTO_WIDTH = 640
  static readonly PHOTO_HEIGHT = 480
  static readonly PHOTO_CENTER_X = FaceDetectCamera.PHOTO_WIDTH / 2
  static readonly PHOTO_CENTER_Y = FaceDetectCamera.PHOTO_HEIGHT / 2

  private _camera: PiCamera
  private _classifier: cv.CascadeClassifier
  private _debugCanvas: Canvas
  private _debugCtx: CanvasRenderingContext2D

  constructor() {
    this._camera = new PiCamera({
      mode: 'photo',
      width: FaceDetectCamera.PHOTO_WIDTH,
      height: FaceDetectCamera.PHOTO_HEIGHT,
      timeout: 1,
      shutter: 50000,
      vflip: true,
      nopreview: !DEBUG,
    })
    this._classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT)
    this._debugCanvas = createCanvas(
      FaceDetectCamera.PHOTO_WIDTH,
      FaceDetectCamera.PHOTO_HEIGHT,
    )
    this._debugCtx = this._debugCanvas.getContext('2d')
  }

  public faceDetect = async (): Promise<cv.Rect | null> => {
    const base64text = await this._camera.snapDataUrl()
    // 対象画像読込
    const base64data = base64text
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/jpg;base64', '')
      .replace('data:image/png;base64', '')
    const buffer = Buffer.from(base64data, 'base64')
    const image = cv.imdecode(buffer) //Image is now represented as Mat
    const { objects, numDetections } = this._classifier.detectMultiScale(image.bgrToGray())

    if (!objects.length) {
      return null
    }

    console.log('顔検出した領域:', objects)
    console.log('確度:', numDetections)

    const target = objects[0]

    if (DEBUG) {
      const img = await loadImage(base64text)
      this._debugCtx.drawImage(img as any, 0, 0, FaceDetectCamera.PHOTO_WIDTH, FaceDetectCamera.PHOTO_HEIGHT)
      this._debugCtx.strokeStyle = '#F00'
      this._debugCtx.lineWidth = 15
      this._debugCtx.strokeRect(
        target.x,
        target.y,
        target.width,
        target.height,
      )
      const out = fs.createWriteStream('./result.jpg')
      const stream = this._debugCanvas.createJPEGStream()
      stream.pipe(out)
    }

    return target
  }
}
