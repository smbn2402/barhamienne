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
        Schema::create('caravanes', function (Blueprint $table) {
            $table->id();
            $table->string('libelle')->unique();
            $table->date('date');
            $table->integer('prix')->default(3500);
            $table->string('telAgent');
            $table->boolean('est_publiee')->default(true);
            $table->boolean('est_ouverte')->default(true);
            $table->softDeletes();
            $table->unsignedBigInteger('trajet_id');
            $table->unsignedBigInteger('moment_id');
            $table->foreign('trajet_id')->references('id')->on('trajets');
            $table->foreign('moment_id')->references('id')->on('moments');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caravanes');
    }
};
