const {
	Service
} = require('uni-cloud-router')


module.exports = class GoodsService extends Service {
	constructor(ctx) {
		super(ctx)
		this.collection = this.db.collection('opendb-mall-goods')
	}

	async add(goods) {
		return goods;
	}

	async update(goods) {
		return goods;
	}

	async delete(id) {
		return id;
	}

	async _getAll() {
		const {
			data
		} = await this.collection.orderBy('sort', 'asc').get()
		return data
	}
}
