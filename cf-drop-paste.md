# cloudflare搭建文件中转和图床

## 项目地址：[1143520/dropbox](https://github.com/1143520/dropbox)

## 前言

### cloudflare真是大善人啊，但是不是很清楚pages的免费额度

## 准备工作

1、一个cloudflare账户

2、一个域名托管到cloudfalre

3、一个github账户

4、一双手

## 操作步骤

1、打开[1143520/dropbox](https://github.com/1143520/dropbox)并且fork到自己的仓库，

或者下载源代码修改后上传到自己的仓库

![image-20241201224617107](https://4f3f3863.dropbox-share.pages.dev/images/1733068707436-5euqdor8b2.png)

2、登录cloudflare打开workers and pages，创建page

![image-20241201224820093](https://pic.wtr.cc/i/2024/12/02/674c92be81e56.jpeg)



连接到git

![image-20241201224857616](https://4f3f3863.dropbox-share.pages.dev/images/1733068770731-da4khkdd0u9.png)

选择仓库

![image-20241201224928865](https://4f3f3863.dropbox-share.pages.dev/images/1733068797137-jjchdbzjcl.png)

按照下面的填，构建命令

```
npm install
```

输出一个.

![image-20241201225013595](https://4f3f3863.dropbox-share.pages.dev/images/1733068820245-0ylcj2p7ulm.png)

保存并部署

继续处理项目

![image-20241201225216387](https://4f3f3863.dropbox-share.pages.dev/images/1733068847348-0zsqfoyu9sje.png)



添加变量



![image-20241201225326252](https://4f3f3863.dropbox-share.pages.dev/images/1733068869531-nivb0ufygw.png)



选择密码，变量名为CLOUDFLARE_API_TOKEN，值需要自己到个人资料创建api

![image-20241201225601890](https://4f3f3863.dropbox-share.pages.dev/images/1733068891722-9yv95bv9d0b.png)



选择编辑workers模板

![image-20241201225804243](https://4f3f3863.dropbox-share.pages.dev/images/1733068914084-bbuhp73i7ed.png)



可以不修改，起码要有KV存储和pages![image-20241201225910472](https://4f3f3863.dropbox-share.pages.dev/images/1733068937105-bop2sqru216.png)



选择自己的账户和域名

![image-20241201230020831](https://4f3f3863.dropbox-share.pages.dev/images/1733068961354-16s4jkwoe22.png)



一直继续直到创建令牌并且复制



填入复制的值

![image-20241201230405684](https://4f3f3863.dropbox-share.pages.dev/images/1733068990141-fughzpje8s.png)



创建D1数据库和两个KV存储

![image-20241201230302743](https://4f3f3863.dropbox-share.pages.dev/images/1733069014134-cedc9shvchs.png)

![image-20241201230428986](https://4f3f3863.dropbox-share.pages.dev/images/1733069051196-4sk3fw7436p.png)

名称随意

![image-20241201230457616](https://4f3f3863.dropbox-share.pages.dev/images/1733069084067-0mr0jxgtvk7.png)

点击创建

创建KV存储

![image-20241201230551689](https://4f3f3863.dropbox-share.pages.dev/images/1733069109554-3gy2vxqdupj.png)

一个存图片，名称随意

![image-20241201230632067](https://4f3f3863.dropbox-share.pages.dev/images/1733069139398-zffd3w8duog.png)



一个存文件，貌似最大25M

![image-20241201230817674](https://4f3f3863.dropbox-share.pages.dev/images/1733069165893-fzk7tv2hcs8.png)



回到刚才创建的pages进行绑定

![image-20241201230909447](https://4f3f3863.dropbox-share.pages.dev/images/1733069194311-fopm18gmurh.png)



![image-20241201230929461](https://4f3f3863.dropbox-share.pages.dev/images/1733069220697-9tkmp6p0xk.png)



数据库的变量名叫做DB

![image-20241201231014042](https://4f3f3863.dropbox-share.pages.dev/images/1733069246815-ku51ned57sh.png)

KV的变量名分别是IMAGES 和 FILES，要对应

![image-20241201231044255](https://4f3f3863.dropbox-share.pages.dev/images/1733069285705-7vkjvwt8zmg.png)



![image-20241201231204006](https://4f3f3863.dropbox-share.pages.dev/images/1733069310611-lveyfil6xfc.png)

之后重试部署

![image-20241201231237711](https://4f3f3863.dropbox-share.pages.dev/images/1733069334360-b25y70fkh2d.png)



出现请在 Cloudflare Pages 设置中绑定 D1 数据库，则重新绑定数据库，重新部署

最后自定义域名就可以愉快玩耍了

支持全局复制图片，文件，代码，文字消息

就是很消耗额度，每天10W免费额度，我才一天消耗了1W多，我在想要是不实时同步，请求次数应该少得多

![](https://4f3f3863.dropbox-share.pages.dev/images/1733069458926-u4q5z8doskk.png)

演示地址：https://drop-share.1143520.xyz/

博客：[无服务器–Cloudflare搭建文件中转和图床 – BAOER.BLOG](https://manji.1143520.xyz/index.php/2024/12/02/w_f_w_q_-cloudflare_d_j_w_j_z_z_h_t_c/)