const {
    Controller
} = require('uni-cloud-router')
module.exports = class CategoriesController extends Controller {
    constructor(ctx) {
        super(ctx)
        this.categoriesService = this.service.system.categories
    }
    async list() {
        return this.categoriesService.list()
    }
    async add() {
        return this.categoriesService.add(this.ctx.data)
    }
    async update() {
        return this.categoriesService.update(this.ctx.data)
    }
    async delete() {
        return this.categoriesService.delete(this.ctx.data.id)
    }
}
