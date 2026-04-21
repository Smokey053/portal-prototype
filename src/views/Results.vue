<template>
  <div>
    <!-- GPA Banner -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3">
        <v-card color="primary" variant="tonal" rounded="xl" class="pa-4 text-center">
          <div class="text-caption">CGPA</div>
          <div class="text-h4 font-weight-bold text-primary">{{ student.academic.cgpa }}</div>
          <div class="text-caption text-grey">Cumulative</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="secondary" variant="tonal" rounded="xl" class="pa-4 text-center">
          <div class="text-caption">Credits Earned</div>
          <div class="text-h4 font-weight-bold text-secondary">{{ student.academic.totalCreditsEarned }}</div>
          <div class="text-caption text-grey">Total credits</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="success" variant="tonal" rounded="xl" class="pa-4 text-center">
          <div class="text-caption">Semesters Completed</div>
          <div class="text-h4 font-weight-bold text-success">{{ student.academic.semesterHistory.length }}</div>
          <div class="text-caption text-grey">of 8 total</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="surface" rounded="xl" class="pa-4 text-center">
          <div class="text-caption">Current Semester</div>
          <div class="text-h4 font-weight-bold">In Progress</div>
          <div class="text-caption text-grey">Exams pending</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Download -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-file-pdf-box" size="small">
        Download Unofficial Transcript
      </v-btn>
    </div>

    <!-- Current Semester (in progress) -->
    <v-card color="surface" rounded="xl" class="pa-4 mb-4">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-subtitle-1 font-weight-bold">Year 2 – Semester 2 (2026) — Current</div>
        <v-chip size="small" color="warning" variant="tonal">In Progress</v-chip>
      </div>
      <v-table density="compact" hover>
        <thead>
          <tr>
            <th>Module Code</th>
            <th>Module Name</th>
            <th class="text-center">Credits</th>
            <th class="text-center">CA Score</th>
            <th class="text-center">Grade</th>
            <th class="text-center">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in student.academic.modules" :key="m.id">
            <td class="text-caption">{{ m.id }}</td>
            <td class="text-caption">{{ m.name }}</td>
            <td class="text-center text-caption">{{ m.credits }}</td>
            <td class="text-center text-caption">{{ m.caScore }}/{{ m.caMax }}</td>
            <td class="text-center">
              <v-chip size="x-small" :color="gradeColor(m.grade)" variant="tonal">{{ m.grade }}</v-chip>
            </td>
            <td class="text-center text-caption font-weight-bold">{{ m.gradePoints.toFixed(1) }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="text-caption text-grey mt-2">
        * Grades are provisional until final examinations are sat and ratified.
      </div>
    </v-card>

    <!-- Historical semesters -->
    <v-expansion-panels variant="accordion" class="rounded-xl overflow-hidden">
      <v-expansion-panel
        v-for="sem in student.academic.semesterHistory"
        :key="sem.label"
        bg-color="surface"
        rounded="xl"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center w-100">
            <span class="text-subtitle-2 font-weight-bold">{{ sem.label }}</span>
            <v-spacer></v-spacer>
            <v-chip size="x-small" color="primary" variant="tonal" class="mr-4">GPA {{ sem.gpa }}</v-chip>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table density="compact" hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Module Name</th>
                <th class="text-center">Credits</th>
                <th class="text-center">Grade</th>
                <th class="text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in sem.modules" :key="m.id">
                <td class="text-caption">{{ m.id }}</td>
                <td class="text-caption">
                  {{ m.name }}
                  <v-chip v-if="m.failed" size="x-small" color="warning" variant="tonal" class="ml-1">Repeat Required</v-chip>
                </td>
                <td class="text-center text-caption">{{ m.credits }}</td>
                <td class="text-center">
                  <v-chip size="x-small" :color="gradeColor(m.grade)" variant="tonal">{{ m.grade }}</v-chip>
                </td>
                <td class="text-center text-caption font-weight-bold">{{ m.gradePoints.toFixed(1) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Grade scale reference -->
    <v-card color="surface" rounded="xl" class="pa-4 mt-4">
      <div class="text-caption font-weight-bold mb-2">Grading Scale Reference</div>
      <v-row dense>
        <v-col v-for="g in gradeScale" :key="g.grade" cols="auto">
          <v-chip size="x-small" :color="g.color" variant="tonal" class="mr-1">{{ g.grade }} ({{ g.range }})</v-chip>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import student from '../data/studentData';

const gradeColor = (g) => {
  if (g.startsWith('A')) return 'success';
  if (g.startsWith('B')) return 'primary';
  if (g.startsWith('C')) return 'warning';
  return 'error';
};

const gradeScale = [
  { grade: 'A',  range: '90–100', color: 'success' },
  { grade: 'A-', range: '85–89',  color: 'success' },
  { grade: 'B+', range: '80–84',  color: 'primary' },
  { grade: 'B',  range: '75–79',  color: 'primary' },
  { grade: 'B-', range: '70–74',  color: 'primary' },
  { grade: 'C+', range: '65–69',  color: 'warning' },
  { grade: 'C',  range: '60–64',  color: 'warning' },
  { grade: 'D',  range: '50–59',  color: 'error' },
  { grade: 'F',  range: '0–49',   color: 'error' },
];
</script>
