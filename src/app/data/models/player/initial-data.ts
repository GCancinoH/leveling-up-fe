import { InitialDataBodyComposition } from "@models/player/initialData/body-composition";
import { InitialDataMeasurements } from "@models/player/initialData/measurements";

export interface PlayerInitialData {
    bodyComposition?: InitialDataBodyComposition;
    measurements?: InitialDataMeasurements;
}
