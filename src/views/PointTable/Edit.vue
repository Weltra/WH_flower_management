<template>
  <div>
    <header>
      <Header :routelist="routelist"></Header>
    </header>
    <div class="body">
      <div id="contact-form" class="contact-form">
        <h1 class="contact-form_title">
          <i class="el-icon-edit"></i>更新地图点信息
        </h1>
        <div class="separator"></div>
        <div class="form">
          <input
            style="background-color: white"
            v-model="point.name"
            placeholder="赏花点名称"
            type="text"
            autocomplete="off"
          />
          <input
            style="background-color: white"
            v-model="point.description"
            placeholder="地址"
            type="text"
            autocomplete="off"
          />
          <div>
            <input
              style="background-color: white"
              v-model="point.longitude"
              placeholder="经度"
              type="number"
              autocomplete="off"
            />
            <input
              style="background-color: white"
              v-model="point.latitude"
              placeholder="纬度"
              type="number"
              autocomplete="off"
            />
          </div>
          <input
            style="background-color: white"
            v-model="point.ticket"
            placeholder="门票价格"
            type="text"
            autocomplete="off"
          />
          <input
            style="background-color: white"
            v-model="point.open_time"
            placeholder="开放时间"
            type="text"
            autocomplete="off"
          />
          <input
            style="background-color: white"
            v-model="point.traffic"
            placeholder="交通方式"
            type="text"
            autocomplete="off"
          />
          <input
            style="background-color: white"
            v-model="point.flower_class"
            placeholder="花卉种类"
            type="text"
            autocomplete="off"
          />
          <p style="color: #5d655f; font-weight: 550; font-size: 17px">
            <i class="el-icon-picture"></i> 添加赏花点图片：
          </p>
          <div class="upload">
            <div class="upload-file">
              <ImageUploader
                :avatar="avatar"
                :region="options_OSS.region"
                :accessKeyId="options_OSS.accessKeyId"
                :accessKeySecret="options_OSS.accessKeySecret"
                :bucket="options_OSS.bucket"
                @avatarUrl="getAvatarUrl"
                @deleteAvatar="deleteAvatar"
              >
              </ImageUploader>
            </div>
          </div>
          <el-button class="button" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ImageUploader from '@/components/ImageUpload.vue'
import ossConfig from '@/utils/ossConfig'

export default {
  components: { Header, ImageUploader },
  data() {
    return {
      routelist: [
        { route: '/Home', name: '主页' },
        { route: '/UserTable', name: '用户管理' },
        { route: '/PointTable', name: '地图点管理' },
        { route: '/AbstractTable', name: '详情页管理' },
        { route: '/PickPoint', name: '坐标拾取' },
      ],
      point: {
        id: 0,
        name: '',
        description: '',
        longitude: '',
        latitude: '',
        imgURL: '',
        traffic: '',
        open_time: '',
        ticket: '',
        flower_class: '',
      },
      avatar: '',
      options_OSS: ossConfig,
    }
  },
  created() {
    this.$axios
      .get('http://127.0.0.1:8000/points/' + this.$route.params.id)
      .then((res) => {
        this.point = res.data
      })
      .catch((err) => {
        console.log(err)
        this.$message.error('数据载入失败，请检查网络！')
      })
  },
  methods: {
    getAvatarUrl(avatarUrl) {
      console.log('图片url:', avatarUrl)
      this.point.imgURL = avatarUrl
    },
    deleteAvatar() {},
    submit() {
      this.$axios
        .post(
          'http://127.0.0.1:8000/update_map_point/' + this.$route.params.id,
          this.point
        )
        .then((res) => {
          if (res.data.code == '0000') {
            this.$message({
              message: '地图点更新成功！',
              type: 'success',
            })
            this.point = {
              id: 0,
              name: '',
              description: '',
              longitude: '',
              latitude: '',
              imgURL: '',
              traffic: '',
              open_time: '',
              ticket: '',
              flower_class: '',
            }
          } else if (res.data.code == '0001') {
            this.$message.error('参数错误，地图点更新失败！')
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('地图点更新失败！')
        })
    },
  },
}
</script>

<style scoped>
@import 'open-props/open-props.min.css' layer(open-props);
@import 'open-props/normalize.min.css' layer(open-props);

.body {
  background: white;
  font-family: 'Roboto', sans-serif;
  height: 101vh;
}

.contact-form {
  font-family: 16px;
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}

.contact-form .separator {
  border-bottom: solid 1px #ccc;
  margin-bottom: 15px;
}

.contact-form .form {
  display: flex;
  flex-direction: column;
  font-size: 16px;
}

.contact-form_title {
  color: #333;
  text-align: left;
  font-size: 28px;
  margin-bottom: 10px;
}

.contact-form input[type='number'] {
  width: 49%;
}

.contact-form input[type='number']:last-of-type {
  width: 49%;
  margin-left: 2%;
}

.contact-form input,
.contact-form textarea {
  border: solid 2px #a9a9a9;
  font-family: 'Roboto', sans-serif;
  padding: 10px 7px;
  margin-bottom: 15px;
  outline: none;
}

.contact-form textarea {
  resize: none;
}

.contact-form .button {
  background: #ed556a;
  border: solid 1px #ed556a;
  color: white;
  cursor: pointer;
  padding: 10px 50px;
  text-align: center;
  text-transform: uppercase;
}

.contact-form .button:hover {
  background: #ed556a;
  border: solid 1px #ed556a;
}

.contact-form input,
.contact-form .button {
  font-size: 15px;
  border-radius: 3px;
}

.upload-file {
  position: relative;
  height: 180px;
  width: 360px;
  margin-bottom: 10px;
  margin-top: 5px;
}
</style>
