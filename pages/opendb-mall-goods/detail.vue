<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" collection="opendb-mall-goods" field="category_id,goods_sn,name,keywords,goods_desc,goods_thumb,goods_banner_imgs,remain_count,month_sell_count,total_sell_count,comment_count,is_real,is_on_sale,is_alone_sale,is_best,is_new,is_hot,add_date,last_modify_date,seller_note" :where="queryWhere" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
           <view>
     <text>category_id:</text>
                     <text>{{data.category_id}}</text>            
   </view> 
    <view>
     <text>货号:</text>
                     <text>{{data.goods_sn}}</text>            
   </view> 
    <view>
     <text>名称:</text>
                     <text>{{data.name}}</text>            
   </view> 
    <view>
     <text>关键字:</text>
                     <text>{{data.keywords}}</text>            
   </view> 
    <view>
     <text>详细描述:</text>
                     <text>{{data.goods_desc}}</text>            
   </view> 
    <view>
     <text>缩略图地址:</text>
                     <text>{{data.goods_thumb}}</text>            
   </view> 
    <view>
     <text>goods_banner_imgs:</text>
                     <text>{{data.goods_banner_imgs}}</text>            
   </view> 
    <view>
     <text>库存数量:</text>
                     <text>{{data.remain_count}}</text>            
   </view> 
    <view>
     <text>month_sell_count:</text>
                     <text>{{data.month_sell_count}}</text>            
   </view> 
    <view>
     <text>total_sell_count:</text>
                     <text>{{data.total_sell_count}}</text>            
   </view> 
    <view>
     <text>comment_count:</text>
                     <text>{{data.comment_count}}</text>            
   </view> 
    <view>
     <text>是否为实物:</text>
                     <text>{{data.is_real == true ? '✅' : '❌'}}</text>            
   </view> 
    <view>
     <text>是否上架:</text>
                     <text>{{data.is_on_sale == true ? '✅' : '❌'}}</text>            
   </view> 
    <view>
     <text>is_alone_sale:</text>
                     <text>{{data.is_alone_sale == true ? '✅' : '❌'}}</text>            
   </view> 
    <view>
     <text>is_best:</text>
                     <text>{{data.is_best == true ? '✅' : '❌'}}</text>            
   </view> 
    <view>
     <text>是否新品:</text>
                     <text>{{data.is_new == true ? '✅' : '❌'}}</text>            
   </view> 
    <view>
     <text>is_hot:</text>
                     <text>{{data.is_hot == true ? '✅' : '❌'}}</text>            
   </view> 
    <view>
     <text>add_date:</text>
     <uni-dateformat :date="data.add_date" :threshold="[0, 0]" />     
   </view> 
    <view>
     <text>last_modify_date:</text>
     <uni-dateformat :date="data.last_modify_date" :threshold="[0, 0]" />     
   </view> 
    <view>
     <text>seller_note:</text>
                     <text>{{data.seller_note}}</text>            
   </view> 
  
      </view>
    </unicloud-db>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '../../js_sdk/validator/opendb-mall-goods.js';

  export default {
    data() {
      return {
        queryWhere: '',
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.queryWhere = '_id=="' + this._id + '"'
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
  }

  .btns {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }
</style>
