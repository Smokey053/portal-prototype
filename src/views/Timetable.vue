<template>
  <div>
    <!-- Week info banner -->
    <v-card class="section-card pa-4 mb-4 d-flex align-center flex-wrap" style="gap:12px" rounded="lg">
      <span class="banner-title">Semester 2, 2026</span>
      <span class="banner-chip">Week {{ student.academic.currentWeek }}/{{ student.academic.weeksPerSemester }}</span>
      <v-spacer></v-spacer>
      <div class="d-none d-sm-flex align-center" style="gap:8px">
        <span v-for="item in legend" :key="item.id" class="legend-dot-row">
          <span class="legend-dot" :style="{ background: colorHex(item.color) }"></span>
          <span class="legend-label">{{ item.name }}</span>
        </span>
      </div>
    </v-card>

    <!-- Desktop Grid View -->
    <v-card class="section-card pa-4 d-none d-md-block" rounded="lg">
      <div class="section-title mb-3">Weekly Schedule</div>
      <v-table class="tt-table">
        <thead>
          <tr>
            <th class="tt-time-col tbl-head">Time</th>
            <th v-for="day in days" :key="day" class="tbl-head" :class="day === todayName ? 'tt-today-hd' : ''">
              {{ day }}
              <span v-if="day === todayName" class="today-chip ml-1">Today</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in timeSlots" :key="slot">
            <td class="tt-time-col tbl-cell">{{ slot }}</td>
            <td
              v-for="day in days"
              :key="day"
              class="tt-cell"
              :class="day === todayName ? 'tt-today-col' : ''"
            >
              <div
                v-for="cls in getCellClasses(day, slot)"
                :key="cls.moduleId + cls.time"
                class="tt-event"
                :style="{ borderLeftColor: colorHex(cls.color) }"
              >
                <div class="tt-evt-name">{{ cls.name }}</div>
                <div class="tt-evt-sub">{{ cls.room }} &bull; {{ cls.type }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Mobile Day-by-Day View -->
    <div class="d-md-none">
      <v-card
        v-for="day in days"
        :key="day"
        class="section-card pa-4 mb-3"
        rounded="lg"
      >
        <div class="d-flex align-center mb-3">
          <span class="section-title">{{ day }}</span>
          <span v-if="day === todayName" class="today-chip ml-2">Today</span>
        </div>
        <div v-if="!student.timetable[day] || student.timetable[day].length === 0" class="field-label">No classes</div>
        <div
          v-for="cls in student.timetable[day]"
          :key="cls.moduleId + cls.time"
          class="tt-mob-row"
          :style="{ borderLeftColor: colorHex(cls.color) }"
        >
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="mod-name">{{ cls.name }}</div>
              <div class="field-label mt-1">{{ cls.room }} &bull; {{ cls.lecturer }}</div>
            </div>
            <div class="text-right">
              <div class="time-val">{{ cls.time }}</div>
              <div class="type-badge mt-1">{{ cls.type }}</div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import student from '../data/studentData';

const DAYS_LIST = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const todayName = DAYS_LIST[new Date().getDay()];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Time slots for the grid – only slots that have at least one class
const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00'];

// Map time slot string to start hour
const slotHour = (s) => parseInt(s.split(':')[0]);

// Return timetable entries whose start time falls within this slot
const getCellClasses = (day, slot) => {
  const entries = student.timetable[day] ?? [];
  return entries.filter(cls => {
    const start = cls.time.split('–')[0].trim();
    return start === slot;
  });
};

const colorMap = { purple: '#7B5EA7', blue: '#4A7EC3', green: '#3D9D5C', orange: '#C97A25', teal: '#2E8B8B', pink: '#C84B5B', deepblue: '#3A5FA0', red: '#C84B5B' };
const colorHex = (c) => colorMap[c] ?? '#5B8FD4';

const legend = student.academic.modules.map(m => ({ id: m.id, name: m.id, color: m.color }));
</script>

<style scoped>
.section-card { border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label  { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }
.banner-title { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.8); }
.banner-chip  { font-size: 11px; background: rgba(91,143,212,0.15); color: #5B8FD4; padding: 3px 10px; border-radius: 6px; font-weight: 600; }
.today-chip   { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; background: rgba(91,143,212,0.15); color: #5B8FD4; padding: 2px 7px; border-radius: 5px; text-transform: uppercase; }

/* Legend */
.legend-dot-row { display: flex; align-items: center; gap: 5px; }
.legend-dot     { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.legend-label   { font-size: 10px; color: rgba(255,255,255,0.4); }

/* Table */
.tt-table { border-collapse: separate; border-spacing: 4px; width: 100%; }
.tbl-head { font-size: 11px !important; color: rgba(255,255,255,0.38) !important; font-weight: 600 !important; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px !important; }
.tbl-cell { font-size: 12px !important; color: rgba(255,255,255,0.75) !important; padding: 6px 10px !important; }
.tt-time-col { width: 70px; text-align: center; }
.tt-cell { min-width: 120px; height: 80px; vertical-align: top; padding: 4px !important; background: rgba(255,255,255,0.02); border-radius: 6px; }
.tt-today-hd { background: rgba(91,143,212,0.06) !important; }
.tt-today-col { background: rgba(91,143,212,0.03) !important; }

/* Events */
.tt-event {
  border-left: 3px solid transparent;
  background: rgba(255,255,255,0.04);
  border-radius: 5px;
  padding: 5px 7px;
  margin-bottom: 3px;
}
.tt-evt-name { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tt-evt-sub  { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 2px; }

/* Mobile rows */
.mod-name { font-size: 13px; color: rgba(255,255,255,0.87); font-weight: 500; }
.time-val  { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.75); }
.type-badge { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: rgba(255,255,255,0.4); }
.tt-mob-row {
  border-left: 3px solid transparent;
  background: rgba(255,255,255,0.03);
  border-radius: 0 6px 6px 0;
  padding: 10px 12px;
  margin-bottom: 8px;
}
</style>
