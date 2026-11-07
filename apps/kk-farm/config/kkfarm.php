<?php

$all = ['ceo', 'manager', 'vet', 'caretaker', 'feeding', 'cleaning', 'finance'];

return [
    // Candidate roles from the project brief. Actual responsibilities are confirmed after the farm visit.
    'roles' => [
        'ceo' => 'CEO / Owner',
        'manager' => 'Farm Manager',
        'vet' => 'Veterinarian',
        'caretaker' => 'Caretaker',
        'feeding' => 'Feeding Employee',
        'cleaning' => 'Cleaning Employee',
        'finance' => 'Finance Employee',
    ],

    'modules' => [
        'dashboard' => $all,
        'goats' => ['ceo', 'manager', 'vet', 'caretaker', 'feeding', 'finance'],
        'scan' => ['ceo', 'manager', 'vet', 'caretaker'],
        'breeding' => ['ceo', 'manager', 'vet', 'caretaker'],
        'health' => ['ceo', 'manager', 'vet', 'caretaker'],
        'weights' => ['ceo', 'manager', 'vet', 'caretaker'],
        'feeding' => ['ceo', 'manager', 'vet', 'caretaker', 'feeding'],
        'sheds' => ['ceo', 'manager', 'vet', 'caretaker', 'cleaning'],
        'employees' => ['ceo', 'manager'],
        'tasks' => $all,
        'finance' => ['ceo', 'finance'],
        'reports' => ['ceo', 'manager', 'finance'],
        'settings' => ['ceo'],
    ],

    // Hard gates from SECURITY_AND_RBAC.md: these never come from a configurable override.
    'gates' => [
        'clinical' => ['vet'],
        'approve_feeding_plan' => ['vet'],
        'exit_animal' => ['ceo', 'manager'],
        'assign_tags' => ['ceo', 'manager', 'caretaker'],
    ],

    // Demonstration assumption (Q-PB-2): the real value is confirmed by the veterinarians.
    'demo_gestation_days' => 150,
];
