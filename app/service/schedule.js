'use strict';

const Service = require('egg').Service;
const axios = require('axios');

class ScheduleService extends Service {
  async bing() {
    const res = await axios.get(this.config.bing);
    return 'http://www.bing.com' + res.data.images[0].url;
  }
  async buffer(url) {
    const buffer = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return buffer.data.toString('base64');
  }
  async upload(base64, name) {
    const { config, service } = this;
    const time = service.tools.time();
    const res = await axios({
      headers: {
        Authorization: 'token ' + config.github.token,
      },
      method: 'put',
      url: config.github.reqBaseUrl + name,
      data: JSON.stringify({
        message: 'update image ' + time,
        content: base64,
      }),
    });
    return res.data.content.sha;
  }
  async poem() {
    const { config, service } = this;
    const res = await axios.get(config.hitokoto);
    const { hitokoto, type, from } = res.data;
    const result = await service.sql.insert({ table: 'poem', param: {
      poem: hitokoto,
      create_time: service.tools.time(),
      author: from,
      type_name: type,
    } });
    return result;
  }
  async baiduPush() {
    const { config, service } = this;
    const urls = [
      'https://997.dog/about',
      'https://997.dog/timeLine',
      'https://997.dog/gallery',
      'https://997.dog/imageZip',
    ];
    const ids = await service.sql.selectAll({ table: 'article', columns: [ 'id' ] });
    for (let i = 0; i < ids.length; i++) {
      urls.push('https://997.dog/detail/' + ids[i].id);
    }
    const data = urls.join('\n');
    const res = await axios({
      method: 'post',
      url: config.baiduPush,
      data,
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('成功推送条数: ' + res.data.success);
    return res.data;
  }
}

module.exports = ScheduleService;
