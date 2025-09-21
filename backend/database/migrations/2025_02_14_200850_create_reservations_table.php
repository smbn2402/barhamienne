<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->timestamp('date');
            $table->enum('statut', ['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE']);
            $table->integer('nombre_personnes');
            $table->softDeletes();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('caravane_id');
            $table->unsignedBigInteger('depart_moment_id');
            $table->unsignedBigInteger('arrivee_id');
            $table->foreign('client_id')->references('id')->on('clients');
            $table->foreign('caravane_id')->references('id')->on('caravanes');
            $table->foreign('depart_moment_id')->references('id')->on('depart_moments');
            $table->foreign('arrivee_id')->references('id')->on('arrivees');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
