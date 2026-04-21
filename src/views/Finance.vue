<template>
  <div>
    <!-- Balance Overview Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card color="error" variant="tonal" rounded="xl" class="pa-4 text-center">
          <v-icon size="32" class="mb-1">mdi-alert-circle</v-icon>
          <div class="text-caption text-medium-emphasis">OUTSTANDING BALANCE</div>
          <div class="text-h4 font-weight-bold mt-1">M{{ student.finance.outstandingBalance.toLocaleString() }}</div>
          <div class="text-caption">Due {{ student.finance.pendingPayments[0].dueDate }}</div>
          <v-btn color="error" variant="elevated" prepend-icon="mdi-credit-card" size="small" class="mt-3">Make Payment</v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="success" variant="tonal" rounded="xl" class="pa-4 text-center">
          <v-icon size="32" class="mb-1">mdi-check-circle</v-icon>
          <div class="text-caption text-medium-emphasis">TOTAL PAID</div>
          <div class="text-h4 font-weight-bold mt-1">M{{ totalPaid.toLocaleString() }}</div>
          <div class="text-caption">{{ student.finance.payments.length }} payments</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="primary" variant="tonal" rounded="xl" class="pa-4 text-center">
          <v-icon size="32" class="mb-1">mdi-cash-register</v-icon>
          <div class="text-caption text-medium-emphasis">TOTAL BILLED</div>
          <div class="text-h4 font-weight-bold mt-1">M{{ student.finance.tuitionTotal.toLocaleString() }}</div>
          <div class="text-caption">{{ student.finance.sponsorship }} sponsorship</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Fee Breakdown -->
      <v-col cols="12" md="4">
        <v-card color="surface" rounded="xl" class="pa-4 h-100">
          <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-receipt</v-icon>
            Fee Breakdown
          </div>
          <v-list density="compact">
            <v-list-item
              v-for="item in student.finance.feeBreakdown"
              :key="item.description"
              class="px-0"
            >
              <template v-slot:title>
                <span :class="[item.isTotal ? 'text-error font-weight-bold' : item.bold ? 'font-weight-bold' : 'text-medium-emphasis', 'text-body-2']">{{ item.description }}</span>
              </template>
              <template v-slot:append>
                <span :class="[item.isTotal ? 'text-error font-weight-bold' : item.isDeduction ? 'text-success' : '', 'text-body-2']">M{{ Math.abs(item.amount).toLocaleString() }}</span>
              </template>
            </v-list-item>
          </v-list>
          <v-divider class="my-3"></v-divider>
          <div class="text-caption text-grey">
            Account No: {{ student.finance.accountNumber }}
          </div>
        </v-card>
      </v-col>

      <!-- Payment History -->
      <v-col cols="12" md="8">
        <v-card color="surface" rounded="xl" class="pa-4">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-subtitle-1 font-weight-bold d-flex align-center">
              <v-icon color="secondary" class="mr-2">mdi-history</v-icon>
              Payment History
            </div>
            <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-download">Export PDF</v-btn>
          </div>

          <v-table density="compact" hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Method</th>
                <th class="text-right">Amount</th>
                <th class="text-center">Status</th>
                <th class="text-center">Receipt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in student.finance.payments" :key="tx.reference">
                <td class="text-caption">{{ tx.date }}</td>
                <td class="text-caption font-weight-medium">{{ tx.reference }}</td>
                <td class="text-caption">{{ tx.method }}</td>
                <td class="text-right text-caption font-weight-bold text-success">M{{ tx.amount.toLocaleString() }}</td>
                <td class="text-center">
                  <v-chip size="x-small" color="success" variant="tonal">{{ tx.status }}</v-chip>
                </td>
                <td class="text-center">
                  <v-btn icon="mdi-file-pdf-box" size="x-small" variant="text" color="primary"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Pending Payments -->
          <div class="text-subtitle-2 font-weight-bold mt-5 mb-3 d-flex align-center">
            <v-icon color="warning" class="mr-2" size="18">mdi-clock-alert</v-icon>
            Pending / Overdue
          </div>
          <v-alert
            v-for="p in student.finance.pendingPayments"
            :key="p.dueDate"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-2 rounded-lg"
            border="start"
          >
            <strong>M{{ p.amount.toLocaleString() }}</strong> — {{ p.description }}
            <div class="text-caption mt-1">Due: {{ p.dueDate }} &bull; Status: {{ p.status }}</div>
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import student from '../data/studentData';

const totalPaid = computed(() => student.finance.payments.reduce((sum, p) => sum + p.amount, 0));
</script>
