import { DBConfig } from "ngx-indexed-db";
import { playerStore } from "./schemas/player.store";
import { playerAttributesStore } from "./schemas/player/player-attributes.store";
import { playerProgressStore } from "./schemas/player/player-progress.store";
import { bodyCompositionStore } from "./schemas/body-composition-logs.store";
import { measurementsStore } from "./schemas/measurement-logs.store";

export const dbConfig: DBConfig = {
    name: 'appDB',
    version: 1,
    objectStoresMeta: [
        // player schemas
        playerStore,
        playerAttributesStore,
        playerProgressStore,
        // body composition schema
        bodyCompositionStore,
        // measurements schema
        measurementsStore
    ]
}