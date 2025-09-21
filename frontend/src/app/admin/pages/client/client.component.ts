import { SmsService } from './../../../core/services/sms/sms.service';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import saveAs from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subject, tap, catchError } from 'rxjs';
import { Client } from '../../../core/interfaces/client';
import { AlertService } from '../../../core/services/alert/alert.service';
import { ClientService } from '../../../core/services/client/client.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { ClientModalComponent } from './components/client-modal/client-modal.component';
import { MessageModalComponent } from '../client/components/message-modal/message-modal.component';

@Component({
  selector: 'app-client',
  imports: [
    CommonModule,
    DataTablesModule,
    BreadcrumbsComponent,
    ClientModalComponent,
    MessageModalComponent,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  clients: Client[] = [];
  selectedClient!: Client;
  selectedClients: any[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private clientService: ClientService,
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
    this.getClients();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getClients(): void {
    this.clientService.getAll().subscribe({
      next: async (res) => {
        this.clients = res;
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
        console.error('Erreur lors de la récupération des clients : ', err);
        this.sharedService.hide();
        this.isLoading = false;
      },
    });
  }

  selecteClient(client: Client) {
    this.isEditMode = true;
    this.selectedClient = { ...client }; // Clone pour éviter de modifier l'original
    this.sharedService.openModal('genericModal');
  }

  handleAdd(newClient: Client) {
    this.clientService.create(newClient).subscribe({
      next: (res) => {
        this.getClients();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Client enregistré avec succès !');
        this.isEditMode = false;
      },
      error: (error) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error("Erreur lors de l'ajout du client", error);
      },
    });
  }

  handleUpdate(updatedClient: Client) {
    this.clientService.update(this.selectedClient.id, updatedClient).subscribe({
      next: (res) => {
        this.getClients();
        this.sharedService.closeModal('genericModal');
        this.alertService.showToast('🎉 Client mise à jour avec succès !');
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

  handleDelete(client: Client): void {
    const title = client.prenom + ' ' + client.nom;

    this.alertService.confirmDeleteAsync(`le client ${title}`, () =>
      this.clientService.delete(client.id).pipe(
        tap(() => {
          this.getClients();
          this.alertService.showToast(
            `🎉 Le client ${title} a été supprimée avec succès !`
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

  toggleSelection(client: any, event: any) {
    if (event.target.checked) {
      this.selectedClients.push(client);
    } else {
      this.selectedClients = this.selectedClients.filter(
        (r) => r.id !== client.id
      );
    }
  }

  selectAll(event: any) {
    if (event.target.checked) {
      this.selectedClients = [...this.clients];
    } else {
      this.selectedClients = [];
    }
  }

  handleBulkMessage(event: { message: string; clients: any[] }) {
    this.smsService.sendBulkMessage(event.message, event.clients).subscribe({
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

  exportConfirmedClientsToPDF(): void {
    // const confirmed = this.clients.filter(
    //   (r) => r.statut.toUpperCase() === 'CONFIRMEE'
    // );
    // const doc = new jsPDF();
    // doc.text('Liste des réservations confirmées', 14, 15);
    // const rows = confirmed.map((r, i) => [
    //   i + 1,
    //   r.client.prenom,
    //   r.client.nom,
    //   r.client.tel,
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
    //   `clients_confirmées_${new Date().toISOString().split('T')[0]}.pdf`
    // );
  }

  exportToExcel(): void {
    // const exportData = this.clients.map((res, index) => ({
    //   '#': index + 1,
    //   Prénom: res.client?.prenom,
    //   Nom: res.client?.nom,
    //   Numéro: res.client?.tel,
    //   'Point de départ': `${res.departMoment?.depart?.libelle} (${res.departMoment?.heureDepart})`,
    //   "Point d'arrivée": res.arrivee?.libelle,
    //   Statut: res.statut,
    //   Date: res.date,
    // }));
    // const worksheet = XLSX.utils.json_to_sheet(exportData);
    // const workbook = {
    //   Sheets: { Clients: worksheet },
    //   SheetNames: ['Clients'],
    // };
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array',
    // });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(blob, `clients_${new Date().toISOString()}.xlsx`);
  }

  exportConfirmedClients(): void {
    // const confirmed = this.clients.filter(
    //   (r) => r.statut === 'CONFIRMEE' || r.statut === 'CONFIRMEE'
    // );
    // const data = confirmed.map((r, i) => ({
    //   '#': i + 1,
    //   Prénom: r.client.prenom,
    //   Nom: r.client.nom,
    //   Téléphone: r.client.tel,
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
    //   'Clients confirmées'
    // );
    // const excelBuffer = XLSX.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array',
    // });
    // const blob = new Blob([excelBuffer], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // });
    // saveAs(blob, `clients_confirmees_${new Date().toISOString()}.xlsx`);
  }
}
