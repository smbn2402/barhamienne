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
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bus_id');
            $table->integer('numero'); // Numéro de place (1-57)
            $table->boolean('occupee')->default(false);
            
            $table->foreign('bus_id')->references('id')->on('buses');
            $table->unique(['bus_id', 'numero']); // Assure que chaque place est unique dans un bus
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};
