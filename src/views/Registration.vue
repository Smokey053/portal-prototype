<template>
  <div>
    <!-- Past Registration Requests -->
    <div class="section-label mb-2">Registration Requests</div>
    <div class="text-caption text-medium-emphasis mb-4">View and track all your registration requests and their current status</div>
    <v-divider class="mb-4"></v-divider>

    <v-row dense class="mb-6">
      <v-col cols="12" sm="6" v-for="reg in student.registrationHistory" :key="reg.term">
        <div class="reg-card">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center" style="gap:10px">
              <div class="reg-icon-box"><v-icon size="15">mdi-calendar-month-outline</v-icon></div>
              <span class="reg-term">{{ reg.term }}</span>
            </div>
            <span class="reg-badge">{{ reg.status.toUpperCase() }}</span>
          </div>
          <div class="reg-label mb-3">{{ reg.label }}</div>
          <div class="d-flex align-center justify-space-between">
            <span class="reg-submitted">Submitted: {{ reg.submitted }}</span>
            <span class="reg-link">View Details <v-icon size="12">mdi-chevron-right</v-icon></span>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Upcoming Registration Status -->
    <v-card color="surface" rounded="lg" class="pa-4 mb-5 section-card">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="section-title mb-1">Next Semester Registration</div>
          <div class="text-caption text-medium-emphasis">{{ student.registrationStatus.nextSemester }}</div>
        </div>
        <v-chip
          size="small"
          :color="student.registrationStatus.isOpen ? 'success' : 'warning'"
          variant="flat"
          class="status-chip"
        >{{ student.registrationStatus.isOpen ? 'OPEN' : 'NOT YET OPEN' }}</v-chip>
      </div>
      <v-divider class="my-3"></v-divider>
      <div class="d-flex align-center" style="gap:24px">
        <div>
          <div class="field-label">{{ student.registrationStatus.isOpen ? 'Deadline' : 'Opens' }}</div>
          <div class="field-value">{{ student.registrationStatus.isOpen ? student.registrationStatus.deadline : student.registrationStatus.opensDate }}</div>
        </div>
        <div v-if="!student.registrationStatus.isOpen">
          <div class="field-label">Registration Deadline</div>
          <div class="field-value">{{ student.registrationStatus.deadline }}</div>
        </div>
        <div>
          <div class="field-label">Semester</div>
          <div class="field-value">{{ student.registrationStatus.nextSemester }}</div>
        </div>
      </div>
      <div v-if="!student.registrationStatus.isOpen" class="notice-box mt-3">
        <v-icon size="13" class="mr-2" style="opacity:0.5; flex-shrink:0">mdi-information-outline</v-icon>
        Registration is not yet open. You may preview the available Year 3 modules below. Enrolment will be enabled from {{ student.registrationStatus.opensDate }}.
      </div>
    </v-card>

    <v-row>
      <!-- Current Enrolment -->
      <v-col cols="12" md="5">
        <v-card color="surface" rounded="lg" class="pa-4 h-100 section-card">
          <div class="section-title mb-3">Currently Enrolled — Sem 2</div>
          <div v-for="mod in student.academic.modules" :key="mod.id" class="enrol-row">
            <div style="flex:1; min-width:0">
              <div class="field-value">{{ mod.name }}</div>
              <div class="field-label mt-1">{{ mod.id }} &bull; {{ mod.credits }} credits</div>
            </div>
            <span class="badge-enrolled">Enrolled</span>
          </div>
          <v-divider class="my-3"></v-divider>
          <div class="field-label">Total credits: <span class="field-value">{{ totalCurrentCredits }}</span></div>
        </v-card>
      </v-col>

      <!-- Available Modules -->
      <v-col cols="12" md="7">
        <v-card color="surface" rounded="lg" class="pa-4 section-card">
          <div class="section-title mb-3">Available — {{ student.registrationStatus.nextSemester }}</div>

          <v-table density="compact" hover>
            <thead>
              <tr>
                <th class="tbl-head">Code</th>
                <th class="tbl-head">Module Name</th>
                <th class="tbl-head text-center">Credits</th>
                <th class="tbl-head text-center">Seats</th>
                <th class="tbl-head text-center">Required</th>
                <th class="tbl-head text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mod in regularModules" :key="mod.id" class="tbl-row">
                <td class="tbl-cell mono">{{ mod.id }}</td>
                <td class="tbl-cell">{{ mod.name }}</td>
                <td class="tbl-cell text-center">{{ mod.credits }}</td>
                <td class="text-center">
                  <span class="seats-badge" :class="mod.seats <= 5 ? 'seats-low' : mod.seats <= 15 ? 'seats-med' : 'seats-ok'">{{ mod.seats }}</span>
                </td>
                <td class="text-center">
                  <v-icon :color="mod.required ? 'error' : 'grey'" size="14">{{ mod.required ? 'mdi-asterisk' : 'mdi-minus' }}</v-icon>
                </td>
                <td class="text-center">
                  <v-btn size="x-small" :color="mod.enrolled ? 'error' : 'primary'" :variant="mod.enrolled ? 'tonal' : 'elevated'" :disabled="!student.registrationStatus.isOpen" @click="toggleEnrol(mod)">
                    {{ mod.enrolled ? 'Drop' : 'Enrol' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider class="my-3"></v-divider>
          <div class="d-flex align-center justify-space-between">
            <div class="field-label">
              Selected: <span class="field-value">{{ enrolledCount }}</span> module(s) &bull;
              <span class="field-value">{{ enrolledCredits }}</span> credits
            </div>
            <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-send" :disabled="enrolledCount === 0 || !student.registrationStatus.isOpen" @click="submitRegistration">
              Submit
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Repeat Modules -->
    <v-row v-if="repeatModules.length > 0" class="mt-4">
      <v-col cols="12">
        <v-card color="surface" rounded="lg" class="pa-4 section-card">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="section-title">Repeat Module(s) — {{ student.registrationStatus.nextSemester }}</div>
            <v-chip size="x-small" color="warning" variant="flat" class="status-chip">Action Required</v-chip>
          </div>
          <div class="notice-box mb-3">
            <v-icon size="13" class="mr-1" style="opacity:0.5">mdi-alert-circle-outline</v-icon>
            The following module(s) were not passed and must be repeated in the next academic year.
          </div>
          <v-table density="compact" hover>
            <thead>
              <tr>
                <th class="tbl-head">Code</th>
                <th class="tbl-head">Module Name</th>
                <th class="tbl-head text-center">Credits</th>
                <th class="tbl-head text-center">Seats</th>
                <th class="tbl-head text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mod in repeatModules" :key="mod.id" class="tbl-row">
                <td class="tbl-cell mono">{{ mod.id }}</td>
                <td class="tbl-cell">
                  {{ mod.name }}
                  <span class="repeat-tag ml-1">REPEAT</span>
                </td>
                <td class="tbl-cell text-center">{{ mod.credits }}</td>
                <td class="text-center">
                  <span class="seats-badge" :class="mod.seats <= 5 ? 'seats-low' : mod.seats <= 15 ? 'seats-med' : 'seats-ok'">{{ mod.seats }}</span>
                </td>
                <td class="text-center">
                  <v-btn size="x-small" :color="mod.enrolled ? 'error' : 'warning'" :variant="mod.enrolled ? 'tonal' : 'elevated'" :disabled="!student.registrationStatus.isOpen" @click="toggleEnrol(mod)">
                    {{ mod.enrolled ? 'Drop' : 'Enrol' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snack" color="success" timeout="3000" location="bottom right">
      <v-icon class="mr-2">mdi-check</v-icon> Registration submitted successfully!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import student from '../data/studentData';

const snack = ref(false);

const regularModules = computed(() => student.registrationStatus.availableModules.filter(m => m.type !== 'repeat'));
const repeatModules = computed(() => student.registrationStatus.availableModules.filter(m => m.type === 'repeat'));

const totalCurrentCredits = computed(() => student.academic.modules.reduce((s, m) => s + m.credits, 0));
const enrolledCount = computed(() => student.registrationStatus.availableModules.filter(m => m.enrolled).length);
const enrolledCredits = computed(() => student.registrationStatus.availableModules.filter(m => m.enrolled).reduce((s, m) => s + m.credits, 0));

const toggleEnrol = (mod) => { mod.enrolled = !mod.enrolled; };
const submitRegistration = () => { snack.value = true; };
</script>

<style scoped>
.section-card { border: 1px solid rgba(255,255,255,0.06); }
.section-label { font-size: 20px; font-weight: 700; color: rgba(255,255,255,0.9); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }
.field-value { font-size: 13px; color: rgba(255,255,255,0.87); }
.status-chip { font-size: 10px !important; font-weight: 600; letter-spacing: 0.5px; }

/* Registration history cards */
.reg-card {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255,255,255,0.02);
}
.reg-icon-box {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5);
}
.reg-term { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.87); }
.reg-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; color: #3D9D5C; }
.reg-label { font-size: 13px; color: rgba(255,255,255,0.6); }
.reg-submitted { font-size: 11px; color: rgba(255,255,255,0.38); }
.reg-link { font-size: 11px; color: rgba(255,255,255,0.45); display: flex; align-items: center; cursor: pointer; }
.reg-link:hover { color: #5B8FD4; }

/* Enrolled rows */
.enrol-row {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.enrol-row:last-of-type { border-bottom: none; }
.badge-enrolled {
  font-size: 10px; font-weight: 600; letter-spacing: 0.5px;
  color: #3D9D5C; background: rgba(61,157,92,0.12);
  padding: 3px 8px; border-radius: 6px;
  flex-shrink: 0;
}

/* Table styles */
.tbl-head { font-size: 11px !important; color: rgba(255,255,255,0.38) !important; font-weight: 600 !important; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 12px !important; }
.tbl-row { border-bottom: 1px solid rgba(255,255,255,0.04) !important; }
.tbl-cell { font-size: 12px !important; color: rgba(255,255,255,0.75) !important; padding: 8px 12px !important; }
.mono { font-family: 'Roboto Mono', monospace; font-size: 11px !important; color: rgba(255,255,255,0.45) !important; }

.seats-badge { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 6px; }
.seats-ok  { background: rgba(61,157,92,0.15); color: #3D9D5C; }
.seats-med { background: rgba(201,122,37,0.15); color: #C97A25; }
.seats-low { background: rgba(200,75,91,0.15); color: #C84B5B; }

.repeat-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 0.6px;
  color: #C97A25; background: rgba(201,122,37,0.15);
  padding: 2px 5px; border-radius: 4px;
}

.notice-box {
  display: flex; align-items: flex-start;
  font-size: 11px; color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 10px 12px;
}
</style>
