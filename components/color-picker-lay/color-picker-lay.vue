<template>
	<view id="pickBox">
		<view class="colorBox">
			<view class="color" :style="{'background':rgb}">
				<movable-area id="colorcanvas" class="colorcanvas" @click="colorcanvasClick">
					<movable-view damping="1000" class="point" :x="cx" :y="cy" direction="all" @change="colorChange">
					</movable-view>
				</movable-area>
				<view class="white"></view>
				<view class="black"></view>
			</view>
			<view class="colorSelect">
				<movable-area class="colorBar" id="colorBar" @click="colorBarClick">
					<movable-view damping="1000" class="thumb" :y="ry" direction="vertical" @change="colorBarChange">
					</movable-view>
				</movable-area>
			</view>
		</view>
		<view class="transparency" :style="{'background-color': trgb}">
			<movable-area class="transparencyBar" id="transparencyBar" @click="transparencyBarClick">
				<movable-view damping="1000" class="thumb" :x="ax" direction="horizontal"
					@change="transparencyBarChange"></movable-view>
			</movable-area>
		</view>
		<view class="operate">
			<input v-model="rgba" type="text" />
			<view class="opbtns">
				<button @click="changeHe" :class="{act:hexifytog}">{{hexifytog?"HEXIFY":"RGBA"}}</button>
				<button id="confirm" @click="confirm">确认</button>
			</view>
		</view>
		<view class="colorlist">
			<view class="coloritem" @click="fastcolor(item)" v-for="(item,index) in colorList" :key="index"
				:style="{background:item}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "color-picker-lay",
		props: {
			colorList: {
				type: Array,
				default () {
					return [
						'#000000', '#222222', '#444444', '#999999', '#EEEEEE', '#FFFFFF', '#ff0000', '#ff3399',
						'#ff33cc', '#cc00cc', '#cc0099',
						'#cc3399', '#cc3300', '#cc6600', '#ff9933', '#ff9999', '#ff99ff', '#cc66ff', '#cc33ff',
						'#663300', '#996600', '#cc9900', '#a58800', '#ffff66', '#ffff99',
						'#ffffcc', '#336600', '#009900', '#00cc00', '#66ff66', '#339933', '#339966', '#33cccc',
						'#003366', '#3366cc', '#0099ff', '#000099', '#0000cc', '#993366', '#993333'
					]
				}
			},
		},
		data() {
			return {
				hexifytog: false, //显示格式
				colorBar: null, //节点对象实例
				transparencyBar: null, //节点对象实例
				colorcanvas: null, //节点对象实例
				colorObj: { //右侧颜色组 颜色对象
					r: 255,
					g: 0,
					b: 0
				},
				canvansObj: { //左侧颜色画布 颜色对象
					r: 255,
					g: 0,
					b: 0
				},
				alpha: 1.00,
				cx: 270, //颜色画布位置
				cy: 0, //颜色画布位置
				old: {
					cx: 270,
					cy: 0
				},
				ry: 0, //颜色条位置
				ax: 0, //底部透明度 位置
				rgb: "rgb(255,0,0)",
				trgb: "rgb(255,0,0)",
				rgba: "rgba(255,0,0,1)"
			}
		},
		mounted() {
			let query = uni.createSelectorQuery().in(this);
			this.colorBar = query.select('#colorBar');
			this.transparencyBar = query.select('#transparencyBar');
			this.colorcanvas = query.select('#colorcanvas');
		},
		methods: {
			//点击右侧颜色条
			colorBarClick(e) {
				this.colorBar.boundingClientRect(data => {
					let qt = data.top;
					this.ry = e.detail.y - qt - 3;
				}).exec();
			},
			// 右侧颜色条改变
			colorBarChange(e) {
				let _b = e.detail.y / 143;
				this.colorObj = this.changeColorBar(_b);
				this.changeColor(this.old.cx, this.old.cy);
				this.objToRGB(this.colorObj);
			},
			changeColorBar(scale) {
				var range = this.colorBarRange(scale);
				var rangeArr = range.arr;
				var diff = {
					r: rangeArr[0].r - rangeArr[1].r,
					g: rangeArr[0].g - rangeArr[1].g,
					b: rangeArr[0].b - rangeArr[1].b
				};
				var result = rangeArr[1];
				for (var i in diff) {
					result[i] = result[i] + diff[i] * (1 - range.rank) | 0;
				}
				return result;
			},
			//画布 颜色
			objToRGB(_obj) {
				this.rgb = "rgba(" + _obj.r + "," + _obj.g + "," + _obj.b + ")";
			},
			//透明度调整条 颜色
			objTotRGB(_obj) {
				this.trgb = "rgba(" + _obj.r + "," + _obj.g + "," + _obj.b + ")";
			},
			//综合颜色
			objToRGBA(_obj) {
				if (this.hexifytog) {
					this.rgba = this.hexify(_obj);
				} else {
					this.rgba = "rgba(" + _obj.r + "," + _obj.g + "," + _obj.b + "," + this.alpha + ")";
				}
			},
			//点击透明度
			transparencyBarClick(e) {
				this.transparencyBar.boundingClientRect(data => {
					let ql = data.left;
					this.ax = e.detail.x - ql - 3;
				}).exec();
			},
			// 底部透明度改变
			transparencyBarChange(e) {
				let _b = (1 - e.detail.x / 273).toFixed(2);
				this.alpha = _b;
				this.objToRGBA(this.canvansObj);
			},
			//点击画布
			colorcanvasClick(e) {
				// 点击位置 计算准确
				this.colorcanvas.boundingClientRect(data => {
					let ql = data.left;
					let qt = data.top;
					this.cx = e.detail.x - ql - 5;
					this.cy = e.detail.y - qt - 5;
					// console.log(ql);
				}).exec();
			},
			// 画布移动
			colorChange(e) {
				this.old.cx = e.detail.x;
				this.old.cy = e.detail.y;
				this.changeColor(e.detail.x, e.detail.y);
			},
			scaleChange(diff, scale) {
				for (var i in diff) {
					diff[i] = (scale * diff[i]) | 0;
				}
				return diff;
			},
			changeColor(x, y) {
				var _a = this.colorObj,
					r = _a.r,
					g = _a.g,
					b = _a.b;
				//右上 RGB;
				var difference = {
					r: 255 - r,
					g: 255 - g,
					b: 255 - b
				};
				var scaleX = x / 270;
				let res = this.scaleChange(difference, scaleX);
				var result = {
					r: 255 - res.r,
					g: 255 - res.g,
					b: 255 - res.b
				};
				var scaleY = y / 140;
				this.canvansObj = this.scaleChange(result, 1 - scaleY);
				this.objTotRGB(this.canvansObj);
				this.objToRGBA(this.canvansObj);
			},
			colorBarRange(scale) {
				switch (true) {
					case scale < .17:
						return {
							rank: scale / .17, arr: [{
								r: 255,
								g: 0,
								b: 0
							}, {
								r: 255,
								g: 255,
								b: 0
							}]
						};
					case scale < .33:
						return {
							rank: (scale - .17) / .16, arr: [{
								r: 255,
								g: 255,
								b: 0
							}, {
								r: 0,
								g: 255,
								b: 0
							}]
						};
					case scale < .5:
						return {
							rank: (scale - .33) / .17, arr: [{
								r: 0,
								g: 255,
								b: 0
							}, {
								r: 0,
								g: 255,
								b: 255
							}]
						};
					case scale < .67:
						return {
							rank: (scale - .5) / .17, arr: [{
								r: 0,
								g: 255,
								b: 255
							}, {
								r: 0,
								g: 0,
								b: 255
							}]
						};
					case scale < .83:
						return {
							rank: (scale - .67) / .16, arr: [{
								r: 0,
								g: 0,
								b: 255
							}, {
								r: 255,
								g: 0,
								b: 255
							}]
						};
					default:
						return {
							rank: (scale - .83) / .17, arr: [{
								r: 255,
								g: 0,
								b: 255
							}, {
								r: 255,
								g: 0,
								b: 0
							}]
						};
				}
			},
			// 更换显示模式
			hexify(color) {
				var a = this.alpha,
					r = Math.floor(a * color.r + (1 - a) * 255),
					g = Math.floor(a * color.g + (1 - a) * 255),
					b = Math.floor(a * color.b + (1 - a) * 255);
				return "#" +
					("0" + r.toString(16)).slice(-2) +
					("0" + g.toString(16)).slice(-2) +
					("0" + b.toString(16)).slice(-2);
			},
			//更换显示格式
			changeHe() {
				this.hexifytog = !this.hexifytog;
				this.objToRGBA(this.canvansObj)
			},
			//推荐颜色组
			fastcolor(color) {
				this.$emit("confirm", color)
			},
			//确认
			confirm() {
				this.$emit("confirm", this.rgba)
			}
		}
	}
</script>

<style lang="scss" scoped>
	#pickBox {
		width: 300px;
		border: 1px solid #ddd;
		border-radius: 3px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		background-color: #fff;
		padding: 6px;
		position: relative;
	}

	.colorBox {
		margin-bottom: 6px;
		display: flex;
		justify-content: space-between;

		.color {
			position: relative;
			width: 280px;
			height: 150px;

			.white {
				background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}

			.black {
				background: linear-gradient(0deg, #000, transparent);
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
			}

			.colorcanvas {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				z-index: 3;

				.point {
					cursor: pointer;
					display: block;
					width: 10px;
					height: 10px;
					box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, .3), 0 0 1px 2px rgba(0, 0, 0, .4);
					border-radius: 50%;
					transform: translate(-5px, -5px);
				}
			}
		}

		.colorSelect {
			width: 12px;
			height: 150px;
			float: right;
			position: relative;
			box-sizing: border-box;

			.colorBar {
				background: linear-gradient(180deg, red 0, #ff0 17%, lime 33%, cyan 50%, blue 67%, #f0f 83%, red);
				height: 100%;
			}

			.thumb {
				display: block;
				height: 7px;
				box-sizing: border-box;
				border-radius: 1px;
				background: #fff;
				border: 1px solid #f0f0f0;
				box-shadow: 0 0 2px rgba(0, 0, 0, .6);
				cursor: pointer;
			}
		}
	}

	.transparency {
		position: relative;
		width: 280px;
		height: 12px;

		.thumb {
			display: block;
			width: 7px;
			height: 100%;
			box-sizing: border-box;
			border-radius: 1px;
			background: #fff;
			border: 1px solid #f0f0f0;
			box-shadow: 0 0 2px rgba(0, 0, 0, .6);
			z-index: 1;
			cursor: pointer;
		}

		.transparencyBar {
			background: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0, #fff);
			height: 100%;
			width: 100%;
		}

	}

	.operate {
		margin-top: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		input {
			font-size: 15px;
			box-sizing: border-box;
			outline: 0;
			color: #333;
			text-align: left;
		}

		.opbtns {
			display: flex;
			align-items: center;
		}

		button {
			margin: 0;
			font-size: 12px;
			line-height: 24px;
			background-color: #fff;
			color: #333;
			border: 1px solid #ddd;
			border-radius: 3px;
			height: 24px;
			cursor: pointer;
			outline: 0;
			padding: 0 5px;
			text-align: center;
			-webkit-appearance: none;
			transition: .3s;
			margin-left: 5px;

			&::after {
				display: none;
			}

			&:hover {
				border-color: #51bbdd;
				color: #51bbdd;
			}

			&:focus {
				border-color: #2c9edd;
				color: #2c9edd;
			}

			&.act {
				color: #cc0000;
				border-color: #cc0000;
			}

			&.act:hover {
				color: #cc0000;
				border-color: #cc0000;
			}

			&.act:focus {
				color: #cc0000;
				border-color: #cc0000;
			}
		}
	}

	.colorlist {
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		.coloritem {
			border: 2px solid #ccc;
			width: 20px;
			height: 20px;
			background: #000;
			margin-right: 5px;
			margin-top: 10px;
			cursor: pointer;
		}
	}
</style>
