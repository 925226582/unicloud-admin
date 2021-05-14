<template>
	<view>
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">商品类别管理</view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
				<button class="uni-button" type="default" size="mini" @click="delTable"
					:disabled="!selectedIndexs.length">批量删除</button>
			</view>
		</view>
		<view class="uni-container">
			<uni-table border stripe type="selection" @selection-change="selectionChange">
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
						<image :src="Object.keys(item.icon).length == 0?'':item.icon.url" mode="aspectFit" style="width:40px;height:40px"></image>
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
							<button @click="confirmDelete(item)" class="uni-button" size="mini" type="warn">删除</button>
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
				categoriesdata: [],//类别列表
				query: '',
				selectedIndexs: [], //批量选中的项
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
			//获取分类列表，并进行树形处理
			loadlist() {
				this.$request('system/categories/list', {}, {
					showModal: false
				}).then(res => {
					let ctes=flatMenu(res, "", 1);
					this.categoriesdata = ctes;
					this.$forceUpdate();//强制刷新
				}).catch(err => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				}).finally(() => {
					this.loading = false
				})
			},
			navigateTo(url, clear) { // clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
				// 打开新增页面
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.categoriesdata=[];
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
					data: obj
				})).then((res) => {
					uni.showToast({
						title: '修改成功'
					})
				}).finally(() => {
					uni.hideLoading()
				})

			},
			// 删除相关
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			//删除类别
			confirmDelete(cates) {
				let content = '是否删除该类别？'
				console.log(cates);
				return;
				// 有子菜单
				if (this.menus.find(item => item.parent_id === menu.menu_id)) {
					content = '是否删除该菜单及其所有子菜单？'
				}
				uni.showModal({
					title: '提示',
					content,
					success: (res) => {
						if (!res.confirm) {
							return
						}
						// uni.showLoading({
						// 	mask: true
						// })
						// this.$request('system/menu/delete', {
						// 	id: menu._id
						// }).then(() => {
						// 	this.init()
						// 	this.loadData()
						// }).finally(() => {
						// 	uni.hideLoading()
						// })
					}
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
