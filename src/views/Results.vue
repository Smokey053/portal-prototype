<template>
  <div>
    <!-- GPA Summary Row -->
    <v-card color="surface" rounded="lg" class="pa-5 mb-5 stats-card">
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-label">CGPA</div>
          <div class="stat-value text-primary">{{ student.academic.cgpa }}</div>
          <div class="stat-sub">Cumulative</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">Credits Earned</div>
          <div class="stat-value">{{ student.academic.totalCreditsEarned }}</div>
          <div class="stat-sub">Total</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">Semesters Done</div>
          <div class="stat-value">{{ student.academic.semesterHistory.length }}</div>
          <div class="stat-sub">of 8 total</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">Current Semester</div>
          <div class="stat-value" style="font-size:14px">In Progress</div>
          <div class="stat-sub">Exams pending</div>
        </div>
      </div>
    </v-card>

    <!-- Download -->
    <div class="d-flex justify-end mb-4">
      <v-btn variant="text" size="small" prepend-icon="mdi-file-pdf-box" style="color: rgba(255,255,255,0.5); font-size:12px">
        Download Unofficial Transcript
      </v-btn>
    </div>

    <!-- Current Semester -->
    <v-card color="surface" rounded="lg" class="pa-4 mb-4 section-card">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="section-title">Year 2 – Semester 2 (2026) — Current</div>
        <span class="badge-inprogress">In Progress</span>
      </div>
      <v-table density="compact" hover>
        <thead>
          <tr>
            <th class="tbl-head">Module Code</th>
            <th class="tbl-head">Module Name</th>
            <th class="tbl-head text-center">Credits</th>
            <th class="tbl-head text-center">CA Score</th>
            <th class="tbl-head text-center">Grade</th>
            <th class="tbl-head text-center">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in student.academic.modules" :key="m.id" class="tbl-row">
            <td class="tbl-cell mono">{{ m.id }}</td>
            <td class="tbl-cell">{{ m.name }}</td>
            <td class="tbl-cell text-center">{{ m.credits }}</td>
            <td class="tbl-cell text-center">{{ m.caScore }}/{{ m.caMax }}</td>
            <td class="text-center">
              <span class="grade-badge" :class="gradeClass(m.grade)">{{ m.grade }}</span>
            </td>
            <td class="tbl-cell text-center font-weight-medium">{{ m.gradePoints.toFixed(1) }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="notice-inline mt-2">* Grades are provisional until final examinations are sat and ratified.</div>
    </v-card>

    <!-- Historical semesters -->
    <v-expansion-panels variant="accordion" class="rounded-lg overflow-hidden">
      <v-expansion-panel
        v-for="sem in student.academic.semesterHistory"
        :key="sem.label"
        bg-color="surface"
      >
        <v-expansion-panel-title class="py-3">
          <div class="d-flex align-center w-100">
            <span class="section-title">{{ sem.label }}</span>
            <v-spacer></v-spacer>
            <span class="gpa-badge mr-4">GPA {{ sem.gpa }}</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table density="compact" hover>
            <thead>
              <tr>
                <th class="tbl-head">Code</th>
                <th class="tbl-head">Module Name</th>
                <th class="tbl-head text-center">Credits</th>
                <th class="tbl-head text-center">Grade</th>
                <th class="tbl-head text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in sem.modules" :key="m.id" class="tbl-row">
                <td class="tbl-cell mono">{{ m.id }}</td>
                <td class="tbl-cell">
                  {{ m.name }}
                  <span v-if="m.failed" class="repeat-tag ml-1">Repeat Required</span>
                </td>
                <td class="tbl-cell text-center">{{ m.credits }}</td>
                <td class="text-center">
                  <span class="grade-badge" :class="gradeClass(m.grade)">{{ m.grade }}</span>
                </td>
                <td class="tbl-cell text-center font-weight-medium">{{ m.gradePoints.toFixed(1) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Grade scale reference -->
    <v-card color="surface" rounded="lg" class="pa-4 mt-4 section-card">
      <div class="field-label mb-3">Grading Scale Reference</div>
      <div class="d-flex flex-wrap" style="gap:6px">
        <span v-for="g in gradeScale" :key="g.grade" class="grade-badge" :class="g.cls">{{ g.grade }} ({{ g.range }})</span>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import student from '../data/studentData';

const gradeClass = (g) => {
  if (g.startsWith('A')) return 'grade-a';
  if (g.startsWith('B')) return 'grade-b';
  if (g.startsWith('C')) return 'grade-c';
  return 'grade-f';
};

const gradeScale = [
  { grade: 'A',  range: '90–100', cls: 'grade-a' },
  { grade: 'A-', range: '85–89',  cls: 'grade-a' },
  { grade: 'B+', range: '80–84',  cls: 'grade-b' },
  { grade: 'B',  range: '75–79',  cls: 'grade-b' },
  { grade: 'B-', range: '70–74',  cls: 'grade-b' },
  { grade: 'C+', range: '65–69',  cls: 'grade-c' },
  { grade: 'C',  range: '60–64',  cls: 'grade-c' },
  { grade: 'D',  range: '50–59',  cls: 'grade-f' },
  { grade: 'F',  range: '0–49',   cls: 'grade-f' },
];
</script>

<style scoped>
.section-card { border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }

/* Stats row */
.stats-card { border: 1px solid rgba(255,255,255,0.06); }
.stats-row { display: flex; align-items: center; }
.stat-item { flex: 1; text-align: center; padding: 4px 8px; }
.stat-divider { width: 1px; height: 48px; background: rgba(255,255,255,0.07); }
.stat-label { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 4px; }
.stat-value { font-size: 24px; font-weight: 700; color: rgba(255,255,255,0.9); line-height: 1.1; }
.stat-sub   { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 3px; }

/* Badges */
.badge-inprogress {
  font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
  color: #C97A25; background: rgba(201,122,37,0.13);
  padding: 3px 8px; border-radius: 6px;
}
.gpa-badge {
  font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.07);
  padding: 2px 8px; border-radius: 6px;
}

/* Grade badges */
.grade-badge { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 5px; white-space: nowrap; }
.grade-a { background: rgba(61,157,92,0.15);  color: #3D9D5C; }
.grade-b { background: rgba(91,143,212,0.15); color: #5B8FD4; }
.grade-c { background: rgba(201,122,37,0.15); color: #C97A25; }
.grade-f { background: rgba(200,75,91,0.15);  color: #C84B5B; }

/* Table */
.tbl-head { font-size: 10px !important; color: rgba(255,255,255,0.38) !important; font-weight: 600 !important; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 12px !important; }
.tbl-row { border-bottom: 1px solid rgba(255,255,255,0.04) !important; }
.tbl-cell { font-size: 12px !important; color: rgba(255,255,255,0.75) !important; padding: 8px 12px !important; }
.mono { font-size: 11px !important; color: rgba(255,255,255,0.4) !important; }

.repeat-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
  color: #C97A25; background: rgba(201,122,37,0.15);
  padding: 2px 5px; border-radius: 4px;
}
.notice-inline { font-size: 11px; color: rgba(255,255,255,0.33); }
</style>
