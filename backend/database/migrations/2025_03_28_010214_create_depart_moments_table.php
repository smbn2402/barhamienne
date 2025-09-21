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
        Schema::create('depart_moments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('depart_id');
            $table->unsignedBigInteger('moment_id');
            $table->time('heure_depart');
            $table->foreign('depart_id')->references('id')->on('departs')->onDelete('cascade');
            $table->foreign('moment_id')->references('id')->on('moments')->onDelete('cascade');
            $table->unique(['depart_id', 'moment_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depart_moments');
    }
};
