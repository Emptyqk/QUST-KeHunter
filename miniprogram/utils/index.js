export const formatTime=(time)=>{
  const _time = new Date(time);
  const y = _time.getFullYear();
  const m = _time.getMonth()+1;
  const d = _time.getDate();

  return `${y}年${m}月${d}日`;
}


export const ajax = (url,method,data)=> {
  const base_url = 'http://localhost:3002';
  return new Promise((resolve,reject)=>{
    wx.request({
      url: `${base_url}${url}`,
      method:method?method:'GET',
      data,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}