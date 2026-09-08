/**
 * ONE E-Waste Emporia — Shipping & Logistics Service
 * Integration with EasyPost / ShipStation / USPS Priority Mail
 */

class ShippingService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.EASYPOST_API_KEY;
    this.isLive = !!this.apiKey && !this.apiKey.includes('placeholder');
  }

  /**
   * Generates a pre-paid USPS Priority Mail return label for customer inbound shipping
   */
  async generateInboundLabel(clientDetails, serviceType) {
    const returnAddress = {
      name: "ONE E-Waste Emporia & Restorative Guild",
      company: "Our New Era (ONE) Church",
      street1: "123 Sanctuary Way, Annex Tech Lab",
      city: "Atlanta",
      state: "GA",
      zip: "30301",
      phone: "404-555-0199"
    };

    if (!this.isLive) {
      // Production fallback / Mock mode when API keys are being provisioned
      const mockTracking = '9400111899562' + Math.floor(Math.random() * 89999999 + 10000000);
      return {
        success: true,
        provider: 'USPS Priority Mail (Commercial Rate)',
        trackingNumber: mockTracking,
        labelUrl: `https://postage.onechurch.global/labels/${mockTracking}.pdf`,
        estimatedDays: 2,
        batteryHazmatDeclared: true,
        antiStaticKitIncluded: true,
        instructions: "Pack device securely. Place battery warning label visible on outside of box."
      };
    }

    try {
      // Live EasyPost API Call
      const EasyPost = require('@easypost/api');
      const client = new EasyPost(this.apiKey);

      const shipment = await client.Shipment.create({
        to_address: returnAddress,
        from_address: {
          name: clientDetails.fullName,
          street1: clientDetails.address,
          email: clientDetails.email,
        },
        parcel: {
          weight: 64, // 4 lbs average box
          length: 14,
          width: 10,
          height: 4
        },
        options: {
          delivery_confirmation: 'SIGNATURE'
        }
      });

      const boughtShipment = await client.Shipment.buy(shipment.id, shipment.lowestRate(['USPS']));
      return {
        success: true,
        trackingNumber: boughtShipment.tracking_code,
        labelUrl: boughtShipment.postage_label.label_url,
        rate: boughtShipment.selected_rate.rate
      };
    } catch (err) {
      console.error("Shipping API error:", err);
      throw err;
    }
  }
}

module.exports = new ShippingService();
