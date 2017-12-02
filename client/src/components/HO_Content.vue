<template>
  <div class="content">
    <navbar/>
    <div class="container">
      <div class="row">
        <div class="col-md-12 text-left">
          <button v-if="dataStorage.length == 0" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#login">Add Thread</button>
          <router-link v-for="dstr in dataStorage" :to="{name: 'User', params: { userId: dstr.id }}" v-else class="btn btn-primary btn-sm">Add Thread</router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-left">
          <div v-for="thr in thread" class="col-md-12 text-left bodyThread">
            <div v-for="thr2 in thr.thread">
              <router-link :to="{ name: 'Thread', params: { slug: thr2.slug } }">
                <h4>{{ thr2.title }}</h4>
              </router-link>
              <p>
                <span>
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                  {{ thr2.date }}
                </span>
                <span>
                  <i class="fa fa-comment-o" aria-hidden="true"></i>
                  {{ thr.question.length }} Question
                </span>
                <span>
                  <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                  {{ thr2.author }}
                </span>
                <span>
                  <a href="" @click="getUpVotes(thr2.slug, $event)"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></a>
                  {{ thr.userU.length }}
                </span>
                <span>
                  <a href="" @click="getDownVotes(thr2.slug, $event)"><i class="fa fa-thumbs-down" aria-hidden="true"></i></a>
                  {{ thr.userD.length }}
                </span>
                <span v-for="dts in dataStorage" v-if="thr2.author == dts.username">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                  <a href="" @click="deleteThread(thr2._id, thr2.title, $event)">Delete</a>
                </span>
              </p>
            </div>
          </div>
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
    data: function(){
      return {
        thread: [],
        votes: [],
        dataStorage: []
      }
    },
    mounted(){
      this.getStorage()
    },
    methods: {
      getStorage: function(){
        if(localStorage.token){
          let decoded = JWT.decode(localStorage.token)
          this.dataStorage.push(decoded)
        }
      },
      getThread: function(){
        this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/')
        .then(({body}) => {
          body.forEach(r => {
            this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/'+ r.slug)
            .then(({body}) => {
              this.thread.push(body)
            })
          })
        })
      },
      getUpVotes: function(slug, e){
        e.preventDefault()
        if(localStorage.token){
          let decoded = JWT.decode(localStorage.token)
          this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/' + slug + '/' + decoded.username + '/upvotes')
          .then(({body}) => {
            alert(body)
            setInterval(() => {
              this.$router.go(this.$router.currentRoute)
            }, 300)
          })
        }
      },
      getDownVotes: function(slug, e){
        e.preventDefault()
        if(localStorage.token){
          let decoded = JWT.decode(localStorage.token)
          this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/' + slug + '/' + decoded.username + '/downvotes')
          .then(({body}) => {
            alert(body)
            setInterval(() => {
              this.$router.go(this.$router.currentRoute)
            }, 300)
          })
        }
      },
      deleteThread: function(id, title, e){
        e.preventDefault()
        if(confirm('Are you sure want to delete this ' + title)){
          this.$http.delete('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/' + id, {
            headers: {
              'token': localStorage.token
            }
          })
          .then(result => {
            this.$router.go(this.$router.currentRoute)
          })
          .catch(err => {
            console.log(err)
          })
        }
      }
    },
    beforeMount(){
      this.getThread()
    }
  }
</script>
