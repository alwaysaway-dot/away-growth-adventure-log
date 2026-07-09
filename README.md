# 阿尾成长冒险日志

一个本地运行的游戏化成长打卡网页。

英文名：Awei Growth Adventure Log

当前版本：V2.0

## 项目简介

阿尾成长冒险日志把每日打卡做成一个轻量的角色养成系统。你可以通过现实任务积累剑士 / 学徒 EXP，提升综合等级，并解锁不同阶段的角色形态。

项目是纯静态网页，不需要服务器、数据库或构建工具。

## 核心功能

- 今日任务打卡
- 常规任务 / 突发任务
- 常规任务添加、删除、排序
- 剑士 / 学徒双职业 EXP
- 综合等级与角色形态解锁
- Level Up 升级提示
- 今日修行结算
- 成长图鉴
- 本月冒险地图
- 近 7 日修行记录
- 今日冒险日志
- 数据导出 / 导入备份
- 复制备份文本 / 从备份文本恢复

## 技术栈

- HTML
- CSS
- 原生 JavaScript
- 浏览器 localStorage

没有使用 React、Vue、Next.js、TypeScript、数据库、后端或打包工具。

## 本地运行

方式一：直接打开文件

1. 找到 `index.html`
2. 用浏览器打开

方式二：使用本地静态服务

```bash
python3 -m http.server 8765
```

然后访问：

```text
http://127.0.0.1:8765/index.html
```

## 数据保存说明

所有数据都保存在当前浏览器的 `localStorage` 中。

主要 key：

- `awei-task-config`
- `awei-checkin-YYYY-MM-DD`
- `awei-last-backup-time`

注意：如果清理浏览器数据、更换浏览器或更换设备，记录可能丢失。

## 备份建议

请定期使用页面底部的「数据备份」功能导出 JSON 文件。

备份方式包括：

- 导出备份文件
- 复制备份文本
- 导入备份文件
- 从备份文本恢复

## 安装到手机桌面

部署上线后，在手机浏览器打开 GitHub Pages 网址。

### iPhone Safari

1. 打开网址
2. 点击分享按钮
3. 选择「添加到主屏幕」
4. 回到桌面，点击「成长日志」图标打开

### Android Chrome

1. 打开网址
2. 点击右上角菜单
3. 选择「添加到主屏幕」或「安装应用」
4. 回到桌面打开

注意：PWA 数据仍然保存在当前浏览器环境中。不同设备、不同浏览器的数据不会自动同步。换设备或清理缓存前，请先使用页面内的数据备份功能导出 JSON。

## 静态部署

本项目可以部署到任何静态站点平台。

### GitHub Pages

1. 新建 GitHub 仓库
2. 上传 `index.html`、`style.css`、`script.js`、`README.md` 和 `assets` 文件夹
3. 进入仓库 `Settings → Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main`
6. Folder 选择 `/root`
7. 保存后等待 GitHub Pages 生成访问链接

本项目数据保存在当前浏览器 `localStorage` 中。不同设备、不同浏览器之间数据不会自动同步。换设备前请使用页面中的「数据备份」功能导出 JSON。

### Vercel / Netlify

直接上传整个项目文件夹即可作为静态站点部署。

注意：部署到线上后，数据仍然保存在访问者自己的浏览器 `localStorage` 中。不同浏览器、不同设备之间的数据不会自动同步。

## 建议文件结构

```text
awei-growth-adventure-log/
├── index.html
├── style.css
├── script.js
├── README.md
├── manifest.json
├── service-worker.js
└── assets/
    ├── characters/
    │   ├── stage-01-balanced.png
    │   ├── stage-02-balanced.png
    │   ├── stage-03-balanced.png
    │   ├── stage-04-balanced.png
    │   ├── stage-05-balanced.png
    │   ├── stage-06-balanced.png
    │   ├── stage-07-balanced.png
    │   ├── stage-08-balanced.png
    │   ├── stage-09-balanced.png
    │   └── stage-10-balanced.png
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

## 版本功能概览

- V1.0：基础成长打卡
- V1.1：按日期保存与历史记录
- V1.2：模块完成率与进度条
- V1.3：连续打卡与成长等级
- V1.4：本月打卡日历
- V1.4.5：游戏化视觉改造
- V1.4.6：双职业经验系统
- V1.4.7：任务系统与突发任务
- V1.4.8：顶部信息精简与模块重组
- V1.4.9：长期 EXP 曲线与任务排序
- V1.5：稳定性检查与代码整理
- V1.6：数据导出 / 导入备份
- V1.7：今日结算面板
- V1.8：成长图鉴
- V1.9：Level Up 升级提示
- V2.0：版本收束与发布准备
- V2.1：PWA 支持与基础离线缓存
