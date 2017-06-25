const BaseUrl = 'https://newsapi.org/v1/articles?source='
const APIkey = '83134a2da37b4345ad4a92485ec18024'
// const Sources = []

function buildUrl (source) {
  return BaseUrl + source + '&apiKey=' + APIkey
}

Vue.component('news-list', {
  // props: ['sources'],
  data () {
    return {
      results: [],
      source: null,
      sources: [],
      lang: '',
      cat: '',
      loading: false
    }
  },
  template: `
  <section class="section">
  <div class="container">

  <form action="">
    <div class="columns is-mobile">
      <div class="column is-half">
      <h5 class="text-center">Filter by Language</h5>
      <div class="field">
        <p class="control">
          <label class="radio">
            <input type="radio" id="en" value="en" v-model="lang">
            English
          </label>
          <label class="radio">
            <input type="radio" id="de" value="de" v-model="lang">
            Deutsch
          </label>
        </p>
      </div>

      <h5 class="text-center">Filter by Category</h5>
      <div class="field">
        <p class="control">
          <label class="radio">
            <input type="radio" id="business" value="business" v-model="cat">
            Business
          </label>
          <label class="radio">
            <input type="radio" id="entertainment" value="entertainment" v-model="cat">
            Entertainmant
          </label>
          <label class="radio">
            <input type="radio" id="gaming" value="gaming" v-model="cat">
            Gaming
          </label>
          <label class="radio">
            <input type="radio" id="general" value="general" v-model="cat">
            General
          </label>
          <label class="radio">
            <input type="radio" id="music" value="music" v-model="cat">
            Music
          </label>
          <label class="radio">
            <input type="radio" id="politics" value="politics" v-model="cat">
            Politics
          </label>
          <label class="radio">
            <input type="radio" id="science-and-nature" value="science-and-nature" v-model="cat">
            Sciene and Nature
          </label>
          <label class="radio">
            <input type="radio" id="sport" value="sport" v-model="cat">
            Sport
          </label>
          <label class="radio">
            <input type="radio" id="technology" value="technology" v-model="cat">
            Technology
          </label>
          <label class="radio">
            <input type="radio" id="" value="" v-model="cat">
            All
          </label>
        </p>
      </div>

      </div>
      <div class="column is-half"></div>
    </div>
  </form>
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
    <div class="container" v-if="loading">
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
  watch: {
    lang: function() {
      console.log('watcher fired')
      this.loadSources(this.cat, this.lang)
    },
    cat: function() {
      console.log('watcher fired')
      this.loadSources(this.cat, this.lang)
    }
  },
  methods: {
    getPosts(source) {
      this.loading = false
      this.results = []
      let url = buildUrl(source)
      axios.get(url)
        .then(res => {
          this.results = res.data.articles
        })
        .then(this.loading = true)
        .catch( err => {console.log(err)})
    },
    loadSources(cat = '', lang = '') {
      this.sources = []
      axios.get(`https://newsapi.org/v1/sources?category=${cat}&language=${lang}`)
      .then(res => {this.sources = res.data.sources})
      .catch( err => {console.log(err)})
    }
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
    // this.loadSources()
    // this.getPosts(this.source)
  },
  methods: {
    // getPosts(source) {
    //   let url = buildUrl(source)
    //   axios.get(url)
    //     .then(res => {
    //       this.results = res.data.articles
    //     })
    //     .catch( err => {console.log(err)})
    // },
    loadSources(cat = '', lang = '') {
      axios.get(`https://newsapi.org/v1/sources?category=${cat}&language=${lang}`)
      .then(res => {this.sources = res.data.sources})
      .catch( err => {console.log(err)})
    }
  },

})
