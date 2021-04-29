<template>
	<view class="uni-select-lay">
		<input type="text" :name="name" v-model="value" :value="value" class="uni-select-input">
		<view class="uni-select-lay-select" :class="{'active':active}" @click="select">
			<view class="uni-select-lay-text">{{layvalue}}</view>
			<view class="uni-select-lay-icon"></view>
		</view>
		<view class="uni-select-lay-options" v-show="active">
			<view class="uni-select-lay-item" :class="{active:value==''}" @click="selectitem(-1)">{{toptitle}}</view>
			<view class="uni-select-lay-item" :class="{active:value==item._id}" v-for="(item,index) in options"
				:key="index" @click="selectitem(index)">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "uni-select-lay",
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			name: {
				type: String,
				default: ''
			},
			value: {
				type: String,
				default: ''
			},
			toptitle:{
				type: String,
				default: '顶级分类'
			}
		},
		data() {
			return {
				active: false, //组件是否激活，
				layvalue: ""
			};
		},
		watch: {
			//value改变
			value() {
				this.itemcheck();
			},
			//初始化数组
			options() {
				// 此处判断是否有初始value,存在则判断显示文字
				this.itemcheck();
			}
		},
		methods: {
			//判断数组跟当前active值
			itemcheck(){
				// 此处判断是否有初始value,存在则判断显示文字
				if (this.value != "") {
					// 展示plachhoder
					//判断数组
					if (this.options.length > 0) {
						for (var i = 0; i < this.options.length; i++) {
							if (this.value == this.options[i]._id) {
								this.layvalue = this.options[i].name
							}
						}
					}
				}else{
					this.layvalue=this.toptitle
				}
			},
			//点击组件
			select() {
				this.active = !this.active;
			},
			//点击组件列
			selectitem(index) {
				this.active = false;
				this.$emit("selectitem",index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-select-lay {
		position: relative;
		z-index: 9;

		.uni-select-input {
			opacity: 0;
			position: absolute;
			z-index: -111;
		}

		// select部分 
		.uni-select-lay-select {
			user-select: none;
			position: relative;
			z-index: 3;
			height: 36px;
			padding: 0 30px 0 10px;
			box-sizing: border-box;
			border-radius: 4px;
			border: 1px solid rgb(229, 229, 229);
			display: flex;
			align-items: center;
			font-size: 14px;
			color: #999;
			cursor: pointer;

			.uni-select-lay-text {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.uni-select-lay-icon {
				position: absolute;
				right: 0;
				top: 0;
				height: 100%;
				width: 30px;
				display: flex;
				align-items: center;
				justify-content: center;

				&::after {
					content: "";
					width: 0;
					height: 0;
					border-width: 12rpx 12rpx 0;
					border-style: solid;
					border-color: #bbb transparent transparent;
					transition: .3s;
				}
			}

			&.active .uni-select-lay-icon {
				&::after {
					transform: rotate(180deg);
				}
			}
		}

		// options部分
		.uni-select-lay-options {
			user-select: none;
			position: absolute;
			top: calc(100% + 5px);
			left: 0;
			width: 100%;
			height: 500rpx;
			overflow-y: auto;
			border-radius: 4px;
			border: 1px solid rgb(229, 229, 229);
			background: #fff;
			padding: 5px 0;
			box-sizing: border-box;
			z-index: 9;

			.uni-select-lay-item {
				padding: 0 10px;
				box-sizing: border-box;
				cursor: pointer;
				line-height: 2.5;
				transition: .3s;

				&.active {
					background: #007AFF;
					color: #fff;

					&:hover {
						background: #007AFF;
						color: #fff;
					}
				}

				&:hover {
					background-color: #f5f5f5;
				}
			}
		}
	}
</style>
