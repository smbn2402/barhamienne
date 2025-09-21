import { Depart } from "./depart";
import { Moment } from "./moment";

export interface DepartMoment {
  id: number;
  depart: Depart;
  moment: Moment;
  heureDepart: string; // Heure spécifique sous forme de string ("HH:mm:ss")
}
