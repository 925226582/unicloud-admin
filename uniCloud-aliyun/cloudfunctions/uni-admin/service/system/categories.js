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

	async search(categories) {
		const {
			data: cateList
		} = await this.collection.where({
			name:new RegExp('/'+categories.data+'/')
		}).orderBy('sort', 'asc').get();
		return cateList;
	}

	async update(categories) {
		//特殊参数  代表更改switch
		if (categories.distinctive) {
			return this.collection.doc(categories._id).update(categories.data)
		}
		return this.collection.doc(categories._id).set(categories.data)
	}
	async add(categories) {
		return this.collection.add(categories)
	}
	async delete(id) {
		if (!id) {
			this.throw('未指定要删除的类别')
		}
		const catelist = await this._getAll();

		const cate = catelist.find(item => item._id === id)
		if (!cate) {
			this.throw('要删除的类别不存在')
		}

		let ids = await this._resetid(id, catelist);
		return this.collection.where({
			_id: this.db.command.in(ids)
		}).remove()
	}
	async _getAll() {
		const {
			data
		} = await this.collection.orderBy('sort', 'asc').get()
		return data
	}
	async _resetid(id, catelist, idarr = []) {
		//判断是否有子类别
		const cates = catelist.filter(item => item.parent_id === id);
		if (cates.length > 0) {
			cates.forEach(v => {
				this._resetid(v._id, catelist, idarr)
			})
		}
		idarr.push(id)
		return idarr;
	}

}
