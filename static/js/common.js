module.exports = {
//盲盒交流Q群825133442 此版本不支持商用
	//接口访问地址
	env: "prod", //dev  prod

	host: "https://soul.xianghongkj8.com",
	api: "https://soulapi.xianghongkj8.com/",

	//无需登录白名单内容页
	noMustLogin: [
		"/pages/index/index",
		"/pages/login/login",
		"/pages/introduce/introduce",
	],

	//获取token
	token() {
		if (this.isLogin()) {
			var userInfo = this.getUserInfo();
			return userInfo.token;
		} else {
			return "";
		}
	},

	//获取当前时间戳
	time() {
		let time = parseInt(new Date().getTime() / 1000);
		return time;
	},

	//生成headers
	headers() {
		let system = uni.getSystemInfoSync();

		let header = {
			authorization: this.token() || "",
			time: this.time() || "",
			deviceId: system.deviceId || "",
			systemType: system.platform || "",
			systemVersion: (system.system + " - " + system.version) || "",
			deviceModel: system.model || "",
			brand: system.brand || "",
		}
		return header;
	},

	//toast提示
	toast(msg) {
		uni.showToast({
			icon: "none",
			title: msg,
			position: "center"
		});
	},

	//alert提示
	alert(option) {
		uni.showModal({
			title: option.title || "提示",
			content: option.content || "弹窗内容",
			showCancel: false,
			confirmText: option.confirmText || "确认",
			confirmColor: option.confirmColor || "#ff840c",
			success: function(res) {
				option.success && option.success();
			}
		})
	},

	//confirm提示
	confirm(option) {
		uni.showModal({
			title: option.title || "提示",
			content: option.content || "弹窗内容",
			cancelText: option.cancelText || "取消",
			cancelColor: option.cancelColor || "#000000",
			confirmText: option.confirmText || "确认",
			confirmColor: option.confirmColor || "#ff840c",
			success: function(res) {
				if (res.confirm) {
					option.success && option.success();
				}
				if (res.cancel) {
					option.error && option.error();
				}
			}
		})
	},

	//ajax公共方法
	ajax(option) {
		var _this = this;
		if (option.load) {
			_this.showLoading();
		}

		var opt = {
			url: (_this.api + "api/" + option.url),
			data: option.data || {},
			method: option.method || "get",
			header: option.header || _this.headers(),
			success: (res) => {
				//console.log(res)
				if (option.method == "upload") {
					res.data = JSON.parse(res.data);
				}

				if (res.data.code == 1) {
					option.success && option.success(res.data)
				} else {
					if (res.data.code == 401) { //当token过期以后
						_this.loginExit();
					}

					if (option.error) {
						option.error && option.error(res.data)
					} else {
						_this.toast(res.data.msg || "网络错误");
					}
				}
			},
			fail: (res) => {
				if (option.error) {
					option.error && option.error(res)
				} else {
					_this.toast("网络错误!");
				}
			},
			complete: (res) => {
				_this.hideLoading();
				uni.stopPullDownRefresh();
				option.done && option.done(res);
			},
			filePath: option.filePath || "",
			name: option.name || "file",
			formData: option.data || {},
		}

		if (option.method == "upload") {
			uni.uploadFile(opt);
		} else {
			uni.request(opt);
		}
	},

	//加载loading
	showLoading() {
		uni.showLoading({
			mask: true
		})
	},

	//隐藏loading
	hideLoading() {
		uni.hideLoading();
	},

	//将一个数组分割为多个数组
	chunk(array, size) {
		//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
		var length = array.length
		//判断不是数组，或者size没有设置，size小于1，就返回空数组
		if (!length || !size || size < 1) {
			return []
		}
		//核心部分
		var index = 0 //用来表示切割元素的范围start
		var resIndex = 0 //用来递增表示输出数组的下标

		//根据length和size算出输出数组的长度，并且创建它。
		var result = new Array(Math.ceil(length / size))
		//进行循环
		while (index < length) {
			//循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
			result[resIndex++] = array.slice(index, (index += size))
		}

		//输出新数组
		return result;
	},

	//获取当前页面路由地址
	getRoute() {
		var pageList = getCurrentPages();
		if (pageList.length > 0) {
			var page = "/" + (pageList[pageList.length - 1]).route;
		} else {
			var page = "";
		}
		return page;
	},

	//通用跳转页面
	openUrl(option) {
		// #ifdef APP-PLUS
		if (this.getRoute() == option.url) {
			console.log("当前处于 " + option.url + " 此页面，因此不需跳转");
			return;
		}
		// #endif

		//不处于白名单，并且未登录状态
		if (this.noMustLogin.indexOf(option.url) == -1 && !this.isLogin()) {
		    this.toLogin();
		    return;
		}

		var data = {
			url: option.url,
			data: option.data || {},
			animationType: option.animationType || "pop-in",
			animationDuration: 250
		}

		var params = Object.keys(data.data).map(function(key) {
			return encodeURIComponent(key) + "=" + encodeURIComponent(data.data[key]);
		}).join("&");
		data.url += "?" + params;

		if (option.openType == "navigateTo" || option.openType == undefined) {
			uni.navigateTo(data);
		} else if (option.openType == "redirectTo") {
			uni.redirectTo(data);
		} else if (option.openType == "reLaunch") {
			uni.reLaunch(data);
		} else if (option.openType == "switchTab") {
			uni.switchTab(data);
		}
	},

	//转换时间
	mysqlTimeto: function(time) { //数据库时间转换为普通的时间戳
		var myDate = new Date(time + '+0800');
		if (myDate == 'Invalid Date') {
			time = time.replace(/T/g, ' '); //去掉T
			time = time.replace(/-/g, '/');
			time = time.replace(/\.\d+/, ' '); //去掉毫秒
			myDate = new Date(time + '+0800');
			return myDate;
		} else {
			return myDate;
		}
	},
	toTime: function(strTime, type) { //数据库时间转换成时间戳或者MM/DD
		var myDate;
		if (strTime) {
			myDate = this.mysqlTimeto(strTime);
		} else {
			myDate = new Date();
		}


		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		if (month < 10) {
			month = '0' + month;
		}
		var day = myDate.getDate();
		if (day < 10) {
			day = '0' + day;
		}
		var hours = myDate.getHours();
		if (hours < 10) {
			hours = '0' + hours;
		}
		var minute = myDate.getMinutes();
		if (minute < 10) {
			minute = '0' + minute;
		}
		var second = myDate.getSeconds();
		if (second < 10) {
			second = '0' + second;
		}

		if (type == 'MM/DD') {
			return month + '/' + day;
		} else if (type == 'YYYY/MM/DD hh:mm') {
			return year + '/' + month + '/' + day + ' ' + hours + ':' + minute;
		} else if (type == 'YYYY/MM/DD hh:mm:ss') {
			return year + '/' + month + '/' + day + ' ' + hours + ':' + minute + ':' + second;
		} else if (type == 'MM/DD hh:mm') {
			return month + '/' + day + ' ' + hours + ':' + minute;
		} else if (type == 'MM/DD hh:mm:ss') {
			return month + '/' + day + ' ' + hours + ':' + minute + ':' + second;
		} else if (type == 'YYYY/MM/DD') {
			return year + '/' + month + '/' + day;
		} else {
			return myDate;
		}
	},
	getDateTimeStamp: function(dateStr) { //将字符串时间转换为时间戳
		return Date.parse(("" + dateStr).replace(/-/gi, "/"));
	},
	getDateDiff: function(dateStr) { //将时间转换为xx之前
		var publishTime = this.getDateTimeStamp(dateStr) / 1000,
			d_seconds,
			d_minutes,
			d_hours,
			d_days,
			timeNow = parseInt(new Date().getTime() / 1000),
			d,
			date = new Date(publishTime * 1000),
			Y = date.getFullYear(),
			M = date.getMonth() + 1,
			D = date.getDate(),
			H = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
		//小于10的在前面补0
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		if (H < 10) {
			H = '0' + H;
		}
		if (m < 10) {
			m = '0' + m;
		}
		if (s < 10) {
			s = '0' + s;
		}

		d = timeNow - publishTime;
		d_days = parseInt(d / 86400);
		d_hours = parseInt(d / 3600);
		d_minutes = parseInt(d / 60);
		d_seconds = parseInt(d);

		if (d_days > 0 && d_days < 2) {
			return d_days + '天前';
		} else if (d_days <= 0 && d_hours > 0) {
			return d_hours + '小时前';
		} else if (d_hours <= 0 && d_minutes > 0) {
			return d_minutes + '分钟前';
		} else if (d_seconds < 60) {
			if (d_seconds <= 0) {
				return '刚刚';
			} else {
				return d_seconds + '秒前';
			}
		} else if (d_days >= 2 && d_days < 30) {
			return M + '-' + D + ' ' + H + ':' + m;
		} else if (d_days >= 30) {
			return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
		}
	},

	//转换数字
	castNum: function(num) {
		if (num < 10000) {
			return num;
		} else if (num >= 10000 && num < 100000000) {
			var newNum = (num / 10000).toFixed(1) + "万";
			return newNum;
		} else if (num >= 100000000 && num < 10000000000000000) {
			var newNum = (num / 100000000).toFixed(2) + "亿";
			return newNum;
		} else if (num >= 10000000000000000 && num < 1000000000000000000000000) {
			var newNum = (num / 10000000000000000).toFixed(2) + "亿亿";
			return newNum;
		} else {
			var newNum = "亿亿以上+";
			return newNum;
		}
	},

	//通用返回页面
	goBack() {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			uni.navigateBack(1);
		} else {
			uni.reLaunch({
				url: "/pages/index/index"
			});
		}
	},

	//关于用户板块的
	reshMyInfo() { //刷新所有需要刷新的地方
		uni.$emit("updateMyInfo");
	},
	loginSuccess(data) {
		this.setUserInfo(data);
		this.reshMyInfo();
		this.openUrl({
			url: "/pages/index/index",
			openType: "reLaunch"
		});
	},
	loginExit() {
		this.removeUserInfo();
		this.reshMyInfo();
		this.openUrl({
			url: "/pages/index/index",
			openType: "reLaunch"
		});
	},
	getUserInfo() {
		if (uni.getStorageSync("userInfo")) {
			return uni.getStorageSync("userInfo");
		} else {
			return false;
		}
	},
	setUserInfo(data) {
		uni.setStorageSync("userInfo", data);
	},
	removeUserInfo() {
		uni.removeStorageSync("userInfo");
	},
	isLogin() {
		if (uni.getStorageSync("userInfo")) {
			return true;
		} else {
			return false;
		}
	},
	toLogin() {
		this.openUrl({
			url: '/pages/login/login'
		});
	},

	//打开图片
	openImage(index, list) {
		uni.previewImage({
			urls: list,
			current: index,
			indicator: "number",
		});
	},

	//保存图片到相册
	saveImage: function(option) {
		var _this = this;
		_this.showLoading();
		uni.downloadFile({
			url: option.url, //仅为示例，并非真实的资源
			success: (res) => {
				if (res.statusCode === 200) {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							_this.toast("保存成功");
						},
						fail: (res) => {
							_this.toast("保存失败");
						},
					});
				}
			},
			fail: (res) => {
				_this.toast("下载失败");
			},
			complete: (res) => {
				_this.hideLoading();
			}
		});
	},

	//小程序检查更新
	smallCheckUpdate() {
		// #ifdef MP
		var _this = this;
		const updateManager = uni.getUpdateManager();

		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate);
		});

		updateManager.onUpdateReady(function(res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});

		updateManager.onUpdateFailed(function(res) {
			_this.toast("新版本下载失败");
		});
		// #endif
	},

	//微信支付监听
	wxPayOnBridgeReady(e,success,error){
		var _this = this;
		WeixinJSBridge.invoke('getBrandWCPayRequest', {
			"appId": e.appId,     //公众号ID，由商户传入     
			"timeStamp": e.timeStamp,         //时间戳，自1970年以来的秒数     
			"nonceStr": e.nonceStr, //随机串     
			"package": e.package,     
			"signType": e.signType,         //微信签名方式：     
			"paySign": e.paySign //微信签名 
		},function(res){
			if(res.err_msg == "get_brand_wcpay_request:ok" ){
				// 使用以上方式判断前端返回,微信团队郑重提示：
				//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				success && success(res);
			}else{
				error && error(res);
			}
		}); 
	},

	//微信支付
	wxPay(e,success,error){
		var _this = this;
		
		//微信公众号环境内
		if(e.type == "wxPublic"){
			if (typeof WeixinJSBridge == "undefined"){
			    if( document.addEventListener ){
			        document.addEventListener('WeixinJSBridgeReady', function(){
						_this.wxPayOnBridgeReady(e,success,error);
				    }, false);
			    }else if (document.attachEvent){
					document.attachEvent('WeixinJSBridgeReady', function(){
						_this.wxPayOnBridgeReady(e,success,error);
					}); 
					document.attachEvent('onWeixinJSBridgeReady', function(){
						_this.wxPayOnBridgeReady(e,success,error);
					});
			    }
			}else{
				_this.wxPayOnBridgeReady(e,success,error);
			}
		}
	},
	
	//是否处于微信环境内
	isWeixin() {  
		var ua = navigator.userAgent.toLowerCase();  
		if (ua.match(/MicroMessenger/i) == "micromessenger") {  
			return true;  
		} else {  
			return false;  
		}  
	},




}
