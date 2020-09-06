<template>
	<div>
		<header>
			<div class="header-info">
				<div>
					<span class="title">高雄旅遊資訊</span>
				</div>
				<div>
					<select name="selectLocat" id="LOCAT_SELECT" v-model="selectedDist">
						<option value="">--請選擇行政區--</option>
						<option v-for="(option,idx) in distOptions" :value="option" :key="'option_'+idx">{{option}}</option>
					</select>
				</div>
			</div>

		</header>
		<content>
			<section class="first-block">
				<div class="dist-list-block">
					<div class="dist-span-block">
						<span class="dist-span">熱門行政區</span>
					</div>
					<ul class="dist-list">
						<li>
							<button class="popular-dist-btn primary" @click="selectedDist='苓雅區'">
								苓雅區
							</button>
						</li>
						<li>
							<button class="popular-dist-btn secondary" @click="selectedDist='三民區'">
								三民區
							</button>
						</li>
						<li>
							<button class="popular-dist-btn success" @click="selectedDist='新興區'">
								新興區
							</button>
						</li>
						<li>
							<button class="popular-dist-btn danger" @click="selectedDist='鹽程區'">
								鹽程區
							</button>
						</li>
					</ul>
				</div>
			</section>
			<section>
				<div class="main-block">
					<div class="dotted-line-block">
						<div class="dotted-line">
							<div class="icon-down-block">
								<img src="../assets/icons_down.png" alt="">
							</div>
						</div>
					</div>
					<div class="dist-title-block">
						<span>{{selectedDist}}</span>
					</div>
					<div class="dist-info-outer-block" v-if="data.length!==0">
						<ul class="dist-info-list">
							<template v-for="(item,idx) in filterData">
								<li v-if="idx < 8" :class="itemClass(idx)" :key="'dist_'+idx">
									<div class="dist-img-block" :style="`background-image: url(${item.Picture1});`">
										<div class="item-name-block">
											<span class="item-name">{{item.Name}}</span>
										</div>
										<div class="item-dist-block">
											<span class="item-dist">{{item.Zone}}</span>
										</div>
									</div>
									<div class="dist-info-block">
										<div class="item-open-time-block">
											<div class="item-open-time-img">
												<img src="../assets/icons_clock.png" alt="">
											</div>
											<div class="item-open-time-span">
												<span>{{item.Opentime}}</span>
											</div>
										</div>
										<div class="item-address-block">
											<div class="item-address-img">
												<img src="../assets/icons_pin.png" alt="">
											</div>
											<div class="item-address-span">
												<span>{{item.Add}}</span>
											</div>
										</div>
										<div class="item-other-block">
											<div class="item-phone-block">
												<div class="item-phone-img">
													<img src="../assets/icons_phone.png" alt="">
												</div>
												<div class="item-phone-span">
													<span>{{item.Tel}}</span>
												</div>
											</div>
											<div class="item-free-open-block" v-show="item.Ticketinfo.length > 0">
												<div class="item-free-open-img">
													<img src="../assets/icons_tag.png" alt="">
												</div>
												<div class="item-free-open-span">
													<span>{{item.Ticketinfo}}</span>
												</div>
											</div>
										</div>
									</div>
								</li>
							</template>
						</ul>
					</div>
				</div>
			</section>
			<section>
				<div class="page-idx-list-block">
					<ul class="page-idx-list">
						<li class="page-idx-li prev">
							<a href="#" @click="changeView(pageIdx-1)">{{pagePrevLabel}}</a>
						</li>
						<li v-for="page in viewPageIdxList" :class="pageIdxLiClass(page)">
							<a href="#" @click="changeView(page)">{{page}}</a>
						</li>
						<li class="page-idx-li next">
							<a href="#" @click="changeView(pageIdx+1)">{{pageNextLabel}}</a>
						</li>
					</ul>
				</div>
			</section>
		</content>
		<footer>
			<div class="footer-block">
				<div class="footer-first-block">
					<span>高雄資訊網</span>
				</div>
				<div class="footer-second-block">
					<span>資料來源：高雄市政府</span>
				</div>
			</div>
		</footer>
	</div>
</template>

<script>
	// @ is an alias to /src
	const axios = require('axios');

	export default {
		name: 'Home',
		data() {
			return {
				pagePrevLabel:'< prev',
				pageNextLabel:'next >',
				data: [],
				pageIdx:1,
				selectedDist:'',
				cilckedDist:'',
			}
		},
		computed:{
			
			filterData(){
				return this.selectDistData.filter((item,idx)=>{
					if(idx < this.pageIdx*8 && (this.pageIdx*1-1) <= idx){
						return item
					}
				})
			},
			selectDistData(){
				return this.isSelectDistData()
			},
			distOptions(){
				return this.data.reduce((zoneList,item)=>{
					if(zoneList.includes(item.Zone)) return zoneList
					zoneList.push(item.Zone)
					return zoneList
				},[])
			},
			selectDistDataSize(){
				return this.selectDistData.length
			},
			pageIdxList(){
				let arr = []
				let pageMaxSize = this.selectDistDataSize/8 | 0
				let leftNum = this.selectDistDataSize % 8
				if(leftNum > 0) pageMaxSize +=1
				for(let cnt=1 ; cnt <= pageMaxSize; cnt++){
					arr.push(cnt)
				}
				return arr
			},
			viewPageIdxList(){
				return this.pageIdxList.reduce((viewPageList,pageIdx)=>{
					if(this.pageIdx <= pageIdx && pageIdx <= (this.pageIdx+4)){
						viewPageList.push(pageIdx) 
					}
					return viewPageList
				},[])
			}
		},
		methods:{
			pageIdxLiClass(page){
				return (this.pageIdx === page ? 'page-idx-li selected' : 'page-idx-li') 
			},
			changeView(page){
				if( page === 0 ) return
				if( page > this.pageIdxList.length) return
				this.pageIdx = page
			},
			isSelectDistData(){
				if(this.selectedDist===''){
					return this.data
				}
				return this.data.filter(item=>{
					if(item.Zone===this.selectedDist) return item
				})
				
			},
			itemClass(idx){
				let str = idx === (this.filterData.length-1) ? ' return-icon' : ''
				return 'dist-info'+str
			},
			// addReturnTopImg(){
			// 	const items = document.querySelectorAll('.dist-info')
			// 	console.log("items",items)
			// 	const lastItem = items[items.length-1]
				
			// 	var beforeStyle = window.getComputedStyle(lastItem, ":after");
			// 	console.log("beforeStyle",beforeStyle.visibility='visible')
			// }
			addReturnTopEvent(){
				const distInfoList = document.querySelector('.dist-info-list')
				distInfoList.addEventListener('click',(e)=>{
					console.log(e.target.className)
					if(e.target.className.includes('return-icon')){
						document.body.scrollTop = document.documentElement.scrollTop = 0;
					}
					
				})
			}
		},
		mounted() {
			console.log(this.filterData)
			// Make a request for a user with a given ID
			axios.get('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json')
				.then((response)=> {
					// handle success
					console.log(response.data)
					console.log(response.data.result.records)
					this.data = response.data.result.records
					
				})
				.catch(function(error) {
					// handle error
					console.log(error);
				})
		},
		watch:{
			data(){
				this.$nextTick(()=>{
					this.addReturnTopEvent()
				})
				
			}
		}
	}
</script>
<style scoped>
	
	.primary {
		background: #8A82CC;
	}
	
	.secondary {
		background: #FFA782;
	}
	
	.success {
		background: #F5D005;
	}
	
	.danger {
		background: #559AC8;
	}
	
	header {
		display: flex;
		justify-content: center;
	}

	header .header-info {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		flex-direction: column;
		background-image: url(../assets/Hero.png);
		width: 1024px;
		height: 380px;
	}

	header .header-info .title {
		position: relative;
		top: 95px;
		font-family: .PingFangTC-Regular;
		font-size: 40px;
		color: #FFFFFF;
		letter-spacing: 3.89px;
	}

	#LOCAT_SELECT {
		/* position: relative; */
		background: rgba(255, 255, 255, 0.70);
		border: 3px solid #FFFFFF;
		border-radius: 3px;
		font-family: .SFNSText;
		font-size: 18px;
		color: #000000;
		width: 452px;
		height: 48px;
		margin-top: 200px;
	}

	.popular-dist-btn {
		/* background: #8A82CC; */
		/* border-radius: 5px; */
		width: 130px;
		height: 42px;
		font-family: .PingFangTC-Regular;
		font-size: 20px;
		color: #FFFFFF;
		
		display: inline-block;
		    font-weight: 400;
		    text-align: center;
		    vertical-align: middle;
		    -moz-user-select: none;
		    -ms-user-select: none;
		    user-select: none;
		    /* background-color: #8A82CC; */
		    border: none;
		    padding: .375rem .75rem;
		    font-size: 1rem;
		    line-height: 1.5;
		    border-radius: .25rem;
		    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	}
	
	content {
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.first-block {
		display: flex;
		justify-content: center;
	}

	.dist-list-block {
		position: relative;
		top: -28px;
		background: #FFFFFF;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.20);
		border-radius: 5px;
		width: 800px;
		height: 112px;
	}

	.dist-span-block {
		padding: 1% 0 0 2.5%;
	}

	.dist-span {
		font-family: .AppleSystemUIFont;
		font-size: 18px;
		color: #000000;
		/* padding-top: 1%; */

	}

	.dist-list {
		display: flex;
		flex-direction: row;
		list-style: none;
	}

	.dist-list li {
		margin-right: 1rem;
	}

	.main-block {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-direction: column;
	}

	.dotted-line-block {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.dotted-line {
		position: relative;
		width: 900px;
		border-bottom: 1px dashed #559AC8;
		display: flex;
		justify-content: center;
	}

	.icon-down-block {
		position: relative;
		top: 15px;
		left: 2px;
		width: 20px;
		height: 20px;
		border: 3px solid #559AC8;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #ffffff;
	}

	.icon-down-block img {
		display: inline-block;
		width: 12px;
		height: 10px;
	}

	.dist-title-block {
		margin-top: 80px;
		display: flex;
		justify-content: center;
	}

	.dist-title-block span {
		font-family: .SFNSDisplay;
		font-size: 36px;
		color: #8A82CC;
	}

	.dist-info-outer-block {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.dist-info-list {
		position: relative;
		left: -15px;
		width: 80%;
		list-style: none;
		display: flex;
		justify-content: center;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.dist-info {
		margin: 10px;
		/* border: 1px solid #000000; */
	}

	.dist-img-block {
		width: 464px;
		height: 155px;
		/* background: #00aa7f; */
		background-size: cover!important;
		background-position: center!important;
		background-repeat: no-repeat;
		box-shadow: 0 1px 3px 0 rgba(0,0,0,0.20);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
	}
	
	.item-name-block {
		padding-left: 16px;
		padding-bottom: 10px;
	}
	
	.item-dist-block {
		padding-right: 12px;
		padding-bottom: 6px;
	}
	
	.item-name {
		font-family: .SFNSDisplay;
		font-size: 24px;
		color: #FFFFFF;
	}

	.item-dist {
		font-family: .PingFangTC-Regular;
		font-size: 16px;
		color: #FFFFFF;
	}

	.dist-info-block {
		height: 118px;
		width: 464px;
		background: #FFFFFF;
		box-shadow: 0 1px 3px 0 rgba(0,0,0,0.20);
	}
	
	
	.item-open-time-block,
	.item-address-block,
	.item-other-block {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		padding-top: 10px;
		padding-left: 10px;
	}
	
	.item-other-block {
		justify-content: space-between;
	}
	
	.item-phone-block,
	.item-free-open-block {
		display: flex;
		flex-direction: row;
	}
	
	.item-open-time-img,
	.item-address-img,
	.item-phone-img,
	.item-free-open-img{
		padding-right: 10px;
	}
	
	.item-free-open-span {
		padding-right: 20px;
	}
	
	.return-icon::after {
		/* visibility: hidden; */
		content: url(../assets/btn_goTop.png);
		top: -20px;
		left: 5px;
		position: relative;
		float: right;
		cursor: pointer;
	}
	
	.page-idx-list-block {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.page-idx-list {
		display: flex;
		flex-direction: row;
		list-style: none;
	}
	
	.page-idx-li {
		padding: 0 10px 0 10px;
	}
	
	.page-idx-li a {
		font-family: .AppleSystemUIFont;
		font-size: 14px;
		color: #4A4A4A;
	}
	
	.page-idx-li a.prev {
		color: rgba(73,73,73,0.50);
	}
	
	.page-idx-li.selected a {
		color: #559AC8;
	}
	
	footer {
		display: flex;
		justify-content: center;
	}
	
	.footer-block {
		width: 1024px;
		height: 90px;
		background: #559AC8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.footer-first-block span {
		font-family: .AppleSystemUIFont;
		font-size: 14px;
		color: #FFFFFF;
	}
	
	.footer-second-block {
		padding-top: 10px;
	}
	
	.footer-second-block span {
		font-family: .AppleSystemUIFont;
		font-size: 14px;
		color: #FFD366;
	}
</style>
