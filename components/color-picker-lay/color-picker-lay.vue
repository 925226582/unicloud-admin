<template>
	<view id="pickBox">
		<view class="colorBox">
			<view class="color" :style="{'background':rightColor}">
				<movable-area class="colorcanvas">
					<movable-view class="point" direction="all" @change="colorChange"></movable-view>
				</movable-area>
				<view class="white"></view>
				<view class="black"></view>
			</view>
			<view class="colorSelect">
				<movable-area class="colorBar">
					<movable-view class="thumb" direction="vertical" @change="colorBarChange"></movable-view>
				</movable-area>
			</view>
		</view>
		<view class="transparency" :style="{'background-color': transparencybg}">
			<movable-area class="transparencyBar">
				<movable-view class="thumb" direction="horizontal" @change="transparencyBarChange"></movable-view>
			</movable-area>
		</view>
		<view class="operate">
			<text>{{rgba}}</text>
			<view class="opbtns">
				<button @click="changeHe" :class="{act:hexifytog}">更换格式</button>
				<button id="confirm" @click="confirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "color-picker-lay",
		data() {
			return {
				hexifytog: false,
				transparencyCache: 1,
				colorObj: {
					r: 255,
					g: 0,
					b: 0
				},
				rightColor: "rgb(255,0,0)",
				transparencybg: "rgb(255,255,255)",
				alpha: 1.00,
				rgba: "rgba(255,255,255,1)"
			}
		},
		methods: {

			// 右侧颜色条改变
			colorBarChange(e) {
				let _b = e.detail.y / 143;
				this.colorObj = this.changeColorBar(_b);
				this.rightColor = this.objToRGB(this.colorObj);
				this.transparencybg = this.rightColor;
				this.objToRGBA(this.colorObj);
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
			objToRGB(obj) {
				return "rgba(" + obj.r + "," + obj.g + "," + obj.b + ")";
			},
			// 底部透明度改变
			transparencyBarChange(e) {
				let _b = (1 - e.detail.x / 273).toFixed(2);
				this.alpha = _b;
				this.objToRGBA(this.colorObj);
			},
			// 画布移动
			colorChange(e) {
				this.changeColor(e.detail.x, e.detail.y);
			},
			objToRGBA(obj) {
				this.rgba = "rgba(" + obj.r + "," + obj.g + "," + obj.b + "," + this.alpha + ")";
				if (this.hexifytog) {
					return this.hexify(this.rgba);
				}
				return this.rgba;
			},
			rgbToObj(rgbString) {
				var array = rgbString.split(',');
				return {
					r: Number(array[0].split('(')[1]),
					g: Number(array[1]),
					b: Number(array[2].slice(0, -1))
				};
			},
			scaleChange(diff, scale) {
				for (var i in diff) {
					diff[i] = (scale * diff[i]) | 0;
				}
				return diff;
			},
			changeColor(x, y) {
				var _a = this.rgbToObj(this.rightColor),
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
				let res2 = this.scaleChange(result, 1 - scaleY);
				this.colorObj = res2;
				this.objToRGBA(res2);
				this.transparencybg = this.objToRGB(res2);
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
			hexify(color) {
				var values = color
					.replace(/rgba?\(/, '')
					.replace(/\)/, '')
					.replace(/[\s+]/g, '')
					.split(',');
				var a = parseFloat(values[3] || 1),
					r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
					g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
					b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
				return "#" +
					("0" + r.toString(16)).slice(-2) +
					("0" + g.toString(16)).slice(-2) +
					("0" + b.toString(16)).slice(-2);
			},
			//更换显示格式
			changeHe() {
				this.hexifytog = !this.hexifytog;
				if (this.hexifytog) {
					this.rgba = this.hexify(this.rgba)
				} else {
					this.rgba = this.objToRGBA(this.colorObj)
				}
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
		height: 200px;
		border: 1px solid #ddd;
		border-radius: 3px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		background-color: #fff;
		padding: 6px;
		position: absolute;
		user-select: none;
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
				height: 14rpx;
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
			width: 14rpx;
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

		text {
			font-size: 30rpx;
			box-sizing: border-box;
			outline: 0;

		}

		.opbtns {
			display: flex;
			align-items: center;
		}

		button {
			margin: 0;
			font-size: 24rpx;
			line-height: 48rpx;
			background-color: #fff;
			color: #333;
			border: 1px solid #ddd;
			border-radius: 3px;
			height: 48rpx;
			cursor: pointer;
			outline: 0;
			padding: 0 20rpx;
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
</style>
