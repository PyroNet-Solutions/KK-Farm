<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->string('role')->default('caretaker');
            $t->string('employee_code')->nullable();
        });

        Schema::create('breeds', function (Blueprint $t) {
            $t->id();
            $t->string('name')->unique();
            $t->unsignedSmallInteger('default_gestation_days')->nullable();
            $t->boolean('is_active')->default(true);
            $t->timestamps();
        });

        Schema::create('sheds', function (Blueprint $t) {
            $t->id();
            $t->string('code')->unique();
            $t->string('name');
            $t->string('status')->default('active'); // active | planned
            $t->timestamps();
        });

        Schema::create('pens', function (Blueprint $t) {
            $t->id();
            $t->foreignId('shed_id')->constrained();
            $t->string('name');
            $t->string('purpose');
            $t->unsignedSmallInteger('capacity')->nullable();
            $t->timestamps();
            $t->unique(['shed_id', 'name']);
        });

        Schema::create('feeding_groups', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->text('criteria');
            $t->json('ration');
            $t->string('plan_status')->default('approved'); // draft | pending_approval | approved
            $t->string('approved_by')->nullable();
            $t->timestamp('approved_at')->nullable();
            $t->timestamps();
        });

        Schema::create('animals', function (Blueprint $t) {
            $t->uuid('id')->primary(); // permanent identity: never reused, never the tag code
            $t->string('farm_number')->unique();
            $t->string('name')->nullable();
            $t->string('sex'); // male | female
            $t->string('reproductive_status')->default('intact');
            $t->foreignId('breed_id')->constrained();
            $t->date('birth_date')->nullable();
            $t->boolean('birth_date_is_estimate')->default(false);
            $t->string('origin'); // born_on_farm | purchased
            $t->uuid('sire_id')->nullable();
            $t->uuid('dam_id')->nullable();
            $t->foreignId('pen_id')->nullable()->constrained();
            $t->foreignId('feeding_group_id')->nullable()->constrained();
            $t->string('status')->default('active'); // active | left_farm | deceased
            $t->string('health_status')->default('healthy'); // healthy | watch | treatment | critical
            $t->string('repro_state')->nullable(); // pregnant | lactating
            $t->string('coat')->default('brown');
            $t->string('exit_reason')->nullable();
            $t->date('exit_date')->nullable();
            $t->timestamps();
            $t->index(['status', 'pen_id']);
        });

        // Sequences only move forward, so an issued farm number can never be handed out again.
        DB::statement('CREATE SEQUENCE IF NOT EXISTS animal_number_seq');

        Schema::table('animals', function (Blueprint $t) {
            $t->foreign('sire_id')->references('id')->on('animals');
            $t->foreign('dam_id')->references('id')->on('animals');
        });

        Schema::create('rfid_tags', function (Blueprint $t) {
            $t->id();
            $t->string('tag_code')->unique();
            $t->string('status')->default('in_stock'); // in_stock | assigned | lost
            $t->timestamps();
        });

        Schema::create('rfid_assignments', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('animal_id')->constrained('animals');
            $t->foreignId('rfid_tag_id')->constrained();
            $t->timestamp('valid_from');
            $t->timestamp('valid_to')->nullable();
            $t->string('reason_assigned');
            $t->string('reason_unassigned')->nullable();
            $t->string('assigned_by');
            $t->timestamps();
        });
        // A tag identifies at most one animal, and an animal carries at most one open tag.
        DB::statement('CREATE UNIQUE INDEX one_open_assignment_per_tag ON rfid_assignments (rfid_tag_id) WHERE valid_to IS NULL');
        DB::statement('CREATE UNIQUE INDEX one_open_assignment_per_animal ON rfid_assignments (animal_id) WHERE valid_to IS NULL');

        Schema::create('animal_events', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('animal_id')->constrained('animals');
            $t->string('type');
            $t->timestamp('occurred_at');
            $t->string('summary');
            $t->string('recorded_by');
            $t->timestamps();
            $t->index(['animal_id', 'occurred_at']);
        });

        Schema::create('weight_records', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('animal_id')->constrained('animals');
            $t->date('measured_on');
            $t->decimal('weight_kg', 6, 2);
            $t->string('context')->default('routine');
            $t->string('measured_by');
            $t->timestamps();
            $t->index(['animal_id', 'measured_on']);
        });

        Schema::create('health_records', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('animal_id')->constrained('animals');
            $t->string('kind'); // observation | examination | treatment | vaccination | deworming
            $t->date('occurred_on');
            $t->string('title');
            $t->text('notes')->nullable();
            $t->string('severity')->nullable(); // low | medium | high | critical
            $t->string('recorded_by');
            $t->string('recorded_role');
            $t->date('next_due_on')->nullable();
            $t->string('status')->default('closed'); // open | closed
            $t->timestamps();
            $t->index(['animal_id', 'occurred_on']);
        });

        Schema::create('matings', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('dam_id')->constrained('animals');
            $t->foreignUuid('sire_id')->nullable()->constrained('animals');
            $t->date('mated_on');
            $t->string('method')->default('natural');
            $t->date('expected_kidding_on')->nullable();
            $t->string('status')->default('open'); // open | pregnant | not_pregnant | kidded
            $t->string('recorded_by');
            $t->timestamps();
        });

        Schema::create('kiddings', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('dam_id')->constrained('animals');
            $t->foreignId('mating_id')->nullable()->constrained();
            $t->date('kidded_on');
            $t->unsignedTinyInteger('born_alive');
            $t->unsignedTinyInteger('stillborn')->default(0);
            $t->string('recorded_by');
            $t->timestamps();
        });

        Schema::create('feeding_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('feeding_group_id')->constrained();
            $t->date('fed_on');
            $t->string('session'); // morning | evening
            $t->string('status'); // done | partial | missed
            $t->string('fed_by');
            $t->timestamps();
            $t->unique(['feeding_group_id', 'fed_on', 'session']);
        });

        Schema::create('employees', function (Blueprint $t) {
            $t->id();
            $t->string('code')->unique();
            $t->string('name');
            $t->string('role');
            $t->string('shift');
            $t->boolean('is_active')->default(true);
            $t->timestamps();
        });

        Schema::create('tasks', function (Blueprint $t) {
            $t->id();
            $t->string('title');
            $t->string('type');
            $t->foreignId('pen_id')->nullable()->constrained();
            $t->foreignId('employee_id')->nullable()->constrained();
            $t->date('due_on');
            $t->string('priority')->default('normal');
            $t->string('status')->default('open'); // open | done
            $t->timestamp('completed_at')->nullable();
            $t->string('completed_by')->nullable();
            $t->timestamps();
        });

        Schema::create('ledger_entries', function (Blueprint $t) {
            $t->id();
            $t->string('direction'); // in | out
            $t->string('category');
            $t->decimal('amount', 14, 2);
            $t->date('occurred_on');
            $t->string('counterparty')->nullable();
            $t->string('description')->nullable();
            $t->foreignId('shed_id')->nullable()->constrained();
            $t->foreignUuid('animal_id')->nullable()->constrained('animals');
            $t->foreignId('reverses_id')->nullable()->constrained('ledger_entries');
            $t->string('recorded_by');
            $t->timestamps();
            $t->index('occurred_on');
        });

        Schema::create('animal_photos', function (Blueprint $t) {
            $t->id();
            $t->foreignUuid('animal_id')->constrained('animals'); // bound to identity, never the tag
            $t->string('path');
            $t->string('notes')->nullable();
            $t->boolean('is_profile')->default(false);
            $t->string('added_by');
            $t->timestamps();
        });

        Schema::create('activities', function (Blueprint $t) {
            $t->id();
            $t->string('actor');
            $t->string('role');
            $t->string('action');
            $t->string('audience')->default('farm'); // farm | finance
            $t->string('url')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['activities', 'animal_photos', 'ledger_entries', 'tasks', 'employees', 'feeding_logs', 'kiddings', 'matings', 'health_records', 'weight_records', 'animal_events', 'rfid_assignments', 'rfid_tags', 'animals', 'feeding_groups', 'pens', 'sheds', 'breeds'] as $table) {
            Schema::dropIfExists($table);
        }
        DB::statement('DROP SEQUENCE IF EXISTS animal_number_seq');
        Schema::table('users', fn (Blueprint $t) => $t->dropColumn(['role', 'employee_code']));
    }
};
