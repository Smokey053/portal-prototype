<template>
  <div>
    <!-- Profile Header -->
    <v-card color="surface" rounded="lg" class="pa-5 mb-4 header-card">
      <div class="d-flex align-start" style="gap:20px">
        <v-avatar size="88" rounded="lg" color="primary">
          <span class="text-h3 font-weight-bold text-white">EY</span>
        </v-avatar>
        <div style="flex:1; min-width:0">
          <div class="text-h5 font-weight-bold mb-2">{{ student.profile.name }}</div>
          <div class="d-flex align-center flex-wrap mb-2" style="gap:10px">
            <v-chip size="x-small" variant="outlined" prepend-icon="mdi-identifier" class="id-chip">
              {{ student.profile.studentId }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">{{ student.profile.email }}</span>
          </div>
          <div class="d-flex align-center flex-wrap" style="gap:16px">
            <span class="meta-item"><v-icon size="13">mdi-gender-male-female</v-icon>{{ student.profile.gender }}</span>
            <span class="meta-item"><v-icon size="13">mdi-cake-variant-outline</v-icon>{{ student.profile.dateOfBirth }}</span>
            <span class="meta-item"><v-icon size="13">mdi-phone-outline</v-icon>{{ student.profile.contactNumber }}</span>
          </div>
        </div>
        <v-chip size="x-small" color="success" variant="flat" class="mt-1 status-chip">
          {{ student.profile.enrollmentStatus }}
        </v-chip>
      </div>
    </v-card>

    <v-row>
      <!-- Personal Info -->
      <v-col cols="12" md="6">
        <v-card color="surface" rounded="lg" class="pa-5 h-100 section-card">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="section-title">Personal Information</div>
            <v-btn
              v-if="!editMode"
              size="small"
              variant="text"
              color="primary"
              prepend-icon="mdi-pencil-outline"
              class="edit-btn"
              @click="editMode = true"
            >Edit</v-btn>
          </div>

          <!-- Display Mode -->
          <template v-if="!editMode">
            <div class="info-grid">
              <div class="info-field">
                <div class="field-label">Student Number</div>
                <div class="field-value">{{ student.profile.studentId }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">Full Name</div>
                <div class="field-value">{{ form.name }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">National ID</div>
                <div class="field-value">{{ student.profile.nationalId }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">Date of Birth</div>
                <div class="field-value">{{ student.profile.dateOfBirth }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">Gender</div>
                <div class="field-value">{{ student.profile.gender }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">Nationality</div>
                <div class="field-value">{{ student.profile.nationality }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">Contact Number</div>
                <div class="field-value">{{ form.contactNumber }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">Personal Email</div>
                <div class="field-value">{{ form.personalEmail }}</div>
              </div>
            </div>
            <v-divider class="my-4"></v-divider>
            <div class="info-grid">
              <div class="info-field" style="grid-column: 1 / -1">
                <div class="field-label">Physical Address</div>
                <div class="field-value">{{ form.address }}</div>
              </div>
              <div class="info-field" style="grid-column: 1 / -1">
                <div class="field-label">Emergency Contact</div>
                <div class="field-value">{{ form.emergencyContact }}</div>
              </div>
            </div>
          </template>

          <!-- Edit Mode -->
          <v-form v-else @submit.prevent="saveProfile">
            <v-row dense>
              <v-col cols="12">
                <v-text-field label="Full Name" v-model="form.name" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Student ID" :model-value="student.profile.studentId" variant="outlined" density="compact" readonly hint="Read-only" persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="National ID" :model-value="student.profile.nationalId" variant="outlined" density="compact" readonly hint="Read-only" persistent-hint></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Contact Number" v-model="form.contactNumber" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Personal Email" v-model="form.personalEmail" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Physical Address" v-model="form.address" variant="outlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Emergency Contact" v-model="form.emergencyContact" variant="outlined" density="compact"></v-text-field>
              </v-col>
            </v-row>
            <div class="d-flex justify-end mt-3" style="gap:8px">
              <v-btn variant="text" size="small" @click="cancelEdit">Cancel</v-btn>
              <v-btn color="primary" size="small" prepend-icon="mdi-content-save" type="submit">Save</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>

      <!-- Academic Info -->
      <v-col cols="12" md="6">
        <v-card color="surface" rounded="lg" class="pa-5 mb-4 section-card">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="section-title">Academic Information</div>
            <v-chip size="x-small" color="success" variant="flat" class="status-chip">{{ student.profile.enrollmentStatus }}</v-chip>
          </div>

          <div class="mb-4">
            <div class="text-body-2 font-weight-semibold text-primary mb-1">{{ student.profile.programme }}</div>
            <div class="text-caption text-medium-emphasis">{{ student.profile.faculty }}</div>
          </div>
          <v-divider class="mb-4"></v-divider>

          <div class="info-grid mb-4">
            <div class="info-field">
              <div class="field-label">Year of Study</div>
              <div class="field-value">Year {{ student.profile.year }}</div>
            </div>
            <div class="info-field">
              <div class="field-label">Current Semester</div>
              <div class="field-value">Semester {{ student.profile.semester }}</div>
            </div>
            <div class="info-field">
              <div class="field-label">Enrollment Date</div>
              <div class="field-value">{{ student.profile.enrollmentDate }}</div>
            </div>
            <div class="info-field">
              <div class="field-label">Advisor</div>
              <div class="field-value">{{ student.profile.advisor }}</div>
            </div>
            <div class="info-field" style="grid-column: 1 / -1">
              <div class="field-label">University Email</div>
              <div class="field-value">{{ student.profile.email }}</div>
            </div>
          </div>

          <div class="notice-box">
            <v-icon size="14" class="mr-1" style="opacity:0.5">mdi-lock-outline</v-icon>
            <span>Academic records are managed by the Registry. Contact <strong>registry@luct.ac.ls</strong> for changes.</span>
          </div>
        </v-card>

        <!-- Sponsorship -->
        <v-card color="surface" rounded="lg" class="pa-5 section-card">
          <div class="section-title mb-4">Sponsorship Information</div>
          <div class="sponsor-list">
            <div class="sponsor-row">
              <span class="field-label">Sponsor</span>
              <span class="field-value">{{ student.finance.sponsorship }}</span>
            </div>
            <div class="sponsor-row">
              <span class="field-label">Account Number</span>
              <span class="field-value">{{ student.finance.accountNumber }}</span>
            </div>
            <div class="sponsor-row">
              <span class="field-label">Currency</span>
              <span class="field-value">{{ student.finance.currency }}</span>
            </div>
          </div>
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

<style scoped>
.header-card { border: 1px solid rgba(255,255,255,0.07); }
.section-card { border: 1px solid rgba(255,255,255,0.06); }

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.3px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}

.id-chip { font-size: 11px !important; }

.status-chip {
  font-size: 10px !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.edit-btn { font-size: 12px !important; }

/* Info grid – 2-column label/value pairs */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;
}

.field-label {
  font-size: 10px;
  color: rgba(255,255,255,0.38);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 3px;
}

.field-value {
  font-size: 13px;
  color: rgba(255,255,255,0.87);
  font-weight: 400;
  word-break: break-word;
}

/* Sponsorship section – label left, value right */
.sponsor-list { display: flex; flex-direction: column; gap: 14px; }
.sponsor-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 10px;
}
.sponsor-row:last-child { border-bottom: none; padding-bottom: 0; }
.sponsor-row .field-label { font-size: 12px; color: rgba(255,255,255,0.45); }
.sponsor-row .field-value { font-size: 13px; color: rgba(255,255,255,0.87); }

/* Notice box */
.notice-box {
  display: flex;
  align-items: flex-start;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 10px 12px;
  line-height: 1.5;
}
</style>
