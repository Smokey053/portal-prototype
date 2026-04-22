<template>
  <div>
    <!-- Month Navigator -->
    <v-card class="section-card pa-4 mb-4" rounded="lg">
      <div class="d-flex align-center justify-space-between">
        <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="prevMonth"></v-btn>
        <span class="banner-title">{{ monthLabel }} {{ displayYear }}</span>
        <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="nextMonth"></v-btn>
      </div>
    </v-card>

    <v-row>
      <!-- Calendar Grid -->
      <v-col cols="12" md="8">
        <v-card class="section-card pa-4" rounded="lg">
          <!-- Day headers -->
          <div class="cal-grid cal-header">
            <div v-for="d in dayNames" :key="d" class="cal-cell field-label text-center">{{ d }}</div>
          </div>

          <!-- Empty offset cells + day cells -->
          <div class="cal-grid mt-1">
            <div v-for="n in startOffset" :key="'e' + n" class="cal-cell"></div>
            <div
              v-for="day in daysInMonth"
              :key="day"
              class="cal-cell cal-day"
              :class="{
                'cal-today': isToday(day),
                'cal-has-event': getEvents(day).length > 0,
              }"
            >
              <span class="day-num" :class="isToday(day) ? 'day-today' : 'day-normal'">{{ day }}</span>
              <div class="dots-row">
                <div
                  v-for="ev in getEvents(day)"
                  :key="ev.title"
                  class="dot"
                  :class="'dot-' + ev.type"
                  :title="ev.title"
                ></div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Events this month -->
      <v-col cols="12" md="4">
        <v-card class="section-card pa-4" rounded="lg">
          <div class="section-title mb-3">Events — {{ monthLabel }}</div>

          <div v-if="monthEvents.length === 0" class="field-label text-center py-4">No events this month</div>

          <div v-for="ev in monthEvents" :key="ev.title" class="event-row">
            <div class="d-flex align-start justify-space-between">
              <div>
                <div class="event-title">{{ ev.title }}</div>
                <div class="field-label mt-1">{{ ev.date }}</div>
              </div>
              <span class="event-badge" :class="'evt-' + ev.type">{{ ev.category }}</span>
            </div>
          </div>

          <!-- Legend -->
          <v-divider class="my-3" style="opacity:0.07"></v-divider>
          <div class="field-label mb-2">Legend</div>
          <div v-for="l in legend" :key="l.type" class="d-flex align-center mb-2">
            <div class="dot mr-2" :class="'dot-' + l.type" style="width:8px;height:8px;flex-shrink:0"></div>
            <span class="legend-label">{{ l.label }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import student from '../data/studentData';

const now = new Date();
const displayMonth = ref(now.getMonth()); // 0-indexed
const displayYear = ref(now.getFullYear());

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const monthLabel = computed(() => MONTHS[displayMonth.value]);
const daysInMonth = computed(() => new Date(displayYear.value, displayMonth.value + 1, 0).getDate());
const startOffset = computed(() => new Date(displayYear.value, displayMonth.value, 1).getDay());

const prevMonth = () => {
  if (displayMonth.value === 0) { displayMonth.value = 11; displayYear.value--; }
  else displayMonth.value--;
};
const nextMonth = () => {
  if (displayMonth.value === 11) { displayMonth.value = 0; displayYear.value++; }
  else displayMonth.value++;
};

const pad = (n) => String(n).padStart(2,'0');
const getEvents = (day) => {
  const dateStr = `${displayYear.value}-${pad(displayMonth.value + 1)}-${pad(day)}`;
  return student.calendarEvents.filter(e => e.date === dateStr);
};

const isToday = (day) => {
  return day === now.getDate() && displayMonth.value === now.getMonth() && displayYear.value === now.getFullYear();
};

const monthEvents = computed(() => {
  const prefix = `${displayYear.value}-${pad(displayMonth.value + 1)}`;
  return student.calendarEvents.filter(e => e.date.startsWith(prefix)).sort((a,b) => a.date.localeCompare(b.date));
});

const typeColor = (type) => ({
  exam: 'error', holiday: 'success', break: 'warning',
  assessment: 'info', milestone: 'primary',
})[type] ?? 'grey';

const typeIcon = (type) => ({
  exam: 'mdi-pencil-box', holiday: 'mdi-palm-tree', break: 'mdi-sleep',
  assessment: 'mdi-clipboard-check', milestone: 'mdi-flag-checkered',
})[type] ?? 'mdi-circle';const legend = [
  { type: 'exam',       label: 'Examination' },
  { type: 'holiday',    label: 'Public Holiday' },
  { type: 'break',      label: 'Break / Revision' },
  { type: 'assessment', label: 'Assessment' },
  { type: 'milestone',  label: 'Milestone' },
];
</script>

<style scoped>
.section-card { border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label   { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }
.banner-title  { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.8); }
.legend-label  { font-size: 11px; color: rgba(255,255,255,0.4); }

.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.cal-header .cal-cell { padding: 4px 2px; }
.cal-cell { min-height: 52px; }
.cal-day {
  background: rgba(255,255,255,0.025);
  border-radius: 6px;
  padding: 4px;
  cursor: default;
}
.cal-today { background: rgba(91,143,212,0.1) !important; border: 1px solid rgba(91,143,212,0.4); }
.cal-has-event { background: rgba(255,255,255,0.05) !important; }
.day-num { font-size: 0.75rem; display: block; text-align: right; }
.day-today  { color: #5B8FD4; font-weight: 700; }
.day-normal { color: rgba(255,255,255,0.5); }
.dots-row { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; justify-content: center; }
.dot { width: 5px; height: 5px; border-radius: 50%; }
.dot-exam       { background: #C84B5B; }
.dot-holiday    { background: #3D9D5C; }
.dot-break      { background: #C97A25; }
.dot-assessment { background: #5B8FD4; }
.dot-milestone  { background: #7B5EA7; }

/* Event list */
.event-row {
  padding: 9px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.event-row:last-of-type { border-bottom: none; }
.event-title { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 500; }
.event-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 2px 7px; border-radius: 5px; flex-shrink: 0; }
.evt-exam       { background: rgba(200,75,91,0.15);  color: #C84B5B; }
.evt-holiday    { background: rgba(61,157,92,0.15);  color: #3D9D5C; }
.evt-break      { background: rgba(201,122,37,0.15); color: #C97A25; }
.evt-assessment { background: rgba(91,143,212,0.15); color: #5B8FD4; }
.evt-milestone  { background: rgba(123,94,167,0.15); color: #7B5EA7; }
</style>
