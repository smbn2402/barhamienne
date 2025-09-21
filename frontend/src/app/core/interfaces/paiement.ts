export interface Paiement {
  id: number;
  date: Date;
  montant: number;
  methode: string;
  statut: string;
}
