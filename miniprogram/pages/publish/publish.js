// pages/publish/publish.js

import {ajax} from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      ['卡片、证件类', '生活用品', '数码产品', '美妆护肤类', '衣服物品类', '饰品', '文娱', '其它'],
      ['身份证', '校园卡', '学生证', '公交卡', '银行卡', '其它']
      ],
        // 第二列的储备数据源
        pickerList: [
        ['身份证', '校园卡', '学生证', '公交卡', '银行卡', '其它'],
        ['水杯', '雨伞','钥匙/钥匙扣', '其它'],
        ['手机','电脑', '相机', 'U盘/硬盘', '充电宝', '平板电脑', '鼠标', '充电线', '耳机', '手写笔',  '其它'],
        ['口红', '粉底', '眉笔', '腮红', '眼影', '防晒', '喷雾', '香水', '其它'],
        ['男装', '女装', '鞋子', '包包', '其它'],
        ['手表', '项链', '手链', '戒指', '耳饰', '眼镜', '帽子', '发饰', '其它'],
        ['教材', '笔记', '文具', '运动', '其它'],
        ['药品', '饭' , '零食' , '周边']
        ],
    multiIndex: [0, 0],
    select:false,
    name:'',
    date:'',
    region:'',
    phone:'',
    desc:'',
    imgList:[],
    type:'',
    type_check:false,
    name_check:false,
    date_check:false,
    region_check:false,
    phone_check:false,
    info:null,
    id:''
  },

  getPhone(e){
    this.setData({
      phone:e.detail.value,
      phone_check:false
    })
  },
  getName(e){
    this.setData({
      name:e.detail.value,
      name_check:false
    })
  },
  getDate(e){
    this.setData({
      date:e.detail.value,
      date_check:false
    })
  },
  getRegion(e){
    this.setData({
      region:e.detail.value,
      region_check:false
    })
  },   
  bindMultiPickerChange(e){
    this.setData({
      select:true
    })
  },
  getDesc(e){
    this.setData({
      desc:e.detail.value.trim()
    })
  },
  deleteDesc(){
    this.setData({
      desc:''
    })
  },
  bindMultiPickerColumnChange(e) {
    let {column , value} = e.detail;
    let data=this.data;
    let {multiArray,pickerList} = this.data;
    if(column===0){
      multiArray[1]=pickerList[value];
    }
    data.multiArray = multiArray;
    data.multiIndex[column]=value;
    this.setData(data);
  },
  closeSelect(){
    this.setData({
      select:false,
      multiIndex: [0, 0]
        })
  },


  async toPublish(){
            /**
         *  type: 失物招领的类型  0 => 寻物  1 => 寻主
         *  classify1: 一级分类
         *  classify2: 二级分类
         *  name: 物品名称
         *  date: 丢失/拾取时间
         *  region: 丢失/拾取地点
         *  phone: 联系方式
         *  desc: 物品描述
         *  imgList: 上传的图片
         *  time: 发布时间
         */
    const {
      type,
      multiArray,
      multiIndex,
      name,
      date,
      region,
      phone,
      desc,
      imgList,
      select,
      id,
      info
    }=this.data;

    if(!type){
      this.setData({
        type_check:true
      })
    }
    if(!name){
      this.setData({
        name_check:true
      })
    }
    if(!date){
      this.setData({
        date_check:true
      })
    }
    if(!region){
      this.setData({
        region_check:true
      })
    }
    if(!phone){
      this.setData({
        phone_check:true
      })
    }
    if( !type || !select || !name ||!date || !region ||!phone){
      wx.showToast({
        title: '未填写必须项',
        icon:'none',
      });
      return;
    }

    if(info){
      const params = {
        openid:wx.getStorageSync('openid'),
        type:Number(type),
        classify1:multiArray[0][multiIndex[0]],
        classify2:multiArray[1][multiIndex[1]],
        name,
        date,
        region,
        phone,
        desc,
        imgList,
        time:new Date().getTime(),
        id:info._id,
      };
      const {data} = await ajax('/updateLose','POST',params);
      if(data === "success"){
        wx.switchTab({
          url: '../index/index',
          success:()=>{
            wx.showToast({
              title: '修改成功',
              icon:'none'
            })
          }
        })
      }else{
        wx.showToast({
          title: '修改失败',
          icon:'none'
        })
      }

    }else{
      const params = {
        openid:wx.getStorageSync('openid'),
        type,
        classify1:multiArray[0][multiIndex[0]],
        classify2:multiArray[1][multiIndex[1]],
        name,
        date,
        region,
        phone,
        desc,
        imgList,
        time:new Date().getTime()
      }
      const result = await ajax('/publish','POST',params);
      const {data}=result;
          if(data==="success"){
            wx.switchTab({
              url: '../index/index',
              success:() => {
                wx.showToast({
                  title: '发布成功！',
                  icon:'none',
                })
              }
            })
          }else {
            wx.showToast({
              title: '发布失败！',
              icon:'none',
            })
          }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {info} = options;
    const {multiArray,pickerList} = this.data;
    if(info){
      const _info = JSON.parse(info);
      const {type,classify1,classify2,name,date,region,phone,desc,imgList}=_info;
      const index1 = multiArray[0].findIndex(item=>item === classify1);
      const index2 = pickerList[index1].findIndex(item=>item === classify2);
      this.setData({
        type:String(type),
        multiArray:[
          multiArray[0],
          pickerList[index1]
        ],
        multiIndex:[index1,index2],
        select:true,
        name,
        date,
        region,
        phone,
        desc,
        imgList,
        info:_info
      })
    }
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo && userInfo.phone){
      this.setData({
        phone:userInfo.phone
      })
    }
    

    
  },
  backPage(){
    wx.navigateBack();
  },
  uploadImg(){
    const {imgList} =this.data; 
    wx.chooseMedia({
      count: 6-imgList.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],

      success:(res)=> {
        const { tempFiles } =res;
        tempFiles.forEach((item,index)=>{
          wx.uploadFile({
            url: 'http://localhost:3002/uploadImg',
            filePath: item.tempFilePath,
            name: 'file',
            success: (res)=>{
              const {data} = res;
              let {path}=JSON.parse(data)[0];
              let __path=path.split('\\');
              console.log(__path);
              let _path=`http://localhost:3002/${__path[0]}/${__path[1]}`;
              console.log(_path);
              imgList.unshift(_path);
              this.setData({
                imgList
              })
            },
            fail: (err) =>{
              console.log(err);
            }
          })
        })

      }
    })
  },

  selectType(e){
    const {id} =e.currentTarget.dataset;
    this.setData({
      type:id,
      type_check:false
    })
  },
  deleteImg(e){
    let { index }=e.currentTarget.dataset;
    let {imgList} = this.data;
    imgList.splice(index,1);
    this.setData({
      imgList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})