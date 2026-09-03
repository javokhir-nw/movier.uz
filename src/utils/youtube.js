export function getYoutubeId(url) {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/)
    return match ? match[1] : null
}

export function getYoutubeEmbedUrl(url) {
    const id = getYoutubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&iv_load_policy=3` : null
}