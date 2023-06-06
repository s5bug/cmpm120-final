import Level from "../level.ts";

import lab1json from '../assets/lab1.json?url';

export default class Level1 extends Level {
    constructor() {
        super('level1', 'lab1', lab1json);
    }
}
