<template>
  <div>
    <v-row>
      <!-- Submit Ticket -->
      <v-col cols="12" md="5">
        <v-card class="section-card pa-4 mb-4" rounded="lg">
          <div class="section-title mb-4">Submit a Support Ticket</div>
          <v-form @submit.prevent="submitTicket">
            <v-select
              v-model="form.category"
              label="Category"
              :items="['Finance', 'Registry', 'IT Support', 'Academic', 'Library', 'Other']"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-select>
            <v-select
              v-model="form.priority"
              label="Priority"
              :items="['Low', 'Medium', 'High']"
              variant="outlined"
              density="compact"
              class="mb-3"
            ></v-select>
            <v-text-field
              v-model="form.subject"
              label="Subject"
              variant="outlined"
              density="compact"
              class="mb-3"
              counter="100"
              maxlength="100"
            ></v-text-field>
            <v-textarea
              v-model="form.description"
              label="Description"
              variant="outlined"
              density="compact"
              rows="4"
              class="mb-3"
            ></v-textarea>
            <v-file-input
              v-model="form.attachment"
              label="Attachment (optional)"
              variant="outlined"
              density="compact"
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
              class="mb-4"
              accept="image/*,.pdf,.docx"
            ></v-file-input>
            <v-btn block color="primary" type="submit" :disabled="!form.subject || !form.category" size="small">
              Submit Ticket
            </v-btn>
          </v-form>
        </v-card>

        <!-- FAQ -->
        <v-card class="section-card pa-4" rounded="lg">
          <div class="section-title mb-3">Quick Help</div>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="faq in faqs" :key="faq.q" bg-color="transparent" rounded="lg">
              <v-expansion-panel-title style="font-size:12px; color:rgba(255,255,255,0.65)">{{ faq.q }}</v-expansion-panel-title>
              <v-expansion-panel-text style="font-size:12px; color:rgba(255,255,255,0.4)">{{ faq.a }}</v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>

      <!-- My Tickets -->
      <v-col cols="12" md="7">
        <v-card class="section-card pa-4 mb-4" rounded="lg">
          <div class="section-title mb-3">My Tickets</div>

          <div
            v-for="ticket in allTickets"
            :key="ticket.id"
            class="ticket-row"
          >
            <div class="d-flex align-start justify-space-between flex-wrap" style="gap:8px">
              <div class="flex-grow-1">
                <div class="ticket-subject">{{ ticket.subject }}</div>
                <div class="field-label mt-1">{{ ticket.id }} &bull; {{ ticket.category }} &bull; {{ ticket.createdDate }}</div>
                <div class="ticket-desc mt-1">{{ ticket.description }}</div>
              </div>
              <div class="text-right" style="flex-shrink:0">
                <span class="status-badge" :class="statusClass(ticket.status)">{{ ticket.status }}</span>
                <div class="field-label mt-2">Updated: {{ ticket.lastUpdated }}</div>
              </div>
            </div>
            <div class="d-flex justify-end mt-2" style="gap:4px">
              <v-btn size="x-small" variant="text" color="primary" style="font-size:11px">View Details</v-btn>
              <v-btn v-if="ticket.status !== 'Resolved'" size="x-small" variant="text" style="font-size:11px; opacity:0.6">Add Comment</v-btn>
            </div>
          </div>
        </v-card>

        <!-- Direct Contacts -->
        <v-card class="section-card pa-4" rounded="lg">
          <div class="section-title mb-3">Direct Contacts</div>
          <v-row dense>
            <v-col v-for="dept in departments" :key="dept.name" cols="12" sm="6">
              <div class="dept-row">
                <v-icon :color="dept.color" size="16" class="mr-2" style="flex-shrink:0">{{ dept.icon }}</v-icon>
                <div>
                  <div class="dept-name">{{ dept.name }}</div>
                  <div class="field-label">{{ dept.email }}</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snack" color="success" timeout="3000" location="bottom right">
      Ticket submitted! Reference: TKT-2026-{{ newTicketNum }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import student from '../data/studentData';

const snack = ref(false);
const newTicketNum = ref(19);
const allTickets = ref([...student.supportTickets]);

const form = ref({ category: '', priority: 'Medium', subject: '', description: '', attachment: null });

const statusClass = (s) => ({ 'In Progress': 'status-warning', 'Resolved': 'status-success', 'Open': 'status-info' })[s] ?? '';

const submitTicket = () => {
  allTickets.value.unshift({
    id: 'TKT-2026-' + (newTicketNum.value++),
    subject: form.value.subject,
    category: form.value.category,
    status: 'Open',
    priority: form.value.priority,
    createdDate: new Date().toISOString().slice(0,10),
    lastUpdated: new Date().toISOString().slice(0,10),
    description: form.value.description,
  });
  form.value = { category: '', priority: 'Medium', subject: '', description: '', attachment: null };
  snack.value = true;
};

const faqs = [
  { q: 'How do I get my official transcript?', a: 'Submit a request to registry@luct.ac.ls or visit the Registry office with your student ID.' },
  { q: 'When will my exam results be published?', a: 'Results are typically published 4 weeks after the final examination period ends.' },
  { q: 'How do I reset my Moodle password?', a: 'Visit the IT Support desk or email itsupport@luct.ac.ls with your student ID.' },
];

const departments = [
  { name: 'Finance',    email: 'finance@luct.ac.ls',      icon: 'mdi-cash-multiple', color: 'success' },
  { name: 'Registry',  email: 'registry@luct.ac.ls',     icon: 'mdi-file-document',  color: 'primary' },
  { name: 'IT Support',email: 'itsupport@luct.ac.ls',    icon: 'mdi-laptop',         color: 'info' },
  { name: 'Academic',  email: 'academic@luct.ac.ls',     icon: 'mdi-school',         color: 'warning' },
];
</script>

<style scoped>
.section-card  { border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label   { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }

/* Ticket rows */
.ticket-row {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.ticket-row:last-of-type { border-bottom: none; }
.ticket-subject { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.87); }
.ticket-desc    { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.4; }

/* Status badges */
.status-badge { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; }
.status-success { background: rgba(61,157,92,0.15);  color: #3D9D5C; }
.status-warning { background: rgba(201,122,37,0.15); color: #C97A25; }
.status-info    { background: rgba(91,143,212,0.15); color: #5B8FD4; }

/* Dept rows */
.dept-row {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.dept-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.75); }
</style>
