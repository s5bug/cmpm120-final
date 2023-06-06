import Level from "../level.ts";

import lab2json from '../assets/lab2.json?url';

export default class Level2 extends Level {
    constructor() {
        super('level2', 'lab2', lab2json);
    }
}
