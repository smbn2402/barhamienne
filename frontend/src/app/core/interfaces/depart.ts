import { DepartMoment } from "./depart_moment";
import { Trajet } from "./trajet";

export interface Depart {
    id: number,
    libelle: string,
    trajet: Trajet,
    order?: number,
    moments?: DepartMoment[]
}
