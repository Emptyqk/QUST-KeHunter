const express = require("express");
const app = express();
const {Lose,Collection,User,Admin,Claim} =require('./db');
const multer = require("multer");
const {v4}=require("uuid");
const axios = require("axios");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname));

app.all("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", '*');

    next();
})

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./file")
    },
    filename:(req,file,cb)=>{
        let type = file.originalname.replace(/.+\./,".");
        console.log(type);
        cb(null,`${v4()}${type}`)
    }
})
const upload = multer({storage});

app.post("/publish",async(req,res)=>{
    try{
        const {type,classify1,classify2,name,date,region,phone,desc,imgList,time,openid}=req.body;
        await Lose.create({
           type,
           classify1,
           classify2,
           name,
           date,
           region,
           phone,
           desc,
           imgList,
           time,
           openid,
           auditStatus: 0  // 鏂板彂甯冪殑鍐呭榛樿寰呭锟�?
        }); 
        res.send("success");
    }catch(err){
        res.send("fail");
    }

})

app.post("/uploadimg",upload.array("file",6),(req,res)=>{
    res.send(req.files);
})

app.get("/getLose",async(req,res)=>{
    const { type }=req.query;
    const result = await Lose.find({
        type,
        auditStatus: 1  // 鍙繑鍥炲鏍搁€氳繃鐨勫唴锟�?
    });
    res.send(result);
})

app.post("/toCollection",async(req,res)=>{
    try {
        const {id,openid}=req.body;
        // 妫€鏌ユ槸鍚﹀凡缁忔敹钘忚繃
        const existing = await Collection.findOne({
            id,
            openid
        });
        if (existing) {
            res.send("already_collected");
            return;
        }
        await Collection.create({
            id,
            openid,
        });
        res.send("success");
    } catch(err) {
        console.error('鏀惰棌澶辫触:', err);
        res.send("fail");
    }
})

app.get("/login",async(req,res)=>{
    const{code} = req.query;
    try{
        const {data:{openid}} =await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wxef792df4a772122a&secret=5d1d868ed7fbd67a6918803933ad756b&js_code=${code}&grant_type=authorization_code `);
        console.log(openid);
        res.send(openid);
    }catch(err){
        res.send("error");
    }    
})

app.post("/checkCollection",async(req,res)=>{
    try {
        const {openid,id} = req.body;
        const result = await Collection.find({
            openid,
            id
        });
        res.send(result);
    } catch(err) {
        console.error('妫€鏌ユ敹钘忓け璐�', err);
        res.send([]);
    }
})

app.get("/cancelCollection",async(req,res)=>{
    try{
        const {id,openid} = req.query;
        if (!id || !openid) {
            res.send("error");
            return;
        }
        const result = await Collection.findOneAndDelete({
            id,
            openid
        });
        if (result) {
            res.send("success");
        } else {
            res.send("not_found");
        }
    }catch(err){
       console.error('鍙栨秷鏀惰棌澶辫触:', err); 
       res.send("error");
    }
})


app.post("/getDetail",async(req,res)=>{
    const {_id} = req.body;
    try{
        const result = await Lose.findById(_id);
        res.send(result);
    }catch(err){
        res.send("error");
    }
})

app.post("/getCollection", async (req, res) => {
    try {
        const { openid, type } = req.body;
        
        if (!openid) {
            res.send([]);
            return;
        }
        
        const result = await Collection.find({
            openid
        }).populate('id');
        
        // 杩囨护鍑烘湁鏁堢殑鏀惰棌锛坕d瀛樺湪涓攖ype鍖归厤锟�?
        const _result = result.filter(item => {
            // 妫€鏌opulate鏄惁鎴愬姛锛屼互鍙奿d鏄惁琚垹锟�?
            if (!item.id) {
                return false; // 濡傛灉鍏宠仈鐨勬枃妗ｄ笉瀛樺湪锛岃繃婊ゆ帀
            }
            // 濡傛灉type瀛樺湪锛屽垯杩涜绫诲瀷杩囨护
            if (type !== undefined && type !== null) {
                return item.id.type === type;
            }
            return true;
        }).map(item => {
            // 灏嗘暟鎹牸寮忓寲涓哄墠绔渶瑕佺殑鏍煎紡
            return {
                id: {
                    _id: item.id._id,
                    ...item.id.toObject()
                },
                openid: item.openid,
                time: item.id.time || item.id.createdAt || new Date().getTime()
            };
        });
        
        res.send(_result);
    } catch(err) {
        console.error('鑾峰彇鏀惰棌鍒楄〃澶辫触:', err);
        res.send([]);
    }
})


app.get("/getMyPublish",async(req,res)=>{
    const{openid,type}=req.query;
    const result = await Lose.find({
        openid,type
    });
    res.send(result);
})

app.post("/getClassifyTwo",async(req,res)=>{
    const {type,classify2}=req.body;
    const result = await Lose.find({
        type,
        classify2,
        auditStatus: 1  // 鍙繑鍥炲鏍搁€氳繃鐨勫唴锟�?
    });
    res.send(result);
})

app.get('/searchLose',async(req,res)=>{
    const{name} = req.query;
    const _name = new RegExp(name);
    const result = await Lose.find({
        name:_name,
        auditStatus: 1  // 鍙繑鍥炲鏍搁€氳繃鐨勫唴锟�?
    })
    res.send(result);
})

app.post('/register', async (req, res) => {
    const { openid, username, password, date } = req.body;
    const result = await User.findOne({
        username
    });

    if (result) {
        res.send("Registered");
    } else {
        await User.create({
            openid,
            username,
            password,
            date
        });
        res.send("success");
    }
})

// 娉ㄥ唽
app.post("/toLogin", async (req, res) => {
    const { username, password } = req.body;
    const result = await User.findOne({
        username
    });
    if (result) {
        if (result.password === password) {
            res.send("success");
        } else {
            res.send("pwdError")
        }
    } else {
        res.send("error");
    }
})

app.post("/deleteLose",async (req, res) => { 
    const { _id } = req.body;
    try{
        await Lose.findByIdAndDelete(_id);
        await Collection.deleteMany({
            id: _id
        })
        res.send("success");
    }catch(error){
        res.send("error");
    }
})

app.post("/updateLose",async(req,res)=>{
    const {type,classify1,classify2,name,date,region,phone,desc,imgList,time,openid,id} = req.body;
    try{
        await Lose.findByIdAndUpdate(id,{
            type,
            classify1,
            classify2,
            name,
            date,
            region,
            phone,
            desc,
            imgList,
            time,
            openid
        })
        res.send("success");
    }catch(error){
        res.send("error");
    }

})


app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const result = await Admin.findOne({
        username
    })

    if (result && result.password === password) {
        res.send(result);
    } else {
        res.send("error");
    }
})

app.post("/admin/getLose", async (req, res) => {
    const { type, page, size } = req.body;
    try {
        const result = await Lose.find({
            type
        }).skip((page - 1) * size).limit(size).sort({ time: -1 });
        const total = await Lose.find({
            type
        }).countDocuments();
        res.send({
            result,
            total
        })
    } catch (error) {
        res.send("error");
    }

})

app.post("/admin/delete", async (req, res) => {
    const { _id } = req.body;
    try {
        await Lose.findByIdAndRemove(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

app.post("/admin/getUser", async (req, res) => {
    const { page, size, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i');
            const result = await User.find({
                username
            })
                .skip((page - 1) * size).limit(size);
            const total = await User.find().countDocuments();

            res.send({
                result,
                total
            })
        } else {
            const result = await User.find()
                .skip((page - 1) * size).limit(size);
            const total = await User.find().countDocuments();

            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error");
    }
})

app.post("/admin/deleteUser", async (req, res) => {
    const { _id } = req.body;
    try {
        await User.findByIdAndDelete(_id);
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

app.post("/admin/getAdmin", async (req, res) => {
    const { page, size, search } = req.body;
    try {
        if (search) {
            const username = new RegExp(search, 'i');
            const result = await Admin.find({
                username
            })
                .skip((page - 1) * size).limit(size);
            const total = await Admin.find().countDocuments();

            res.send({
                result,
                total
            })
        } else {
            const result = await Admin.find()
                .skip((page - 1) * size).limit(size);
            const total = await Admin.find().countDocuments();

            res.send({
                result,
                total
            })
        }
    } catch (error) {
        res.send("error");
    }
})


app.post("/admin/deleteAdmin", async (req, res) => {
    const { _id, username } = req.body;
    try {
        const { role } = await Admin.findOne({
            username
        });
        if (role === 1) {
            res.send("noPower");
        } else {
            await Admin.findByIdAndRemove(_id);
            res.send("success");
        }
    } catch (error) {
        res.send("error");
    }
})


app.post("/admin/addAdmin", async (req, res) => {
    const { username, password, role, nickname, _id } = req.body;

    try {
        if (_id) {
            await Admin.findByIdAndUpdate(_id, {
                username,
                password,
                role,
                nickname,
            })
        } else {
            await Admin.create({
                username,
                password,
                role,
                nickname,
                create_time: new Date().getTime()
            })
        }
        res.send("success");
    } catch (error) {
        res.send("error");
    }
})

app.post("/admin/getPower", async (req, res) => {
    const { username } = req.body;

    try {
        const { role } = await Admin.findOne({
            username
        });
        if (role === 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    } catch (error) {
        res.send("error");
    }
})

app.post("/addComment",async(req,res)=>{ 
    const {avatarUrl,nickname,content,time,_id} = req.body;
    try{
        let result = await Lose.findById(_id);
        let {commentList} = result;
        commentList.push({
            avatarUrl,
            nickname,
            content,
            time
        })
        await Lose.findByIdAndUpdate(_id,{
            commentList
        })
        result["commentList"] = commentList;
        res.send({
            status:"success",
            data:result
        });
        
    }catch(error){
        res.send({
            status:"error",
            data:error
        });
        
    }
})

// 璁ら澶辩墿/澶变富
app.post("/claim",async(req,res)=>{
    try {
        const {id,claimerOpenid} = req.body;
        
        if (!id || !claimerOpenid) {
            res.send("error");
            return;
        }
        
        // 鑾峰彇澶辩墿/澶变富淇℃伅
        const loseInfo = await Lose.findById(id);
        if (!loseInfo) {
            res.send("not_found");
            return;
        }
        
        // 妫€鏌ユ槸鍚﹀凡缁忚棰嗚繃
        const existing = await Claim.findOne({
            id,
            claimerOpenid,
            status: {$in: [0, 1]}  // 寰呯‘璁ゆ垨宸茬‘锟�?
        });
        
        if (existing) {
            res.send("already_claimed");
            return;
        }
        
        // 妫€鏌ユ槸鍚︽槸鑷繁鍙戝竷锟�?
        if (loseInfo.openid === claimerOpenid) {
            res.send("cannot_claim_own");
            return;
        }
        
        // 鍒涘缓璁ら璁板綍
        await Claim.create({
            id,
            claimerOpenid,
            ownerOpenid: loseInfo.openid,
            claimTime: new Date().getTime(),
            status: 0  // 寰呯‘锟�?
        });
        
        res.send("success");
    } catch(err) {
        console.error('璁ら澶辫触:', err);
        res.send("fail");
    }
})

// 鍙栨秷璁ら
app.get("/cancelClaim",async(req,res)=>{
    try{
        const {id,claimerOpenid} = req.query;
        if (!id || !claimerOpenid) {
            res.send("error");
            return;
        }
        const result = await Claim.findOneAndDelete({
            id,
            claimerOpenid,
            status: 0  // 鍙兘鍙栨秷寰呯‘璁ょ殑璁ら
        });
        if (result) {
            res.send("success");
        } else {
            res.send("not_found");
        }
    }catch(err){
       console.error('鍙栨秷璁ら澶辫触:', err); 
       res.send("error");
    }
})

// 鏌ヨ璁ら鐘讹拷?
app.post("/checkClaim",async(req,res)=>{
    try {
        const {id,openid} = req.body;
        const result = await Claim.findOne({
            id,
            claimerOpenid: openid
        });
        res.send(result || {});
    } catch(err) {
        console.error('鏌ヨ璁ら鐘舵€佸け锟�?:', err);
        res.send({});
    }
})

// 鑾峰彇鏌愪釜澶辩墿/澶变富鐨勬墍鏈夎棰嗚褰曪紙鍙戝竷鑰呮煡鐪嬶級
app.post("/getClaims",async(req,res)=>{
    try {
        const {id,ownerOpenid} = req.body;
        const result = await Claim.find({
            id,
            ownerOpenid
        }).sort({claimTime: -1});  // 鎸夎棰嗘椂闂村€掑簭
        res.send(result);
    } catch(err) {
        console.error('鑾峰彇璁ら鍒楄〃澶辫触:', err);
        res.send([]);
    }
})

// 纭璁ら锛堝彂甯冭€呯‘璁わ級
app.post("/confirmClaim",async(req,res)=>{
    try {
        const {claimId,ownerOpenid} = req.body;
        
        const claim = await Claim.findById(claimId);
        if (!claim) {
            res.send("not_found");
            return;
        }
        
        // 楠岃瘉鏄惁鏄彂甯冿拷?
        if (claim.ownerOpenid !== ownerOpenid) {
            res.send("unauthorized");
            return;
        }
        
        // 鏇存柊璁ら鐘舵€佷负宸茬‘锟�?
        await Claim.findByIdAndUpdate(claimId, {
            status: 1
        });
        
        // 鏇存柊澶辩墿鐘舵€佷负宸茶锟�?
        await Lose.findByIdAndUpdate(claim.id, {
            state: 1  // 1琛ㄧず宸茶锟�?
        });
        
        // 鎷掔粷鍏朵粬寰呯‘璁ょ殑璁ら
        await Claim.updateMany({
            id: claim.id,
            _id: {$ne: claimId},
            status: 0
        }, {
            status: 2  // 2琛ㄧず宸叉嫆锟�?
        });
        
        res.send("success");
    } catch(err) {
        console.error('纭璁ら澶辫触:', err);
        res.send("fail");
    }
})

// 鎷掔粷璁ら锛堝彂甯冭€呮嫆缁濓級
app.post("/rejectClaim",async(req,res)=>{
    try {
        const {claimId,ownerOpenid} = req.body;
        
        const claim = await Claim.findById(claimId);
        if (!claim) {
            res.send("not_found");
            return;
        }
        
        // 楠岃瘉鏄惁鏄彂甯冿拷?
        if (claim.ownerOpenid !== ownerOpenid) {
            res.send("unauthorized");
            return;
        }
        
        // 鏇存柊璁ら鐘舵€佷负宸叉嫆锟�?
        await Claim.findByIdAndUpdate(claimId, {
            status: 2
        });
        
        res.send("success");
    } catch(err) {
        console.error('鎷掔粷璁ら澶辫触:', err);
        res.send("fail");
    }
})

// 绠＄悊鍛樺鏍稿け锟�?/澶变富淇℃伅
app.post("/admin/audit", async (req, res) => {
    try {
        const { _id, auditStatus, auditReason } = req.body;
        
        if (!_id || auditStatus === undefined) {
            res.send("error");
            return;
        }
        
        const updateData = {
            auditStatus,
            auditTime: new Date().getTime()
        };
        
        if (auditStatus === 2 && auditReason) {
            updateData.auditReason = auditReason;
        }
        
        await Lose.findByIdAndUpdate(_id, updateData);
        res.send("success");
    } catch(err) {
        console.error('瀹℃牳澶辫触:', err);
        res.send("fail");
    }
})

// 鑾峰彇寰呭鏍稿垪锟�?
app.post("/admin/getAuditList", async (req, res) => {
    try {
        const { type, page, size, auditStatus } = req.body;
        const query = { type };
        
        // 濡傛灉鎸囧畾浜嗗鏍哥姸鎬侊紝鍒欒繃锟�?
        if (auditStatus !== undefined && auditStatus !== null) {
            query.auditStatus = auditStatus;
        }
        
        const result = await Lose.find(query)
            .skip((page - 1) * size)
            .limit(size)
            .sort({ time: -1 });
        const total = await Lose.find(query).countDocuments();
        
        res.send({
            result,
            total
        });
    } catch(err) {
        console.error('鑾峰彇瀹℃牳鍒楄〃澶辫触:', err);
        res.send("error");
    }
})

app.listen(3002,()=>{
    console.log("server running!");
})