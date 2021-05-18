<template>
	<view>
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">商品类别列表</view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
				<button class="uni-button" type="default" size="mini" @click="loadlist">重置列表</button>
			</view>
		</view>
		<view class="uni-container">
			<uni-table ref="catetable" type="" border stripe>
				<uni-tr>
					<uni-th align="center">排序</uni-th>
					<uni-th align="center">类别名称</uni-th>
					<uni-th align="center">类别图标</uni-th>
					<uni-th align="center">类别描述</uni-th>
					<uni-th align="center">是否热门</uni-th>
					<uni-th align="center">首页显示</uni-th>
					<uni-th align="center">是否发布</uni-th>
					<uni-th width="170" align="center">创建时间</uni-th>
					<uni-th width="204" align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item,index) in categoriesdata" :key="index">
					<uni-td align="center">{{item.sort}}</uni-td>
					<uni-td align="left">{{item.name}}</uni-td>
					<uni-td align="center">
						<image :src="Object.keys(item.icon).length == 0?'':item.icon.url" mode="aspectFit"
							style="width:40px;height:40px"></image>
					</uni-td>
					<uni-td align="center">{{item.description}}</uni-td>
					<uni-td align="center">
						<switch @change="binddata('is_hot_show', $event.detail.value,item._id)"
							:checked="item.is_hot_show" />
					</uni-td>
					<uni-td align="center">
						<switch @change="binddata('is_index_show', $event.detail.value,item._id)"
							:checked="item.is_index_show" />
					</uni-td>
					<uni-td align="center">
						<switch @change="binddata('status', $event.detail.value,item._id)" :checked="item.status" />
					</uni-td>
					<uni-td align="center">
						<uni-dateformat :date="item.create_date" :threshold="[0, 0]" />
					</uni-td>
					<uni-td align="center">
						<view class="uni-group">
							<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
								type="primary">修改</button>
							<button @click="confirmDelete(item._id)" class="uni-button" size="mini"
								type="warn">删除</button>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</view>

</template>

<script>
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
				query: '',
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onReady() {
			this.loadlist();
		},
		methods: {
			//搜索
			search() {

				let _query = this.query.trim();
				if (_query == "") {
					this.loadlist();
					return;
				}
				uni.showLoading({
					title: '正在搜索',
					mask: true
				})
				this.categoriesdata = [];
				this.$request('system/categories/search', Object.assign({
					data: _query
				}), {
					showModal: false
				}).then(res => {
					this.categoriesdata = res;
				}).catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					});
					this.loadlist();
				}).finally(() => {
					uni.hideLoading();
					this.$forceUpdate(); //强制刷新
				})
			},
			//获取分类列表，并进行树形处理
			loadlist() {
				uni.showLoading({
					title: '正在加载',
					mask: true
				})
				this.categoriesdata = [];
				this.$request('system/categories/list', {}).then(res => {
					let ctes = flatMenu(res, "", 1);
					this.categoriesdata = ctes;
				}).catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					uni.hideLoading()
					this.$forceUpdate(); //强制刷新
				})
			},
			navigateTo(url, clear) { // clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
				// 打开新增页面
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadlist();
						}
					}
				})
			},

			//直接修改switch
			binddata(k, value, id) {
				let obj = {}
				obj[k] = value;
				uni.showLoading({
					title: '修改中...',
					mask: true
				})
				this.$request('system/categories/update', Object.assign({
					_id: id,
					distinctive: true, //区分直接修改
					data: obj
				})).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
				}).catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					});
					this.loadlist();
				}).finally(() => {
					uni.hideLoading()
				})

			},
			// 删除相关

			//删除类别
			confirmDelete(catesid) {
				let content = '是否删除该类别？'
				// 有子菜单
				if (this.categoriesdata.find(item => item.parent_id === catesid)) {
					content = '是否删除该类别及其所有子类别？'
				}
				uni.showModal({
					title: '提示',
					content,
					success: (res) => {
						res.confirm && this.delete(catesid)
					}
				})
			},
			async delete(id) {
				let that = this;
				uni.showLoading({
					mask: true
				});
				// return;
				this.$request('system/categories/delete', Object.assign({
						id: id,
					}))
					.then(res => {
						uni.showToast({
							title: '删除成功'
						})
						this.categoriesdata = [];
						this.loadlist();
					}).catch(err => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(err => {
						uni.hideLoading();
					})

			}
		}
	}
</script>

<style>
	/* #ifndef H5 */
	page {
		padding-top: 85px;
	}

	/* #endif */
</style>
