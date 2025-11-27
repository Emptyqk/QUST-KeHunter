// pages/collection/collection.js
import {ajax,formatTime} from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabList:["寻主","寻物"],
      list:[],
      select:0
  },

  
  toDetail(e) {
    const { info } = e.currentTarget.dataset;
    console.log('点击详情，数据:', info);
    
    // 根据实际数据结构获取_id
    // 后端返回的收藏数据结构：{ id: { _id: '...' }, ... }
    let _id = null;
    if (info && info.id && info.id._id) {
      _id = info.id._id;
    } else if (info && info._id) {
      _id = info._id;
    }
    
    if (!_id) {
      console.error('无法获取_id，数据:', info);
      wx.showToast({
        title: '数据错误',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `../infoDetail/infoDetail?_id=${_id}`,
    });
  },

  getTab(e){
    this.setData({
      select:e.detail
    })
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { select } = this.data;
    const openid = wx.getStorageSync('openid');
    
    // 检查openid是否存在
    if (!openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      this.setData({
        list: []
      });
      return;
    }

    const params = {
        openid: openid,
        type: select
    };
    
    try {
      const result = await ajax('/getCollection', 'POST', params);
      console.log('收藏列表数据:', result);
      
      const { data } = result;
      
      // 处理数据为空或格式错误的情况
      if (!data || !Array.isArray(data)) {
        console.warn('返回数据格式错误:', data);
        this.setData({
          list: []
        });
        return;
      }

      // 如果数据为空，显示提示
      if (data.length === 0) {
        wx.showToast({
          title: '暂无收藏',
          icon: 'none',
          duration: 2000
        });
      }

      this.setData({
        list: data.map(item => {
            return {
                ...item,
                time: formatTime(item.time)
            };
        })
      });
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      wx.showToast({
        title: '获取收藏列表失败',
        icon: 'none'
      });
      this.setData({
        list: []
      });
    }
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
            select: 3
        })
    }
    this.onLoad();
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