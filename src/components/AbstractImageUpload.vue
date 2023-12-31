<!--AvatarUploader-->
<template>
  <div class="ImageUploader">
    <div>
      <span v-if="!avatarUrl" @click="openEditAvatarDialog()" style="
                            display: inline-block;
                            padding: 70px;
                            border: 2px dashed gray;
                            cursor: pointer;
                            border-radius: 5px;
                            width: 240px;
                            height: 240px;
                            text-align: center;
                            
                          ">
        <el-tooltip effect="dark" content="上传图片" placement="top">
          <i class="el-icon-plus" style="font-size: 40px; line-height:100px;"></i>
        </el-tooltip>
      </span>

      <div v-else class="image">
        <el-image :src="avatarUrl" fit="" />
        <div class="mask">
          <el-tooltip effect="dark" content="预览图片" placement="top">
            <i class="el-icon-zoom-in" style="cursor: pointer" @click="isVisible_previewAvatarDialog = true" />
          </el-tooltip>
          <el-tooltip effect="dark" content="删除图片" placement="top">
            <i class="el-icon-delete" style="cursor: pointer" @click="deleteAvatar()" />
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 预览头像窗口 -->
    <el-dialog :visible.sync="isVisible_previewAvatarDialog">
      <img width="100%" :src="avatarUrl" />
    </el-dialog>
    <!-- 修改头像窗口 -->
    <el-dialog :visible.sync="isVisible_editAvatarDialog" width="900px" :append-to-body="true">
      <el-row>
        <el-col style="height: 550px; width: 800px;">
          <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox">
          </vue-cropper>
          <div style="display: flex; padding-top: 10px">
            <el-upload ref="uploadCropper" :before-upload="beforeAvatarUpload" :show-file-list="false" action
              style="margin-right: 10px">
              <el-button type="primary" size="small">上传赏花点图片</el-button>
            </el-upload>
            <el-tooltip class="item" effect="dark" content="向左旋转" placement="top">
              <el-button size="small" @click="rotateLeft"><i class="el-icon-refresh-left"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="向右旋转" placement="top">
              <el-button size="small" @click="rotateRight"><i class="el-icon-refresh-right"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="放大" placement="top">
              <el-button size="small" @click="changeScale(1)"><i class="el-icon-plus"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="缩小" placement="top">
              <el-button size="small" @click="changeScale(-1)"><i class="el-icon-minus"></i></el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible_editAvatarDialog = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitUpdate" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
   
<script>
import { VueCropper } from "vue-cropper";

export default {
  name: "AbstractImageUploader",
  components: { VueCropper },
  props: {
    avatar: String,
    region: String,
    accessKeyId: String,
    accessKeySecret: String,
    bucket: String,
  },
  data() {
    return {
      isVisible_editAvatarDialog: false,
      isVisible_previewAvatarDialog: false,
      options: {
        img: "", //裁剪图片的地址
        info: true, //裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: 400, //默认生成截图框宽度
        autoCropHeight: 400,
        fixedBox: false, // 固定截图框大小 是否允许改变
        fixed: true, //是否开启截图框宽高固定比例
        fixedNumber: [1, 1], //截图框的宽高比例
        original: true, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      previews: {},
      loading: false,
      avatarName: "", //头像名，包含后缀
      avatarUrl: this.avatar, //头像服务端链接
      client_alioss: {},
    };
  },
  created() {
    const OSS = require("ali-oss");
    this.client_alioss = new OSS({
      region: this.region,
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
      bucket: this.bucket,
    });
  },
  mounted() { },
  computed: {},
  methods: {
    //打开编辑头像窗口
    openEditAvatarDialog() {
      this.isVisible_editAvatarDialog = true;
      if (this.previews.url) {
        this.previews.url = "";
        this.options.img = "";
      }
    },
    beforeAvatarUpload(file) {
      this.avatarName = this.$uuid.v1() + file.name; //包含后缀
      let uploadAccept = ["jpeg", "jpg", "png"]; //上传图片允许的格式
      let ext = file.type.split("/")[1]; //后缀名
      if (!uploadAccept.includes(ext)) {
        this.$message.warning("您上传的图片格式不符，请重新上传");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.options.img = reader.result;
      };
    },
    changeScale(num) {
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    //删除服务器中的头像
    async deleteAvatar() {
      try {
        if (this.avatarUrl) {
          let { pathname } = new URL(this.avatarUrl);
          await this.client_alioss.deleteMulti([decodeURIComponent(pathname)]); //删除服务器中的头像。decodeURIComponent解决中文乱码
          this.$message.success("赏花点图片删除成功");
          this.avatarUrl = "";
          this.$emit("deleteAvatar");
        }
      } catch (error) {
        this.$message.error("赏花点图片删除失败");
      }
    },
    //上传头像
    submitUpdate() {
      try {
        this.loading = true;
        this.$refs.cropper.getCropData(async (base64) => {
          let file_img = this.base64toFile(base64, this.avatarName);
          let { name } = file_img;
          let {
            res: { requestUrls },
          } = await this.client_alioss.multipartUpload(name, file_img)
          let imgURL = requestUrls[0]
          let splitURL = imgURL.split('?')
          this.avatarUrl = splitURL[0]
          this.$message.success("上传赏花点图片成功");
          this.$emit("avatarUrl", this.avatarUrl); //把头像url传出去
        });
      } catch (error) {
        this.$message.error("上传赏花点图片失败");
      } finally {
        this.loading = false;
        this.isVisible_editAvatarDialog = false;
      }
    },
    //base64转换为file类型
    base64toFile(base64, filename) {
      let arr = base64.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      console.log(u8arr)
      return new File([u8arr], filename, { type: mime });
    },
  },
  watch: {},
};
</script>
   
<style lang="scss" scoped>
.ImageUploader {
  .image {
    position: relative;
    display: inline-block;
    width: 400px;
    height: 400px;

    .mask {
      opacity: 0;
      color: white;
      font-size: 25px;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      &:hover {
        opacity: 1;
      }
    }
  }

  .upload-preview {
    position: relative;
    top: 50%;
    transform: translate(50%, -50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    box-shadow: 0 0 4px #bbbbbb;
    overflow: hidden;
  }
}

::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  height: 850px;
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>