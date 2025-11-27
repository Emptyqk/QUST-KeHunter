import {formatTime,ajax} from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['../../images/banner1.png' , '../../images/banner2.png'],
    tabList:['寻主','寻物'],
    select:0,
    list:[]
},

  toSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  // toDetail(e){
  //   const {info} = e.currentTarget.dataset;
  //   wx.navigateTo({
  //     url: `../infoDetail/infoDetail?info=${JSON.stringify(info)}`,
  //   })
  // },
  
  toDetail(e) {
    const { info:{_id} } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../infoDetail/infoDetail?_id=${_id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {select}=this.data;
    const params = {
      type:select
    }
    const result = await ajax('/getLose','GET',params);
    const {data} = result;
    this.setData({
      list:data.map(item=>{
        return {
          ...item,
          time:formatTime(item.time)
        }
      })
    })

    const openid = wx.getStorageSync('openid');
    if(!openid){
      const {code} = await wx.login();
      const params1 = {
        code
      };
      const result1 = await ajax('/login','GET',params1);
      const{data}=result1;
      if(data!=="error"){
        wx.setStorageSync('openid', data);
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  getTab(e){
    this.setData({
      select:e.detail
    })
    this.onLoad();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
          select: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
});

