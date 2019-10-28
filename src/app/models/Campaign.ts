export class Campaign {
  id: string;
  name: string;
  campaignId: string;
  clicks: number;
  impressions: number;
  clickRate: number;
  status: boolean;


  constructor(object, platformPage: boolean = false) {
    this.status = null;
    this.id = object.id;

    // for page /platforms, there is another response
    if (platformPage) {
      this.name = object.groupName;
      this.campaignId = object.campaignName;
    } else {
      this.name = object.name;
      this.campaignId = object.campaignId;
    }

    // for page /campaigns to take enabled or not status
    if (object.status) {
      this.status = object.status === 'enabled';
    }
    this.clicks = object.clicks;
    this.impressions = object.impressions;
    this.clickRate = object.clickRate;
  }
}
