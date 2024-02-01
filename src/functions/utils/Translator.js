import { translation } from "../../config/translation";
import { safeGet } from "functions/utils/Fixers";


export const t = (lang, value) => {

    let trans = safeGet(translation, value);

    if(lang=="french" && trans) {
        return trans
    } 

    return value;
}