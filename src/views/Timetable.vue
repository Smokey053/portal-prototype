<template>
  <div>
    <!-- Week info banner -->
    <v-card color="surface" rounded="xl" class="pa-4 mb-4 d-flex align-center flex-wrap gap-3">
      <v-icon color="primary" class="mr-2">mdi-calendar-week</v-icon>
      <span class="text-body-2 font-weight-bold">Semester 2, 2026</span>
      <v-chip size="small" color="primary" variant="tonal" class="ml-2">Week {{ student.academic.currentWeek }}/{{ student.academic.weeksPerSemester }}</v-chip>
      <v-spacer></v-spacer>
      <v-chip
        v-for="item in legend"
        :key="item.id"
        size="x-small"
        :color="item.color"
        variant="tonal"
        class="mr-1 d-none d-sm-flex"
      >{{ item.name }}</v-chip>
    </v-card>

    <!-- Desktop Grid View -->
    <v-card color="surface" rounded="xl" class="pa-4 d-none d-md-block">
      <div class="text-subtitle-1 font-weight-bold mb-3">Weekly Schedule</div>
      <v-table class="tt-table">
        <thead>
          <tr>
            <th class="tt-time-col">Time</th>
            <th v-for="day in days" :key="day" :class="day === todayName ? 'tt-today' : ''">
              {{ day }}
              <v-chip v-if="day === todayName" size="x-small" color="primary" class="ml-1">Today</v-chip>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in timeSlots" :key="slot">
            <td class="tt-time-col text-caption text-grey">{{ slot }}</td>
            <td
              v-for="day in days"
              :key="day"
              class="tt-cell"
              :class="day === todayName ? 'tt-today-col' : ''"
            >
              <template v-for="cls in getCellClasses(day, slot)" :key="cls.moduleId + cls.time">
                <v-card
                  :color="cls.color"
                  variant="tonal"
                  class="pa-2 mb-1 tt-event"
                  rounded="lg"
                >
                  <div class="text-caption font-weight-bold text-truncate">{{ cls.name }}</div>
                  <div class="text-caption opacity-80">{{ cls.room }}</div>
                  <v-chip size="x-small" variant="tonal" :color="cls.type === 'Tutorial' ? 'secondary' : cls.color" class="mt-1">{{ cls.type }}</v-chip>
                </v-card>
              </template>
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
        color="surface"
        rounded="xl"
        class="pa-4 mb-3"

      >
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-2 font-weight-bold">{{ day }}</span>
          <v-chip v-if="day === todayName" size="x-small" color="primary" class="ml-2">Today</v-chip>
        </div>
        <div v-if="!student.timetable[day] || student.timetable[day].length === 0" class="text-caption text-grey">No classes</div>
        <v-card
          v-for="cls in student.timetable[day]"
          :key="cls.moduleId + cls.time"
          :color="cls.color"
          variant="tonal"
          class="pa-3 mb-2"
          rounded="lg"
        >
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-body-2 font-weight-bold">{{ cls.name }}</div>
              <div class="text-caption">{{ cls.room }} &bull; {{ cls.lecturer }}</div>
            </div>
            <div class="text-right">
              <div class="text-caption font-weight-bold">{{ cls.time }}</div>
              <v-chip size="x-small" :color="cls.color" variant="tonal" class="mt-1">{{ cls.type }}</v-chip>
            </div>
          </div>
        </v-card>
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

const legend = student.academic.modules.map(m => ({ id: m.id, name: m.id, color: m.color }));
</script>

<style scoped>
.tt-table { border-collapse: separate; border-spacing: 4px; width: 100%; }
.tt-time-col { width: 70px; font-size: 0.75rem; text-align: center; }
.tt-cell { min-width: 130px; height: 80px; vertical-align: top; padding: 4px !important; background: rgba(255,255,255,0.02); border-radius: 8px; }
.tt-today { background: rgba(187,134,252,0.05) !important; }
.tt-today-col { background: rgba(187,134,252,0.03) !important; }
.tt-event { cursor: pointer; transition: transform .15s; }
.tt-event:hover { transform: scale(1.02); }
</style>
