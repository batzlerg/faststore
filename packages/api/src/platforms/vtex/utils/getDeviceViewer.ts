export const determineDeviceType = (ogRequestHeaders: Headers) => {
    const desktopViewer = ogRequestHeaders.get('cloudfront-is-desktop-viewer');
    const mobileViewer = ogRequestHeaders.get('cloudfront-is-mobile-viewer');
    const smartTVViewer = ogRequestHeaders.get('cloudfront-is-smarttv-viewer');
    const tabletViewer = ogRequestHeaders.get('cloudfront-is-tablet-viewer');

    if (desktopViewer === 'true') {
        return 'Desktop';
    } else if (mobileViewer === 'true') {
        return 'Mobile';
    } else if (smartTVViewer === 'true') {
        return 'Smart TV';
    } else if (tabletViewer === 'true') {
        return 'Tablet';
    } else {
        return 'Unknown Device';
    }
};