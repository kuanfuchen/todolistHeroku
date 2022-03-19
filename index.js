const http = require('http');
const { uuid } = require('uuidv4');
const errorInfo = require('./err');
const header = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};
let todos = [];
const todolistFn = (req,res)=>{
  let body ='';
  req.on('data',chunk=>body +=chunk);
  if(req.url === '/todos' && req.method === 'GET'){
    res.writeHeader(200,header)
    res.write(JSON.stringify({
      status:'success',
      data:todos
    }))
    res.end();
  }else if(req.url === '/todos' && req.method === 'POST'){
    req.on('end',()=>{
      try{
        const title = JSON.parse(body).title;
        if(title !==undefined){
          todos.push({
            title,
            id:uuid()
          });
          res.writeHeader(200,header)
          res.write(JSON.stringify({
            status:'success',
            data:todos
          }))
        res.end();
        }else{
          errorInfo(header,res)
        }
      }catch(err){
        errorInfo(header,res)
      }
    })
  }else if(req.url === '/todos' && req.method === 'DELETE'){
    todos.length = 0;
    res.writeHeader(200,header)
    res.write(JSON.stringify({
      status:'success',
      data:todos
    }))
    res.end();
  }else if(req.url.startsWith('/todos/')&&req.method === 'DELETE'){
    const id = req.url.split('/').pop();
    const index = todos.findIndex(element=>element.id===id);
    if(index !== -1){
      todos.splice(index,1)
      res.writeHeader(200,header)
      res.write(JSON.stringify({
        status:'success',
        data:todos
      }))
    res.end();
    }else{
      errorInfo(header,res)
    }
  }else if(req.url.startsWith('/todos/')&&req.method ==='PATCH'){
    req.on('end',()=>{
      try{
        const text = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element=>element.id === id);
        if(text !== undefined &&index !==-1){
          todos[index].title = text;
          res.writeHeader(200,header)
          res.write(JSON.stringify({
            status:'success',
            data:todos
          }))
          res.end()
        }else{
          errorInfo(header,res)
        }
      }catch(err){
        errorInfo(header,res)
      }
    })
  }
  else{
    res.writeHeader(404,header);
    res.write(JSON.stringify({
      status:'false',
      message:'走錯網址囉!'
    }))
    res.end();
  }
}
http.createServer(todolistFn).listen(process.env.PORT||8080)