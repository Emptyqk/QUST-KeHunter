// pages/search/search.js
import {ajax} from '../../utils/index';
let t =null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search:'',
    _search:'',
    searchLog:[],
    searchRes:[],
  },

  toSearchLog(e){
    const {name} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../searchResult/searchResult?name=${name}`,
    })
  },

  toDetail(e){
    const {info:{_id}} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../infoDetail/infoDetail?info=${JSON.stringify(_id)}`,
    })
  },

  deleteLog(){
    this.setData({
      searchLog:[]
    });
    wx.removeStorageSync('searchLog');
  },

  deleteSearch(){
    this.setData({
      search:'',
      _search:''
    })
  },

  getSearch(e) {
    //防抖
    this.setData({
      _search: e.detail.value
    })
    if(t) clearTimeout(t);
    t=setTimeout(async ()=>{
      this.setData({
        search: e.detail.value
      });
      let searchLog = wx.getStorageSync('searchLog');
      if(searchLog){
        searchLog.unshift(e.detail.value);
      }else{
        searchLog=[e.detail.value];
      }
      wx.setStorageSync('searchLog', searchLog);
      this.setData({
        searchLog
      })
      const params={
        name: e.detail.value
      };
      const result = await ajax('/searchLose','GET',params);
      const{data}=result;
      this.setData({
        searchRes:data
      })
    },1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      const searchLog = wx.getStorageSync('searchLog');
      this.setData({
        searchLog
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
    const searchLog = wx.getStorageSync('searchLog');
    this.setData({
      searchLog
    })
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