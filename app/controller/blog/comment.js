'use strict';

const Controller = require('../base_controller');

class CommentController extends Controller {
  async search() {
    const { service } = this;
    const total = await service.sql.selectCount('comment');
    const list = await service.sql.select({ table: 'comment', columns: [ 'id', 'article_id', 'comment', 'email', 'article_name', 'nick_name', 'parent_name', 'create_time', 'parent_id', 'browser_name', 'system_name', 'status' ], orders: [ 'create_time', 'desc' ] });
    this.success({ result: { total, list } });
  }
  async add() {
    const { service, ctx } = this;
    const param = { ...ctx.request.body };
    param.create_time = await service.tools.time();
    const result = service.sql.insert({ table: 'comment', param });
    this.success({ result, type: '添加' });
  }
  async edit() {
    const { service } = this;
    const result = await service.sql.update({ table: 'comment' });
    this.success({ result, type: '编辑' });
  }
  async delete() {
    const result = await this.service.sql.delete({ table: 'comment' });
    this.success({ result, type: '删除' });
  }
}

module.exports = CommentController;