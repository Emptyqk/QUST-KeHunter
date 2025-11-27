Component({
  data:{
    select:0,
    list: [
      {
        iconPath: "../images/index.png",
        pagePath: "/pages/index/index",
        selectedIconPath: "../images/index_2.png",
        text: "首页",
        type: 0
      },
      {
        iconPath: "../images/collection.png",
        pagePath: "/pages/classify/classify",
        selectedIconPath: "../images/collection_2.png",
        text: "分类",
        type: 0
      },
      {
        type:1,
        pagePath: "/pages/publish/publish"
      },
      {
        iconPath: "../images/classify.png",
        pagePath: "/pages/collection/collection",
        selectedIconPath: "../images/classify_2.png",
        text: "收藏",
        type: 0
      },
      {
        "iconPath": "../images/me.png",
        "pagePath": "/pages/me/me",
        "selectedIconPath": "../images/me_2.png",
        "text": "我的",
        type: 0
      }
    ]
  },

  methods:{
    selectPage(e){
      const { index, page, type } = e.currentTarget.dataset;
      if (index !== this.data.select && type === 0) {
          wx.switchTab({
            url: page,
          })
      }else {
          wx.navigateTo({
            url: page,
          })
      }
    }
  }
})