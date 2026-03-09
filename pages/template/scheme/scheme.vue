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
					<view class="token-text">{{ maskToken(item.token) }}</view>
					<view class="usage-info">
						<view class="progress-bar-bg">
							<view
								class="progress-bar-fill"
								:style="{
									width: getProgressWidth(item.usage),
									background: getProgressColor(item.usage)
								}"
							></view>
						</view>
						<view class="usage-text">{{ item.usage }}%</view>
					</view>
				</view>
			</view>
		</view>


		<view>
			<!-- 弹出框 -->
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
					@confirm="InputConfirm"
				></uni-popup-dialog>
			</uni-popup>

			<movable-area class="full-screen-area">
				<movable-view
					:x="moveX"
					:y="moveY"
					direction="all"
					inertia
					out-of-bounds
					@click="popupOpen"
				><uni-icons
						type="plus"
						color="#007AFF"
						size="30"
					/></movable-view>
			</movable-area>
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
						usage: 10
					}
				]
			};
		},
		methods: {
			popupOpen () {
				this.$refs.inputDialog.open()
			},
			// 计算进度条宽度（百分比）
			getProgressWidth (usage) {
				const percentage = Math.max(0, Math.min(100, usage));
				return percentage + '%';
			},

			// 计算进度条颜色（绿->黄->红）
			getProgressColor (usage) {
				const percentage = Math.max(0, Math.min(100, usage));
				const hue = 120 - (percentage * 1.2); // 0%->120(绿), 100%->0(红)
				return `hsl(${hue}, 88%, 60%)`;
			},
			InputConfirm (e) {
				console.log(e)
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
		},

		// onLoad () {
		// 	const systemInfo = uni.getSystemInfoSync();
		// 	// rpx 转 px 的换算系数
		// 	const rpxToPx = systemInfo.screenWidth / 750;
		// 	const buttonSize = 50 * rpxToPx;

		// 	// 最右边，垂直居中
		// 	this.moveX = systemInfo.screenWidth - buttonSize - 20;
		// 	this.moveY = systemInfo.screenHeight / 2 - buttonSize / 2;
		// },
		onLoad () {
			// 获取系统信息
			const systemInfo = uni.getSystemInfoSync();

			// 计算按钮初始位置（最右边，垂直居中）
			const rpxToPx = systemInfo.screenWidth / 750;
			const buttonSize = 50 * rpxToPx;
			this.moveX = systemInfo.screenWidth - buttonSize - 20;
			this.moveY = systemInfo.screenHeight / 2 - buttonSize / 2;
		},
	};
</script>
<style>
	@import '../../../common/uni-nvue.css';

	.button {
		margin: 30rpx;
		color: #007AFF;
	}

	.uni-panel-h {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
	}

	.usage-info {
		display: flex;
		align-items: center;
		gap: 15rpx;
		width: 200rpx;
	}

	/* 进度条背景 */
	.progress-bar-bg {
		width: 120rpx;
		height: 20rpx;
		background-color: #e0e0e0;
		border-radius: 10rpx;
		overflow: hidden;
	}

	/* 进度条填充 */
	.progress-bar-fill {
		height: 100%;
		border-radius: 10rpx;
		transition: width 0.3s ease, background 0.3s ease;
	}

	/* 使用百分比文字 */
	.usage-text {
		font-size: 24rpx;
		color: #666;
		width: 60rpx;
		text-align: right;
	}

	.full-screen-area {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
		/* 设为透明，不影响底层内容 */
		z-index: 999;
		/* 确保在最上层 */
		overflow: hidden;
		pointer-events: none;
		/* 不拦截点击事件 */
	}

	movable-view {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50rpx;
		width: 50rpx;
		/* background-color: #007AFF; */
		color: #fff;
		border-radius: 50%;
		/* 可选：圆形按钮 */
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
		/* 可选：添加阴影 */
		pointer-events: auto;
		/* 可以响应点击 */
	}
</style>
