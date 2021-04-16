import { ServoMotor } from '~/classes/ServoMotor'

export class SG90 extends ServoMotor {
    static readonly FREQUENCY: number = 50 // 50Hz
    static readonly MIN_RATE: number = 0.025
    static readonly MAX_RATE: number = 0.12
    static readonly MAX_DEGREE: number = 180

    constructor(
        readonly pin: string, 
        readonly defaultDegree: number,
    ) {
        super(
            pin,
            defaultDegree,
            SG90.FREQUENCY,
            SG90.MIN_RATE,
            SG90.MAX_RATE,
            SG90.MAX_DEGREE,
        )
    }
}