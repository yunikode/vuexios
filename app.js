const BaseUrl = 'https://newsapi.org/v1/articles?source='
const APIkey = '83134a2da37b4345ad4a92485ec18024'
// const Sources = []

function buildUrl (source) {
  return BaseUrl + source + '&apiKey=' + APIkey
}

Vue.component('news-list', {
  props: ['sources'],
  data () {
    return {
      results: [],
      source: null
    }
  },
  template: `
  <section class="section">
  <div class="container">

  <h5 class="text-center">Filter by Source</h5>
  <form>
    <div class="columns is-mobile">
      <div class="column is-half">
        <div class="field">
          <p class="control">
            <span class="select">
              <select v-model="source">
                <option :value="source.id" v-for="source in sources">{{ source.id }}</option>
              </select>
            </span>
          </p>
        </div>
      </div>
      <div class="column is-half">
        <a @click="getPosts(source)" class="button">Get News</a>
      </div>
    </div>
  </form>
  </div>
    <div class="container">
      <div class="columns is-mobile" v-for="posts in processedPosts">
        <div class="column is-half-mobile is-one-quarter-desktop" v-for="post in posts">
          <div class="card">
            <a :href="post.url" target="_blank" class="decoration__none">
              <header class="card-header">
                <p class="card-header-title">
                  {{ post.title }}
                </p>
              </header>
              <div class="card-image">
                <figure class="image is-4by3">
                  <img :src="post.image_url" alt="title image" />
                </figure>
              </div>

              <div class="card-content">
                <div class="content">
                  <p>{{ post.description }}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  computed: {
    processedPosts() {
      let posts = this.results
      let chunkSize = 4

      posts.map(post => {
        let imgObj = post.urlToImage
        if (imgObj.length > 1) {
          post.image_url = imgObj
        } else {
          post.image_url = `http://placehold.it/300x200?text=${post.title}`
        }
      })

      if (window.outerWidth < 700) {
        chunkSize = 2
      };

      let i, j, chunkedArray = [], chunk = chunkSize;
      for (i=0, j=0; i < posts.length; i += chunk, j++) {
        chunkedArray[j] = posts.slice(i, i+chunk)
      }

      return chunkedArray
    }
  },
  methods: {
    getPosts(source) {
      let url = buildUrl(source)
      axios.get(url)
        .then(res => {
          this.results = res.data.articles
        })
        .catch( err => {console.log(err)})
    },
  }
})

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    sources: [],
    // source: 'bbc-news'
  },
  mounted() {
    this.loadSources()
    // this.getPosts(this.source)
  },
  methods: {
    getPosts(source) {
      let url = buildUrl(source)
      axios.get(url)
        .then(res => {
          this.results = res.data.articles
        })
        .catch( err => {console.log(err)})
    },
    loadSources(cat = '', lang = '') {
      axios.get(`https://newsapi.org/v1/sources?category=${cat}&language=${lang}`)
      .then(res => {this.sources = res.data.sources})
      .catch( err => {console.log(err)})
    }
  },

})
