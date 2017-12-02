<template>
  <div class="overflow">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link to="/" class="navbar-brand">Hacktiv Overflow</router-link>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li><router-link to="/">Thread</router-link></li>
          </ul>
          <ul v-if="dataStorage.length == 0" class="nav navbar-nav navbar-right">
            <li><a href="#" data-toggle="modal" data-target="#login">Login</a></li>
            <li><a href="#" data-toggle="modal" data-target="#register">Register</a></li>
          </ul>
          <ul v-else v-for="dstr in dataStorage" class="nav navbar-nav navbar-right">
            <li>
              <p>Welcome, <span>{{ dstr.username }}</span> <a href="" @click="logout">Logout</a></p>
            </li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>

    <!-- Modal Register -->
    <div class="modal fade" id="register" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">Register</h4>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" id="email" placeholder="Email" v-validate="'required|email|email-unique'" :class="{'input': true, 'is-danger': errors.has('email')}" name="email" autocomplete="off" v-model="formRegister.email">
                <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
              </div>
              <div class="form-group">
                <label for="username">username</label>
                <input type="text" class="form-control" id="username" placeholder="Username" v-validate="'required|alpha_dash|regex:[a-zA-Z0-9]|min:6|user-unique'" :class="{'input': true, 'is-danger': errors.has('username')}" name="username" autocomplete="off" v-model="formRegister.user">
                <span v-show="errors.has('username')" class="help is-danger">{{ errors.first('username') }}</span>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-validate="'required|min:8'" :class="{'input': true, 'is-danger': errors.has('password')}" name="password" v-model="formRegister.pass">
                <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm Password" v-validate="'required|confirmed:password'" :class="{'input': true, 'is-danger': errors.has('confirmPassword')}" name="confirmPassword">
                <span v-show="errors.has('confirmPassword')" class="help is-danger">{{ errors.first('confirmPassword') }}</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="submitRegister($event)">Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Login -->
    <div class="modal fade" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <form>
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="myModalLabel">Login</h4>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="username">username</label>
                <input type="text" class="form-control" id="username" placeholder="Username" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('user')}" name="user" autocomplete="off" v-model="formLogin.user">
                <span v-show="errors.has('user')" class="help is-danger">{{ errors.first('user') }}</span>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('pass')}" name="pass" v-model="formLogin.pass">
                <span v-show="errors.has('pass')" class="help is-danger">{{ errors.first('pass') }}</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="submitLogin($event)">Login</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { Validator } from 'vee-validate'
  import JWT from 'jsonwebtoken'

  export default{
    data(){
      return {
        formRegister: {
          email: '',
          user: '',
          pass: ''
        },
        formLogin: {
          user: '',
          pass: ''
        },
        dataStorage: []
      }
    },
    beforeMount(){
      this.getDataLogin()
    },
    methods: {
      getDataLogin: function(){
        if(localStorage.token){
          let decoded = JWT.decode(localStorage.token)
          this.dataStorage.push(decoded)
        }
      },
      logout: function(){
        localStorage.clear()
        this.dataStorage.length = 0
        this.$router.go(this.$router.currentRoute)
      },
      submitRegister: function(e){
        e.preventDefault()
        this.$validator.validateAll({
          email: this.formRegister.email,
          username: this.formRegister.user,
          password: this.formRegister.pass,
          confirmPassword: this.formRegister.pass
        })
        this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/signup')
        .then(({body}) => {
          if(body.length == 0){
            if(!this.errors.any()){
              this.$http.post('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/signup', this.formRegister)
              .then(result => {
                alert('Sukses Register')
                setInterval(() => {
                  $('#register').modal('hide')
                }, 300)
              })
              .catch(err => {
                console.log(err)
              })
            }
          }else{
            this.$validator.validateAll({
              email: this.formRegister.email,
              username: this.formRegister.user,
              password: this.formRegister.pass,
              confirmPassword: this.formRegister.pass
            })
            .then(result => {
              if(result){
                this.$http.post('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/signup', this.formRegister)
                .then(data => {
                  alert('Sukses Register!')
                  setInterval(() => {
                    $('#register').modal('hide')
                  }, 300)
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
          }
        })
      },
      submitLogin: function(e){
        e.preventDefault()
        this.$validator.validateAll({
          user: this.formLogin.user,
          pass: this.formLogin.pass
        })
        if(!this.errors.any()){
          this.$http.post('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/signin', this.formLogin)
          .then(({body}) => {
            if(body === 'Wrong Username or Password!'){
              alert('Username atau Password Salah!')
            }else{
              localStorage.setItem('token', body)
              alert('Sukses Login!')
              setInterval(() => {
                this.$router.go(this.$router.currentRoute)
              }, 300)
            }
          })
          .catch(err => {
            console.log(err)
          })
        }
      }
    },
    beforeCreate(){
      const uniqueEmail = value => new Promise((resolve) => {
        this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/signup/email/' + value)
        .then(({body}) => {
          if(body.length == 0){
            return resolve({
              valid: true
            })
          }
          return resolve({
            valid: false,
            data: {
              message: `Email ${value} is already used!`
            }
          })
        })
      })

      Validator.extend('email-unique', {
        validate: uniqueEmail,
        getMessage: (fields, params, data) => data.message
      })

      const uniqueUser = value => new Promise((resolve) => {
        this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/signup/user/' + value)
        .then(({body}) => {
          if(body.length == 0){
            return resolve({
              valid: true
            })
          }
          return resolve({
            valid: false,
            data: {
              message: `Username ${value} is already used!`
            }
          })
        })
      })

      Validator.extend('user-unique', {
        validate: uniqueUser,
        getMessage: (fields, params, data) => data.message
      })
    }
  }
</script>
