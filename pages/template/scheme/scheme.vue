<template>
	<view class="uni-container">
		<page-head title="token配置"></page-head>

		<!-- <view class="uni-divider">
			<view class="uni-divider__content">线 打开QQ</view>
			<view class="uni-divider__line"></view>
		</view> -->

		<!-- <view class="uni-padding-wrap"> -->
		<view class="">
			<view
				v-for="(item, index) in tokenList"
				:key="index"
				class="uni-panel"
			>
				<view class="uni-panel-h">
					<view class="">{{ maskToken(item.token) }} </view>
					<view class="">{{ item.usage }}</view>
				</view>
			</view>
		</view>
		<form @submit="openQQ">
			<view>
				<view class="uni-title">请输入token：</view>
				<view class="uni-list">
					<uni-easyinput
						v-model="value"
						placeholder="请输入token"
						suffixIcon="plusempty"
					>
						<!-- <template #suffixIcon>
								<button
									class="uni-btn uni-btn-mini uni-btn-radius"
									type="primary"
									size="mini"
								>搜索</button>
							</template> -->
					</uni-easyinput>
				</view>
			</view>
		</form>
		<!-- 弹出框 -->
		<view>
			<uni-popup
				ref="inputDialog"
				type="dialog"
			>
				<uni-popup-dialog
					ref="inputClose"
					mode="input"
					title="输入内容"
					value="对话框预置提示内容!"
					placeholder="请输入内容"
					@confirm="dialogInputConfirm"
				></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
	<!-- </view> -->
</template>

<script>
	export default {
		data () {
			return {
				value: '',
				tokenList: [
					{
						token: "91*************************E7",
						usage: 200
					},
					{
						token: "91*************************E8",
						usage: 0
					}
				]
			};
		},
		methods: {
			inputDialogToggle () {
				// this.$refs.inputDialog.open()
			},
			maskToken (value) {
				if (!value) return '';
				if (value.length <= 16) return value;
				return value.substring(0, 8) + '****' + value.substring(value.length - 8);
			},
			done (e) {
				e.preventDefault();
			},
			submit (e) {
				e.preventDefault();
			},
			openBrowser (url) {
				plus.runtime.openURL(url)
			},
			openMarket (marketPackageName) {
				var appurl;
				if (plus.os.name == "Android") {
					appurl = "market://details?id=io.dcloud.hellouniapp";//可能部分应用商店没有收录
				}
				else {
					appurl = "itms-apps://itunes.apple.com/cn/app/hello-uni-app/id1417078253";
				}
				if (typeof (marketPackageName) == "undefined") {
					plus.runtime.openURL(appurl, function (res) {
						console.log(res);
					});
				} else {//强制指定某个Android应用市场的包名，通过这个包名启动指定app
					if (plus.os.name == "Android") {
						plus.runtime.openURL(appurl, function (res) {
							plus.nativeUI.alert("本机没有安装应用宝");
						}, marketPackageName);
					} else {
						plus.nativeUI.alert("仅Android手机才支持应用宝");
					}
				}
			},
			openTaobao (url) {
				plus.runtime.openURL(url, function (res) {
					uni.showModal({
						content: "本机未检测到淘宝客户端，是否打开浏览器访问淘宝？",
						success: function (res) {
							if (res.confirm) {
								plus.runtime.openURL("https://s.taobao.com/search?q=uni-app")
							}
						}
					})
				});
			},
			openMap () {
				var url = "";
				if (plus.os.name == "Android") {
					var hasBaiduMap = plus.runtime.isApplicationExist({ pname: 'com.baidu.BaiduMap', action: 'baidumap://' });
					var hasAmap = plus.runtime.isApplicationExist({ pname: 'com.autonavi.minimap', action: 'androidamap://' });
					var urlBaiduMap = "baidumap://map/marker?location=39.968789,116.347247&title=DCloud&src=Hello%20uni-app";
					var urlAmap = "androidamap://viewMap?sourceApplication=Hello%20uni-app&poiname=DCloud&lat=39.9631018208&lon=116.3406135236&dev=0"
					if (hasAmap && hasBaiduMap) {
						plus.nativeUI.actionSheet({ title: "选择地图应用", cancel: "取消", buttons: [{ title: "百度地图" }, { title: "高德地图" }] }, function (e) {
							switch (e.index) {
								case 1:
									plus.runtime.openURL(urlBaiduMap);
									break;
								case 2:
									plus.runtime.openURL(urlAmap);
									break;
							}
						})
					}
					else if (hasAmap) {
						plus.runtime.openURL(urlAmap);
					}
					else if (hasBaiduMap) {
						plus.runtime.openURL(urlBaiduMap);
					}
					else {
						url = "geo:39.96310,116.340698?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82";
						plus.runtime.openURL(url); //如果是国外应用，应该优先使用这个，会启动google地图。这个接口不能统一坐标系，进入百度地图时会有偏差
					}
				} else {
					// iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
					plus.nativeUI.actionSheet({ title: "选择地图应用", cancel: "取消", buttons: [{ title: "Apple地图" }, { title: "百度地图" }, { title: "高德地图" }] }, function (e) {
						console.log("e.index: " + e.index);
						switch (e.index) {
							case 1:
								url = "http://maps.apple.com/?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82&ll=39.96310,116.340698&spn=0.008766,0.019441";
								break;
							case 2:
								url = "baidumap://map/marker?location=39.968789,116.347247&title=DCloud&src=Hello%20uni-app";
								break;
							case 3:
								url = "iosamap://viewMap?sourceApplication=Hello%20uni-app&poiname=DCloud&lat=39.9631018208&lon=116.3406135236&dev=0";
								break;
							default:
								break;
						}
						if (url != "") {
							plus.runtime.openURL(url, function (e) {
								plus.nativeUI.alert("本机未安装指定的地图应用");
							});
						}
					})
				}
			},
			openQQ: function (e) {
				// console.log("e.detail.value: " + JSON.stringify(e.detail.value));
				// 没有校验qq号是否为空或合法数字，如果不是可用的qq号，启动qq后会停留在qq主界面
				plus.runtime.openURL('mqqwpa://im/chat?chat_type=' + e.detail.value.token + '&uin=' + e.detail.value.usage, function (res) {
					plus.nativeUI.alert("本机没有安装QQ，无法启动");
				});
			}
		}
	};
</script>
<style>
	@import '../../../common/uni-nvue.css';

	.button {
		margin: 30rpx;
		color: #007AFF;
	}
</style>
