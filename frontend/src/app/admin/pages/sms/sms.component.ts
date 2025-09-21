import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { SmsLogService } from '../../../core/services/sms-log/sms-log.service';
import { SmsLog } from '../../../core/interfaces/sms_log';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs.component';
import { SmsService } from '../../../core/services/sms/sms.service';
import { DateFormatComponent } from '../../../shared/date-format/date-format.component';
import { SharedService } from '../../../core/services/shared/shared.service';

@Component({
  selector: 'app-sms',
  imports: [
    DataTablesModule,
    CommonModule,
    BreadcrumbsComponent,
    DateFormatComponent,
  ],
  templateUrl: './sms.component.html',
  styleUrl: './sms.component.css',
})
export class SmsComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  smsLogs: SmsLog[] = [];
  isLoading: boolean = true;
  statusMap: { [key: number]: string } = {
    1: "Envoyé à l'opérateur",
    2: 'Envoyé mais non délivré',
    3: 'Livré avec succès',
    4: 'Non reçu',
    5: "Rejeté par l'opérateur",
  };
  balance: any;

  constructor(
    private smsLogService: SmsLogService,
    private smsService: SmsService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json',
      },
    };
    this.checkBalance();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getSmsLogs(): void {
    this.smsLogService.getAll().subscribe({
      next: async (res) => {
        this.smsLogs = res;
        this.isLoading = false;
        if (this.dtElement && this.dtElement.dtInstance) {
          const dtInstance = await this.dtElement.dtInstance;
          dtInstance.destroy(); // détruit l'ancienne instance DataTables
          this.dtTrigger.next(null); // réinitialise DataTables avec les nouvelles données
        } else {
          this.dtTrigger.next(null); // 1ère initialisation
        }
        this.sharedService.hide();
      },
      error: (err) => {
        console.log('Erreur lors du chargement des sms logs', err);
        this.sharedService.hide();
        this.isLoading = false;
      },
    });
  }

  checkBalance() {
    this.smsService.getBalance().subscribe({
      next: (res) => {
        this.balance = res;
        this.getSmsLogs(); // Recharger les logs après avoir vérifié le solde
      },
      error: (err) => {
        console.error('Erreur lors de checkBalance:', err);
      },
    });
  }
}
