/**
 * Google AdSense settings.
 *
 * 1. Put your publisher ID below (looks like "ca-pub-1234567890123456").
 * 2. In AdSense, create one responsive display ad unit per placement and paste each unit's slot ID.
 * 3. Rename public/ads.txt.example to public/ads.txt and put your pub ID in it.
 *
 * While `client` is empty no ad code is loaded at all.
 */
export const ADSENSE = {
  client: '',
  slots: {
    home: '',
    kidsLibrary: '',
    kidsComplete: '',
    adultsLibrary: '',
    adultsResults: '',
    howTo: '',
  },
};

export type AdPlacement = keyof typeof ADSENSE.slots;
export const adsEnabled = () => /^ca-pub-\d{10,}$/.test(ADSENSE.client);
