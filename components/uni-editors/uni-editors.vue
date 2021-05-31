<template>
	<view class="page-body">
		<view class='wrapper'>
			<view class='toolbar' @tap="format">
				<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"
					title="加粗">
				</view>
				<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"
					title="斜体">
				</view>
				<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian"
					data-name="underline" title="下划线"></view>
				<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian"
					data-name="strike" title="删除线"></view>
				<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi"
					data-name="align" data-value="left" title="左对齐"></view>
				<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi"
					data-name="align" data-value="center" title="居中对齐"></view>
				<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi"
					data-name="align" data-value="right" title="右对齐"></view>
				<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi"
					data-name="align" data-value="justify" title="两端对齐"></view>
				<view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height"
					data-name="lineHeight" data-value="2" title="行高"></view>
				<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing"
					data-name="letterSpacing" data-value="2em" title="字间距"></view>
				<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju"
					data-name="marginTop" data-value="20px" title="距上20px"></view>
				<view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju"
					data-name="marginBottom" data-value="20px" title="距下20px"></view>
				<view class="iconfont icon-clearedformat" @tap="removeFormat" title="清除样式"></view>
				<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily"
					data-value="Pacifico" title="字体为Pacifico"></view>
				<view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize"
					data-name="fontSize" data-value="24px" title="字体加大为24px"></view>

				<view class="iconfont icon-text_color" data-name="color" style="position: relative;" :data-value="fontColor" title="字体颜色">
					<view class="colorbg" style="width: 70%;height:3px;position: absolute;bottom: 4px;left: 15%;"  :style="{'background':fontColor}"></view>
					<view class="colorboxs" style="position: absolute;right:0;top:100%">
						<color-picker-lay v-show="fontshow" @confirm="fontColorCheck"></color-picker-lay>
					</view>
				</view>
				<view class="iconfont icon-fontbgcolor" data-name="backgroundColor" :style="{color:bgColor}" :data-value="bgColor" title="字体背景色">
					<view class="colorboxs" style="position: absolute;right:0;top:100%">
						<color-picker-lay v-show="bgshow" @confirm="bgColorCheck"></color-picker-lay>
					</view>
				</view>

				<view class="iconfont icon-date" @tap="insertDate" title="插入日期"></view>
				<view class="iconfont icon--checklist" data-name="list" data-value="check" title="列表"></view>
				<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie"
					data-name="list" data-value="ordered" title="数字列表"></view>
				<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie"
					data-name="list" data-value="bullet" title="点列表"></view>
				<view class="iconfont icon-undo" @tap="undo" title="撤销"></view>
				<view class="iconfont icon-redo" @tap="redo" title="恢复"></view>

				<view class="iconfont icon-outdent" data-name="indent" data-value="-1" title="左缩进"></view>
				<view class="iconfont icon-indent" data-name="indent" data-value="+1" title="右缩进"></view>
				<view class="iconfont icon-fengexian" @tap="insertDivider" title="分割线"></view>
				<view class="iconfont icon-charutupian" @tap="insertImage" title="插入图片"></view>
				<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1"
					data-name="header" :data-value="1" title=""></view>
				<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao"
					data-name="script" data-value="sub" title="下标"></view>
				<view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao"
					data-name="script" data-value="super" title="上标"></view>
				<view class="iconfont icon-shanchu" @tap="clear" title="清空"></view>
				<view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl"
					data-name="direction" data-value="rtl" title="反向"></view>
			</view>
			
			<view class="editor-wrapper">
				<editor id="editor" class="ql-container" placeholder="开始输入..." showImgSize showImgToolbar showImgResize
					@statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
				</editor>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "uni-editors",
		data() {
			return {
				readOnly: false,
				fontColor:"#000000",
				fontshow:false,
				bgColor:"#eeeeee",
				bgshow:false,
				formats: {}
			}
		},
		created() {
			uni.loadFontFace({
				family: 'Pacifico',
				source: 'url("https://sungd.github.io/Pacifico.ttf")'
			})
		},
		methods: {
			// 字体颜色选择
			fontColorCheck(e){
				this.fontColor=e;
				this.fontshow=false;
				this.formats.color=e;
			},
			bgColorCheck(e){
				this.bgColor=e;
				this.bgshow=false;
				this.formats.backgroundColor=e;
			},
			//以下是编辑器默认
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				// 颜色选择器
				if(name==="color"){
					// 打开颜色选择器
					this.fontshow=true;
					
				}else if(name==="backgroundColor"){
					// 打开颜色选择器
					this.bgshow=true;
				}
				this.editorCtx.format(name, value);
			},

			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							alt: '图像',
							success: function() {
								console.log('insert image success')
							}
						})
					}
				})
			},
			getvalues() {
				this.editorCtx.getContents({
					success(res) {
						console.log(res)
					}
				});
			}
		},

	}
</script>

<style>
	@import "./editor-icon.css";

	.page-body {
		/* height: calc(100vh - var(--window-top) - var(--status-bar-height)); */
		border: 1px solid #e5e5e5;
		border-radius: 8rpx;
	}

	/* .wrapper {
		height: 100%;
	} */

	/* 	.editor-wrapper {
		height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px);
		background: #fff;
	}
 */
	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
		text-align: center;	
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		border-bottom: 1px solid #e5e5e5;
		position: relative;z-index: 23;
	}


	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 60vh;
		overflow-y: auto;
		font-size: 16px;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
	}
</style>
