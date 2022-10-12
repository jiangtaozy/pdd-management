# 代码同步
- 上传
    rsync -av --exclude-from='/home/jemo/workspace/mjx/pdd-management-web/exclude.rsync' /home/jemo/workspace/mjx/pdd-management-web/ root@121.42.24.117:/root/workspace/mjx/pdd-management-web/
- 下载
    rsync -av --exclude-from='/home/jemo/workspace/mjx/pdd-management-web/exclude.rsync' root@121.42.24.117:/root/workspace/mjx/pdd-management-web/ /home/jemo/workspace/mjx/pdd-management-web/

- 上传build到生产服务器
    rsync -av --exclude-from='/home/jemo/workspace/mjx/pdd-management-web/exclude.rsync' /home/jemo/workspace/mjx/pdd-management-web/ root@121.42.24.117:/root/workspace/pdd-management-web/
