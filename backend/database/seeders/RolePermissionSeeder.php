<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'user.view',
            'user.create',
            'user.update',
            'user.delete'
        ];
        // foreach ($permissions as $p) {
        //     Permission::firstOrCreate(['name' => $p]);
        // }

        $admin = Role::firstOrCreate(['name' => 'super-admin']);
        $admin->syncPermissions($permissions);

        // $admin = Role::firstOrCreate(['name' => 'admin']);
        // $admin->syncPermissions($permissions);

        // // facultatif : rôle “manager” plus restreint
        // $manager = Role::firstOrCreate(['name' => 'manager']);
        // $manager->syncPermissions(['user.view', 'user.update']);
    }
}
