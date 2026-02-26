class MediaHelper {
  static extractYoutubeId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  static convertYoutubeToEmbed(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
  }

  static getYoutubeThumbnail(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }

    return null;
  }
}

module.exports = MediaHelper;
