<template>
	<view class="uni-container">
		<uni-common-top>
			<uni-segmented-control :current="current" :values="tablist" @clickItem="onClickItem" styleType="button"
				activeColor="#409EFF"></uni-segmented-control>
		</uni-common-top>
		<uni-forms ref="form" :value="formData" validate-trigger="submit" err-show-type="toast">
			<view v-show="current === 0">
				<uni-forms-item name="category_id" label="所属分类" required>
					<uni-select-lay :value="formData.category_id" toptitle="请选择分类" :options="categoriesdata"
						@selectitem="selectitem">
					</uni-select-lay>
				</uni-forms-item>
				<uni-forms-item name="goods_sn" label="货号" required>
					<uni-easyinput placeholder="商品的唯一货号" v-model="formData.goods_sn" trim="both" />
				</uni-forms-item>
				<uni-forms-item name="name" label="名称" required>
					<uni-easyinput placeholder="商品名称" v-model="formData.name" trim="both" />
				</uni-forms-item>
				<uni-forms-item name="keywords" label="关键字">
					<uni-easyinput placeholder="商品关键字，为搜索引擎收录使用" v-model="formData.keywords" trim="both" />
				</uni-forms-item>
				<uni-forms-item name="remain_count" label="库存数量" required>
					<uni-easyinput placeholder="库存数量" type="number" v-model="formData.remain_count" />
				</uni-forms-item>
				<uni-forms-item name="is_real" label="是否为实物" required>
					<switch @change="binddata('is_real', $event.detail.value)" :checked="formData.is_real" />
				</uni-forms-item>
				<uni-forms-item name="is_on_sale" label="是否上架" required>
					<switch @change="binddata('is_on_sale', $event.detail.value)" :checked="formData.is_on_sale" />
				</uni-forms-item>
				<uni-forms-item name="is_best" label="是否精品" required>
					<switch @change="binddata('is_best', $event.detail.value)" :checked="formData.is_best" />
				</uni-forms-item>
				<uni-forms-item name="is_new" label="是否新品" required>
					<switch @change="binddata('is_new', $event.detail.value)" :checked="formData.is_new" />
				</uni-forms-item>
				<uni-forms-item name="is_hot" label="是否热销" required>
					<switch @change="binddata('is_hot', $event.detail.value)" :checked="formData.is_hot" />
				</uni-forms-item>
				<uni-forms-item name="is_alone_sale" label="是否单独销售" required>
					<switch @change="binddata('is_alone_sale', $event.detail.value)"
						:checked="formData.is_alone_sale" />
					<text>如果不是，则只能作为配件或赠品销售</text>
				</uni-forms-item>
				<uni-forms-item name="add_date" label="上架时间">
					<uni-datetime-picker return-type="timestamp" :value="formData.add_date" />
				</uni-forms-item>
				<uni-forms-item name="last_modify_date" label="最后修改时间">
					<uni-datetime-picker return-type="timestamp" :value="formData.last_modify_date" />
				</uni-forms-item>

				<uni-forms-item name="month_sell_count" label="月销量" required>
					<uni-easyinput placeholder="月销量" type="number" v-model="formData.month_sell_count" />
				</uni-forms-item>
				<uni-forms-item name="total_sell_count" label="总销量" required>
					<uni-easyinput placeholder="总销量" type="number" v-model="formData.total_sell_count" />
				</uni-forms-item>
				<uni-forms-item name="comment_count" label="累计评论数" required>
					<uni-easyinput placeholder="累计评论数" type="number" v-model="formData.comment_count" />
				</uni-forms-item>
			</view>
			<view v-show="current === 1">
				<uni-forms-item name="goods_thumb" label="缩略图(头图)">
					<uni-file-picker v-model="formData.goods_thumb" fileMediatype="image" mode="grid" :limit="1"
						return-type="object" disable-preview :auto-upload="false" file-extname="png,jpg"
						ref="iconupload" @select="iconselect" @success="iconsuccess" @fail="iconfail"
						@progress="iconprogress">
						<!-- <image src="../../static/icon/jia.png" mode="aspectFit" style="width:150rpx;height:150rpx"></image> -->
					</uni-file-picker>
				</uni-forms-item>
				<uni-forms-item name="goods_banner_imgs" label="banner图列表(轮播图)">
					<uni-data-checkbox :multiple="true" v-model="formData.goods_banner_imgs" />
				</uni-forms-item>
				<uni-forms-item name="seller_note" label="商家备注">
					<uni-easyinput placeholder="商家备注，仅商家可见" v-model="formData.seller_note" trim="both" />
				</uni-forms-item>
				<uni-forms-item name="goods_desc" label="详细描述">
					<uni-easyinput placeholder="商品详细描述" v-model="formData.goods_desc" trim="both" />
				</uni-forms-item>
			</view>
		</uni-forms>
		<uni-common-bot>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">提交</button>
				<navigator open-type="navigateBack" style="margin-left: 15px;"><button style="width: 100px;"
						class="uni-button">返回</button></navigator>
			</view>
		</uni-common-bot>
	</view>
</template>

<script>
	import {
		validator
	} from '../../js_sdk/validator/opendb-mall-goods.js';

	const db = uniCloud.database();
	const dbCollectionName = 'opendb-mall-goods';

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
				current: 0,
				tablist: ["商品基本信息", "商品详细信息"],
				categoriesdata: [], //类别列表
				formData: {
					"category_id": "",
					"goods_sn": "",
					"name": "",
					"keywords": "",
					"goods_desc": "",
					"goods_thumb": null,
					"goods_banner_imgs": [],
					"remain_count": null,
					"month_sell_count": 0,
					"total_sell_count": 0,
					"comment_count": 0,
					"is_real": true,
					"is_on_sale": true,
					"is_alone_sale": true,
					"is_best": true,
					"is_new": true,
					"is_hot": true,
					"add_date": Date.now(),
					"last_modify_date": Date.now(),
					"seller_note": ""
				},
				formOptions: {},
				rules: {
					...getValidator(["category_id", "goods_sn", "name", "keywords", "goods_desc", "goods_thumb",
						"goods_banner_imgs", "remain_count", "month_sell_count", "total_sell_count", "comment_count",
						"is_real", "is_on_sale", "is_alone_sale", "is_best", "is_new", "is_hot", "add_date",
						"last_modify_date", "seller_note"
					])
				}
			}
		},
		onReady() {
			this.loadlist();
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			//获取分类列表，并进行树形处理
			loadlist() {
				uni.showLoading({
					title: '正在获取分类列表',
					mask: true
				});
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
					this.loading = false;
					uni.hideLoading();
				})
			},
			selectitem(index, item) {
				if (index >= 0) {
					this.formData.category_id = this.categoriesdata[index]._id;
				} else {
					this.formData.category_id = ""
				}
			},
			onClickItem(e) {
				this.current = e.currentIndex
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
				console.log(value)
				return;
				if (value.icon == null || value.icon == undefined) {
					value.icon = {};
				}

				// 使用 clientDB 提交数据
				this.$request('system/goods/add', value).then((res) => {
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

<style lang="scss">
	.uni-button {
		width: 100px;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 0;
		line-height: 1;
		margin: 0;
	}
</style>
