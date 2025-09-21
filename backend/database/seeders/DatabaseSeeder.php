<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // $admin = User::find(1);
        // if ($admin && !$admin->hasRole('admin')) {
        //     $admin->assignRole('admin');
        // }

        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        //     // Clients
        //     DB::table('clients')->insert([
        //         ['prenom' => 'Alioune', 'nom' => 'Diop', 'tel' => '771234567', 'email' => 'alioune.diop@example.com', 'created_at' => now(), 'updated_at' => now()],
        //         ['prenom' => 'Fatou', 'nom' => 'Ndoye', 'tel' => '778765432', 'email' => 'fatou.ndoye@example.com', 'created_at' => now(), 'updated_at' => now()],
        //         ['prenom' => 'Mamadou', 'nom' => 'Ba', 'tel' => '776543210', 'email' => 'mamadou.ba@example.com', 'created_at' => now(), 'updated_at' => now()],
        //     ]);

        //     // Moments
        //     DB::table('moments')->insert([
        //         ['libelle' => 'Matin', 'created_at' => now(), 'updated_at' => now()],
        //         ['libelle' => 'Après-midi', 'created_at' => now(), 'updated_at' => now()],
        //         ['libelle' => 'Soir', 'created_at' => now(), 'updated_at' => now()],
        //     ]);

        //     // Paiements
        //     DB::table('paiements')->insert([
        //         ['date' => now(), 'montant' => 10000, 'methode' => 'Orange Money', 'created_at' => now(), 'updated_at' => now()],
        //         ['date' => now(), 'montant' => 15000, 'methode' => 'Wave', 'created_at' => now(), 'updated_at' => now()],
        //     ]);

        //     // Trajets
        //     DB::table('trajets')->insert([
        //         ['libelle' => 'Dakar - Saint Louis', 'created_at' => now(), 'updated_at' => now()],
        //         ['libelle' => 'Saint Louis - Dakar', 'created_at' => now(), 'updated_at' => now()],
        //     ]);

        //     // Caravanes
        //     DB::table('caravanes')->insert([
        //         ['libelle' => 'Caravane 1', 'date' => now(), 'statut' => 'PUBLIEE', 'telAgent' => '770000000', 'trajet_id' => 1, 'moment_id' => 1, 'created_at' => now(), 'updated_at' => now()],
        //         ['libelle' => 'Caravane 2', 'date' => now(), 'statut' => 'FERMEE', 'telAgent' => '771111111', 'trajet_id' => 2, 'moment_id' => 2, 'created_at' => now(), 'updated_at' => now()],
        //     ]);

        //     // Buses
        //     DB::table('buses')->insert([
        //         ['libelle' => 'Bus A', 'capacite' => 57, 'caravane_id' => 1, 'created_at' => now(), 'updated_at' => now()],
        //         ['libelle' => 'Bus B', 'capacite' => 57, 'caravane_id' => 2, 'created_at' => now(), 'updated_at' => now()],
        //     ]);

        //     // Places (de 1 à 57 pour chaque bus)
        //     foreach ([1, 2] as $bus_id) {
        //         for ($i = 1; $i <= 57; $i++) {
        //             DB::table('places')->insert([
        //                 'bus_id' => $bus_id,
        //                 'numero' => $i,
        //                 'occupee' => false,
        //                 'created_at' => now(),
        //                 'updated_at' => now(),
        //             ]);
        //         }
        //     }

        //     // Arrivées
        //     $arrivees = [
        //         [1, 'Dakar - Ecole Normale', 2],
        //         [2, 'Bountou Pikine - Station TOTAL', 2],
        //         [3, 'FASS MBAO - ARRET ICS', 2],
        //         [4, 'Keur Mbaye Fall - Djouma', 2],
        //         [5, 'Rufisque - EDK En Face Sococim', 2],
        //         [6, 'Bargny - EDK', 2],
        //         [7, 'Diamniadio - Station Olibya', 2],
        //         [8, 'Sébikhotane - Niari Poto', 2],
        //         [9, 'Km 50 - Station Clean Oil', 2],
        //         [10, 'Pout - Station Ciel Oil', 2],
        //         [11, 'Thiès - Devant Mairie', 2],
        //         [12, 'Tivaouane - EDK', 2],
        //         [13, 'Ngaye Mékhé - Station Star', 2],
        //         [14, 'Saint Louis - KHOR Station SGF', 1],
        //         [15, 'Ugb - Devant Village L', 1],
        //         [16, 'Ugb - Devant Village N', 1],
        //         [17, 'Ugb - Devant Village M', 1],
        //         [18, 'Ugb - Devant Village P', 1]
        //     ];
        //     foreach ($arrivees as $arr) {
        //         DB::table('arrivees')->insert([
        //             'id' => $arr[0],
        //             'libelle' => $arr[1],
        //             'trajet_id' => $arr[2],
        //             'created_at' => now(),
        //             'updated_at' => now(),
        //         ]);
        //     }

        //     // Départs
        //     $departs = [
        //         [1, 'Dakar - Ecole Normale', 1],
        //         [2, 'Bountou Pikine - Station TOTAL', 1],
        //         [3, 'FASS MBAO - ARRET ICS', 1],
        //         [4, 'Keur Mbaye Fall - Djouma', 1],
        //         [5, 'Rufisque - EDK En Face Sococim', 1],
        //         [6, 'Bargny - EDK', 1],
        //         [7, 'Diamniadio - Station Olibya', 1],
        //         [8, 'Sébikhotane - Niari Poto', 1],
        //         [9, 'Km 50 - Station Clean Oil', 1],
        //         [10, 'Pout - Station Ciel Oil', 1],
        //         [11, 'Thiès - Devant Mairie', 1],
        //         [12, 'Tivaouane - EDK', 1],
        //         [13, 'Ngaye Mékhé - Station Star', 1],
        //         [14, 'Saint Louis - KHOR Station SGF', 2],
        //         [15, 'Ugb - Devant Village L', 2],
        //         [16, 'Ugb - Devant Village N', 2],
        //         [17, 'Ugb - Devant Village M', 2],
        //         [18, 'Ugb - Devant Village P', 2]
        //     ];
        //     foreach ($departs as $dep) {
        //         DB::table('departs')->insert([
        //             'id' => $dep[0],
        //             'libelle' => $dep[1],
        //             'trajet_id' => $dep[2],
        //             'created_at' => now(),
        //             'updated_at' => now(),
        //         ]);
        //     }

        //     // Réservations
        //     DB::table('reservations')->insert([
        //         ['date' => now(), 'statut' => 'CONFIRMEE', 'nombrePersonnes' => 2, 'client_id' => 1, 'caravane_id' => 1, 'paiement_id' => 1, 'created_at' => now(), 'updated_at' => now()],
        //         ['date' => now(), 'statut' => 'EN_ATTENTE', 'nombrePersonnes' => 1, 'client_id' => 2, 'caravane_id' => 2, 'paiement_id' => 2, 'created_at' => now(), 'updated_at' => now()],
        //     ]);
    }
}
