<template>
  <div>
    <!-- Welcome Banner -->
    <v-card color="surface" rounded="lg" class="pa-5 mb-5 banner-card">
      <div class="d-flex align-start" style="gap:18px">
        <v-avatar size="64" rounded="lg" color="primary">
          <span class="text-h5 font-weight-bold text-white">EY</span>
        </v-avatar>
        <div style="flex:1; min-width:0">
          <div class="text-h6 font-weight-bold mb-1">{{ student.profile.name }}</div>
          <div class="text-caption text-medium-emphasis mb-2">{{ student.profile.programme }}</div>
          <div class="d-flex align-center flex-wrap" style="gap:12px">
            <span class="banner-meta"><v-icon size="13">mdi-school-outline</v-icon>Year {{ student.profile.year }}, Semester {{ student.profile.semester }}</span>
            <span class="banner-meta"><v-icon size="13">mdi-identifier</v-icon>{{ student.profile.studentId }}</span>
            <span class="banner-meta"><v-icon size="13">mdi-calendar-today</v-icon>Week {{ student.academic.currentWeek }}/{{ student.academic.weeksPerSemester }}</span>
          </div>
        </div>
        <v-chip size="x-small" color="success" variant="flat" class="status-chip mt-1">Active</v-chip>
      </div>
    </v-card>

    <!-- KPI Summary Cards -->
    <v-row class="mb-5">
      <v-col cols="6" md="3">
        <v-card color="surface" rounded="lg" class="pa-4 kpi-card h-100">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="kpi-label">Outstanding Balance</span>
            <div class="kpi-icon-box kpi-icon-error"><v-icon size="16">mdi-cash-minus</v-icon></div>
          </div>
          <div class="text-h6 font-weight-bold text-error mb-1">M{{ student.finance.outstandingBalance.toLocaleString() }}</div>
          <div class="kpi-sub">Due {{ student.finance.pendingPayments[0].dueDate }}</div>
        </v-card>
      </v-col>

      <v-col cols="6" md="3">
        <v-card color="surface" rounded="lg" class="pa-4 kpi-card h-100">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="kpi-label">Avg. Attendance</span>
            <div class="kpi-icon-box" :class="'kpi-icon-' + attColor(avgAtt)"><v-icon size="16">mdi-chart-line</v-icon></div>
          </div>
          <div class="text-h6 font-weight-bold mb-1" :class="'text-' + attColor(avgAtt)">{{ avgAtt }}%</div>
          <v-progress-linear :model-value="avgAtt" :color="attColor(avgAtt)" height="3" rounded bg-color="rgba(255,255,255,0.08)" class="mb-1"></v-progress-linear>
          <div class="kpi-sub">Threshold: {{ student.academic.attendanceThreshold }}%</div>
        </v-card>
      </v-col>

      <v-col cols="6" md="3">
        <v-card color="surface" rounded="lg" class="pa-4 kpi-card h-100">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="kpi-label">Current CGPA</span>
            <div class="kpi-icon-box kpi-icon-primary"><v-icon size="16">mdi-star-circle-outline</v-icon></div>
          </div>
          <div class="text-h6 font-weight-bold text-primary mb-1">{{ student.academic.cgpa }}</div>
          <div class="kpi-sub">{{ student.academic.totalCreditsEarned }} credits earned</div>
        </v-card>
      </v-col>

      <v-col cols="6" md="3">
        <v-card color="surface" rounded="lg" class="pa-4 kpi-card h-100">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="kpi-label">Notifications</span>
            <div class="kpi-icon-box kpi-icon-neutral"><v-icon size="16">mdi-bell-outline</v-icon></div>
          </div>
          <div class="text-h6 font-weight-bold mb-1">{{ unreadCount }}</div>
          <div class="kpi-sub">{{ student.notifications.length }} total &bull; {{ unreadCount }} unread</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Module Quick Overview -->
      <v-col cols="12" md="7">
        <v-card color="surface" rounded="lg" class="pa-4 h-100 section-card">
          <div class="section-header mb-3">
            <span class="section-title">Current Modules — Semester 2</span>
          </div>
          <div v-for="mod in student.academic.modules" :key="mod.id" class="module-row">
            <div class="module-dot" :style="{ background: modDotColor(mod.color) }"></div>
            <div style="flex:1; min-width:0">
              <div class="module-name">{{ mod.name }}</div>
              <div class="module-sub">{{ mod.lecturer }} &bull; {{ mod.room }}</div>
            </div>
            <div class="att-badge" :class="'att-' + attColor(mod.attendance)">{{ mod.attendance }}%</div>
          </div>
        </v-card>
      </v-col>

      <!-- Today's Schedule -->
      <v-col cols="12" md="5">
        <v-card color="surface" rounded="lg" class="pa-4 mb-4 section-card">
          <div class="section-header mb-3">
            <span class="section-title">Today's Classes</span>
            <span class="section-badge">{{ todayName }}</span>
          </div>
          <div v-if="todayClasses.length === 0" class="empty-state">
            <v-icon size="36" class="mb-2 d-block" style="opacity:0.3">mdi-coffee-outline</v-icon>
            <span>No classes scheduled today</span>
          </div>
          <div v-else>
            <div v-for="cls in todayClasses" :key="cls.moduleId + cls.time" class="schedule-row">
              <div class="schedule-time">{{ cls.time.split('–')[0] }}</div>
              <div class="schedule-block">
                <div class="module-name">{{ cls.name }}</div>
                <div class="module-sub">{{ cls.room }} &bull; {{ cls.type }}</div>
              </div>
            </div>
          </div>
        </v-card>

        <!-- Upcoming Alert -->
        <div v-if="upcomingEvent" class="alert-box">
          <v-icon size="16" class="mr-2" color="warning">mdi-calendar-alert</v-icon>
          <div>
            <div class="module-name">{{ upcomingEvent.title }}</div>
            <div class="module-sub">{{ upcomingEvent.date }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import student from '../data/studentData';

const colorMap = { blue:'#5B8FD4', purple:'#8B6BBF', green:'#3D9D5C', orange:'#C97A25', red:'#C84B5B', teal:'#3A8F8F' };
const modDotColor = (c) => colorMap[c] ?? '#888';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const todayName = DAYS[new Date().getDay()];
const todayClasses = computed(() => student.timetable[todayName] ?? []);

const avgAtt = computed(() => {
  const sum = student.academic.modules.reduce((a, m) => a + m.attendance, 0);
  return Math.round(sum / student.academic.modules.length);
});
const attColor = (v) => v >= 80 ? 'success' : v >= 70 ? 'warning' : 'error';

const unreadCount = computed(() => student.notifications.filter(n => !n.read).length);

const upcomingEvent = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return student.calendarEvents.find(e => e.date >= today && e.type !== 'assessment') ?? null;
});
</script>

<style scoped>
.banner-card { border: 1px solid rgba(255,255,255,0.07); }
.section-card { border: 1px solid rgba(255,255,255,0.06); }

.banner-meta {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: rgba(255,255,255,0.5);
}
.status-chip { font-size: 10px !important; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

/* KPI cards */
.kpi-card { border: 1px solid rgba(255,255,255,0.06); }
.kpi-label { font-size: 11px; color: rgba(255,255,255,0.45); }
.kpi-sub { font-size: 11px; color: rgba(255,255,255,0.38); }

.kpi-icon-box {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-icon-error   { background: rgba(200, 75, 91, 0.15); color: #C84B5B; }
.kpi-icon-success { background: rgba(61,157,92,0.15); color: #3D9D5C; }
.kpi-icon-primary { background: rgba(91,143,212,0.15); color: #5B8FD4; }
.kpi-icon-neutral { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); }
.kpi-icon-warning { background: rgba(201,122,37,0.15); color: #C97A25; }

/* Section headers */
.section-header { display: flex; align-items: center; gap: 10px; }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.section-badge {
  font-size: 11px; padding: 2px 8px; border-radius: 6px;
  background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.45);
}

/* Module rows */
.module-row {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.module-row:last-child { border-bottom: none; }
.module-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.module-name { font-size: 13px; color: rgba(255,255,255,0.87); }
.module-sub  { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 1px; }

.att-badge { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 6px; flex-shrink: 0; }
.att-success { background: rgba(61,157,92,0.15); color: #3D9D5C; }
.att-warning  { background: rgba(201,122,37,0.15); color: #C97A25; }
.att-error    { background: rgba(200,75,91,0.15); color: #C84B5B; }

/* Schedule */
.schedule-row { display: flex; align-items: flex-start; gap: 12px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
.schedule-row:last-child { border-bottom: none; }
.schedule-time { font-size: 11px; color: rgba(255,255,255,0.4); min-width: 44px; padding-top: 1px; }
.schedule-block { flex: 1; }

.empty-state { text-align: center; padding: 24px 0; font-size: 12px; color: rgba(255,255,255,0.3); }

/* Alert box */
.alert-box {
  display: flex; align-items: flex-start;
  background: rgba(201,122,37,0.1);
  border: 1px solid rgba(201,122,37,0.25);
  border-radius: 10px;
  padding: 12px 14px;
}
</style>
