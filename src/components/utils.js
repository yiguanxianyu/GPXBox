export function formatSecond(time) {
    time = time / 1000;
    const h = parseInt(time / 3600);
    const minute = parseInt(time / 60 % 60);
    const second = Math.ceil(time % 60);

    const hours = h < 10 ? '0' + h : h;
    const formatSecond = second > 59 ? 59 : second;
    return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`;
}

export function formatDistance(dist) {
    if (dist >= 10000)
        return (dist * 0.001).toFixed(2) + 'km';
    else
        return dist.toFixed(1) + 'm';
}