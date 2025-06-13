import { Categories } from "./progress/categories";

export interface PlayerProgress {
    coins?: number;
    currentCategory?: Categories.CATEGORY_BEGINNER;
    exp?: number;
    lastCategoryUpdate?: Categories | null;
    lastLevelUpdate?: number | null;
    level?: 1 
}
