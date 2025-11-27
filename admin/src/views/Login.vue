<template>
    <div class="body">
        <img class="bg" src="../assets/background.png" />
        <div class="form">
            <h2>稞小寻后台管理系统</h2>
            <el-input v-model="username" placeholder="请输入用户名"></el-input>
            <el-input v-model="password" placeholder="请输入密�?"show-password></el-input>
            <el-button @click="submit">登录</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                username:"",
                password:""
            }
        },
        methods:{
            async submit(){
                const {username,password} = this;
                if(!username || !password){
                    this.$message.error("存在未填�?");
                    return;
                }
                const params = {
                    username,
                    password
                };
                const res = await this.$http.post("/admin/login",params);
                const{data} = res;
                if(typeof data === "object"){
                    localStorage.setItem("userInfo",JSON.stringify(data));
                    this.$message.success("登录成功");
                    this.$router.push("/home");
                }else{
                    this.$message.error("账号或密码错�?");
                }
                console.log(res);
            }
        }
    }
</script>

<style lang="less" scoped>
    .body{
        width: 100%;
        height: 100vh;
        position: relative;
        overflow: hidden;
        margin:0 ;
        padding:0;
    }
    .bg{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 10;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .form {
        position: absolute;
        z-index:11;
        background-color: aliceblue;
        padding: 20px 30px;
        border-radius: 20px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        
        .el-input{
            margin-bottom: 20px;
        }
        .el-button{
            width: 100px;
            color: black;
        }
    }
    
</style>