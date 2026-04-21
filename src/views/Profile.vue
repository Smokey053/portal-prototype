<template>
  <div>
    <!-- Profile Header -->
    <v-card color="surface" rounded="xl" class="pa-5 mb-5">
      <v-row align="center">
        <v-col cols="auto">
          <v-avatar size="80" color="primary">
            <span class="text-h4 font-weight-bold text-white">EY</span>
          </v-avatar>
        </v-col>
        <v-col>
          <div class="text-h5 font-weight-bold">{{ student.profile.name }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ student.profile.studentId }}</div>
          <div class="text-caption text-grey">{{ student.profile.programme }}</div>
          <v-chip size="x-small" color="success" class="mt-2" prepend-icon="mdi-check-circle">{{ student.profile.enrollmentStatus }}</v-chip>
        </v-col>
        <v-col cols="12" sm="auto">
          <v-btn color="primary" variant="tonal" prepend-icon="mdi-pencil" size="small">Edit Photo</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <!-- Personal Info -->
      <v-col cols="12" md="6">
        <v-card color="surface" rounded="xl" class="pa-5 h-100">
          <div class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-account</v-icon>
            Personal Information
            <v-spacer></v-spacer>
            <v-btn
              v-if="!editMode"
              size="small"
              variant="tonal"
              color="primary"
              prepend-icon="mdi-pencil"
              @click="editMode = true"
            >Edit</v-btn>
          </div>

          <!-- Display Mode -->
          <v-list v-if="!editMode" density="compact" lines="two">
            <v-list-item prepend-icon="mdi-account" subtitle="Full Name" :title="form.name" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-identifier" subtitle="Student ID" :title="student.profile.studentId" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-card-account-details" subtitle="National ID" :title="student.profile.nationalId" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-phone" subtitle="Contact Number" :title="form.contactNumber" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-email" subtitle="Personal Email" :title="form.personalEmail" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-map-marker" subtitle="Physical Address" :title="form.address" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-cake" subtitle="Date of Birth" :title="student.profile.dateOfBirth" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-flag" subtitle="Nationality" :title="student.profile.nationality" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
            <v-list-item prepend-icon="mdi-account-heart" subtitle="Emergency Contact" :title="form.emergencyContact" class="rounded-lg mb-1" style="background:rgba(255,255,255,0.03)"></v-list-item>
          </v-list>

          <!-- Edit Mode -->
          <v-form v-else @submit.prevent="saveProfile">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  label="Full Name"
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Student ID"
                  :model-value="student.profile.studentId"
                  variant="outlined"
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-identifier"
                  hint="Read-only"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="National ID"
                  :model-value="student.profile.nationalId"
                  variant="outlined"
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-card-account-details"
                  hint="Read-only"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Contact Number"
                  v-model="form.contactNumber"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Personal Email"
                  v-model="form.personalEmail"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Physical Address"
                  v-model="form.address"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Date of Birth"
                  :model-value="student.profile.dateOfBirth"
                  variant="outlined"
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-cake"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Nationality"
                  :model-value="student.profile.nationality"
                  variant="outlined"
                  density="compact"
                  readonly
                  prepend-inner-icon="mdi-flag"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Emergency Contact"
                  v-model="form.emergencyContact"
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-account-heart"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="d-flex justify-end mt-3 gap-2">
              <v-btn variant="text" @click="cancelEdit">Cancel</v-btn>
              <v-btn color="primary" prepend-icon="mdi-content-save" type="submit">Save Changes</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- Academic Info -->
      <v-col cols="12" md="6">
        <v-card color="surface" rounded="xl" class="pa-5 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
            <v-icon color="secondary" class="mr-2">mdi-school</v-icon>
            Academic Details
          </div>
          <v-list density="compact" lines="two">
            <v-list-item
              v-for="item in academicItems"
              :key="item.label"
              :prepend-icon="item.icon"
              :subtitle="item.label"
              :title="item.value"
              class="rounded-lg mb-1"
              style="background:rgba(255,255,255,0.03)"
            ></v-list-item>
          </v-list>
          <v-alert type="info" variant="tonal" density="compact" class="mt-4 text-caption" icon="mdi-lock">
            Academic records are managed by the Registry. Contact <strong>registry@luct.ac.ls</strong> for changes.
          </v-alert>
        </v-card>

        <!-- University Email -->
        <v-card color="surface" rounded="xl" class="pa-5">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="info" class="mr-2">mdi-email-lock</v-icon>
            University Account
          </div>
          <v-text-field
            label="University Email (read-only)"
            :model-value="student.profile.email"
            variant="outlined"
            density="compact"
            readonly
            prepend-inner-icon="mdi-email-outline"
            class="mb-3"
          ></v-text-field>
          <v-text-field
            label="Assigned Advisor"
            :model-value="student.profile.advisor"
            variant="outlined"
            density="compact"
            readonly
            prepend-inner-icon="mdi-account-tie"
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snack" color="success" timeout="2500" location="bottom right">
      <v-icon class="mr-2">mdi-check-circle</v-icon> Profile updated successfully!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import student from '../data/studentData';

const form = ref({
  name: student.profile.name,
  contactNumber: student.profile.contactNumber,
  personalEmail: student.profile.personalEmail,
  address: student.profile.address,
  emergencyContact: student.profile.emergencyContact,
});

const snack = ref(false);
const editMode = ref(false);

const academicItems = [
  { label: 'Faculty', value: student.profile.faculty, icon: 'mdi-domain' },
  { label: 'Programme', value: student.profile.programme, icon: 'mdi-book-education' },
  { label: 'Year of Study', value: `Year ${student.profile.year}`, icon: 'mdi-counter' },
  { label: 'Current Semester', value: `Semester ${student.profile.semester}`, icon: 'mdi-calendar-range' },
  { label: 'Enrollment Date', value: student.profile.enrollmentDate, icon: 'mdi-calendar-check' },
  { label: 'Sponsorship', value: student.finance.sponsorship, icon: 'mdi-cash-multiple' },
];

const saveProfile = () => { snack.value = true; editMode.value = false; };
const cancelEdit = () => {
  form.value = {
    name: student.profile.name,
    contactNumber: student.profile.contactNumber,
    personalEmail: student.profile.personalEmail,
    address: student.profile.address,
    emergencyContact: student.profile.emergencyContact,
  };
  editMode.value = false;
};
</script>
