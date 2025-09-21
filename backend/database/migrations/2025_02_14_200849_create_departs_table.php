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
        Schema::create('departs', function (Blueprint $table) {
            $table->id();
            $table->string('libelle')->unique();
            $table->boolean('est_principale')->default(false);
            $table->unsignedBigInteger('trajet_id');
            $table->integer('order')->nullable();
            $table->foreign('trajet_id')->references('id')->on('trajets');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departs');
    }
};
