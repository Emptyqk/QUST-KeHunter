// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      asideBar:[
        "卡片、证件类", "生活用品", "数码产品", "美妆护肤类", "衣服物品类", "饰品", "文娱", "其它"
      ],
      rightlist:[
        [
          {
            url:"../../images/card1.png",
            text:"身份证"
          },
          {
            url:"../../images/card2.png",
            text:"校园卡"
          },
          {
            url:"../../images/card5.png",
            text:"学生证"
          },
          {
            url:"../../images/card3.png",
            text:"公交卡"
          },
          {
            url:"../../images/card4.png",
            text:"银行卡"
          },
          {
            url:"../../images/other.png",
            text:"其它"
          }
        ],
        [
          {
            url:"../../images/life1.png",
            text:"水杯"
          },
          {
            url:"../../images/life2.png",
            text:"雨伞"
          },
          {
            url:"../../images/life3.png",
            text:"钥匙/钥匙扣"
          },
          {
            url:"../../images/other.png",
            text:"其他"
          },
        ],
        [
          {
            url:"../../images/mobile1.png",
            text:"手机"
          },
          {
            url:"../../images/mobile2.png",
            text:"电脑"
          },
          {
            url:"../../images/mobile3.png",
            text:"相机"
          },
          {
            url:"../../images/mobile4.png",
            text:"U盘/硬盘"
          },
          {
            url:"../../images/mobile5.png",
            text:"充电宝"
          },
          {
            url:"../../images/mobile6.png",
            text:"平板电脑"
          },
          {
            url:"../../images/mobile7.png",
            text:"鼠标"
          },
          {
            url:"../../images/mobile8.png",
            text:"充电线"
          },
          {
            url:"../../images/mobile9.png",
            text:"耳机"
          },
          {
            url:"../../images/mobile10.png",
            text:"手写笔"
          },
          {
            url:"../../images/other.png",
            text:"其他"
          },    
        ],
        [
          {
            url:"../../images/makeup1.png",
            text:"口红"
          }, 
          {
            url:"../../images/makeup2.png",
            text:"粉底"
          }, 
          {
            url:"../../images/makeup3.png",
            text:"眉笔"
          }, 
          {
            url:"../../images/makeup4.png",
            text:"腮红"
          }, 
          {
            url:"../../images/makeup5.png",
            text:"眼影"
          }, 
          {
            url:"../../images/makeup6.png",
            text:"防晒"
          }, 
          {
            url:"../../images/makeup7.png",
            text:"喷雾"
          }, 
          {
            url:"../../images/makeup8.png",
            text:"香水"
          }, 
          {
            url:"../../images/other.png",
            text:"其他"
          }, 
        ],
        [
          {
            url:"../../images/clothes1.png",
            text:"男装"
          },
          {
            url:"../../images/clothes2.png",
            text:"女装"
          },
          {
            url:"../../images/clothes3.png",
            text:"鞋子"
          },
          {
            url:"../../images/clothes4.png",
            text:"包包"
          },
          {
            url:"../../images/other.png",
            text:"其他"
          },
        ],
        [
          {
            url:"../../images/design1.png",
            text:"手表"
          },
          {
            url:"../../images/design2.png",
            text:"项链"
          },
          {
            url:"../../images/design3.png",
            text:"手链"
          },
          {
            url:"../../images/design4.png",
            text:"戒指"
          },
          {
            url:"../../images/design5.png",
            text:"耳饰"
          },
          {
            url:"../../images/design6.png",
            text:"眼镜"
          },
          {
            url:"../../images/design7.png",
            text:"帽子"
          },
          {
            url:"../../images/design8.png",
            text:"发饰"
          },
          {
            url:"../../images/other.png",
            text:"其他"
          },
        ],
        [
          {
            url:"../../images/wenyu.png",
            text:"教材"
          },
          {
            url:"../../images/wenyu2.png",
            text:"笔记"
          },
          {
            url:"../../images/wenyu3.png",
            text:"文具"
          },
          {
            url:"../../images/wenyu4.png",
            text:"运动"
          },          
          {
            url:"../../images/other.png",
            text:"其他"
          },
        ],
        [
          {
            url:"../../images/food1.png",
            text:"药品"
          },
          {
            url:"../../images/food2.png",
            text:"饭"
          },
          {
            url:"../../images/food3.png",
            text:"零食"
          },
          {
            url:"../../images/food4.png",
            text:"周边"
          },
        ]
      ],
      select:0,
  },

  toClassify(e){
    const {text} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../classifylist/classifylist?text=${text}`,
    })
  },


  selectLeft(e){
    const { index } = e.currentTarget.dataset;
    this.setData({
      select:index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
          select: 1
      })
    }
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