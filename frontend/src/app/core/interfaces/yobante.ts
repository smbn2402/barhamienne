import { Caravane } from "./caravane";
import { DepartMoment } from "./depart_moment";

export interface Yobante {
    id: number,
    prenomExp: string,
    nomExp: string,
    telExp: string,
    typeColis: string,
    caravane: Caravane,
    departMoment: DepartMoment,
    retrait: string,
    prenomDest: string,
    nomDest: string,
    telDest: string
}