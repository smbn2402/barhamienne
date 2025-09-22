import { SmsService } from '../../../core/services/sms/sms.service';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject, tap, catchError } from 'rxjs';
import { Utilisateur } from '../../../core/interfaces/utilisateur';
import { AlertService } from '../../../core/services/alert/alert.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { UtilisateurModalComponent } from './components/utilisateur-modal/utilisateur-modal.component';
import { UtilisateurService } from '../../../core/services/utilisateur/utilisateur.service';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-utilisateur',
  imports: [
    CommonModule,
    DataTablesModule,
    BreadcrumbsComponent,
    UtilisateurModalComponent,
  ],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css',
})
export class UtilisateurComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  utilisateurs: Utilisateur[] = [];
  selectedUtilisateur!: Utilisateur;
  selectedUtilisateurs: any[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private utilisateurService: UtilisateurService,
    private alertService: AlertService,
    private sharedService: SharedService,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    this.sharedService.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json',
      },
    };
    this.getUtilisateurs();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getUtilisateurs(): void {
    this.utilisateurService.getAll().subscribe({
      next: async (res) => {
        this.utilisateurs = res;
        console.log('Utilisateurs récupérés:', this.utilisateurs);
        this.sharedService.hide();
        this.isLoading = false;
        if (this.dtElement && this.dtElement.dtInstance) {
          const dtInstance = await this.dtElement.dtInstance;
          dtInstance.destroy(); // détruit l'ancienne instance DataTables
          this.dtTrigger.next(null); // réinitialise DataTables avec les nouvelles données
        } else {
          this.dtTrigger.next(null); // 1ère initialisation
        }
      },
      error: (err) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs : ',
          err
        );
        this.sharedService.hide();
        this.isLoading = false;
      },
    });
  }

  selecteUtilisateur(utilisateur: Utilisateur) {
    this.isEditMode = true;
    this.selectedUtilisateur = { ...utilisateur }; // Clone pour éviter de modifier l'original
    this.sharedService.openModal('genericModal');
  }

  handleAdd(newUtilisateur: Utilisateur) {
    this.utilisateurService.create(newUtilisateur).subscribe({
      next: (res) => {
        this.closeModal();
        this.getUtilisateurs();
        this.alertService.showToast('🎉 Utilisateur enregistré avec succès !');
      },
      error: (error) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error("Erreur lors de l'ajout du utilisateur", error);
      },
    });
  }

  handleUpdate(updatedUtilisateur: Utilisateur) {
    this.utilisateurService
      .update(this.selectedUtilisateur.id, updatedUtilisateur)
      .subscribe({
        next: (res) => {
          this.closeModal();
          this.getUtilisateurs();
          this.alertService.showToast(
            '🎉 Utilisateur mise à jour avec succès !'
          );
        },
        error: (err) => {
          this.alertService.showToast(
            "❌ Une erreur s'est produite. Réessaye plus tard.",
            'error'
          );
          console.error('Erreur lors de la mise à jour', err);
        },
      });
  }

  handleDelete(utilisateur: Utilisateur): void {
    const title = utilisateur.name;

    this.alertService.confirmDeleteAsync(`le utilisateur ${title}`, () =>
      this.utilisateurService.delete(utilisateur.id).pipe(
        tap(() => {
          this.getUtilisateurs();
          this.alertService.showToast(
            `🎉 Le utilisateur ${title} a été supprimée avec succès !`
          );
        }),
        catchError((err) => {
          console.error('Erreur lors de la suppression:', err);
          this.alertService.showToast(
            "❌ Une erreur s'est produite. Réessaye plus tard.",
            'error'
          );
          throw err;
        })
      )
    );
  }

  closeModal(): void {
    this.sharedService.closeModal('genericModal');
    this.isEditMode = false;
  }

  resetPassword(utilisateur: any) {

    const title = utilisateur.name;

    this.alertService.confirmActionAsync(`Envoyer un email de  réinitialisation à ${utilisateur.email}`, 'Envoyer', () =>
      this.utilisateurService.sendResetPasswordLink(utilisateur.email).pipe(
        tap(() => {
          this.alertService.showToast(
            `🎉 Un email de réinitialisation a été envoyé à ${utilisateur.email}.`
          );
        }),
        catchError((err) => {
          console.error('Erreur lors de la réinitialisation', err);
          this.alertService.showToast(
            "❌ Une erreur s'est produite lors de la réinitialisation du mot de passe.",
            'error'
          );
          throw err;
        })
      )
    );
  }

  toggleSelection(utilisateur: any, event: any) {
    if (event.target.checked) {
      this.selectedUtilisateurs.push(utilisateur);
    } else {
      this.selectedUtilisateurs = this.selectedUtilisateurs.filter(
        (r) => r.id !== utilisateur.id
      );
    }
  }

  selectAll(event: any) {
    if (event.target.checked) {
      this.selectedUtilisateurs = [...this.utilisateurs];
    } else {
      this.selectedUtilisateurs = [];
    }
  }

  handleBulkMessage(event: { message: string; utilisateurs: any[] }) {
    this.smsService
      .sendBulkMessage(event.message, event.utilisateurs)
      .subscribe({
        next: (res) => {
          this.alertService.showToast('🎉 Messages envoyés avec succès');
          this.sharedService.closeModal('messageModal');
        },
        error: (err) => {
          console.error(err);
          this.alertService.showToast(
            '❌ Erreur lors de l’envoi des messages',
            'error'
          );
        },
      });
  }

  exportConfirmedUtilisateursToPDF(): void {
    // const confirmed = this.utilisateurs.filter(
    //   (r) => r.statut.toUpperCase() === 'CONFIRMEE'
    // );
    // const doc = new jsPDF();
    // doc.text('Liste des réservations confirmées', 14, 15);
    // const rows = confirmed.map((r, i) => [
    //   i + 1,
    //   r.utilisateur.prenom,
    //   r.utilisateur.nom,
    //   r.utilisateur.tel,
    //   `${r.departMoment.depart.libelle} (${r.departMoment.heureDepart})`,
    //   r.arrivee.libelle,
    //   new Date(r.date).toLocaleDateString(), // ✅ Date convertie en string
    // ]);
    // autoTable(doc, {
    //   startY: 20,
    //   head: [['#', 'Prénom', 'Nom', 'Téléphone', 'Départ', 'Arrivée', 'Date']],
    //   body: rows,
    //   styles: { fontSize: 9 },
    // });
    // doc.save(
    //   `utilisateurs_confirmées_${new Date().toISOString().split('T')[0]}.pdf`
    // );
  }

  exportToExcel(): void {
    // const exportData = this.utilisateurs.map((res, index) => ({
    //   '#': index + 1,
    //   Prénom: res.utilisateur?.prenom,
    //   Nom: res.utilisateur?.nom,
    //   Numéro: res.utilisateur?.tel,
    //   'Point de départ': `${res.departMoment?.depart?.libelle} (${res.departMoment?.heureDepart})`,
    //   "Point d'arrivée": res.arrivee?.libelle,
    //   Statut: res.statut,
    //   Date: res.date,
    // }));
    // const worksheet = XLSX.utils.json_to_sheet(exportData);
    // const workbook = {
    //   Sheets: { Utilisateurs: worksheet },
    //   SheetNames: ['Utilisateurs'],
    // };
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array',
    // });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(blob, `utilisateurs_${new Date().toISOString()}.xlsx`);
  }

  exportConfirmedUtilisateurs(): void {
    // const confirmed = this.utilisateurs.filter(
    //   (r) => r.statut === 'CONFIRMEE' || r.statut === 'CONFIRMEE'
    // );
    // const data = confirmed.map((r, i) => ({
    //   '#': i + 1,
    //   Prénom: r.utilisateur.prenom,
    //   Nom: r.utilisateur.nom,
    //   Téléphone: r.utilisateur.tel,
    //   Départ: `${r.departMoment.depart.libelle} (${r.departMoment.heureDepart})`,
    //   Arrivée: r.arrivee.libelle,
    //   Statut: r.statut,
    //   Date: r.date,
    // }));
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(
    //   workbook,
    //   worksheet,
    //   'Utilisateurs confirmées'
    // );
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array',
    // });
    // const blob = new Blob([excelBuffer], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // });
    // saveAs(blob, `utilisateurs_confirmees_${new Date().toISOString()}.xlsx`);
  }
}
