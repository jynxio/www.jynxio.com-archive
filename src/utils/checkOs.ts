function checkOs() {
    let os: 'Windows' | 'macOS' | 'Unknown';

    const navigator = globalThis.navigator as any;

    // For Chromium
    if (navigator.userAgentData) {
        os = navigator.userAgentData.platform;

        return os;
    }

    // For other
    os = navigator.userAgent.includes('Win')
        ? 'Windows'
        : navigator.userAgent.includes('Mac')
        ? 'macOS'
        : 'Unknown';

    return os;
}

export default checkOs;
