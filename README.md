# uniCloud-admin

> 基于 uni-app，uniCloud 的 admin 管理项目模板。[文档](https://uniapp.dcloud.io/uniCloud/admin)

### 关于部分插件的修改
 
> uni-file-picker

  ```
  delFile(index) {
	this.$emit('delete', {
		tempFile: this.files[index],
		tempFilePath: this.files[index].url
	})
	this.files.splice(index, 1);
	this.setEmit();//此处为新增，使用插件内置方法，更新value值
  }
  ```