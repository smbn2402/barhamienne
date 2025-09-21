import { Arrivee } from './arrivee';
import { Moment } from "./moment";

export interface ArriveeMoment {
  id: number;
  arrivee: Arrivee;
  moment: Moment;
  heureArrivee: string; // Heure spécifique sous forme de string ("HH:mm:ss")
}
