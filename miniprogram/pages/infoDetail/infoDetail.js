// pages/infoDetail/infoDetail.js

import { ajax, formatTime} from '../../utils/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['../../images/banner1.png' , '../../images/banner2.png'],
    collectionIcon:['../../images/sc1.png' , '../../images/sc2.png'],
    info:{},
    from:'',
    comment:'',
    claimStatus: null,  // 认领状态：null-未认领, 0-待确认, 1-已确认, 2-已拒绝
    isOwner: false,  // 是否是发布者
    claimList: []  // 认领列表（发布者查看）
  },

  getPhone() {
    const { info: { phone } } = this.data;
    wx.showModal({
      title: '联系方式',
      content: phone,
      confirmText: '复制',
      success: (res) => {
        if (res.confirm) {
            wx.setClipboardData({
              data: phone,
              success: (res) => {
                  wx.showToast({
                    icon: 'none',
                    title: '内容已复制',
                  })
              }
            })
        }
      }
    })
},

async toCollection(){
  const {info,collectionIcon,from}=this.data;
 const{_id} = info;
  if(collectionIcon[0]==='../../images/sc1.png'){
    const params = {
      id: _id,
      openid: wx.getStorageSync('openid')  
  }
    const result = await ajax('/toCollection','POST',params);
    const {data} = result;
    if(data==="success"){
      wx.showToast({
        title: '收藏成功',
        icon:'none'
      })
      let last = collectionIcon.pop();
      collectionIcon.unshift(last);
      this.setData({
        collectionIcon,
      })
    }
  }else{
    const params1 = {
      id: from === 'collection'? info.id:info._id,
      openid:wx.getStorageSync('openid')
    }
    const result1 = await ajax('/cancelCollection','GET',params1);
    const {data} = result1;
    if(data==="success"){
        wx.showToast({
          title: '收藏已取消',
          icon:'none'
        })
        let last = collectionIcon.pop();
        collectionIcon.unshift(last);
        this.setData({
          collectionIcon,
        })
    }
  }
},

// 认领失物/失主
async toClaim(){
  const {info, claimStatus} = this.data;
  const openid = wx.getStorageSync('openid');
  
  if (!openid) {
    wx.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  
  // 如果已经认领过，取消认领
  if (claimStatus !== null && claimStatus === 0) {
    wx.showModal({
      title: '提示',
      content: '确定要取消认领吗？',
      success: async (res) => {
        if (res.confirm) {
          const params = {
            id: info._id || (info.id && info.id._id),
            claimerOpenid: openid
          };
          const result = await ajax('/cancelClaim', 'GET', params);
          if (result.data === "success") {
            wx.showToast({
              title: '已取消认领',
              icon: 'none'
            });
            this.setData({
              claimStatus: null
            });
          } else {
            wx.showToast({
              title: '取消认领失败',
              icon: 'none'
            });
          }
        }
      }
    });
    return;
  }
  
  // 检查是否已认领
  if (info.state === 1) {
    wx.showToast({
      title: '此失物/失主已被认领',
      icon: 'none'
    });
    return;
  }
  
  // 认领
  wx.showModal({
    title: '确认认领',
    content: '确定要认领此失物/失主吗？',
    success: async (res) => {
      if (res.confirm) {
        const params = {
          id: info._id || (info.id && info.id._id),
          claimerOpenid: openid
        };
        const result = await ajax('/claim', 'POST', params);
        const {data} = result;
        
        if (data === "success") {
          wx.showToast({
            title: '认领成功，等待确认',
            icon: 'success'
          });
          this.setData({
            claimStatus: 0
          });
          // 刷新认领列表（如果是发布者查看）
          if (this.data.isOwner) {
            this.loadClaimList();
          }
        } else if (data === "already_claimed") {
          wx.showToast({
            title: '您已经认领过了',
            icon: 'none'
          });
        } else if (data === "cannot_claim_own") {
          wx.showToast({
            title: '不能认领自己发布的',
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: '认领失败',
            icon: 'none'
          });
        }
      }
    }
  });
},

// 确认认领（发布者）
async confirmClaim(e){
  const {claimid} = e.currentTarget.dataset;
  const {info} = this.data;
  const openid = wx.getStorageSync('openid');
  
  wx.showModal({
    title: '确认认领',
    content: '确定要确认此认领吗？确认后其他认领将被拒绝。',
    success: async (res) => {
      if (res.confirm) {
        const params = {
          claimId: claimid,
          ownerOpenid: openid
        };
        const result = await ajax('/confirmClaim', 'POST', params);
        if (result.data === "success") {
          wx.showToast({
            title: '已确认认领',
            icon: 'none'
          });
          // 刷新页面数据
          this.onLoad({_id: info._id || (info.id && info.id._id)});
        } else {
          wx.showToast({
            title: '确认失败',
            icon: 'none'
          });
        }
      }
    }
  });
},

// 拒绝认领（发布者）
async rejectClaim(e){
  const {claimid} = e.currentTarget.dataset;
  const openid = wx.getStorageSync('openid');
  
  wx.showModal({
    title: '拒绝认领',
    content: '确定要拒绝此认领吗？',
    success: async (res) => {
      if (res.confirm) {
        const params = {
          claimId: claimid,
          ownerOpenid: openid
        };
        const result = await ajax('/rejectClaim', 'POST', params);
        if (result.data === "success") {
          wx.showToast({
            title: '已拒绝认领',
            icon: 'none'
          });
          // 刷新认领列表
          this.loadClaimList();
        } else {
          wx.showToast({
            title: '拒绝失败',
            icon: 'none'
          });
        }
      }
    }
  });
},

// 加载认领列表（发布者查看）
async loadClaimList(){
  const {info} = this.data;
  const openid = wx.getStorageSync('openid');
  
  if (!info.openid || info.openid !== openid) {
    return; // 不是发布者，不加载
  }
  
  const params = {
    id: info._id || (info.id && info.id._id),
    ownerOpenid: openid
  };
  
  try {
    const result = await ajax('/getClaims', 'POST', params);
    const claimList = result.data || [];
    
    // 格式化时间
    claimList.forEach(item => {
      item.claimTimeFormatted = formatTime(item.claimTime);
    });
    
    this.setData({
      claimList
    });
  } catch(err) {
    console.error('加载认领列表失败:', err);
  }
},

getComment(e){
  this.setData({
    comment:e.detail.value
  })
},

async submitComment(){
  const { comment, info: { _id } } = this.data;
  console.log(comment);
  if (comment.trim().length === 0) {
      wx.showToast({
        title: '您输入的评论内容为空!',
        icon: 'none'
      })
      return;
  }
  const {avatarUrl,nickname} = wx.getStorageSync('userInfo');
  const params = {
    avatarUrl,
    nickname,
    content:comment,
    time:new Date().getTime(),
    _id,
  };
  const {data:{status,data}} = await ajax('/addComment','POST',params);
  console.log(status);
  if(status === "success"){
    wx.showToast({
      title: '评论成功',
      icon:'none'
    })
    data.commentList.forEach(item=>{
      item.time = formatTime(item.time);
    })
    this.setData({
      info:data,
      comment:''
    })
  }else{
    wx.showToast({
      title: '评论失败',
      icon:'none'
    })
  }

},


  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {collectionIcon} = this.data;
    const {_id} = options;
    const openid = wx.getStorageSync('openid');
    const _params = {
      _id
    };
    const { data: info } = await ajax('/getDetail', 'POST', _params);
    console.log(info);
    
    info.commentList.forEach(item=>{
      item.time = formatTime(item.time);
    })
    
    // 判断是否是发布者
    const isOwner = info.openid === openid;
    
    // 确保info.state有默认值
    if (!info.state) {
      info.state = 0;
    }
    
    console.log('页面数据:', {
      isOwner,
      openid: openid,
      infoOpenid: info.openid,
      infoState: info.state
    });
    
    this.setData({
      info,
      isOwner,
      claimStatus: null  // 初始化为null
    });
    
    // 检查收藏状态
    const params = {
      id:_id,
      openid:openid
    };
    
    const result = await ajax('/checkCollection','POST',params);
    const {data}=result;
    if(data.length>0){
      let last = collectionIcon.pop();
      collectionIcon.unshift(last);
      this.setData({
        collectionIcon,
      })    
    }
    
    // 检查认领状态（如果不是发布者）
    if (!isOwner && openid) {
      const claimParams = {
        id: _id,
        openid: openid
      };
      try {
        const claimResult = await ajax('/checkClaim', 'POST', claimParams);
        const claimData = claimResult.data;
        if (claimData && claimData._id) {
          this.setData({
            claimStatus: claimData.status !== undefined ? claimData.status : null
          });
        } else {
          this.setData({
            claimStatus: null
          });
        }
      } catch(err) {
        console.error('检查认领状态失败:', err);
        this.setData({
          claimStatus: null
        });
      }
    } else if (!isOwner) {
      // 不是发布者但未登录，设置认领状态为null
      this.setData({
        claimStatus: null
      });
    }
    
    // 如果是发布者，加载认领列表
    if (isOwner) {
      this.loadClaimList();
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
