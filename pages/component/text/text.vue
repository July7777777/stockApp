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
					@click="stock"
				>add line</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { stockKline, stockGet } from '@/api/apiTianTian.js';

	export default {
		data () {
			return {
				title: '南方香港lof实时溢价估算',
			}
		},
		methods: {
			stock () {
				let p = {
					secid: '0.160125',
				}
				stockGet(p).then(res => {
					console.log('res', res);
				})
			},
			getData () {
				let p = {
					klt: 101,
					fqt: 1,
					lmt: 2,
					end: this.$dayjs().format('YYYYMMDD'),
					fields1: 'f1,f2,f3,f4,f5,f6,f7,f8',
					fields2: 'f51,f59',
				}
				Promise.all([stockKline({ ...p, secid: '124.HSCGSI' }), stockKline({ ...p, secid: '124.HSTECH' })]).then(res => {
					console.log('res', res);
				})
			}
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
