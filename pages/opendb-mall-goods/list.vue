<template>
	<view class="container">
		<view class="uni-header">
			<view class="uni-group hide-on-phone">
				<view class="uni-title">商品列表</view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
				<!-- <button class="uni-button" type="default" size="mini" @click="loadlist">重置列表</button> -->
				<button class="uni-button" type="default" size="mini" @click="delTable"
					:disabled="!selectedIndexs.length">批量删除</button>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" @load="onqueryload" collection="opendb-mall-goods,opendb-mall-categories"
				:options="options" :where="where"
				field="_id,name,goods_sn,category_id{_id,name},keywords,goods_desc,goods_thumb,goods_banner_imgs,remain_count,month_sell_count,total_sell_count,comment_count,is_real,is_on_sale,is_alone_sale,is_best,is_hot,add_date,seller_note,register_date"
				page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error}">
				<uni-table :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection"
					@selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center">商品名称</uni-th>
						<uni-th align="center">商品货号</uni-th>
						<uni-th align="center">所属分类</uni-th>
						<uni-th align="center">商品关键字，为搜索引擎收录使用</uni-th>
						<uni-th align="center">商品详细描述</uni-th>
						<uni-th align="center">商品缩略图</uni-th>
						<uni-th align="center">banner图列表</uni-th>
						<uni-th align="center">库存数量</uni-th>
						<uni-th align="center">月销量</uni-th>
						<uni-th align="center">总销量</uni-th>
						<uni-th align="center">累计评论数</uni-th>
						<uni-th align="center">是否实物</uni-th>
						<uni-th align="center">是否上架</uni-th>
						<uni-th align="center">是否能单独销售</uni-th>
						<uni-th align="center">是否精品</uni-th>
						<uni-th align="center">是否热销</uni-th>
						<uni-th align="center">上架时间</uni-th>
						<uni-th align="center">最后修改时间</uni-th>
						<uni-th align="center">商家备注，仅商家可见</uni-th>
						<uni-th width="204" align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.name}}</uni-td>
						<uni-td align="center">{{item.goods_sn}}</uni-td>
						<uni-td align="center">{{item.category_id}}</uni-td>
						<uni-td align="center">{{item.keywords}}</uni-td>
						<uni-td align="center">{{item.goods_desc}}</uni-td>
						<uni-td align="center">{{item.goods_thumb}}</uni-td>
						<uni-td align="center">{{item.goods_banner_imgs}}</uni-td>
						<uni-td align="center">{{item.remain_count}}</uni-td>
						<uni-td align="center">{{item.month_sell_count}}</uni-td>
						<uni-td align="center">{{item.total_sell_count}}</uni-td>
						<uni-td align="center">{{item.comment_count}}</uni-td>
						<uni-td align="center">
							<switch @change="binddata('is_real', $event.detail.value,item._id)" :checked="item.is_real" />
						</uni-td>
						<uni-td align="center">
							<switch @change="binddata('is_on_sale', $event.detail.value,item._id)" :checked="item.is_on_sale" />
						</uni-td>
						<uni-td align="center">
							<switch @change="binddata('is_alone_sale', $event.detail.value,item._id)" :checked="item.is_alone_sale" />
						</uni-td>
						<uni-td align="center">
							<switch @change="binddata('is_best', $event.detail.value,item._id)" :checked="item.is_best" />
						</uni-td>
						<uni-td align="center">
							<switch @change="binddata('is_hot', $event.detail.value,item._id)" :checked="item.is_hot" />
						</uni-td>
						<uni-td align="center">
							<uni-dateformat :date="item.add_date" :threshold="[0, 0]" />
						</uni-td>
						<uni-td align="center">
							<uni-dateformat :date="item.last_modify_date" :threshold="[0, 0]" />
						</uni-td>
						<uni-td align="center">{{item.seller_note}}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
								<button @click="confirmDelete(item)" class="uni-button" size="mini"
									type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
		<!-- #ifndef H5 -->
		<fix-window />
		<!-- #endif -->
	</view>
</template>

<script>
	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = 'register_date desc' // 排序字段
	const dbSearchFields = ['username', 'role_name', 'mobile', 'email'] // 支持模糊搜索的字段列表
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1
	export default {
		data() {
			return {
				query: '',
				where: '',
				orderby: dbOrderBy,
				options: {
					pageSize,
					pageCurrent
				},
				selectedIndexs: [] //批量选中的项
			}
		},
		methods: {
			onqueryload(data) {
				for (var i = 0; i < data.length; i++) {
					let item = data[i]
					item.role = item.role.map(item => item.role_name).join('、')
					item.status = this.parseUserStatus(item.status)
				}
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search(e) {
				const newWhere = this.getWhere()
				const isSameWhere = newWhere === this.where
				this.where = newWhere
				if (isSameWhere) { // 相同条件时，手动强制刷新
					this.loadData()
				}
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.$refs.udb.loadData({
					current: e.current
				})
			},
			navigateTo(url, clear) { // clear 表示刷新列表时是否清除当前页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
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
				this.$request('system/goods/update', Object.assign({
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
			// 多选处理
			selectedItems() {
				var dataList = this.$refs.udb.dataList
				return this.selectedIndexs.map(i => dataList[i]._id)
			},
			//批量删除
			delTable() {
				const ids = this.selectedItems()
				const currentUserId = this.userInfo._id
				if (ids.includes(currentUserId)) {
					uni.showToast({
						icon: 'none',
						title: '当前账号不能删除自己',
						duration: 1500
					})
					return
				}
				this.$refs.udb.remove(ids)
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(item) {
				const currentUserId = this.userInfo._id
				if (currentUserId === item._id) {
					uni.showToast({
						icon: 'none',
						title: '不允许 admin 账号删除自己',
						duration: 1500
					})
					return
				}
				this.$refs.udb.remove(item._id)
			},
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
