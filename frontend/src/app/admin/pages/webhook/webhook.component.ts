import { SmsService } from './../../../core/services/sms/sms.service';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject, tap, catchError } from 'rxjs';
import { AlertService } from '../../../core/services/alert/alert.service';
import { SharedService } from '../../../core/services/shared/shared.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { WebhookModalComponent } from './components/webhook-modal/webhook-modal.component';
import { WebhookService } from '../../../core/services/webhook/webhook.service';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-webhook',
  imports: [
    CommonModule,
    DataTablesModule,
    BreadcrumbsComponent,
    WebhookModalComponent,
  ],
  templateUrl: './webhook.component.html',
  styleUrl: './webhook.component.css',
})
export class WebhookComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  webhooks: any[] = [];
  selectedWebhook!: any;
  selectedWebhooks: any[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private webhookService: WebhookService,
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
    this.getWebhooks();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getWebhooks(): void {
    this.webhookService.getAllWebhooks().subscribe({
      next: async (res) => {
        this.webhooks = res;
        console.log('Webhooks récupérés:', this.webhooks);
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
          'Erreur lors de la récupération des webhooks : ',
          err
        );
        this.sharedService.hide();
        this.isLoading = false;
      },
    });
  }

  selecteWebhook(webhook: any) {
    this.isEditMode = true;
    this.selectedWebhook = { ...webhook }; // Clone pour éviter de modifier l'original
    this.sharedService.openModal('genericModal');
  }

  handleAdd(newWebhook: any) {
    this.webhookService.registerWebhook(newWebhook).subscribe({
      next: (res) => {
        this.closeModal();
        this.getWebhooks();
        this.alertService.showToast('🎉 Webhook enregistré avec succès !');
      },
      error: (error) => {
        this.alertService.showToast(
          "❌ Une erreur s'est produite. Réessaye plus tard.",
          'error'
        );
        console.error("Erreur lors de l'ajout du webhook", error);
      },
    });
  }

  handleUpdate(updatedWebhook: any) {
    this.webhookService
      .update(this.selectedWebhook.id, updatedWebhook)
      .subscribe({
        next: (res) => {
          this.closeModal();
          this.getWebhooks();
          this.alertService.showToast(
            '🎉 Webhook mise à jour avec succès !'
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

  handleDelete(webhook: any): void {
    const title = webhook.name;

    this.alertService.confirmDeleteAsync(`le webhook ${title}`, () =>
      this.webhookService.delete(webhook.id).pipe(
        tap(() => {
          this.getWebhooks();
          this.alertService.showToast(
            `🎉 Le webhook ${title} a été supprimée avec succès !`
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

  toggleSelection(webhook: any, event: any) {
    if (event.target.checked) {
      this.selectedWebhooks.push(webhook);
    } else {
      this.selectedWebhooks = this.selectedWebhooks.filter(
        (r) => r.id !== webhook.id
      );
    }
  }

  selectAll(event: any) {
    if (event.target.checked) {
      this.selectedWebhooks = [...this.webhooks];
    } else {
      this.selectedWebhooks = [];
    }
  }
}
