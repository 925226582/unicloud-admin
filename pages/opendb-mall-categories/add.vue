<template>
	<view class="uni-container">
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="name" label="类别名称" required>
				<uni-easyinput placeholder="类别名称" v-model="formData.name" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="parent_id" label="所属分类">
				<uni-select-lay :value="formData.parent_id" toptitle="请选择分类" :options="categoriesdata"
					@selectitem="selectitem">
				</uni-select-lay>
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
			<uni-forms-item name="status" label="发布">
				<switch @change="binddata('status', $event.detail.value)" :checked="formData.status" />
			</uni-forms-item>
			<uni-forms-item name="create_date" label="发布时间">
				<uni-datetime-picker return-type="timestamp" type="date" :value="formData.create_date" />
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
	// 列表扁平化

	//$id 代表在编辑页面 此id的所属栏目不可为自己，所以将$id的所属栏目剔除
	function flatMenu(catelist, pid, dep, id = -1) {
		var newarr = [];
		flatMenus(newarr, catelist, pid, dep, id);
		return newarr;
	}

	function flatMenus(newarr, catelist, pid, dep, id) {
		catelist.forEach(function(vo, k) {
			if (vo['parent_id'] == pid && vo['_id'] != id) {
				vo["dep"] = dep;
				vo['name'] = new Array(dep).join('﹄') + vo['name']
				newarr.push(vo);
				flatMenus(newarr, catelist, vo['_id'], dep + 1, id);
			}
		})
	}
	export default {
		data() {
			return {
				categoriesdata: [], //类别列表
				formData: {
					"parent_id": "",
					"name": "",
					"icon": null,
					"sort": 1000,
					"description": "",
					"is_hot_show": null,
					"is_index_show": null,
					"status": true,
					"create_date": Date.now()
				},
				formOptions: {},
				rules: {
					...getValidator(["parent_id", "name", "icon", "sort", "description", "is_hot_show", "is_index_show",
						"status",
						"create_date"
					])
				}
			}
		},
		onReady() {
			this.loadlist();
			this.$refs.form.setRules(this.rules);
		},
		methods: {
			//获取分类列表，并进行树形处理
			loadlist() {
				this.$request('system/categories/list', {}, {
					showModal: false
				}).then(res => {
					this.categoriesdata = flatMenu(res, "", 1);
				}).catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					this.loading = false
				})
			},
			selectitem(index,item) {
				if (index >= 0) {
					this.formData.parent_id = this.categoriesdata[index]._id;
				} else {
					this.formData.parent_id = ""
				}
			},
			// 图标上传相关
			// 获取上传状态
			iconselect(e) {
				let _size = e.tempFiles[0].size;
				//判断尺寸，小于300kb
				if (_size > 1024 * 300) {
					uni.showToast({
						image: '/static/icon/error.png',
						title: '选择的文件要小于300KB！',
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
			iconsuccess(e) {},
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
				if (value.icon == null || value.icon == undefined) {
					value.icon = {};
				}
				// 使用 clientDB 提交数据
				this.$request('system/categories/add', value).then((res) => {
					uni.showToast({
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData');
					setTimeout(() => uni.navigateBack(), 500)
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
