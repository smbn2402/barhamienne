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
        Schema::create('arrivee_moments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('arrivee_id');
            $table->unsignedBigInteger('moment_id');
            $table->time('heure_arrivee');
            $table->boolean('est_principale');
            $table->foreign('arrivee_id')->references('id')->on('arrivees')->onDelete('cascade');
            $table->foreign('moment_id')->references('id')->on('moments')->onDelete('cascade');
            $table->unique(['arrivee_id', 'moment_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrivee_moments');
    }
};
