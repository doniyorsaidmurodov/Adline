export class Ads {
  campaignName: string;
  groupName: string;
  clickRate: number;
  clicks: number;
  id: number;
  impressions: number;

  constructor(object) {
    this.campaignName = object.campaignName;
    this.groupName = object.groupName;
    this.clickRate = object.clickRate;
    this.clicks = object.clicks;
    this.id = object.id;
    this.impressions = object.impressions;
  }
}
