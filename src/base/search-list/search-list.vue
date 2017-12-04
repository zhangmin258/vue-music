


<template>
	<div class="search-list" v-show="searches.length">
		<transition-group name="slide" tag="ul">
			<li :key="item" v-for="item in searches" class="search-item" @click="selectItem(item)">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOne(item)">
					<i class="icon-delete"></i>
				</span>
			</li>
		</transition-group>
	</div>
</template>




<script>

export default {
	props: {
		searches: {
			type: Array,
			default: []
		}
	},
	methods: {
		selectItem(item){
			this.$emit('select', item);
		},
		deleteOne(item){
			this.$emit('delete', item);
		}
	}
}

</script>





<style scoped lang="stylus" rel="stylesheet/stylus">

	@import "~common/stylus/variable";
  	@import "~common/stylus/mixin";

  	.search-list{
  		overflow: hidden;
  		.search-item{
  			display: flex;
  			height: 40px;
  			align-items: center;
  			&.slide-enter-active, &.slide-leave-active{
  				transition: all 1s;
  			}
  			&.slide-enter, &.slide-leave-to{
  				opacity: 0;
  				height: 0;
  			}
  			.text{
  				flex: 1;
  				font-size: $font-size-medium-x;
  				color: $color-text-l;
  			}
  			.icon{
  				extend-click();
  				.icon-delete{
          			color: $color-text-d;
          			font-size: $font-size-small;
  				}
  			}
  		}
  	}

</style>





