<template>
  <div>
    <!-- Status Banner -->
    <v-alert
      :type="student.registrationStatus.isOpen ? 'success' : 'error'"
      variant="tonal"
      border="start"
      class="mb-4 rounded-xl"
      :icon="student.registrationStatus.isOpen ? 'mdi-check-circle' : 'mdi-lock'"
    >
      <strong>Registration is {{ student.registrationStatus.isOpen ? 'OPEN' : 'CLOSED' }}</strong>
      for {{ student.registrationStatus.nextSemester }}.
      <span v-if="student.registrationStatus.isOpen">
        Deadline: <strong>{{ student.registrationStatus.deadline }}</strong>
      </span>
    </v-alert>

    <v-row>
      <!-- Current Registration -->
      <v-col cols="12" md="5">
        <v-card color="surface" rounded="xl" class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="secondary" class="mr-2" size="20">mdi-check-decagram</v-icon>
            Currently Enrolled — Sem 2
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="mod in student.academic.modules"
              :key="mod.id"
              :title="mod.name"
              :subtitle="mod.id + ' · ' + mod.credits + ' credits'"
              prepend-icon="mdi-book-check"
              color="success"
              class="rounded-lg mb-1"
              style="background:rgba(76,175,80,0.07)"
            >
              <template v-slot:append>
                <v-chip size="x-small" color="success" variant="tonal">Enrolled</v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-divider class="my-3"></v-divider>
          <div class="text-caption text-grey">
            Total credits this semester:
            <strong>{{ totalCurrentCredits }}</strong>
          </div>
        </v-card>
      </v-col>

      <!-- Available Modules for Next Semester -->
      <v-col cols="12" md="7">
        <v-card color="surface" rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="primary" class="mr-2" size="20">mdi-pencil-box-outline</v-icon>
            Available — {{ student.registrationStatus.nextSemester }}
          </div>

          <v-table density="compact" hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Module Name</th>
                <th class="text-center">Credits</th>
                <th class="text-center">Seats</th>
                <th class="text-center">Required</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mod in regularModules" :key="mod.id">
                <td class="text-caption">{{ mod.id }}</td>
                <td class="text-caption">{{ mod.name }}</td>
                <td class="text-center text-caption">{{ mod.credits }}</td>
                <td class="text-center">
                  <v-chip size="x-small" :color="mod.seats <= 5 ? 'error' : mod.seats <= 15 ? 'warning' : 'success'" variant="tonal">
                    {{ mod.seats }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-icon :color="mod.required ? 'error' : 'grey'" size="16">
                    {{ mod.required ? 'mdi-asterisk' : 'mdi-minus' }}
                  </v-icon>
                </td>
                <td class="text-center">
                  <v-btn
                    size="x-small"
                    :color="mod.enrolled ? 'error' : 'primary'"
                    :variant="mod.enrolled ? 'tonal' : 'elevated'"
                    @click="toggleEnrol(mod)"
                  >
                    {{ mod.enrolled ? 'Drop' : 'Enrol' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider class="my-3"></v-divider>

          <!-- Summary of selections -->
          <div class="d-flex align-center justify-space-between">
            <div class="text-caption">
              Selected: <strong>{{ enrolledCount }}</strong> module(s) &bull;
              <strong>{{ enrolledCredits }}</strong> credits
            </div>
            <v-btn
              color="primary"
              size="small"
              prepend-icon="mdi-send"
              :disabled="enrolledCount === 0"
              @click="submitRegistration"
            >Submit Registration</v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Confirmation snackbar -->
    <v-snackbar v-model="snack" color="success" timeout="3000" location="bottom right">
      <v-icon class="mr-2">mdi-check</v-icon> Registration submitted successfully!
    </v-snackbar>

    <!-- Repeat Modules -->
    <v-row v-if="repeatModules.length > 0" class="mt-4">
      <v-col cols="12">
        <v-card color="surface" rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="warning" class="mr-2" size="20">mdi-refresh-circle</v-icon>
            Repeat Module(s) — {{ student.registrationStatus.nextSemester }}
          </div>
          <v-alert type="warning" variant="tonal" density="compact" class="mb-3 text-caption" icon="mdi-alert-circle-outline">
            The following module(s) were not passed and <strong>must be repeated</strong> in the next academic year.
          </v-alert>
          <v-table density="compact" hover>
            <thead>
              <tr>
                <th>Code</th>
                <th>Module Name</th>
                <th class="text-center">Credits</th>
                <th class="text-center">Seats</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mod in repeatModules" :key="mod.id">
                <td class="text-caption">{{ mod.id }}</td>
                <td class="text-caption">
                  {{ mod.name }}
                  <v-chip size="x-small" color="warning" variant="tonal" class="ml-2">Repeat</v-chip>
                </td>
                <td class="text-center text-caption">{{ mod.credits }}</td>
                <td class="text-center">
                  <v-chip size="x-small" :color="mod.seats <= 5 ? 'error' : mod.seats <= 15 ? 'warning' : 'success'" variant="tonal">
                    {{ mod.seats }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-btn
                    size="x-small"
                    :color="mod.enrolled ? 'error' : 'warning'"
                    :variant="mod.enrolled ? 'tonal' : 'elevated'"
                    @click="toggleEnrol(mod)"
                  >
                    {{ mod.enrolled ? 'Drop' : 'Enrol' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
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
