const STAGES = [
  { key: 'draft', label: 'Draft Kontrak', lane: 'commercial' },
  { key: 'reported_by_sales', label: 'Report Contract dari Sales', lane: 'commercial' },
  { key: 'ops_notified', label: 'Operational Menerima Notif Contract', lane: 'ops' },
  { key: 'ops_feasibility_submitted', label: 'Ajukan Feasibility Operational', lane: 'ops' },
  { key: 'finance_notified', label: 'Finance Menerima Notif Contract', lane: 'finance' },
  { key: 'finance_approved', label: 'Finance Setujui Contract dan Harga', lane: 'finance' },
  { key: 'unit_prepared', label: 'Persiapkan Unit Armada Sesuai Contract', lane: 'ops' },
  { key: 'handover_reported', label: 'Report Serah Terima Unit', lane: 'ops' },
  { key: 'contract_activated', label: 'Aktivasi Contract', lane: 'ops' },
  { key: 'service_monitoring', label: 'Monitoring Kondisi Unit dan Layanan', lane: 'ops' },
  { key: 'maintenance', label: 'Pelaksanaan Maintenance', lane: 'ops' },
  { key: 'replacement_ready', label: 'Penyediaan Unit Pengganti', lane: 'ops' },
  { key: 'monthly_billing', label: 'Melakukan Billing Bulanan', lane: 'finance' },
  { key: 'payment_monitoring', label: 'Monitoring Pembayaran Aktif', lane: 'finance' },
  { key: 'payment_escalated', label: 'Eskalasi Issue Pembayaran ke Commercial', lane: 'finance' },
  { key: 'contract_term_monitoring', label: 'Monitoring Masa Kontrak', lane: 'commercial' },
  { key: 'renewal_process', label: 'Proses Renewal Kontrak', lane: 'commercial' },
  { key: 'completed', label: 'Selesai', lane: 'commercial' }
];

const STAGE_BY_KEY = Object.fromEntries(STAGES.map((stage) => [stage.key, stage]));

const LEGACY_STATUS_MAP = {
  feasible_checked: 'ops_feasibility_submitted',
  approved: 'finance_approved',
  active: 'contract_activated',
  pending: 'reported_by_sales'
};

const ACTIONS = {
  report_contract: { label: 'Report Contract', role: 'commercial', from: 'draft', to: 'reported_by_sales' },
  receive_sales_contract_ops: { label: 'Terima Notif Contract', role: 'ops', from: 'reported_by_sales', to: 'ops_notified' },
  submit_feasibility: { label: 'Ajukan Feasibility', role: 'ops', from: 'ops_notified', to: 'ops_feasibility_submitted' },
  receive_sales_contract_finance: { label: 'Terima Notif Contract', role: 'finance', from: 'ops_feasibility_submitted', to: 'finance_notified' },
  approve_contract_price: { label: 'Setujui Contract & Harga', role: 'finance', from: 'finance_notified', to: 'finance_approved' },
  prepare_unit: { label: 'Persiapkan Unit', role: 'ops', from: 'finance_approved', to: 'unit_prepared' },
  report_handover: { label: 'Report Serah Terima', role: 'ops', from: 'unit_prepared', to: 'handover_reported' },
  activate_contract: { label: 'Aktivasi Contract', role: 'ops', from: 'handover_reported', to: 'contract_activated' },
  monitor_unit_service: { label: 'Monitoring Unit & Layanan', role: 'ops', from: 'contract_activated', to: 'service_monitoring' },
  perform_maintenance: { label: 'Pelaksanaan Maintenance', role: 'ops', from: 'service_monitoring', to: 'maintenance' },
  provide_replacement_unit: { label: 'Sediakan Unit Pengganti', role: 'ops', from: 'maintenance', to: 'replacement_ready' },
  do_monthly_billing: { label: 'Billing Bulanan', role: 'finance', from: 'replacement_ready', to: 'monthly_billing' },
  monitor_payment: { label: 'Monitoring Pembayaran', role: 'finance', from: 'monthly_billing', to: 'payment_monitoring' },
  escalate_payment_issue: { label: 'Eskalasi ke Commercial', role: 'finance', from: 'payment_monitoring', to: 'payment_escalated' },
  monitor_contract_term: { label: 'Monitoring Masa Kontrak', role: 'commercial', from: 'payment_escalated', to: 'contract_term_monitoring' },
  process_renewal: { label: 'Proses Renewal', role: 'commercial', from: 'contract_term_monitoring', to: 'renewal_process' },
  complete_contract: { label: 'Tandai Selesai', role: 'commercial', from: 'renewal_process', to: 'completed' }
};

function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase();
  const aliases = {
    operational: 'ops',
    'operational lead': 'ops',
    operation: 'ops',
    sales: 'commercial',
    'commercial / sales': 'commercial',
    'super admin': 'super_admin',
    superadmin: 'super_admin',
    admin: 'super_admin'
  };
  return aliases[value] || value;
}

function getStage(key) {
  const normalized = LEGACY_STATUS_MAP[key] || key;
  return STAGE_BY_KEY[normalized] || STAGE_BY_KEY.draft;
}

function getActionForStatus(status) {
  const normalized = LEGACY_STATUS_MAP[status] || status;
  return Object.entries(ACTIONS).find(([, action]) => action.from === normalized) || null;
}

function getAllowedAction(status, role) {
  const pair = getActionForStatus(status);
  if (!pair) return null;
  const [actionKey, action] = pair;
  if (normalizeRole(role) !== action.role) return null;
  return { actionKey, ...action };
}

module.exports = {
  STAGES,
  ACTIONS,
  normalizeRole,
  getStage,
  getAllowedAction
};
