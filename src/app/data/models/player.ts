import { PlayerAttributes } from "@models/player/attributes";
import { PlayerImprovements } from "@models/player/improvements";
import { PlayerInitialData } from "@models/player/initial-data";
import { PlayerObjectives } from "@models/player/objectives";
import { PlayerProgress } from "@models/player/progress";
import { PlayerStreak } from "@models/player/streak";

export interface Player {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    age?: string;
    height?: string;
    birthday?: Date;
    gender?: string;
    attributes?: PlayerAttributes;
    improvements?: PlayerImprovements;
    initialData?: PlayerInitialData;
    objectives?: PlayerObjectives | PlayerObjectives[];
    progress?: PlayerProgress;
    streak?: PlayerStreak;
}
