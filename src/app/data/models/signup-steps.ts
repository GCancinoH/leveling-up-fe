export interface SignupData {
    accountDetails?: AccountDetails;
    personalInformation?: PersonalInformation;
    physicalAttributes?: PhysicalAttributes;
    bodyComposition?: BodyComposition;
    bodyMeasurements?: BodyMeasurements;
}

export interface AccountDetails {
    email?: string; 
    uid?: string;
}

export interface PersonalInformation {
    name?: string;
    birthDate?: Date;
    age?: number;
    gender?: string;
}

export interface PhysicalAttributes {
    height?: number;
    weight?: number;
    bmi?: number;
}

export interface BodyComposition {
    bodyFat?: number;
    muscleMass?: number;
    visceralFat?: number;
    bodyAge?: number;
}

export interface BodyMeasurements {
    neck?: number;
    rightForearm?: number;
    leftForearm?: number;
    rightArm?: number;
    leftArm?: number;
    rightArmContracted?: number;
    leftArmContracted?: number;
    chest?: number;
    shoulders?: number;
    waist?: number;
    umbilical?: number;
    hips?: number;
    leftLeg?: number;
    rightLeg?: number;
    rightCalf?: number;
    leftCalf?: number;
}

export enum Improvements {
    MOBILITY = 'MOBILITY',
    ENDURANCE = 'ENDURANCE',
    SELF_DEVELOPMENT = 'SELF_DEVELOPMENT',
    RECOVERY = 'RECOVERY',
    MENTAL_TOUGHNESS = 'MENTAL_TOUGHNESS'
}