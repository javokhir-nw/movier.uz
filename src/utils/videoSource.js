export function getVideoType(url) {
    if (!url) return null
    if (url.includes('youtu.be') || url.includes('youtube.com')) return 'youtube'
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return 'direct'
    return 'unknown'
}