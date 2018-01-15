<template>
  <div class="my-tabs">
    <ul>
      <li
        v-for="(tab, index) in myTabs.tabs"
        :class="getTabClass(tab)"
        v-text="tab.title"
        @click="myTabs.selectTab(tab, index)"
      >
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {},

    data () {
      return {
        myTabs: {},
      };
    },

    created () {
      this.$bus.listen('my-tabs-fixed:init', myTabs => {
        this.myTabs = myTabs;
      });
    },

    methods: {
      getTabClass (tab) {
        return [
          'my-tabs__tab',
          {
            'my-tabs__tab--active': tab.isActive,
            'my-tabs__tab--disabled': tab.isDisabled,
            'my-tabs__tab--has-errors': tab.hasErrors,
          },
        ];
      },
    },
  };
</script>