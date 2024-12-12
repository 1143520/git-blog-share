# wordpress博客搭建

## 1、在1panel创建php环境，选择wordpress模板，创建网站，进入网站根目录

## 2、远程拉取，下载解压（用于创建新的网站）

查看最新版本

```
https://cn.wordpress.org/download/
```

远程下载链接（替换版本号）

```
https://cn.wordpress.org/wordpress-6.7.1-zh_CN.zip
```

![image-20241212144313570](https://pic.wtr.cc/i/2024/12/12/675a862567604.jpeg)

解压后全选移动到根目录

![image-20241212144426435](https://pic.wtr.cc/i/2024/12/12/675a866d96cdc.jpeg)

现在就可以访问网址了，配置数据库也可以在本地编辑wp-config.php（新建，将WordPress安装目录下的`wp-config-sample.php`文件复制到`wp-config.php`文件中，并将`wp-config-sample.php`文件作为备份）

给与index目录包括子文件夹0777权限（省事），否则后面很多操作需要配置FTP

## 3、备份以及迁移

先在原来的后台工具-导出-wordpress 会得到一个xml文件

![image-20241212160143224](https://pic.wtr.cc/i/2024/12/12/675a988a78b00.jpeg)

![image-20241212160216103](https://pic.wtr.cc/i/2024/12/12/675a98ab06b6c.jpeg)

![image-20241212160317594](https://pic.wtr.cc/i/2024/12/12/675a98e8a253d.jpeg)

保持一样的域名，只修改DNS解析ip，和上面一样，搞好运行环境和数据库和SSL

使用duplicator，确保网站根目录为空

上传Installer和备份文件，教程

```
https://www.wpdaxue.com/wordpress-migration-plugin-duplicator.html
```

如果有redis缓存还要修改wp-config.php，之后才能点击进行登录

![image-20241212155631531](https://pic.wtr.cc/i/2024/12/12/675a9753bfaba.jpeg)

如果提示文件不存在，则使用之前导出的xml导入覆盖

切记，不要批量启用插件！一个个来，出问题了直接删除网站重来