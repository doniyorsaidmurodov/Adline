export class Campaign {
  id: string;
  name: string;
  campaignId: string;
  clicks: number;
  impressions: number;
  clickRate: number;
  views: number;
  viewRate: number;
  status: string;


  constructor(object, platformPage: boolean = false) {
    // this.status = null;
    if (object.groupId) {
      this.id = object.groupId;
    } else {
      this.id = object.id;
    }

    // for page /platforms, there is another response
    if (platformPage) {
      this.name = object.groupName;
      this.campaignId = object.campaignName;
    } else {
      this.name = object.name;
      this.campaignId = object.campaignId;
    }

    // for page /campaigns to take enabled or not status
    // if (object.status) {
    //   this.status = object.status === 'ENABLED';
    // }
    this.status = object.status;
    this.clicks = object.clicks;
    this.impressions = object.impressions;
    this.clickRate = object.clickRate;

    if (object.views) {
      this.views = object.views;
    } else {
      this.views = 0;
    }

    if (object.viewRate) {
      this.viewRate = object.viewRate;
    } else {
      this.viewRate = 0;
    }

  }
}
