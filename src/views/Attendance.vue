<template>
  <div>
    <!-- Summary Strip -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3">
        <v-card color="surface" rounded="xl" class="pa-3 text-center">
          <div class="text-caption text-medium-emphasis">Avg. Attendance</div>
          <div class="text-h5 font-weight-bold" :class="'text-' + avgColor">{{ avgAtt }}%</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="success" variant="tonal" rounded="xl" class="pa-3 text-center">
          <div class="text-caption">Good Standing</div>
          <div class="text-h5 font-weight-bold text-success">{{ goodCount }}</div>
          <div class="text-caption">modules ≥ 80%</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="warning" variant="tonal" rounded="xl" class="pa-3 text-center">
          <div class="text-caption">At Risk</div>
          <div class="text-h5 font-weight-bold text-warning">{{ atRiskCount }}</div>
          <div class="text-caption">modules 70–79%</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="error" variant="tonal" rounded="xl" class="pa-3 text-center">
          <div class="text-caption">Critical</div>
          <div class="text-h5 font-weight-bold text-error">{{ criticalCount }}</div>
          <div class="text-caption">modules &lt; 70%</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Per-module cards -->
    <v-row>
      <v-col
        v-for="mod in student.academic.modules"
        :key="mod.id"
        cols="12" sm="6" lg="4"
      >
        <v-card color="surface" rounded="xl" class="pa-4 h-100">
          <!-- Header -->
          <div class="d-flex justify-space-between align-start mb-2">
            <div>
              <div class="text-body-2 font-weight-bold">{{ mod.name }}</div>
              <div class="text-caption text-grey">{{ mod.id }} &bull; {{ mod.lecturer }}</div>
            </div>
            <v-chip
              size="small"
              :color="attColor(mod.attendance)"
              variant="tonal"
            >{{ mod.attendance }}%</v-chip>
          </div>

          <!-- Progress bar -->
          <v-progress-linear
            :model-value="mod.attendance"
            :color="attColor(mod.attendance)"
            height="8"
            rounded
            bg-color="rgba(255,255,255,0.08)"
            class="mb-3"
          ></v-progress-linear>

          <!-- Stats row -->
          <div class="d-flex justify-space-between text-caption mb-2">
            <span class="text-grey">Classes Attended</span>
            <span class="font-weight-medium">{{ mod.classesAttended }} / {{ mod.classesHeld }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption mb-3">
            <span class="text-grey">Missed</span>
            <span :class="(mod.classesHeld - mod.classesAttended) > 0 ? 'text-error' : 'text-success'" class="font-weight-medium">
              {{ mod.classesHeld - mod.classesAttended }}
            </span>
          </div>

          <!-- Warning banner -->
          <v-alert
            v-if="mod.attendance < student.academic.attendanceThreshold"
            :type="mod.attendance < 70 ? 'error' : 'warning'"
            variant="tonal"
            density="compact"
            class="mb-0 rounded-lg text-caption"
            :icon="mod.attendance < 70 ? 'mdi-alert-circle' : 'mdi-alert'"
          >
            {{ mod.attendance < 70 ? 'Critical – contact lecturer immediately' : 'Below 80% threshold – improvement needed' }}
          </v-alert>
          <v-chip
            v-else
            size="x-small"
            color="success"
            variant="tonal"
            prepend-icon="mdi-check"
          >Good Standing</v-chip>
        </v-card>
      </v-col>
    </v-row>

    <!-- Threshold info -->
    <v-card color="surface" rounded="xl" class="pa-4 mt-4">
      <div class="d-flex align-center">
        <v-icon color="info" class="mr-3">mdi-information-outline</v-icon>
        <div class="text-caption text-medium-emphasis">
          The minimum attendance requirement is <strong>{{ student.academic.attendanceThreshold }}%</strong> per module.
          Students below this threshold may be barred from sitting final examinations.
          Contact your module lecturer or academic advisor if you have concerns.
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import student from '../data/studentData';

const attColor = (v) => v >= 80 ? 'success' : v >= 70 ? 'warning' : 'error';

const avgAtt = computed(() => {
  const sum = student.academic.modules.reduce((a, m) => a + m.attendance, 0);
  return Math.round(sum / student.academic.modules.length);
});
const avgColor = computed(() => attColor(avgAtt.value));
const goodCount = computed(() => student.academic.modules.filter(m => m.attendance >= 80).length);
const atRiskCount = computed(() => student.academic.modules.filter(m => m.attendance >= 70 && m.attendance < 80).length);
const criticalCount = computed(() => student.academic.modules.filter(m => m.attendance < 70).length);
</script>
