<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="parent_id" label="">
				<uni-easyinput placeholder="父ID，用于多级分类" v-model="formData.parent_id" />
			</uni-forms-item>
			<uni-forms-item name="icon" label="类别图标">
				<uni-file-picker v-model="formData.icon" fileMediatype="image" mode="grid" :limit="1"
					return-type="object" disable-preview :auto-upload="false" file-extname="png,jpg" ref="iconupload"
					@select="iconselect" @success="iconsuccess" @fail="iconfail" @progress="iconprogress">
					<!-- <image src="../../static/icon/jia.png" mode="aspectFit" style="width:150rpx;height:150rpx"></image> -->
				</uni-file-picker>
			</uni-forms-item>
			<uni-forms-item name="sort" label="排序">
				<uni-easyinput placeholder="类别排序，越大越靠后" type="number" v-model="formData.sort" />
			</uni-forms-item>
			<uni-forms-item name="description" label="类别描述">
				<uni-easyinput placeholder="类别描述" v-model="formData.description" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="is_hot_show" label="加入热门显示">
				<switch @change="binddata('is_hot_show', $event.detail.value)" :checked="formData.is_hot_show" />
			</uni-forms-item>
			<uni-forms-item name="is_index_show" label="首页显示">
				<switch @change="binddata('is_index_show', $event.detail.value)" :checked="formData.is_index_show" />
			</uni-forms-item>
			<uni-forms-item name="status" label="是否发布">
				<switch @change="binddata('status', $event.detail.value)" :checked="formData.status" />
			</uni-forms-item>
			<uni-forms-item name="create_date" label="">
				<uni-datetime-picker return-type="timestamp" :value="formData.create_date" />
			</uni-forms-item>

			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/opendb-mall-categories.js';

	const db = uniCloud.database();
	const dbCollectionName = 'opendb-mall-categories';

	function getValidator(fields) {
		let reuslt = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				reuslt[key] = validator[key]
			}
		}
		return reuslt
	}

	export default {
		data() {
			return {
				formData: {
					"parent_id": "",
					"name": "",
					"icon": null,
					"sort": null,
					"description": "",
					"is_hot_show": null,
					"is_index_show": null,
					"status": true,
					"create_date": null
				},
				formOptions: {},
				rules: {
					...getValidator(["parent_id", "name", "icon", "sort", "description", "is_hot_show", "is_index_show",
						"status", "create_date"
					])
				}
			}
		},
		onLoad(e) {
			const id = e.id
			this.formDataId = id
			this.getDetail(id)
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			// 图标上传相关
			// 获取上传状态
			iconselect(e) {
				let _size = e.tempFiles[0].size;
				//判断尺寸，小于50kb
				if (_size > 1024 * 50) {
					uni.showToast({
						image: '/static/icon/error.png',
						title: '选择的文件要小于50KB！',
						duration: 2000
					});
					return;
				}
				this.$refs.iconupload.upload();
			},
			// 获取上传进度
			iconprogress(e) {
				console.log('上传进度：', e)
			},
			// 上传成功
			iconsuccess(e) {
			},
			// 上传失败
			iconfail(e) {
				console.log('上传失败：', e)
			},
			/**
			 * 触发表单提交
			 */
			submit() {
				uni.showLoading({
					mask: true
				})
				this.$refs.form.submit().then((res) => {
					this.submitForm(res)
				}).catch((errors) => {
					uni.hideLoading()
				})
			},

			submitForm(value) {
				// 使用 clientDB 提交数据
				this.$request('system/categories/update', Object.assign({
					_id: this.formDataId,
					data:value
				}, value)).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).finally(() => {
					uni.hideLoading()
				})
				
			},

			/**
			 * 获取表单数据
			 * @param {Object} id
			 */
			getDetail(id) {
				uni.showLoading({
					mask: true
				})
				db.collection(dbCollectionName).doc(id).field(
					'parent_id,name,icon,sort,description,is_hot_show,is_index_show,create_date,status').get().then((res) => {
					const data = res.result.data[0]
					if (data) {
						this.formData = data
					}
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.uni-container {
		padding: 15px;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 100%;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;

	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
	}

	.uni-button-group {
		margin-top: 50px;
		display: flex;
		justify-content: center;
	}

	.uni-button {
		width: 184px;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		line-height: 1;
		margin: 0;
	}
</style>
