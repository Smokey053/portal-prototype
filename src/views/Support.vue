<template>
  <div>
    <v-row>
      <!-- Submit Ticket -->
      <v-col cols="12" md="5">
        <v-card color="surface" rounded="xl" class="pa-5">
          <div class="text-subtitle-1 font-weight-bold mb-4 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-ticket-outline</v-icon>
            Submit a Support Ticket
          </div>
          <v-form @submit.prevent="submitTicket">
            <v-select
              v-model="form.category"
              label="Category"
              :items="['Finance', 'Registry', 'IT Support', 'Academic', 'Library', 'Other']"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-tag"
              class="mb-3"
            ></v-select>
            <v-select
              v-model="form.priority"
              label="Priority"
              :items="['Low', 'Medium', 'High']"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-flag"
              class="mb-3"
            ></v-select>
            <v-text-field
              v-model="form.subject"
              label="Subject"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-text-short"
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
              prepend-inner-icon="mdi-text"
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
            <v-btn block color="primary" prepend-icon="mdi-send" type="submit" :disabled="!form.subject || !form.category">
              Submit Ticket
            </v-btn>
          </v-form>
        </v-card>

        <!-- FAQ -->
        <v-card color="surface" rounded="xl" class="pa-4 mt-4">
          <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="secondary" class="mr-2" size="18">mdi-help-circle</v-icon>
            Quick Help
          </div>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="faq in faqs" :key="faq.q" bg-color="transparent" rounded="lg">
              <v-expansion-panel-title class="text-caption">{{ faq.q }}</v-expansion-panel-title>
              <v-expansion-panel-text class="text-caption text-medium-emphasis">{{ faq.a }}</v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>

      <!-- My Tickets -->
      <v-col cols="12" md="7">
        <v-card color="surface" rounded="xl" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="warning" class="mr-2">mdi-ticket-confirmation</v-icon>
            My Tickets
          </div>

          <v-card
            v-for="ticket in allTickets"
            :key="ticket.id"
            variant="tonal"
            :color="statusColor(ticket.status)"
            rounded="xl"
            class="pa-4 mb-3"
          >
            <div class="d-flex align-start justify-space-between flex-wrap gap-2">
              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-bold">{{ ticket.subject }}</div>
                <div class="text-caption text-grey mt-1">{{ ticket.id }} &bull; {{ ticket.category }} &bull; {{ ticket.createdDate }}</div>
                <div class="text-caption mt-1">{{ ticket.description }}</div>
              </div>
              <div class="text-right">
                <v-chip size="x-small" :color="statusColor(ticket.status)" variant="elevated">{{ ticket.status }}</v-chip>
                <div class="text-caption text-grey mt-1">Updated: {{ ticket.lastUpdated }}</div>
              </div>
            </div>
            <div class="d-flex justify-end mt-2">
              <v-btn size="x-small" variant="text" color="primary" prepend-icon="mdi-eye">View Details</v-btn>
              <v-btn v-if="ticket.status !== 'Resolved'" size="x-small" variant="text" color="warning" prepend-icon="mdi-comment">Add Comment</v-btn>
            </div>
          </v-card>
        </v-card>

        <!-- Contact Info -->
        <v-card color="surface" rounded="xl" class="pa-4 mt-4">
          <div class="text-subtitle-2 font-weight-bold mb-3">Direct Contacts</div>
          <v-row dense>
            <v-col v-for="dept in departments" :key="dept.name" cols="12" sm="6">
              <div class="d-flex align-center pa-3 rounded-lg" style="background:rgba(255,255,255,0.03)">
                <v-icon :color="dept.color" class="mr-3" size="20">{{ dept.icon }}</v-icon>
                <div>
                  <div class="text-caption font-weight-bold">{{ dept.name }}</div>
                  <div class="text-caption text-grey">{{ dept.email }}</div>
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

const statusColor = (s) => ({ 'In Progress': 'warning', 'Resolved': 'success', 'Open': 'info' })[s] ?? 'grey';

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
