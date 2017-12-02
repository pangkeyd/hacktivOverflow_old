<template>
  <div class="add_thread">
    <navbar/>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h3>Add Thread</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-left">
          <router-link to="/" class="btn btn-primary btn-sm">Back to Home</router-link>
        </div>
      </div>
      <div class="row form_add_thread">
        <div class="col-md-12 text-left">
          <form>
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" class="form-control" id="title" placeholder="Title" v-model="formAddThread.title" name="title" v-validate="'required'" :class="{ 'input': true, 'is-danger': errors.has('title') }">
              <span v-show="errors.has('title')" class="help is-danger">{{ errors.first('title') }}</span>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea class="form-control" rows="3" placeholder="Description" name="desc" v-model="formAddThread.desc" v-validate="'required'" :class="{ 'input': true, 'is-danger': errors.has('desc') }"></textarea>
              <span v-show="errors.has('desc')" class="help is-danger">{{ errors.first('desc') }}</span>
            </div>
            <button type="submit" class="btn btn-success" @click="submitThread($event)">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from './HO_FrontPage.vue'
  import JWT from 'jsonwebtoken'

  export default{
    components: {
      'navbar': Navbar
    },
    data(){
      return {
        formAddThread: {
          title: '',
          desc: '',
          author: ''
        }
      }
    },
    beforeMount(){
      this.getStorage()
    },
    methods: {
      getStorage: function(){
        let decoded = JWT.decode(localStorage.token)
        this.formAddThread.author = decoded.username
      },
      submitThread: function(e){
        e.preventDefault()
        this.$validator.validateAll({
          title: this.formAddThread.title,
          desc: this.formAddThread.desc
        })
        if(!this.errors.any()){
          this.$http.post('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com', this.formAddThread, {
            headers: {
              'token': localStorage.token
            }
          })
          .then(result => {
            alert('Berhasil di Post!')
            setInterval(() => {
              this.$router.push('/')
            }, 300)
          })
          .catch(err => {
            console.log(err)
          })
        }
      }
    }
  }
</script>
