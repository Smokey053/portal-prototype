<template>
  <div>
    <!-- Month Navigator -->
    <v-card color="surface" rounded="xl" class="pa-4 mb-4">
      <div class="d-flex align-center justify-space-between">
        <v-btn icon="mdi-chevron-left" variant="text" @click="prevMonth"></v-btn>
        <div class="text-subtitle-1 font-weight-bold">
          {{ monthLabel }} {{ displayYear }}
        </div>
        <v-btn icon="mdi-chevron-right" variant="text" @click="nextMonth"></v-btn>
      </div>
    </v-card>

    <v-row>
      <!-- Calendar Grid -->
      <v-col cols="12" md="8">
        <v-card color="surface" rounded="xl" class="pa-4">
          <!-- Day headers -->
          <div class="cal-grid cal-header">
            <div v-for="d in dayNames" :key="d" class="cal-cell text-caption text-center font-weight-bold text-medium-emphasis">{{ d }}</div>
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
              <span class="day-num" :class="isToday(day) ? 'text-primary font-weight-bold' : 'text-medium-emphasis'">{{ day }}</span>
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
        <v-card color="surface" rounded="xl" class="pa-4">
          <div class="text-subtitle-2 font-weight-bold mb-3">
            Events — {{ monthLabel }}
          </div>

          <div v-if="monthEvents.length === 0" class="text-caption text-grey text-center py-4">
            No events this month
          </div>

          <v-list density="compact" lines="two">
            <v-list-item
              v-for="ev in monthEvents"
              :key="ev.title"
              :title="ev.title"
              :subtitle="ev.date"
              :prepend-icon="typeIcon(ev.type)"
              :color="typeColor(ev.type)"
              class="rounded-lg mb-1"
              style="background:rgba(255,255,255,0.03)"
            >
              <template v-slot:append>
                <v-chip size="x-small" :color="typeColor(ev.type)" variant="tonal">{{ ev.category }}</v-chip>
              </template>
            </v-list-item>
          </v-list>

          <!-- Legend -->
          <v-divider class="my-3"></v-divider>
          <div class="text-caption font-weight-bold mb-2">Legend</div>
          <div v-for="l in legend" :key="l.type" class="d-flex align-center mb-1">
            <div class="dot mr-2" :class="'dot-' + l.type" style="width:10px;height:10px"></div>
            <span class="text-caption text-medium-emphasis">{{ l.label }}</span>
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
})[type] ?? 'mdi-circle';

const legend = [
  { type: 'exam',       label: 'Examination' },
  { type: 'holiday',    label: 'Public Holiday' },
  { type: 'break',      label: 'Break / Revision' },
  { type: 'assessment', label: 'Assessment' },
  { type: 'milestone',  label: 'Milestone' },
];
</script>

<style scoped>
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-header .cal-cell { padding: 4px 2px; }
.cal-cell { min-height: 56px; }
.cal-day {
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  padding: 4px;
  cursor: default;
  position: relative;
}
.cal-today { background: rgba(187,134,252,0.12) !important; border: 1px solid #BB86FC; }
.cal-has-event { background: rgba(255,255,255,0.06) !important; }
.day-num { font-size: 0.8rem; display: block; text-align: right; }
.dots-row { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; justify-content: center; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.dot-exam       { background: #CF6679; }
.dot-holiday    { background: #4CAF50; }
.dot-break      { background: #FB8C00; }
.dot-assessment { background: #03DAC6; }
.dot-milestone  { background: #BB86FC; }
</style>
