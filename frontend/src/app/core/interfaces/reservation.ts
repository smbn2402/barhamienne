import { Arrivee } from './arrivee';
import { Caravane } from './caravane';
import { Client } from './client';
import { DepartMoment } from './depart_moment';
import { Paiement } from './paiement';

export interface Reservation {
  id: number;
  date: Date;
  statut: string;
  client: Client;
  caravane: Caravane;
  departMoment: DepartMoment;
  arrivee: Arrivee;
  paiements?: Paiement[];
}
