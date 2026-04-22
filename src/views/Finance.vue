<template>
  <div>
    <!-- Stats Row -->
    <v-card class="section-card pa-4 mb-4" rounded="lg">
      <div class="stats-row">
        <div class="stat-item">
          <div class="field-label">Outstanding Balance</div>
          <div class="stat-val" style="color:#C84B5B">M{{ student.finance.outstandingBalance.toLocaleString() }}</div>
          <div class="stat-sub">Due {{ student.finance.pendingPayments[0].dueDate }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="field-label">Total Paid</div>
          <div class="stat-val" style="color:#3D9D5C">M{{ totalPaid.toLocaleString() }}</div>
          <div class="stat-sub">{{ student.finance.payments.length }} payments</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="field-label">Total Billed</div>
          <div class="stat-val">M{{ student.finance.tuitionTotal.toLocaleString() }}</div>
          <div class="stat-sub">{{ student.finance.sponsorship }} sponsorship</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="field-label">Account No</div>
          <div class="stat-val mono-lg">{{ student.finance.accountNumber }}</div>
          <div class="stat-sub">Student account</div>
        </div>
      </div>
    </v-card>

    <v-row>
      <!-- Fee Breakdown -->
      <v-col cols="12" md="4">
        <v-card class="section-card pa-4 h-100" rounded="lg">
          <div class="section-title mb-3">Fee Breakdown</div>
          <div
            v-for="item in student.finance.feeBreakdown"
            :key="item.description"
            class="fee-row"
            :class="{ 'fee-total-row': item.isTotal }"
          >
            <span :class="item.isTotal ? 'fee-total-label' : 'fee-label'">{{ item.description }}</span>
            <span :class="item.isTotal ? 'fee-total-val' : item.isDeduction ? 'fee-deduct' : 'fee-val'">
              {{ item.isDeduction ? '−' : '' }}M{{ Math.abs(item.amount).toLocaleString() }}
            </span>
          </div>
        </v-card>
      </v-col>

      <!-- Payment History -->
      <v-col cols="12" md="8">
        <v-card class="section-card pa-4 mb-4" rounded="lg">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="section-title">Payment History</div>
            <v-btn variant="text" size="small" style="font-size:11px; opacity:0.5">
              <v-icon size="14" class="mr-1">mdi-download</v-icon> Export PDF
            </v-btn>
          </div>
          <v-table density="compact">
            <thead>
              <tr>
                <th class="tbl-head">Date</th>
                <th class="tbl-head">Reference</th>
                <th class="tbl-head">Method</th>
                <th class="tbl-head text-right">Amount</th>
                <th class="tbl-head text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tx in student.finance.payments" :key="tx.reference" class="tbl-row">
                <td class="tbl-cell">{{ tx.date }}</td>
                <td class="tbl-cell mono">{{ tx.reference }}</td>
                <td class="tbl-cell">{{ tx.method }}</td>
                <td class="tbl-cell text-right" style="color:#3D9D5C; font-weight:600">M{{ tx.amount.toLocaleString() }}</td>
                <td class="tbl-cell text-center">
                  <span class="status-badge status-success">{{ tx.status }}</span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- Pending Payments -->
        <v-card class="section-card pa-4" rounded="lg">
          <div class="section-title mb-3">Pending / Overdue</div>
          <div
            v-for="p in student.finance.pendingPayments"
            :key="p.dueDate"
            class="pending-row"
          >
            <div class="d-flex align-center justify-space-between mb-1">
              <span class="field-value" style="font-weight:600">M{{ p.amount.toLocaleString() }}</span>
              <span class="status-badge status-warning">{{ p.status }}</span>
            </div>
            <div class="field-label">{{ p.description }}</div>
            <div class="field-label mt-1">Due: {{ p.dueDate }}</div>
          </div>
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

<style scoped>
.section-card { border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); }
.field-label { font-size: 10px; color: rgba(255,255,255,0.38); text-transform: uppercase; letter-spacing: 0.7px; }
.field-value { font-size: 13px; color: rgba(255,255,255,0.87); }

/* Stats row */
.stats-row { display: flex; align-items: stretch; }
.stat-item { flex: 1; padding: 4px 20px; }
.stat-item:first-child { padding-left: 4px; }
.stat-val { font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.9); margin: 4px 0 2px; }
.stat-sub { font-size: 11px; color: rgba(255,255,255,0.35); }
.stat-divider { width: 1px; background: rgba(255,255,255,0.07); flex-shrink: 0; margin: 4px 0; }
.mono-lg { font-family: 'Roboto Mono', monospace; font-size: 14px !important; }

/* Fee rows */
.fee-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.fee-row:last-of-type { border-bottom: none; }
.fee-total-row { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 4px; border-bottom: none; }
.fee-label { font-size: 12px; color: rgba(255,255,255,0.6); }
.fee-val { font-size: 12px; color: rgba(255,255,255,0.75); }
.fee-deduct { font-size: 12px; color: #3D9D5C; }
.fee-total-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.87); }
.fee-total-val { font-size: 13px; font-weight: 700; color: #C84B5B; }

/* Tables */
.tbl-head { font-size: 11px !important; color: rgba(255,255,255,0.38) !important; font-weight: 600 !important; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 12px !important; }
.tbl-row { border-bottom: 1px solid rgba(255,255,255,0.04) !important; }
.tbl-cell { font-size: 12px !important; color: rgba(255,255,255,0.75) !important; padding: 8px 12px !important; }
.mono { font-family: 'Roboto Mono', monospace; font-size: 11px !important; color: rgba(255,255,255,0.45) !important; }

/* Status badges */
.status-badge { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; }
.status-success { background: rgba(61,157,92,0.15); color: #3D9D5C; }
.status-warning { background: rgba(201,122,37,0.15); color: #C97A25; }
.status-error { background: rgba(200,75,91,0.15); color: #C84B5B; }

/* Pending rows */
.pending-row {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.pending-row:last-of-type { border-bottom: none; }
</style>
