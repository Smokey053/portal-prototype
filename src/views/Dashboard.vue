<template>
  <div>
    <!-- Welcome Banner -->
    <v-card
      color="surface"
      variant="flat"
      class="mb-6 pa-5 rounded-xl"
      style="background: #1e1e1e;"
    >
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="mr-4">
          <v-avatar size="64" color="primary">
            <span class="text-h5 font-weight-bold text-white">EY</span>
          </v-avatar>
        </v-col>
        <v-col>
          <div class="text-h5 font-weight-bold">Welcome back, {{ student.profile.name }}</div>
          <div class="text-body-2 text-grey mt-1">
            {{ student.profile.programme }} &bull; Year {{ student.profile.year }}, Semester {{ student.profile.semester }}
          </div>
          <div class="text-caption text-grey mt-1">
            <v-icon size="x-small" class="mr-1">mdi-identifier</v-icon>{{ student.profile.studentId }}
            &nbsp;&bull;&nbsp;
            <v-icon size="x-small" class="mr-1">mdi-calendar-today</v-icon>
            Sem Week {{ student.academic.currentWeek }}/{{ student.academic.weeksPerSemester }}
          </div>
        </v-col>
        <v-col cols="12" sm="auto" class="mt-3 mt-sm-0">
          <v-chip color="success" size="small" prepend-icon="mdi-check-circle">Active Enrolment</v-chip>
        </v-col>
      </v-row>
    </v-card>

    <!-- KPI Summary Cards -->
    <v-row class="mb-4">
      <v-col cols="6" md="3">
        <v-card color="surface" rounded="xl" class="pa-4 kpi-card kpi-error h-100">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-caption text-medium-emphasis">Outstanding Balance</span>
            <v-icon color="error" size="20">mdi-cash-minus</v-icon>
          </div>
          <div class="text-h6 font-weight-bold text-error">M{{ student.finance.outstandingBalance.toLocaleString() }}</div>
          <div class="text-caption text-grey">Due {{ student.finance.pendingPayments[0].dueDate }}</div>
          <v-btn variant="tonal" color="error" size="x-small" class="mt-2">Pay Now</v-btn>
        </v-card>
      </v-col>

      <v-col cols="6" md="3">
        <v-card color="surface" rounded="xl" class="pa-4 kpi-card kpi-success h-100">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-caption text-medium-emphasis">Avg. Attendance</span>
            <v-icon color="success" size="20">mdi-chart-line</v-icon>
          </div>
          <div class="text-h6 font-weight-bold" :class="avgAttColor">{{ avgAtt }}%</div>
          <v-progress-linear :model-value="avgAtt" :color="avgAttColor.replace('text-','')" height="4" rounded class="mt-2 mb-1"></v-progress-linear>
          <div class="text-caption text-grey">Threshold: {{ student.academic.attendanceThreshold }}%</div>
        </v-card>
      </v-col>

      <v-col cols="6" md="3">
        <v-card color="surface" rounded="xl" class="pa-4 kpi-card kpi-primary h-100">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-caption text-medium-emphasis">Current CGPA</span>
            <v-icon color="primary" size="20">mdi-star-circle</v-icon>
          </div>
          <div class="text-h6 font-weight-bold text-primary">{{ student.academic.cgpa }}</div>
          <div class="text-caption text-grey">{{ student.academic.totalCreditsEarned }} credits earned</div>
          <v-btn variant="tonal" color="primary" size="x-small" class="mt-2">View Results</v-btn>
        </v-card>
      </v-col>

      <v-col cols="6" md="3">
        <v-card color="surface" rounded="xl" class="pa-4 kpi-card kpi-info h-100">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-caption text-medium-emphasis">Unread Notifications</span>
            <v-icon color="info" size="20">mdi-bell-ring</v-icon>
          </div>
          <div class="text-h6 font-weight-bold text-info">{{ unreadCount }}</div>
          <div class="text-caption text-grey">{{ student.notifications.length }} total messages</div>
          <v-btn variant="tonal" color="info" size="x-small" class="mt-2">Open Inbox</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Module Quick Overview -->
      <v-col cols="12" md="7">
        <v-card color="surface" rounded="xl" class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="primary" class="mr-2" size="20">mdi-book-open-variant</v-icon>
            Current Modules — Semester 2
          </div>
          <v-list density="compact" lines="two">
            <v-list-item
              v-for="mod in student.academic.modules"
              :key="mod.id"
              :subtitle="mod.lecturer + ' · ' + mod.room"
              class="rounded-lg mb-1 px-2"
              style="background:rgba(255,255,255,0.03)"
            >
              <template v-slot:prepend>
                <v-avatar size="8" :color="mod.color" class="mr-3 mt-1"></v-avatar>
              </template>
              <template v-slot:title>
                <span class="text-body-2 font-weight-medium">{{ mod.name }}</span>
              </template>
              <template v-slot:append>
                <v-chip
                  size="x-small"
                  :color="attColor(mod.attendance)"
                  variant="tonal"
                  class="ml-2"
                >{{ mod.attendance }}%</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Today's Schedule -->
      <v-col cols="12" md="5">
        <v-card color="surface" rounded="xl" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="secondary" class="mr-2" size="20">mdi-clock-outline</v-icon>
            Today's Classes
            <v-chip size="x-small" class="ml-2" color="surface" variant="outlined">{{ todayName }}</v-chip>
          </div>
          <div v-if="todayClasses.length === 0" class="text-center text-grey py-4">
            <v-icon size="40" class="mb-2 d-block">mdi-coffee-outline</v-icon>
            No classes scheduled today
          </div>
          <v-timeline v-else density="compact" side="end" truncate-line="both">
            <v-timeline-item
              v-for="cls in todayClasses"
              :key="cls.moduleId + cls.time"
              :dot-color="cls.color"
              size="small"
            >
              <template v-slot:opposite>
                <span class="text-caption">{{ cls.time.split('–')[0] }}</span>
              </template>
              <v-card variant="tonal" :color="cls.color" class="pa-2">
                <div class="text-body-2 font-weight-bold">{{ cls.name }}</div>
                <div class="text-caption">{{ cls.room }} &bull; {{ cls.type }}</div>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card>

        <!-- Upcoming Alert -->
        <v-alert
          v-if="upcomingEvent"
          type="warning"
          variant="tonal"
          border="start"
          density="compact"
          class="rounded-xl"
          :icon="'mdi-calendar-alert'"
        >
          <strong>{{ upcomingEvent.title }}</strong>
          <div class="text-caption">{{ upcomingEvent.date }}</div>
        </v-alert>
      </v-col>
    </v-row>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import student from '../data/studentData';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const todayName = DAYS[new Date().getDay()];
const todayClasses = computed(() => student.timetable[todayName] ?? []);

const avgAtt = computed(() => {
  const sum = student.academic.modules.reduce((a, m) => a + m.attendance, 0);
  return Math.round(sum / student.academic.modules.length);
});
const avgAttColor = computed(() => attColor(avgAtt.value).replace('','text-'));
const attColor = (v) => v >= 80 ? 'success' : v >= 70 ? 'warning' : 'error';

const unreadCount = computed(() => student.notifications.filter(n => !n.read).length);

// Next upcoming event from calendarEvents
const upcomingEvent = computed(() => {
  const today = new Date().toISOString().slice(0,10);
  return student.calendarEvents.find(e => e.date >= today && e.type !== 'assessment') ?? null;
});
</script>

<style scoped>
.kpi-card { border-radius: 16px; }
</style>
