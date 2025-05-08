<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<view
				class="text-box"
				scroll-y="true"
			>
				<text>{{ title }}</text>
			</view>
			<view class="uni-btn-v">
				<button
					type="primary"
					@click="add"
				>add line</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { kline } from '@/api/apiXueQiu.js';
	export default {
		data () {
			return {
				title: '南方香港lof实时溢价估算',
			}
		},
		methods: {
			add () {
				console.log('aaa')
				let p = {
					"symbol": "HKHSTECH",
					"begin": new Date().getTime(),
					"period": "day",
					"type": "before",
					"count": "-2",
					"indicator": "kline"
					// "indicator": "kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance"
				}
				// https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=HKHSTECH&begin=1746610030048&period=day&type=before&count=-2&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance
				kline(p)
					.then(res => {
						console.log('pingConfirm', res);
					}).catch(err => {

						console.error('catch', err);
					})
					.finally(() => {
						loading.value = false;
					});
			},

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
