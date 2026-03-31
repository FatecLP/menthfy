import {
    verifyDashboardAuthentication,
    initializeDashboardLayout
} from '../utils/dashboardAuth.js';

document.addEventListener('DOMContentLoaded', function () {
    if (verifyDashboardAuthentication()) {
        initializeDashboardLayout();
    }
});