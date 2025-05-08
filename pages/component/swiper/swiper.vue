<template>
	<view>
		<page-head title="view"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<button
				class="mini-btn"
				type="primary"
				size="mini"
				@click="Search"
			>按钮</button>

			<view class="">
				<uni-table
					border
					stripe
					emptyText="暂无更多数据"
				>
					<!-- 表头行 -->
					<uni-tr>
						<uni-th
							v-for="i in tableTitle"
							:key="i.title"
							:align="i.align || 'center'"
							:width="i.width"
						>{{ i.title }}</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr
						v-for="i in data"
						:key="i.id"
					>
						<uni-td align="center">{{ i.id }}</uni-td>
						<uni-td>{{ i.fund_nm }}</uni-td>
						<uni-td align="right">{{ i.price }}</uni-td>
						<uni-td
							align="right"
							:class="getColor(i.increase_rt)"
						>{{ i.increase_rt }}%</uni-td>
						<uni-td align="right">{{ i.volume }}</uni-td>
						<uni-td align="right">{{ i.amount }}</uni-td>
						<uni-td align="right">{{ i.amount_incr }}</uni-td>
						<uni-td align="right">{{ i.turnover_rt }}%</uni-td>
						<uni-td align="right">{{ i.fund_nav }}</uni-td>
						<uni-td align="center">{{ i.est_val_dt }}</uni-td>
						<uni-td align="right">{{ i.estimate_value }}</uni-td>
						<uni-td
							align="right"
							:class="getColor(i.discount_rt)"
						>{{ i.discount_rt }}</uni-td>
						<uni-td align="right">{{ i.stock_ratio }}%</uni-td>
						<uni-td
							align="right"
							:class="getColor(i.stock_increase_rt)"
						>{{ i.stock_increase_rt }}%</uni-td>
						<uni-td align="right">{{ i.apply_fee }}</uni-td>
						<uni-td align="right">{{ i.apply_status }}</uni-td>
						<uni-td align="right">{{ i.redeem_fee }}</uni-td>
						<uni-td align="right">{{ i.redeem_status }}</uni-td>
						<uni-td>{{ i.issuer_nm }}</uni-td>
					</uni-tr>
				</uni-table>
			</view>
		</view>
	</view>
</template>
<script setup>
	import { ref, reactive } from 'vue';
	import { stockLofList, indexLofList } from '@/api/apiTianTian.js'; // 根据实际路径引入
	// 使用 ref 创建单个响应式数据
	const count = ref(0);
	console.log(process.env.NODE_ENV)
	const data = ref([]);

	const tableTitle = ref([
		{ title: '代码', width: 80 },
		{ title: '名称', width: 127, },//fund_nm
		{ title: '现价', width: 80, },//price
		{ title: '涨幅', width: 80, },//increase_rt
		{ title: '成交(万元)', width: 67, },//volume
		{ title: '场内份额(万元)', width: 80, },//amount
		{ title: '场内新增(万元)', width: 80, },//amount_incr
		{ title: '换手率', width: 80, },//turnover_rt   +%
		{ title: '基金净值', width: 80, },//fund_nav
		{ title: '净值日期', width: 88, },//est_val_dt  大概
		{ title: '实时估值', width: 80, },//estimate_value
		{ title: '溢价率', width: 80, },//discount_rt   +%
		{ title: '股票占比', width: 80, },//stock_ratio   +%
		{ title: '重仓涨幅', width: 80, },//stock_increase_rt   +%
		{ title: '申购费', width: 80, },//apply_fee  描述apply_fee_tips
		{ title: '申购状态', width: 80, },//apply_status
		{ title: '赎回费', width: 80, },//redeem_fee   +% 描述redeem_fee_tips
		{ title: '赎回状态', width: 80, },//redeem_status
		{ title: '基金公司', width: 80, },//issuer_nm
	]);

	// 点击按钮的处理函数
	const Search = async () => {
		console.log('按钮被点击了');
		let arr = [];
		arr = document.getElementsByClassName('header sticky')
		for (const i of arr) {
			console.log(i.innerHTML)
		}
		try {
			// let p = { m: 1, key: '11' };

			let res = await stockLofList();
			data.value = res.rows.map(i => {
				return { ...i.cell, id: i.id };
			});
			console.log(res);
			console.log(data);
		} catch (error) {
			console.error('请求出错:', error);
		}
	};
	const get2 = async () => {
		console.log('2按钮被点击了');
		try {
			let p = { FCODE: 160125 };
			let res = await fundVarietieValuationDetail(p);
			console.log(res);
		} catch (error) {
			console.error('请求出错:', error);
		}
	};
	const getColor = (value) => {
		if (value > 0) {
			return 'red';
		}
		if (value < 0) {
			return 'green';
		}
		return 'black';
	}
</script>

<style>


	.red {
		color: #FF0000 !important;
	}

	.green {
		color: #008000 !important;
	}

	.black {
		color: #3D3D3D !important;
	}

	.flex-item {
		width: 33.3%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
	}

	.flex-item-V {
		width: 100%;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
	}

	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		background-color: #ebebeb;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}

	.desc {
		/* text-indent: 40rpx; */
	}

	.flex-pc {
		display: flex;
		justify-content: center;
	}

	::v-deep .uni-table-td {
		font-size: 24rpx !important;
	}
</style>
