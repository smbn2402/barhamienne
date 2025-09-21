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
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('phone');
            $table->string('sender_name');
            $table->text('text');
            $table->string('message_id')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->integer('sendtext_sms_count')->default(0);
            $table->integer('status_id');
            $table->string('status_description');
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};
