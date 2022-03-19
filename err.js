function errorInfo(header,res){
  res.writeHeader(400,header);
  res.write(JSON.stringify({
    status:'false',
    message:'格式錯誤'
  }))
  res.end()
}
module.exports = errorInfo;