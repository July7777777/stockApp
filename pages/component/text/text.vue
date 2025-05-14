<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view
				class="text-box"
				scroll-y="true"
			>
				<text>{{ title + ':' + getPremiumRate }}</text>

			</view>
			<uni-group
				:title="SZ160125.name + ' - ' + SZ160125.exchange + SZ160125.code"
				mode="card"
			>
				<view> 现&nbsp; &nbsp;价:{{ SZ160125.current }} {{ SZ160125.currency }} </view>
				<view> 溢价率:{{ SZ160125.premium_rate }}% </view>
			</uni-group>

			<uni-group
				:title="HSTECH.name + ' - ' + HSTECH.code"
				mode="card"
			>
				<view
					v-for="i, n in HSTECH.klines"
					:key="n"
				>{{ split(i) }} </view>
			</uni-group>
			<uni-group
				:title="HSCGSI.name + ' - ' + HSCGSI.code"
				mode="card"
			>
				<view
					v-for="ii, nn in HSCGSI.klines"
					:key="nn"
				>{{ split(ii) }} </view>
			</uni-group>
			<view class="uni-btn-v">
				<button
					type="primary"
					@click="getData"
				>add line</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { stockKline, stockGet } from '@/api/apiTianTian.js';
	import { quote } from '@/api/apiXueQiu.js';
	import Decimal from 'decimal.js';
	export default {
		data () {
			return {
				title: '南方香港lof实时溢价估算',
				HS: {
					klt: 101,
					fqt: 1,
					lmt: 2,
					end: this.$dayjs().format('YYYYMMDD'),
					fields1: 'f1,f2,f3,f4,f5,f6,f7,f8',
					fields2: 'f51,f59',
				},
				XG: {
					symbol: 'SZ160125',
					extend: 'detail'
				},
				SZ160125: {
					exchange: "SZ",
					code: "160125",
					name: '南方香港LOF',//名称
					current: '',//现价
					premium_rate: '',//溢价率
					currency: '',//单位
				},
				HSCGSI: {
					code: "HSCGSI",
					name: "恒生消费品制造及服务业指数",
					klines: [],
				},
				HSTECH: {
					code: "HSTECH",
					name: "恒生科技指数",
					klines: [],
				},
				timeInterval: null
			}
		},
		computed: {
			getPremiumRate () {
				if (this.HSCGSI.klines.length && this.HSTECH.klines.length) {
					let A = this.getD(this.HSCGSI.klines[0])
					let B = this.getD(this.HSCGSI.klines[1])
					let C = this.getD(this.HSTECH.klines[0])
					let D = this.getD(this.HSTECH.klines[1])
					let E = new Decimal(this.SZ160125.premium_rate)
					let F = A.plus(B).plus(C).plus(D)
					return F.div(2).minus(E).toFixed(2) + '%'
				} else {
					return '暂无数据'
				}
			}
		},
		methods: {
			getData () {
				Promise.all([stockKline({ ...this.HS, secid: '124.HSCGSI' }), stockKline({ ...this.HS, secid: '124.HSTECH' }), quote(this.XG)]).then(res => {
					let [HSCGSI, HSTECH, SZ160125] = res;
					console.log(HSCGSI, HSTECH, SZ160125);
					this.HSCGSI = HSCGSI.data;
					this.HSTECH = HSTECH.data;
					this.SZ160125 = SZ160125.data.quote;
				}).catch(err => {
					clearInterval(this.timeInterval)
					uni.showToast({
						title: '请检查网络连接',
						icon: 'error',
						duration: 2000,
					})
					console.log(err)
				})
			},
			split (str) {
				if (str.length) {
					let parts = str.split(",");
					return `${parts[0]} →→→→→ ${parts[1]}%`
				}
				return '';
			},
			getD (str) {
				if (str.length) {
					let parts = str.split(",");
					return new Decimal(parts[1])
				}
				return '';
			},
			init () {
				this.timeInterval = setInterval(() => {
					this.getData()
				}, 5000)
			}
		},
		onLoad () {
			this.getData()
			this.init()
		},
		onUnload () {
			clearInterval(this.timeInterval)
		},
		onHide () {
			clearInterval(this.timeInterval)
		}
	}
</script>

<style>
	.text-box {
		margin-bottom: 40rpx;
		padding: 40rpx 0;
		display: flex;
		min-height: 300rpx;
		background-color: #FFFFFF;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 30rpx;
		color: #353535;
		line-height: 1.8;
	}
</style>
