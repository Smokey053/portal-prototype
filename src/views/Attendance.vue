<template>
  <div>
    <!-- Stats Strip -->
    <v-card class="section-card pa-4 mb-4" rounded="lg">
      <div class="stats-row">
        <div class="stat-item">
          <div class="field-label">Avg. Attendance</div>
          <div class="stat-val" :style="{ color: avgHex }">{{ avgAtt }}%</div>
          <div class="stat-sub">overall average</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="field-label">Good Standing</div>
          <div class="stat-val" style="color:#3D9D5C">{{ goodCount }}</div>
          <div class="stat-sub">modules ≥ 80%</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="field-label">At Risk</div>
          <div class="stat-val" style="color:#C97A25">{{ atRiskCount }}</div>
          <div class="stat-sub">modules 70–79%</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="field-label">Critical</div>
          <div class="stat-val" style="color:#C84B5B">{{ criticalCount }}</div>
          <div class="stat-sub">modules &lt; 70%</div>
        </div>
      </div>
    </v-card>

    <!-- Per-module rows -->
    <v-card class="section-card pa-4 mb-4" rounded="lg">
      <div class="section-title mb-3">Module Attendance</div>
      <div
        v-for="mod in student.academic.modules"
        :key="mod.id"
        class="mod-row"
      >
        <div class="d-flex align-center justify-space-between mb-1">
          <div>
            <span class="mod-name">{{ mod.name }}</span>
            <span class="mod-code ml-2">{{ mod.id }}</span>
          </div>
          <span class="att-badge" :class="attClass(mod.attendance)">{{ mod.attendance }}%</span>
        </div>
        <v-progress-linear
          :model-value="mod.attendance"
          :color="attColor(mod.attendance)"
          height="4"
          rounded
          bg-color="rgba(255,255,255,0.07)"
          class="mb-2"
        ></v-progress-linear>
        <div class="d-flex justify-space-between">
          <span class="field-label">{{ mod.classesAttended }}/{{ mod.classesHeld }} classes attended &bull; {{ mod.id }} &bull; {{ mod.lecturer }}</span>
          <span v-if="mod.attendance < student.academic.attendanceThreshold" class="warn-label" :class="mod.attendance < 70 ? 'warn-error' : 'warn-warning'">
            {{ mod.attendance < 70 ? 'Critical' : 'Below threshold' }}
          </span>
          <span v-else class="warn-ok">Good Standing</span>
        </div>
      </div>
    </v-card>

    <!-- Threshold notice -->
    <div class="notice-box">
      <v-icon size="14" class="mr-2" style="color:rgba(255,255,255,0.3); flex-shrink:0">mdi-information-outline</v-icon>
      <span>Minimum attendance requirement is <strong style="color:rgba(255,255,255,0.6)">{{ student.academic.attendanceThreshold }}%</strong> per module.
        Students below this threshold may be barred from sitting final examinations.</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import student from '../data/studentData';

const attColor = (v) => v >= 80 ? '#3D9D5C' : v >= 70 ? '#C97A25' : '#C84B5B';
const attClass = (v) => v >= 80 ? 'att-good' : v >= 70 ? 'att-risk' : 'att-crit';

const avgAtt = computed(() => {
  const sum = student.academic.modules.reduce((a, m) => a + m.attendance, 0);
  return Math.round(sum / student.academic.modules.length);
});
const avgHex = computed(() => attColor(avgAtt.value));
const goodCount = computed(() => student.academic.modules.filter(m => m.attendance >= 80).length);
const atRiskCount = computed(() => student.academic.modules.filter(m => m.attendance >= 70 && m.attendance < 80).length);
const criticalCount = computed(() => student.academic.modules.filter(m => m.attendance < 70).length);
</script>

<style scoped>
.section-card { border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }

/* Stats row */
.stats-row { display: flex; align-items: stretch; }
.stat-item { flex: 1; padding: 4px 20px; }
.stat-item:first-child { padding-left: 4px; }
.stat-val { font-size: 22px; font-weight: 700; margin: 4px 0 2px; }
.stat-sub { font-size: 11px; color: rgba(255,255,255,0.35); }
.stat-divider { width: 1px; background: rgba(255,255,255,0.07); flex-shrink: 0; margin: 4px 0; }

/* Module rows */
.mod-row {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.mod-row:last-of-type { border-bottom: none; }
.mod-name { font-size: 13px; color: rgba(255,255,255,0.87); font-weight: 500; }
.mod-code { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'Roboto Mono', monospace; }

/* Attendance badges */
.att-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
.att-good { background: rgba(61,157,92,0.15); color: #3D9D5C; }
.att-risk { background: rgba(201,122,37,0.15); color: #C97A25; }
.att-crit { background: rgba(200,75,91,0.15); color: #C84B5B; }

/* Status labels */
.warn-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.warn-ok    { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #3D9D5C; }
.warn-error   { color: #C84B5B; }
.warn-warning { color: #C97A25; }

/* Notice box */
.notice-box {
  display: flex; align-items: flex-start;
  font-size: 11px; color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 10px 12px;
}
</style>
