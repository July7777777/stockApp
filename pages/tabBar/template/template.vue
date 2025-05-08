<template>
	<view class="uni-container">
		<view
			v-if="!hasLeftWin"
			class="uni-header-logo"
		>
			<image
				class="uni-header-image"
				src="/static/templateIndex.png"
			></image>
		</view>
		<view
			v-if="!hasLeftWin"
			class="uni-hello-text"
		>
			<text class="hello-text">a以下是部分模板示例，更多模板见插件市场：</text>
			<u-link
				class="hello-link"
				href="https://ext.dcloud.net.cn"
				:text="'https://ext.dcloud.net.cn'"
				:inWhiteList="true"
			></u-link>
		</view>
		<view
			:class="{ 'pc-hide': hideList.indexOf(item.url) !== -1 && hasLeftWin }"
			class="uni-panel"
			v-for="(item, index) in list"
			:key="item.id"
		>
			<view
				:class="{ 'left-win-active': leftWinActive === item.url && hasLeftWin, 'uni-panel-h-on': item.open }"
				class="uni-panel-h"
				@click="triggerCollapse(index, item.id)"
			>
				<text class="uni-panel-text">{{ item.name }}</text>
				<text
					class="uni-panel-icon uni-icon"
					:class="item.open ? 'uni-panel-icon-on' : ''"
				>{{ item.pages ? '&#xe581;' : '&#xe470;' }}</text>
			</view>
			<view
				class="uni-panel-c"
				v-if="item.open"
			>
				<view
					:class="{ 'left-win-active': leftWinActive === item2.url && hasLeftWin, 'pc-hide': hideList.indexOf(item2.url) !== -1 && hasLeftWin }"
					class="uni-navigate-item"
					v-for="(item2, key) in item.pages"
					:key="key"
					@click="goDetailPage(item2)"
				>
					<text class="uni-navigate-text">{{ item2.name ? item2.name : item2 }}</text>
					<text class="uni-navigate-icon uni-icon">&#xe470;</text>
				</view>
			</view>
		</view>
		<view @click="showPopup">更改全局baseUrl</view>

		<uni-popup
			ref="inputDialog"
			type="dialog"
			:is-mask-click="false"
		>

			<uni-popup-dialog
				ref="inputClose"
				mode="base"
				title="请输入IP地址"
				@confirm="pingConfirm"
			>
				<!-- value=""
				placeholder="" -->
				<view class="border">
					<view class="selectBox">
						<uni-data-select
							:clear="false"
							v-model="prefix"
							:localdata="range"
						></uni-data-select>
					</view>
					<view class="inputBox">
						<uni-easyinput
							:inputBorder="false"
							focus
							:clearable="false"
							trim="all"
							v-model="ipAdds"
							placeholder="例如 127.0.0.1"
						></uni-easyinput>
					</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
		<!-- :before-close="true" -->
		<uni-popup
			type="top"
			ref="NetInfo"
			background-color="#fff"
		>
			<view
				class="InfoItem"
				v-for="(i, n) in arr"
				:key="n"
			>
				<text>{{ i.label }}</text>
				<text style="color: #3efd00;">{{ i.value }}</text>
			</view>
			<view v-if="loading">加载中...</view>
		</uni-popup>
	</view>
</template>
<script setup>
	import { ref, onMounted, watch } from 'vue';
	// 修改导入路径
	import { useRoute } from 'vue-router';
	import { useCounterStore } from '@/store/counter';
	import { ping } from '@/api/apiBase.js'; // 根据实际路径引入
	const counter = useCounterStore();
	// 定义 props
	const props = defineProps({
		hasLeftWin: {
			type: Boolean,
		},
		leftWinActive: {
			type: String,
		},
	});

	// 弹出层
	const inputDialog = ref(null);
	const inputClose = ref(null);
	const NetInfo = ref(null);
	// 定义响应式数据
	const loading = ref(false);
	const hideList = ref(['ucharts', 'nav-city-dropdown']);
	const arr = ref([]);
	const list = ref([
		// #ifdef APP-PLUS || H5 || MP-ALIPAY
		{
			id: 'navbar',
			name: '顶部原生导航标题栏',
			open: false,
			pages: [
				// #ifdef APP-PLUS || H5
				{
					name: '导航栏带自定义按钮',
					url: 'nav-button',
				},
				{
					name: '导航栏带红点和角标',
					url: 'nav-dot',
				},
				{
					name: '导航栏带城市选择',
					url: 'nav-city-dropdown',
				},
				{
					name: '导航栏带搜索框',
					url: 'nav-search-input',
				},
				// #endif
				// #ifdef APP-PLUS || H5 || MP-ALIPAY
				{
					name: '透明渐变样式',
					url: 'nav-transparent',
				},
				{
					name: '导航栏带图片',
					url: 'nav-image',
				},
				// #endif
			],
		},
		// #endif
		// #ifndef QUICKAPP-WEBVIEW || MP-KUAISHOU
		{
			name: '顶部选项卡',
			url: 'tabbar',
		},
		// #endif
		{
			name: '组件通讯',
			url: 'component-communication',
		},
		// #ifndef MP-QQ || QUICKAPP-WEBVIEW
		// {
		//     name: 'uCharts 图表',
		//     url: 'ucharts'
		// },
		// #endif
		// #ifndef QUICKAPP-WEBVIEW
		{
			name: '列表到详情示例',
			url: 'list2detail-list',
		},
		// #endif
		// #ifndef VUE3
		// #ifdef APP-PLUS
		// {
		//     name: '上下滑动切换视频',
		//     url: 'swiper-vertical'
		// },
		// #endif
		// #endif
		// #ifdef APP-NVUE
		{
			name: 'swiper-list',
			url: 'swiper-list-nvue',
		},
		// #endif
		{
			name: 'GlobalData和vuex',
			url: 'global',
		},
		// #ifdef APP-NVUE
		{
			name: 'vuex-nvue',
			url: 'vuex-nvue',
		},
		// #endif
		{
			name: 'vuex-vue',
			url: 'vuex-vue',
		},
		// #ifdef VUE3
		{
			name: 'pinia',
			url: 'pinia',
		},
		// #endif
		{
			name: 'renderjs',
			url: 'renderjs',
		},
		// #ifdef APP-PLUS
		{
			name: '问题反馈',
			url: '/platforms/app-plus/feedback/feedback',
		},
		{
			name: '打开外部应用',
			url: 'scheme',
		},
		// #endif
		// #ifdef APP-PLUS || MP-WEIXIN || MP-QQ || H5
		// {
		//     name: '微信自定义组件示例（vant ui）',
		//     url: 'vant-button'
		// }
		// #endif
	]);
	const ipAdds = ref('')
	const prefix = ref('https://')
	const range = ref([
		{ value: 'http://', text: "http" },
		{ value: 'https://', text: "https" },
	]);
	const rangea = ref([{
		"value": 0,
		"text": "篮球",
		"disable": true
	},
	{
		"value": 1,
		"text": "足球"
	},
	{
		"value": 2,
		"text": "游泳"
	},
	]);

	// 监听路由变化
	const route = useRoute();
	const watchRoute = () => {
		watch(
			() => route.path,
			newPath => {
				if (route.matched.length) {
					const path = newPath.split('/')[3];
					for (const item of list.value) {
						if (Array.isArray(item.pages)) {
							for (const page of item.pages) {
								if (page === path || (page.url && page.url === path)) {
									item.open = true;
								}
							}
						}
					}
				}
			},
			{ immediate: true },
		);
	};

	// #ifdef H5
	onMounted(() => {
		watchRoute();
	});
	// #endif
	// 显示弹窗
	const showPopup = () => {
		console.log(inputDialog)
		if (inputDialog.value) {
			inputDialog.value.open(); // 通过 inputDialog.value 访问组件实例并调用 open 方法
			console.log('给我出来');
		}
	};

	const pingConfirm = () => {
		let url = ''
		let pre = prefix.value
		let ip = ipAdds.value
		url = pre + ip
		// `http://${url}:3000`;
		loading.value = true;
		counter.baseUrl = url;
		inputClose.value.close();
		NetInfo.value.open();
		arr.value = [{ label: 'IP:', value: url }]
		uni.getNetworkType({
			success: function (res) {
				console.log(res);
				console.log(res.networkType);
				arr.value.push({ label: '网络类型:', value: res.networkType })
				const start = Date.now();
				ping()
					.then(res => {
						const duration = Date.now() - start;
						arr.value.push({ label: '网络状况:', value: duration + 'ms' }, { label: '测试结束:', value: 'Enjoy your self' })
						// arr.value.push({ label: '测试结束:', value: 'Enjoy your self' })
						console.log('pingConfirm', res);
					}).catch(err => {
						arr.value.push({ label: '网络状况:', value: '连接失败' }, { label: '提示:', value: '请更换 协议 或 IP ' })

						console.error('catch', err);
					})
					.finally(() => {
						loading.value = false;
					});
			},
		});
		// console.log(`成功连接到 ${url}，响应时间为 ${duration} ms`);
	};



	// 触发折叠
	const triggerCollapse = e => {
		if (!list.value[e].pages) {
			goDetailPage(list.value[e].url);
			return;
		}
		for (let i = 0; i < list.value.length; ++i) {
			if (e === i) {
				list.value[i].open = !list.value[i].open;
			} else {
				list.value[i].open = false;
			}
		}
	};

	// 跳转详情页
	const goDetailPage = e => {
		let path = e.url ? e.url : e;
		let url = ~path.indexOf('platform') ? path : '/pages/template/' + path + '/' + path;
		if (props.hasLeftWin) {
			uni.reLaunch({
				url: url,
			});
		} else {
			uni.navigateTo({
				url: url,
			});
		}
		return false;
	};
</script>

<style scoped lang="scss">
	@import '../../../common/uni-nvue.css';

	.border {
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 228px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.selectBox {
		min-width: 70px;
	}

	.inputBox {
		border-radius: 4px;
		overflow: hidden;
	}

	::v-deep .uni-select {
		border: none;
		border-right: 1px solid #ccc;
		border-radius: unset;
		background-color: gainsboro;
	}

	::v-deep .uni-popup__error {
		color: #909399 !important;
	}

	.InfoItem {
		display: flex;
		justify-content: space-between;
		margin: 10px 20px;
		padding: 4px;
		background-color: #909399;
		border-radius: 2px;
	}

	.InfoItem:last-child {
		margin-bottom: 20px;
		// margin-bottom: 30px;
	}
</style>
