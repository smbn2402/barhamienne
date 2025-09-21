import { ArriveeMoment } from "./arrivee_moment";
import { DepartMoment } from "./depart_moment";
import { Moment } from "./moment";
import { Trajet } from "./trajet";

export interface Caravane {
  id: number;
  libelle: string;
  date: Date;
  prix: number;
  telAgent: string;
  estPubliee: boolean;
  estOuverte: boolean;
  trajet: Trajet;
  moment: Moment;
  reservationsCount?: number;
  yobantesCount?: number;
  departMomentPrincipale?: DepartMoment;
  arriveeMomentPrincipale?: ArriveeMoment;
}
