/**
 * ONE E-Waste Emporia — Certificate & Tax Receipt Engine
 * Generates NIST SP 800-88 Sanitization Certificates and 501(c)(3) Tax Contribution Receipts
 */

const crypto = require('crypto');

class CertificateEngine {
  /**
   * Generates a verifiable NIST SP 800-88 Data Sanitization Certificate payload
   */
  generateSanitizationCertificate(workOrder, technicianName) {
    const timestamp = new Date().toISOString();
    const payload = `${workOrder.id}-${workOrder.deviceSerial || 'NOSERIAL'}-${timestamp}`;
    const sha256 = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      certificateId: 'CERT-NIST-' + sha256.substring(0, 10).toUpperCase(),
      type: 'NIST_SP_800_88_REV1',
      workOrderId: workOrder.id,
      clientName: workOrder.client?.fullName || 'Client',
      deviceModel: workOrder.deviceModel || 'Client Hardware',
      sanitizationMethod: 'CRYPTOGRAPHIC_ERASURE_PURGE',
      technician: technicianName || 'Apprentice Technician',
      verificationHash: sha256,
      issuedAt: timestamp,
      viewUrl: `/certificate.html?id=${workOrder.id}&type=sanitization&hash=${sha256}`
    };
  }

  /**
   * Generates an official 501(c)(3) Charitable Contribution Tax Receipt
   */
  generateTaxReceipt(workOrder, estimatedValueCents) {
    const timestamp = new Date().toISOString();
    const payload = `TAX-${workOrder.id}-${estimatedValueCents}-${timestamp}`;
    const sha256 = crypto.createHash('sha256').update(payload).digest('hex');

    return {
      receiptId: 'TAX-501C3-' + sha256.substring(0, 10).toUpperCase(),
      workOrderId: workOrder.id,
      donorName: workOrder.client?.fullName || 'Donor',
      organization: "Our New Era (ONE) Church",
      taxStatus: "501(c)(3) Non-Profit",
      estimatedValue: `$${(estimatedValueCents / 100).toFixed(2)} USD`,
      donationCategory: "Technology Equipment & Vocational Guild Grant",
      issuedAt: timestamp,
      viewUrl: `/certificate.html?id=${workOrder.id}&type=tax_receipt&hash=${sha256}`
    };
  }
}

module.exports = new CertificateEngine();
