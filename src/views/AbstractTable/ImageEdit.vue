<template>
  <div class="Abstract">
    <header>
      <div class="header-banner" :style="{ 'background-image': 'url(' + this.background_image + ')' }">
        <h1 style="font-size: 40px;">{{ this.name }}</h1>
      </div>
      <div class="clear"></div>
      <nav>
        <div class="site-title" style="font-size: 18px;">{{ this.name }}</div>
        <ul>
          <li><router-link to="/Home"><a>主页</a></router-link></li>
          <li><router-link to="/UserTable"><a>用户管理</a></router-link></li>
          <li><router-link to="/PointTable"><a>地图点管理</a></router-link></li>
          <li><router-link to="/AbstractTable"><a>详情页管理</a></router-link></li>
          <li><router-link to="/AddPoint"><a>添加地图点</a></router-link></li>
          <li><router-link to="/PickPoint"><a>坐标拾取</a></router-link></li>
        </ul>
      </nav>
    </header>

    <div class="body">
      <section class="content">
        <article>
          <AbstractImageUpload :avatar="bg_image_upload" :region="options_OSS.region" :accessKeyId="options_OSS.accessKeyId"
            :accessKeySecret="options_OSS.accessKeySecret" :bucket="options_OSS.bucket" @avatarUrl="getAvatarUrl"
            @deleteAvatar="deleteAvatar"></AbstractImageUpload>
          <AbstractImageUpload :avatar="bg_image_upload" :region="options_OSS.region" :accessKeyId="options_OSS.accessKeyId"
            :accessKeySecret="options_OSS.accessKeySecret" :bucket="options_OSS.bucket" @avatarUrl="getAvatarUrl"
            @deleteAvatar="deleteAvatar"></AbstractImageUpload>
          <AbstractImageUpload :avatar="bg_image_upload" :region="options_OSS.region" :accessKeyId="options_OSS.accessKeyId"
            :accessKeySecret="options_OSS.accessKeySecret" :bucket="options_OSS.bucket" @avatarUrl="getAvatarUrl"
            @deleteAvatar="deleteAvatar"></AbstractImageUpload>
        </article>
        <aside>
          <el-divider></el-divider>
          <img :src="panel_imgURL_top">
          <img :src="panel_imgURL_bottom">
          <el-divider></el-divider>
        </aside>
      </section>
    </div>
  </div>
</template>
  
<script>
import $ from 'jquery'
import AbstractImageUpload from '@/components/AbstractImageUpload.vue';
import ossConfig from '@/utils/ossConfig';
export default {
  components: { AbstractImageUpload },
  data() {
    return {
      name: '东湖樱园',
      like_times: 0,
      background_image: 'https://picture-tjl.oss-cn-hangzhou.aliyuncs.com/WuHan_Flower/yinghua/%E5%A0%A4%E8%A7%92%E5%85%AC%E5%9B%AD%E6%A8%B1%E8%8A%B13.jpg',
      content: ``,
      panel_imgURL_top: '',
      panel_imgURL_bottom: '',
      options_OSS: ossConfig.options_OSS,
      bg_image_upload: '',
    }
  },
  mounted() {
    $(window).scroll(function () {
      if ($(window).scrollTop() >= 300) {
        $('nav').addClass('fixed-header');
        $('nav div').addClass('visible-title');
      }
      else {
        $('nav').removeClass('fixed-header');
        $('nav div').removeClass('visible-title');
      }
    });
  },
  created() {
    console.log(this.$route.params.id)
    this.$axios.get('http://127.0.0.1:8000/abstract_content/' + this.$route.params.id).then((res) => {
      this.name = res.data.name;
      this.background_image = res.data.background_image;
      this.panel_imgURL_top = res.data.panel_imgURL_top;
      this.panel_imgURL_bottom = res.data.panel_imgURL_bottom;
      this.like_times = res.data.like_times;
    }).catch(err => {
      console.log(err);
      this.$message.error('数据载入失败，请检查网络！');
    })
  },
  methods: {
    deleteAvatar() {
    },
    getAvatarUrl(avatarUrl) {
      console.log("图片url:", avatarUrl);
    },
  }
}
</script>
  
<style lang="scss" scoped>
.Abstract {
  font-family: "PingFang SC";
}

/* resets */
.body {
  margin: 0px;
  padding: 0px;
  overflow: hidden
}

/* main */
header {
  height: 360px;
  z-index: 10;
}

.header-banner {
  background-color: #333;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 300px;
}

header h1 {
  background-color: rgba(94, 97, 109, 0.7);
  color: #fff;
  padding: 0 1rem;
  position: absolute;
  top: 2rem;
  left: 2rem;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

nav {
  width: 100%;
  height: 60px;
  background: #292f36;
  z-index: 10;
}

nav div {
  color: white;
  font-size: 2rem;
  line-height: 60px;
  position: absolute;
  top: 0;
  left: 2%;
  visibility: hidden;
}

.visible-title {
  visibility: visible;
}

nav ul {
  list-style-type: none;
  margin: 0 2% auto 0;
  padding-left: 0;
  text-align: right;
  max-width: 100%;
}

nav ul li {
  display: inline-block;
  line-height: 60px;
  margin-left: 10px;
}

nav ul li a {
  text-decoration: none;
  color: #a9abae;
}

/* demo content */
body {
  color: #292f36;
  font-family: helvetica;
  line-height: 1.6;
}

.content {
  margin: 0 auto;
  padding: 4rem 0;
  width: 960px;
  max-width: 100%;
}

article {
  float: left;
  width: 720px;
}

article p:first-of-type {
  margin-top: 0;
}

aside {
  float: right;
  width: 240px;
}

p img {
  max-width: 100%;
}

@media only screen and (max-width: 960px) {
  .content {
    padding: 2rem 0;
  }

  article {
    float: none;
    margin: 0 auto;
    width: 96%;
  }

  article:last-of-type {
    margin-bottom: 3rem;
  }

  aside {
    float: none;
    text-align: center;
    width: 100%;
  }
}

aside img {
  width: 240px;
  height: 240px;
  object-fit: cover;
  margin-bottom: 10px;
}
</style>