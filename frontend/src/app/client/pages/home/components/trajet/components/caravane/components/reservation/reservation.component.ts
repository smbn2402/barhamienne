import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { ArriveeService } from '../../../../../../../../../core/services/arrivee/arrivee.service';
import { CaravaneService } from '../../../../../../../../../core/services/caravane/caravane.service';
import { DateFormatComponent } from '../../../../../../../../../shared/date-format/date-format.component';
import { ReservationService } from '../../../../../../../../../core/services/reservation/reservation.service';
import { Reservation } from '../../../../../../../../../core/interfaces/reservation';
import Swal from 'sweetalert2';
import { DepartMoment } from '../../../../../../../../../core/interfaces/depart_moment';
import { DepartMomentService } from '../../../../../../../../../core/services/depart-moment/depart-moment.service';
import { AlertService } from '../../../../../../../../../core/services/alert/alert.service';
import { Caravane } from '../../../../../../../../../core/interfaces/caravane';
import { HeaderComponent } from '../../../../../../../../shared/header/header.component';
import { SharedService } from '../../../../../../../../../core/services/shared/shared.service';
import { PaymentService } from '../../../../../../../../../core/services/payment/payment.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DateFormatComponent,
    HeaderComponent,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  caravaneId: string | null = null;
  caravane!: Caravane;
  step: number = 1; // Étape actuelle
  readonly maxStep = 5;
  form: FormGroup;
  arrivees: any[] = [];
  reservationId: number | null = null;
  departMoments: DepartMoment[] = [];
  wave_launch_url: string =
    'https://pay.wave.com/m/M_sn_yrMJl44aNeuP/c/sn/?amount=';
  salutation: string = '';
  qrCodeBase64: string | null = null;
  isOmLoading = false;
  isWaveLoading = false;
  isMobile = false;
  isLoading = false;
  deepLinks: any = {};
  selectedPayment: 'MAXIT' | 'OM' | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private caravaneService: CaravaneService,
    private departMomentService: DepartMomentService,
    private arriveeService: ArriveeService,
    private reservationService: ReservationService,
    private alertService: AlertService,
    private router: Router,
    private sharedService: SharedService,
    private paymentService: PaymentService
  ) {
    this.form = this.fb.group({
      infos_perso: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        tel: ['', [Validators.required, Validators.pattern('^([0-9]{9})$')]],
      }),
      trajet: this.fb.group({
        depart: ['', Validators.required],
        arrivee: ['', Validators.required],
        paiement: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.sharedService.show();
    this.caravaneId = this.route.snapshot.paramMap.get('id');
    this.getCaravane();
    const hour = new Date().getHours();
    this.salutation = hour < 18 ? 'Bonjour' : 'Bonsoir';
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // Aller à l'étape suivante
  nextStep() {
    if (this.step === 1) {
      if (this.form.get('infos_perso')?.valid) {
        this.step++;
      } else {
        this.form.get('infos_perso')?.markAllAsTouched(); // Affiche les erreurs
      }
    } else if (this.step === 2) {
      if (this.form.get('trajet')?.valid) {
        this.step++;
      } else {
        this.form.get('trajet')?.markAllAsTouched();
      }
    } else if (this.step === 3) {
      this.step++;
    }
  }

  // Revenir à l'étape précédente
  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  getDepartLabel(): string {
    const id = Number(this.form.get('trajet.depart')?.value);
    const departMoment = this.departMoments.find((d) => d.id === id);
    return departMoment?.depart
      ? departMoment?.depart.libelle + ' à ' + departMoment.heureDepart
      : 'Non défini';
  }

  getArriveeLabel(): string {
    const id = Number(this.form.get('trajet.arrivee')?.value);
    const arrivee = this.arrivees.find((a) => a.id === id);
    return arrivee ? arrivee.libelle : 'Non défini';
  }

  getPaiementLabel(): string {
    const paiement = this.form.get('trajet.paiement')?.value;
    return paiement === 'OM'
      ? 'Orange Money'
      : paiement === 'WAVE'
      ? 'Wave'
      : 'Non défini';
  }

  getCaravane() {
    if (!this.caravaneId) return;

    this.caravaneService.getById(Number(this.caravaneId)).subscribe({
      next: (res) => {
        this.caravane = res;
        // Vérifier que trajet existe avant d’appeler les services
        if (this.caravane.trajet && this.caravane.trajet.id) {
          this.getArriveesByTrajet(this.caravane.trajet.id);
          this.getDepartMomentsByTrajetAndMoment(
            this.caravane.trajet.id,
            this.caravane.moment.id
          );
        } else {
          console.warn('Le trajet de la caravane est manquant ou invalide.');
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la caravane', err);
      },
    });
  }

  getArriveesByTrajet(trajetId: number): void {
    this.arriveeService.getByTrajet(trajetId).subscribe(
      (res) => {
        this.arrivees = res;
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des points d'arrivée:",
          error
        );
      }
    );
  }

  saveReservation() {
    this.isLoading = true;
    const departMoment = this.departMoments.find(
      (d) => d.id === Number(this.form.get('trajet.depart')?.value)
    );
    const reservation: Reservation = {
      id: 0, // L'ID sera géré par le backend
      date: new Date(),
      statut: 'EN_ATTENTE', // Statut par défaut
      client: {
        id: 0,
        prenom: this.form.get('infos_perso.firstName')?.value,
        nom: this.form.get('infos_perso.lastName')?.value,
        tel: this.form.get('infos_perso.tel')?.value,
      },
      caravane: this.caravane, // Assure-toi que la caravane est bien définie dans ton composant
      departMoment: departMoment!,
      arrivee: this.arrivees.find(
        (a) => a.id === Number(this.form.get('trajet.arrivee')?.value)
      ),
    };

    this.reservationService.create(reservation).subscribe(
      (res) => {
        this.alertService.showToast('🎉 Réservation enregistrée avec succès !');
        this.reservationId = res.data.id; // Stocke l'ID pour le paiement
        this.nextStep(); // Passe à l'étape du paiement
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          const data = err.error;

          if (!data.paiement_statut || data.paiement_statut !== 'SUCCESS') {
            // Cas : pas de paiement OU paiement non finalisé
            let msg = 'Vous avez déjà réservé, mais ';
            msg += !data.paiement_statut
              ? 'aucun paiement n’a été effectué.'
              : 'votre paiement est en attente ou annulé.';

            Swal.fire({
              icon: 'info',
              title: 'Paiement à finaliser',
              text: msg + ' Souhaitez-vous le refaire ?',
              showCancelButton: true,
              confirmButtonText: 'Oui, payer',
              cancelButtonText: 'Annuler',
            }).then((result) => {
              if (result.isConfirmed) {
                this.reservationId = data.reservation_id;
                this.step = 4; // Aller à l'étape du paiement
              }
            });
          } else {
            // Cas : paiement déjà effectué avec succès
            Swal.fire({
              icon: 'warning',
              title: 'Réservation confirmée',
              text: data.message,
            });
          }
        } else {
          console.error(
            "Erreur lors de l'enregistrement de la réservation",
            err
          );
          this.alertService.showToast(
            "❌ Une erreur s'est produite. Réessaye plus tard.",
            'error'
          );
        }
      }
    );
  }

  confirmPaiement() {
    if (this.reservationId && this.form.get('trajet.paiement')?.valid) {
      const paiementMethod = this.form.get('trajet.paiement')?.value;

      this.reservationService
        .update(this.reservationId, paiementMethod)
        .subscribe(
          () => {
            alert('Paiement enregistré avec succès !');
            this.router.navigate(['/confirmation']);
          },
          (error) => {
            console.error(
              "Erreur lors de l'enregistrement du paiement :",
              error
            );
          }
        );
    }
  }

  getDepartMomentsByTrajetAndMoment(trajetId: number, momentId: number): void {
    this.departMomentService
      .getDepartMomentsByTrajetAndMoment(trajetId, momentId)
      .subscribe({
        next: (res) => {
          this.departMoments = res;
          this.sharedService.hide();
        },
        error: (err) => {
          this.sharedService.hide();
          console.log(
            'Erreur lors de la récupérations des points de départs',
            err
          );
        },
      });
  }

  formattedDate(date: Date): string {
    return formatDate(date, 'EEEE d MMM à H:M:S', 'fr-FR');
  }

  // Soumettre le formulaire
  onSubmit() {
    const data = {
      montant: this.caravane.prix,
      reservation_id: this.reservationId,
    };
    console.log('Données de paiement:', data);
    const paiementMethod = this.form.get('trajet.paiement')?.value;

    if (paiementMethod === 'WAVE') {
      this.payerAvecWave(data); // Appel à la méthode de paiement Wave
    } else {
      this.payerAvecOrangeMoney(data);
    }
  }

  payerAvecWave(data: any): void {
    this.isWaveLoading = true;
    // this.reservationService.payerAvecWave(res).subscribe({
    //   next: (res) => {
    //     window.location.href = res.wave_launch_url;
    //   },
    //   error: (err) => {
    //     Swal.fire("Erreur", "Une erreur est survenue", err);
    //     console.log(err);
    //   },
    // });
    window.location.href = this.wave_launch_url + data.montant;
  }

  payerAvecOrangeMoney(data: any) {
    this.isOmLoading = true;
    this.paymentService.payerAvecOrangeMoney(data).subscribe({
      next: (res) => {
        console.log('Réponse paiement OM:', res);
        this.isOmLoading = false;

        if (res.orange_response) {
          this.deepLinks = res.orange_response.deepLinks || {};
          this.qrCodeBase64 = res.orange_response.qrCode || '';
          this.step = 5; // Passer à l'étape paiement OM
        }
      },
      error: (err) => {
        this.isOmLoading = false;
        this.alertService.showToast(
          "❌ Une erreur s'est produite lors du paiement. Réessaye plus tard.",
          'error'
        );
        console.error('Erreur paiement OM', err);
      },
    });
  }

  redirectToPayment() {
    if (!this.selectedPayment) return;

    const url = this.deepLinks[this.selectedPayment];
    if (url) {
      window.open(url, '_blank');
    }
  }

  finish() {
    // Redirection ou message final
    this.router.navigate(['/']); // ou autre route
  }
}
