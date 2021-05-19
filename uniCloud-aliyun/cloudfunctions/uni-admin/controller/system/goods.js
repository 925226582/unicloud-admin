const {
    Controller
} = require('uni-cloud-router')
module.exports = class GoodsController extends Controller {
    constructor(ctx) {
        super(ctx)
        this.goodsService = this.service.system.goods
    }
    async add() {
        return this.goodsService.add(this.ctx.data)
    }
    async update() {
        return this.goodsService.update(this.ctx.data)
    }
    async delete() {
        return this.goodsService.delete(this.ctx.data.id)
    }
}
