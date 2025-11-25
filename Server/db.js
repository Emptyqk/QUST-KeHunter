const mongoose = require("mongoose");
const { type } = require("os");
mongoose.connect("mongodb://localhost:27017/loseMg")
.then(() =>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})

const LoseSchema = new mongoose.Schema({
    type:{
        type:Number,

    },
    classify1:{
        type:String,
    },
    classify2:{
        type:String,
    },
    name:{
        type:String,
    },
    date:{
        type:String,
    },
    region:{
        type:String,
    },
    phone:{
        type:String,
    },
    desc:{
        type:String,
        default:''
    },
    commentList:{
        type:Array,
        default:[]
    },
    state:{
        type:Number,
        default:0
    },
    imgList:{
        type:Array,
        default:[]
    },
    time:{
        type:Number
    },
    openid:{
        type:String 
    },
    auditStatus:{
        type:Number,
        default:0  // 0-待审核, 1-审核通过, 2-审核拒绝
    },
    auditTime:{
        type:Number  // 审核时间
    },
    auditReason:{
        type:String  // 审核拒绝原因
    }
})

const CollectionSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lose'
    },
    openid:{
        type:String
    },
})

const ClaimSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lose'
    },
    claimerOpenid:{
        type:String  // 认领者的openid
    },
    ownerOpenid:{
        type:String  // 发布者的openid
    },
    claimTime:{
        type:Number  // 认领时间
    },
    status:{
        type:Number,  // 状态：0-待确认, 1-已确认, 2-已拒绝
        default:0
    }
})

const UserSchema = new mongoose.Schema({
    openid:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    date:{
        type:Number
    }
})

const AdminSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    create_time:{
        type:Number
    },
    role:{
        type:Number
    },
    
    nickname:{
        type:String
    }

})



const Lose = mongoose.model("Lose",LoseSchema);
const Collection = mongoose.model("Collection",CollectionSchema);
const User = mongoose.model("User",UserSchema);
const Admin = mongoose.model("Admin",AdminSchema);
const Claim = mongoose.model("Claim",ClaimSchema);


module.exports = {
    Lose,
    Collection,
    User,
    Admin,
    Claim
}