import nconf from 'nconf-getter'
const mapStyleConfig = nconf.get().mapStyle

function StyleLaundry(style) {
  let rawStyle = JSON.stringify(style)
  return JSON.parse(rawStyle
    .replace(/\{locale\}/g, window.getLang().code)
    .replace('"{tileserver_base}"', mapStyleConfig.baseMapUrl)
    .replace('"{tileserver_poi}"', mapStyleConfig.poiMapUrl)
    .replace('{spriteserver}', mapStyleConfig.spritesUrl)
    .replace('{fontserver}', mapStyleConfig.fontUrl))
}

export default StyleLaundry