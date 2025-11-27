import {ajax,formatTime} from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['../../images/banner1.png' , '../../images/banner2.png'],
    tabList:['寻主','寻物'],
    select:0,
    list:[],
},

async getDelete(e){
  const id = e.detail;
  const params = {
    _id:id
  };
  const {data} = await ajax('/deleteLose','POST',params);
  console.log(data);
  if(data==="success"){
    wx.showToast({
      title: '删除成功',
      icon:'none',
      success:()=>{
        this.onLoad();
      }
    })
  }else{
    wx.showToast({
      title: '删除失败',
      icon:'none'
    })
  }
},

getUpdate(e) {
  const info = e.detail;
  wx.navigateTo({
    url: `../publish/publish?info=${info}`,
  })
},


toDetail(e) {
  const { info: { _id } } = e.currentTarget.dataset;

  wx.navigateTo({
    url: `../infoDetail/infoDetail?_id=${_id}`,
  })
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
    const params = {
        openid: wx.getStorageSync('openid'),
        type: select
    };
    const result = await ajax('/getMyPublish', 'GET', params);
    const { data } = result;
    console.log(data);
    this.setData({
        list: data.map(item => {
            return {
                ...item,
                time: formatTime(item.time)
            }
        })
    })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
