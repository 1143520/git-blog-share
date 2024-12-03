# 前言

灵感来自[K神](https://github.com/krahets)的[krahets/hello-algo: 《Hello 算法》：动画图解、一键运行的数据结构与算法教程。支持 Python, Java, C++, C, C#, JS, Go, Swift, Rust, Ruby, Kotlin, TS, Dart 代码。简体版和繁体版同步更新，English version ongoing](https://github.com/krahets/hello-algo)

于是想着能不能把github仓库存储的文件作为博客文章阅读

# 演示站点

[🕮 BAOER の BLOG 🕮](https://git-blog-share.1143520.xyz/)

# 效果展示

![image-20241203115025627](https://pic.wtr.cc/i/2024/12/03/674e918e3e638.jpeg)

![image-20241203115108087](https://pic.wtr.cc/i/2024/12/03/674e91fc9e2c9.jpeg)

# 部署准备

## 1、本地下载typora或者其他markdown编辑器

[Typora for windows — 测试版发布 --- Typora for windows — beta version release](https://typora.io/windows/dev_release.html)

## 2、一个github账户

## 3、本地安装git，用于管理仓库

## 3、一个cloudflare免费账号

## 4、一个B站账号

# 保姆教程

## 1、新建github仓库



访问  https://github.com/你的github用户名?tab=repositories

![image-20241203115858791](https://pic.wtr.cc/i/2024/12/03/674e926b5c4f7.jpeg)

![image-20241203115953704](https://pic.wtr.cc/i/2024/12/03/674e926b881bb.jpeg)

填写仓库名字

public还是Private看个人喜好，自己看就使用Private，后面加密码验证，分享给别人就public

点击创建

停留在这个界面

![image-20241203120209242](https://pic.wtr.cc/i/2024/12/03/674e92982de58.jpeg)

## 2、本地创建文件夹

随便找个全英文路径文件夹作为上传文件夹，不要使用你的typora的笔记文件夹

把你要上传的.md文件放到这个文件夹

![image-20241203120405636](https://pic.wtr.cc/i/2024/12/03/674e92acb2ac7.jpeg)

从[1143520/git-blog-share](https://github.com/1143520/git-blog-share)下载 git_upload.bat 和 git_delete.bat

用于管理仓库文件

双击运行git_upload.bat 

![image-20241203120644895](https://pic.wtr.cc/i/2024/12/03/674e92c3e4f6b.jpeg)

因为 github 国内访问不畅，你知道的呀，需要开启代理

开启代理确保能够正常访问后,在设置中找到自己的代理端口，比如我的是5229

![image-20241203120955954](https://pic.wtr.cc/i/2024/12/03/674e92d9473b6.jpeg)

在git_upload.bat 填入5229之后回车

复制仓库的git地址填入之后回车

![image-20241203121200103](https://pic.wtr.cc/i/2024/12/03/674e92e9d6082.jpeg)

选择需要上传的文件编号，0为全部上传，和git是一样的，只是增量上传

比如1 3 5就是上传1、3、5这几个文件

回车上传，自动main分支，确保本地安装了git，而且登陆了github账户，

详细请参考[手把手教你用git上传项目到GitHub（图文并茂，这一篇就够了），相信你一定能成功！！ - 知乎](https://zhuanlan.zhihu.com/p/193140870)



![image-20241203121318967](https://pic.wtr.cc/i/2024/12/03/674e93015ef2a.jpeg)

![image-20241203121758779](https://pic.wtr.cc/i/2024/12/03/674e9314df60d.jpeg)

SUCCESS即为成功

回到仓库[1143520/git-blog-share](https://github.com/1143520/git-blog-share)刷新

可以看到已经有了文件

![image-20241203122112739](https://pic.wtr.cc/i/2024/12/03/674e9327bfd06.jpeg)

本地生成了git的默认配置和bat的配置文件夹，注意不要误删

![image-20241203122221525](https://pic.wtr.cc/i/2024/12/03/674e9338aee07.jpeg)



git_delete.bat 是用于删除仓库某个文件，本地不变，使用方法同理，大伙可以用GPT把二者合成一个bat

## 3、配置cloudflare的workers

进入CF点击workers and pages进行创建

![image-20241203122656338](https://pic.wtr.cc/i/2024/12/03/674e934813d9e.jpeg)

![image-20241203122732142](https://pic.wtr.cc/i/2024/12/03/674e935b72b1a.jpeg)



自定义名称然后部署

![image-20241203122850021](https://pic.wtr.cc/i/2024/12/03/674e936f25d09.jpeg)



继续处理项目

![image-20241203122956543](https://pic.wtr.cc/i/2024/12/03/674e9386c6609.jpeg)



编辑添加以下变量

| 变量名         | 必填 | 说明                                                         |
| -------------- | ---- | ------------------------------------------------------------ |
| GITHUB_TOKEN   | 是   | GitHub Personal Access Token，用于访问仓库内容               |
| GITHUB_OWNER   | 是   | GitHub 用户名或组织名                                        |
| GITHUB_REPO    | 是   | 博客内容所在的仓库名称                                       |
| ADMIN_PASSWORD | 否   | 博客管理员密码，仅在 enablePasswordProtection 为 true 时需要 |

GITHUB_TOKEN在登录github后访问

[Personal Access Tokens (Classic)](https://github.com/settings/tokens)  手动生成，需要repo也就是仓库查看的权限（公开仓库限额太少，使用token可以增加限额，也可以访问私库）

点击![image-20241203123625405](https://pic.wtr.cc/i/2024/12/03/674e939c23f93.jpeg)

选择Generate new token (classic)

完成验证（如果有）

名称随意，过期时间自己把握，repo一定要打勾

![image-20241203123847215](https://pic.wtr.cc/i/2024/12/03/674e93b1c90e6.jpeg)

点击底下的![image-20241203123916175](https://pic.wtr.cc/i/2024/12/03/674e93c3587c1.jpeg)

复制token （只显示一次）填入密钥类型的变量，变量名为GITHUB_TOKEN

相对应的填入其他变量

![image-20241203124351425](https://pic.wtr.cc/i/2024/12/03/674e93d38b87c.jpeg)

然后点击编辑代码

![image-20241203124426533](https://pic.wtr.cc/i/2024/12/03/674e93e88fce7.jpeg)

将[git-blog-share/worker.js at main · 1143520/git-blog-share](https://github.com/1143520/git-blog-share/blob/main/worker.js)的内容复制后粘贴到workers全选替换之后部署

![image-20241203124546486](https://pic.wtr.cc/i/2024/12/03/674e93f97f932.jpeg)

![image-20241203124618561](https://pic.wtr.cc/i/2024/12/03/674e9428ac356.jpeg)

选择是否启用密码验证，和设置站点标题和logo

![image-20241203125153423](https://pic.wtr.cc/i/2024/12/03/674e943ce3b3a.jpeg)

之后点击访问大功告成

![image-20241203124711962](https://pic.wtr.cc/i/2024/12/03/674e944e20db3.jpeg)

# 补充

## 1、自定义域名

![image-20241203124823695](https://pic.wtr.cc/i/2024/12/03/674e946221c8e.jpeg)

## 2、填入变量注意前后不要有空格

## 3、推荐搭配typora+bili图床使用（已经失效，还是使用自己的图床接口吧）

[xlzy520/typora-plugin-bilibili: Typora粘贴图片自动上传到Bilibili图床，也可以自定义修改成任意其他图床接口。使用教程：https://b23.tv/urxCc3](https://github.com/xlzy520/typora-plugin-bilibili)

## 4、更多内容请阅读仓库文档或者阅读代码后自行修改