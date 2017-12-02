<template>
  <div class="thread">
    <navbar/>
    <div class="container">
      <div class="row">
        <div v-for="dtr in dataThread" class="col-md-12 text-left">
          <h3>{{ dtr.thread[0].title }}</h3>
          <p class="spec"><i class="fa fa-calendar" aria-hidden="true"></i> {{ dtr.thread[0].date }}</p>
          <p class="spec"><i class="fa fa-user-circle-o" aria-hidden="true"></i> {{ dtr.thread[0].author }}</p>
          <p class="desc">{{ dtr.thread[0].description }}</p>
          <div class="question">
            <p v-for="dtrQ in dtr.question" class="item_ques">
              {{ dtrQ.question }} ~ from
              <span style="color: blue">
                {{ dtrQ.author }}
              </span>

              <span v-if="dataStorage || dtrQ.author == dataStorage[0].username">
                <i class="fa fa-trash" aria-hidden="true"></i>
                <a href="" @click="deleteQuestion(dtr.slug, dtrQ._id, dtrQ.question, $event)" >Delete</a>
              </span>
            </p>
            <a v-if="dataStorage.length == 0" href="" data-toggle="modal" data-target="#login" class="add_comment">Add Comment</a>
            <a v-else data-toggle="modal" data-target="#comment" class="add_comment" href="">Add Comment</a>
          </div>

          <!-- Modal Comment -->
          <div class="modal fade" id="comment" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
              <form>
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Add Comment</h4>
                  </div>
                  <div class="modal-body">
                    <div class="form-group">
                      <label for="question">Comment</label>
                      <textarea class="form-control" rows="3" name="comment" v-validate="'required'" v-model="formComment.ques" :class="{ 'input': true, 'is-danger': errors.has('comment') }"></textarea>
                      <span v-show="errors.has('comment')" class="help is-danger">{{ errors.first('comment') }}</span>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="submitComment($event)">Comment</button>
                  </div>
                </div>
              </form>
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
        dataThread: [],
        dataStorage: [],
        formComment: {
          author: '',
          thread: this.$route.params.slug,
          ques: ''
        }
      }
    },
    beforeMount: function(){
      this.getStorage()
      this.getThread()
    },
    methods: {
      getStorage: function(){
        if(localStorage.token){
          let decoded = JWT.decode(localStorage.token)
          this.dataStorage.push(decoded)
        }
      },
      submitComment: function(e){
        e.preventDefault()
        this.$validator.validateAll({
          comment: this.formComment.ques
        })
        if(localStorage.token){
          let decoded = JWT.decode(localStorage.token)
          if(decoded){
            this.formComment.author = decoded.username
            if(!this.errors.any()){
              this.$http.post('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/' + this.$route.params.slug, this.formComment, {
                headers: {
                  'token': localStorage.token
                }
              })
              .then(result => {
                alert('Comment berhasil di Post!')
                setInterval(() => {
                  this.$router.go(this.$router.currentRoute)
                }, 300)
              })
              .catch(err => {
                console.log(err)
              })
            }
          }
        }
      },
      getThread: function(){
        this.$http.get('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/' + this.$route.params.slug)
        .then(({body}) => {
          this.dataThread.push(body)
        })
      },
      deleteQuestion: function(slug, id, ques, e){
        e.preventDefault()
        if(confirm('Are you sure want to delete this ' + ques)){
          this.$http.delete('http://ec2-34-212-30-138.us-west-2.compute.amazonaws.com/' + slug + '/' + id, {
            headers: {
              'token': localStorage.token
            }
          })
          .then(result => {
            this.$router.go(this.$router.currentRoute)
          })
        }
      }
    }
  }
</script>
