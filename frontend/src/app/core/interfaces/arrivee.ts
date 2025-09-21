import { DepartMoment } from './depart_moment';
import { Trajet } from './trajet';

export interface Arrivee {
  id: number;
  libelle: string;
  trajet: Trajet;
  order?: number;
  moments?: DepartMoment[];
}
