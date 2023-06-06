import Level from "../level.ts";

import lab3json from '../assets/lab3.json?url'

export default class Level3 extends Level {
    constructor() {
        super('level3', 'lab3', lab3json);
    }
}
