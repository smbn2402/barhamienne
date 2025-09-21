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
        Schema::create('yobantes', function (Blueprint $table) {
            $table->id();
            $table->string('prenom_exp');
            $table->string('nom_exp');
            $table->string('tel_exp')->unique();
            $table->string('type_colis');
            $table->unsignedBigInteger('caravane_id');
            $table->unsignedBigInteger('depart_moment_id');
            $table->string('retrait');
            $table->string('prenom_dest');
            $table->string('nom_dest');
            $table->string('tel_dest')->unique();
            $table->timestamps();
            $table->foreign('caravane_id')->references('id')->on('caravanes')->onDelete('cascade');
            $table->foreign('depart_moment_id')->references('id')->on('depart_moments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('yobantes');
    }
};
