const {
	Service
} = require('uni-cloud-router')

module.exports = class CategoriesService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('opendb-mall-categories')
	}
	async list() {
		const {
			data: cateList
		} = await this.collection.orderBy('sort', 'asc').get()
		return cateList;
	}
	async update(categories) {
		return this.collection.doc(categories._id).update(categories.data)
	}
}
